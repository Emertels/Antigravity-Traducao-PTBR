#!/usr/bin/env bash
# ==============================================================================
#  Restaurador do Google Antigravity Original de Fábrica (Linux)
#  Pacote de Tradução por: Emerson Teles
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=linux-common.sh
source "$SCRIPT_DIR/linux-common.sh"

echo -e "${CYAN}====================================================================${NC}"
echo -e "${CYAN}         RESTAURAR ANTIGRAVITY ORIGINAL DE FÁBRICA (LINUX)          ${NC}"
echo -e "${CYAN}              Pacote de Tradução por: Emerson Teles                 ${NC}"
echo -e "${CYAN}====================================================================${NC}"
echo ""

# 1. Localizar Node.js e a instalação do Antigravity
find_node
find_agy_dir "${1:-}"
elevate_if_needed "$SCRIPT_DIR/restaurar-original.sh"

VERIFIER="$SCRIPT_DIR/tools/verify-clean-asar.cjs"
if [ ! -f "$VERIFIER" ]; then
    echo -e "${RED}[x] O verificador tools/verify-clean-asar.cjs não está no pacote; nenhum arquivo foi alterado.${NC}"
    exit 1
fi

# 2. Detectar versão do app.asar instalado
TARGET_ASAR="$AGY_DIR/resources/app.asar"
CURRENT_VERSION="$(detect_asar_version "$TARGET_ASAR" || true)"
if [ -z "$CURRENT_VERSION" ]; then
    echo -e "${RED}[x] Não foi possível identificar a versão do app.asar instalado.${NC}"
    exit 1
fi
echo -e "[*] Versão instalada detectada: ${CYAN}$CURRENT_VERSION${NC}"

VERSION_BACKUP_DIR="$AGY_DIR/_backups/$CURRENT_VERSION"
BACKUP_ASAR="$VERSION_BACKUP_DIR/app.asar"
TARGET_WEB_BUNDLE="$AGY_DIR/resources/web-bundle"
BACKUP_WEB_BUNDLE="$VERSION_BACKUP_DIR/web-bundle-original"
WEB_BUNDLE_WAS_ABSENT="$VERSION_BACKUP_DIR/web-bundle-was-absent.txt"

# 3. Sem backup: só considerar original se o ASAR ativo for limpo e o bundle não tiver tradução
echo -e "[1/3] Validando backup original limpo..."
if [ ! -f "$BACKUP_ASAR" ]; then
    if "$NODE_BIN" "$VERIFIER" "antigravity" "$TARGET_ASAR" "$CURRENT_VERSION" >/dev/null 2>&1 \
        && ! bundle_is_translated "$TARGET_WEB_BUNDLE"; then
        echo -e "${CYAN}[i] Antigravity já está original. Nenhuma restauração necessária.${NC}"
        exit 0
    fi
    echo -e "${RED}[x] Não há backup original da versão $CURRENT_VERSION em $VERSION_BACKUP_DIR.${NC}"
    echo -e "    Nenhum arquivo foi alterado. Reinstale o pacote oficial do Antigravity por cima e tente novamente."
    echo -e "    Os dados do usuário em ~/.config/Antigravity são preservados."
    exit 1
fi

if ! "$NODE_BIN" "$VERIFIER" "antigravity" "$BACKUP_ASAR" "$CURRENT_VERSION"; then
    echo -e "${RED}[x] O backup original falhou na verificação de limpeza; restauração abortada.${NC}"
    exit 1
fi
if [ -d "$BACKUP_WEB_BUNDLE" ] && bundle_is_translated "$BACKUP_WEB_BUNDLE"; then
    echo -e "${RED}[x] O web-bundle salvo contém a marca de tradução e não será restaurado como original.${NC}"
    exit 1
fi
if [ ! -d "$BACKUP_WEB_BUNDLE" ] && [ ! -f "$WEB_BUNDLE_WAS_ABSENT" ] && bundle_is_translated "$TARGET_WEB_BUNDLE"; then
    echo -e "${RED}[x] O web-bundle instalado está traduzido, mas não existe backup original desta versão.${NC}"
    echo -e "${YELLOW}    Restauração interrompida sem alterar o app.asar.${NC}"
    echo -e "${CYAN}    Reinstale o pacote oficial do Antigravity por cima e tente novamente. Os dados do usuário são preservados.${NC}"
    exit 1
fi

# 4. Encerrar a interface somente depois de todos os pré-testes
stop_agy_ui

# 5. Restaurar somente o que difere do original
echo -e "[2/3] Restaurando arquivos originais..."
RESTORE_CHANGED=0
if cmp -s "$BACKUP_ASAR" "$TARGET_ASAR"; then
    echo -e "    ${CYAN}[i] app.asar já está original; restauração desnecessária.${NC}"
else
    cp -f "$BACKUP_ASAR" "$TARGET_ASAR.tmp"
    mv -f "$TARGET_ASAR.tmp" "$TARGET_ASAR"
    RESTORE_CHANGED=1
    echo -e "    ${GREEN}-> app.asar original restaurado.${NC}"
fi

if [ -d "$BACKUP_WEB_BUNDLE" ]; then
    if [ -d "$TARGET_WEB_BUNDLE" ] && diff -rq "$BACKUP_WEB_BUNDLE" "$TARGET_WEB_BUNDLE" >/dev/null 2>&1; then
        echo -e "    ${CYAN}[i] web-bundle já está original; restauração desnecessária.${NC}"
    else
        rm -rf "$TARGET_WEB_BUNDLE"
        cp -a "$BACKUP_WEB_BUNDLE" "$TARGET_WEB_BUNDLE"
        RESTORE_CHANGED=1
        echo -e "    ${GREEN}-> web-bundle original restaurado.${NC}"
    fi
elif [ -f "$WEB_BUNDLE_WAS_ABSENT" ] && [ -f "$TARGET_WEB_BUNDLE/.agy-ptbr-installed" ]; then
    rm -rf "$TARGET_WEB_BUNDLE"
    RESTORE_CHANGED=1
    echo -e "    ${GREEN}-> web-bundle criado pela tradução removido.${NC}"
fi

# 6. Limpar cache da interface
echo -e "[3/3] Limpando caches de interface do Antigravity..."
clean_ui_caches
echo -e "    ${GREEN}[OK] Cache de interface renovado para carregar o original.${NC}"

echo ""
if [ "$RESTORE_CHANGED" -eq 1 ]; then
    echo -e "${GREEN}====================================================================${NC}"
    echo -e "${GREEN}      ANTIGRAVITY ORIGINAL RESTAURADO COM SUCESSO!                  ${NC}"
    echo -e "${GREEN}====================================================================${NC}"
else
    echo -e "${CYAN}====================================================================${NC}"
    echo -e "${CYAN}  O ANTIGRAVITY JÁ ESTÁ ORIGINAL; RESTAURAÇÃO NÃO NECESSÁRIA         ${NC}"
    echo -e "${CYAN}====================================================================${NC}"
fi
echo ""
echo -e "Versão: ${CYAN}$CURRENT_VERSION${NC}"
echo ""
