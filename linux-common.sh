#!/usr/bin/env bash
# ==============================================================================
#  Funções compartilhadas pelos scripts Linux do Antigravity PT-BR.
#  Carregado por instalar-traducao.sh e restaurar-original.sh; não execute direto.
# ==============================================================================

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'
BOLD='\033[1m'

UI_CACHES=("Cache" "Code Cache" "GPUCache" "DawnGraphiteCache" "DawnWebGPUCache")
TRANSLATION_MARKERS=("Emerson Teles" "Tradução PT-BR: Emerson Teles" "Nenhum agente em execução" "Configurando o WSL:")

# Localiza o Node.js, inclusive sob sudo com nvm/fnm/asdf do usuário original.
find_node() {
    NODE_BIN="${NODE_BIN:-}"
    if [ -z "$NODE_BIN" ] && command -v node >/dev/null 2>&1; then
        NODE_BIN="$(command -v node)"
    fi
    if [ -z "$NODE_BIN" ] && [ -n "${SUDO_USER:-}" ]; then
        local sudo_home candidate
        sudo_home="$(getent passwd "$SUDO_USER" | cut -d: -f6)"
        if [ -d "$sudo_home/.nvm/versions/node" ]; then
            candidate="$(find "$sudo_home/.nvm/versions/node" -maxdepth 3 -name node -type f -perm /111 2>/dev/null | sort -V | tail -n 1)"
            [ -n "$candidate" ] && NODE_BIN="$candidate"
        fi
        if [ -z "$NODE_BIN" ]; then
            for candidate in \
                "$sudo_home/.fnm/current/bin/node" \
                "$sudo_home/.asdf/shims/node" \
                "$sudo_home/.local/bin/node" \
                /usr/local/bin/node \
                /usr/bin/node
            do
                if [ -x "$candidate" ]; then
                    NODE_BIN="$candidate"
                    break
                fi
            done
        fi
    fi
    if [ -z "$NODE_BIN" ] || [ ! -x "$NODE_BIN" ]; then
        echo -e "${RED}[x] Erro: Node.js não foi encontrado no sistema.${NC}"
        echo -e "    Instale o Node.js ou informe o caminho: NODE_BIN=/caminho/node $0"
        exit 1
    fi
    echo -e "[*] Node.js detectado: ${CYAN}$NODE_BIN${NC} ($("$NODE_BIN" -v))"
}

# Define AGY_DIR a partir do argumento ou dos locais conhecidos do pacote .deb.
find_agy_dir() {
    AGY_DIR="${1:-}"
    if [ -z "$AGY_DIR" ]; then
        local dir bin_path
        for dir in /opt/Antigravity /opt/antigravity /usr/share/antigravity; do
            if [ -x "$dir/antigravity" ] && [ -f "$dir/resources/app.asar" ]; then
                AGY_DIR="$dir"
                break
            fi
        done
        if [ -z "$AGY_DIR" ] && command -v antigravity >/dev/null 2>&1; then
            bin_path="$(readlink -f "$(command -v antigravity)")"
            if [ -f "$(dirname "$bin_path")/resources/app.asar" ]; then
                AGY_DIR="$(dirname "$bin_path")"
            fi
        fi
    fi
    if [ -z "$AGY_DIR" ] || [ ! -f "$AGY_DIR/resources/app.asar" ]; then
        echo -e "${RED}[x] Não foi possível encontrar a instalação do Antigravity automaticamente.${NC}"
        echo -e "    Uso: $0 /caminho/para/antigravity"
        exit 1
    fi
    AGY_DIR="$(readlink -f "$AGY_DIR")"
    echo -e "[*] Antigravity detectado em: ${GREEN}$AGY_DIR${NC}"
}

# Reexecuta o script com sudo quando a pasta do programa não é gravável.
elevate_if_needed() {
    local script="$1"
    if [ ! -w "$AGY_DIR/resources" ] && [ "$EUID" -ne 0 ]; then
        echo -e "${YELLOW}[!] Permissão de escrita necessária em $AGY_DIR.${NC}"
        echo -e "${CYAN}[*] Elevando privilégios com sudo...${NC}"
        exec sudo -- env NODE_BIN="$NODE_BIN" bash "$script" "$AGY_DIR"
    fi
}

# Imprime a versão do package.json dentro do app.asar informado.
detect_asar_version() {
    "$NODE_BIN" -e '
const fs = require("fs");
try {
    const fd = fs.openSync(process.argv[1], "r");
    const sBuf = Buffer.alloc(16);
    fs.readSync(fd, sBuf, 0, 16, 0);
    const s2 = sBuf.readUInt32LE(4);
    const jSize = sBuf.readUInt32LE(12);
    const hBuf = Buffer.alloc(jSize);
    fs.readSync(fd, hBuf, 0, jSize, 16);
    const h = JSON.parse(hBuf.toString("utf8"));
    const pkg = h.files && h.files["package.json"];
    const buf = Buffer.alloc(pkg.size);
    fs.readSync(fd, buf, 0, pkg.size, 8 + s2 + parseInt(pkg.offset, 10));
    fs.closeSync(fd);
    console.log(JSON.parse(buf.toString("utf8").replace(/^[^{]*/, "")).version);
} catch (e) {
    process.exit(1);
}' "$1"
}

# Retorna sucesso se o web-bundle informado contém a marca ou textos da tradução.
bundle_is_translated() {
    local dir="$1" marker
    [ -d "$dir" ] || return 1
    [ -f "$dir/.agy-ptbr-installed" ] && return 0
    for marker in "${TRANSLATION_MARKERS[@]}"; do
        grep -rqF --exclude='*.png' -- "$marker" "$dir" 2>/dev/null && return 0
    done
    return 1
}

# Lista "PID nome" dos processos da interface cujo executável está na pasta do
# programa, sem incluir o language_server.
list_ui_processes() {
    local proc pid exe name
    for proc in /proc/[0-9]*; do
        pid="${proc#/proc/}"
        exe="$(readlink "$proc/exe" 2>/dev/null)" || continue
        case "$exe" in
            "$AGY_DIR"/*) ;;
            *) continue ;;
        esac
        name="$(basename "${exe% (deleted)}")"
        case "$name" in
            *language_server*) continue ;;
        esac
        echo "$pid $name"
    done
}

# Encerra à força a interface; aborta sem alterar arquivos se algo restar após 3 s.
stop_agy_ui() {
    local running pid name tries=30
    running="$(list_ui_processes)"
    [ -z "$running" ] && return 0
    echo -e "${YELLOW}[-] Encerrando processos do Antigravity para atualizar arquivos com segurança...${NC}"
    while read -r pid name; do
        kill -KILL "$pid" 2>/dev/null || true
    done <<< "$running"
    while [ "$tries" -gt 0 ]; do
        running="$(list_ui_processes)"
        [ -z "$running" ] && return 0
        sleep 0.1
        tries=$((tries - 1))
    done
    echo -e "${RED}[x] Não foi possível encerrar estes processos do Antigravity:${NC}"
    while read -r pid name; do
        echo -e "    - $name (PID $pid)"
    done <<< "$running"
    echo -e "    Nenhum arquivo foi alterado."
    exit 1
}

# Remove os caches de interface do usuário que executou o script.
clean_ui_caches() {
    local target_user user_home cache
    target_user="${SUDO_USER:-$USER}"
    user_home="$(getent passwd "$target_user" | cut -d: -f6)"
    [ -z "$user_home" ] && user_home="$HOME"
    for cache in "${UI_CACHES[@]}"; do
        rm -rf "${user_home:?}/.config/Antigravity/$cache"
    done
}
