#!/usr/bin/env bash
# ==============================================================================
#  Instalador de Tradução PT-BR para Google Antigravity (Linux)
#  Tradução e Personalização por: Emerson Teles
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=linux-common.sh
source "$SCRIPT_DIR/linux-common.sh"

echo -e "${CYAN}====================================================================${NC}"
echo -e "${CYAN}    TRADUÇÃO GOOGLE ANTIGRAVITY PARA PORTUGUÊS DO BRASIL (LINUX)    ${NC}"
echo -e "${CYAN}            Desenvolvido e Personalizado por: Emerson Teles         ${NC}"
echo -e "${CYAN}====================================================================${NC}"
echo ""

# 1. Localizar Node.js e a instalação do Antigravity
find_node
find_agy_dir "${1:-}"

# 2. Pré-teste de compatibilidade (sem alterar nada)
echo -e "[1/4] Executando pré-teste de compatibilidade estrutural..."
if ! "$NODE_BIN" "$SCRIPT_DIR/patch-antigravity.cjs" --preflight "$AGY_DIR"; then
    echo -e "${RED}[x] O pré-teste de compatibilidade falhou. Nenhum arquivo foi alterado.${NC}"
    exit 1
fi

# 3. Elevar privilégios se a pasta do programa não for gravável
elevate_if_needed "$SCRIPT_DIR/instalar-traducao.sh"

# 4. Conferir o web-bundle instalado antes de criar backups
CURRENT_VERSION="$(detect_asar_version "$AGY_DIR/resources/app.asar" || true)"
if [ -z "$CURRENT_VERSION" ]; then
    echo -e "${RED}[x] Não foi possível identificar a versão do app.asar instalado.${NC}"
    exit 1
fi
VERSION_BACKUP_DIR="$AGY_DIR/_backups/$CURRENT_VERSION"
TARGET_WEB_BUNDLE="$AGY_DIR/resources/web-bundle"
BACKUP_WEB_BUNDLE="$VERSION_BACKUP_DIR/web-bundle-original"
WEB_BUNDLE_WAS_ABSENT="$VERSION_BACKUP_DIR/web-bundle-was-absent.txt"

echo -e "[2/4] Verificando backups imutáveis da versão ${CYAN}$CURRENT_VERSION${NC}..."
if [ ! -d "$BACKUP_WEB_BUNDLE" ] && [ ! -f "$WEB_BUNDLE_WAS_ABSENT" ] && bundle_is_translated "$TARGET_WEB_BUNDLE"; then
    echo -e "${RED}[x] A pasta web-bundle já está traduzida, mas não existe uma cópia original salva para a versão $CURRENT_VERSION.${NC}"
    echo -e "${YELLOW}    Instalação interrompida; não vou salvar os arquivos traduzidos como backup original.${NC}"
    echo -e "${CYAN}    Reinstale o pacote oficial do Antigravity por cima e tente novamente. Os dados do usuário em ~/.config/Antigravity são preservados.${NC}"
    exit 1
fi
if [ -d "$BACKUP_WEB_BUNDLE" ] && bundle_is_translated "$BACKUP_WEB_BUNDLE"; then
    echo -e "${RED}[x] O backup web-bundle desta versão contém a marca de tradução; não será usado como original.${NC}"
    echo -e "${CYAN}    Reinstale o pacote oficial do Antigravity por cima e tente novamente.${NC}"
    exit 1
fi

# 5. Encerrar a interface somente depois de todos os pré-testes
stop_agy_ui

# 6. Salvar o web-bundle original uma única vez (o patcher salva o app.asar)
mkdir -p "$VERSION_BACKUP_DIR"
if [ ! -d "$BACKUP_WEB_BUNDLE" ] && [ ! -f "$WEB_BUNDLE_WAS_ABSENT" ]; then
    if [ -d "$TARGET_WEB_BUNDLE" ]; then
        cp -a "$TARGET_WEB_BUNDLE" "$BACKUP_WEB_BUNDLE.tmp"
        mv "$BACKUP_WEB_BUNDLE.tmp" "$BACKUP_WEB_BUNDLE"
        echo -e "    -> web-bundle original salvo em: ${CYAN}$BACKUP_WEB_BUNDLE${NC}"
    else
        echo "web-bundle ausente antes da tradução" > "$WEB_BUNDLE_WAS_ABSENT"
    fi
fi

# 7. Executar o patcher dinâmico
echo ""
echo -e "[3/4] Aplicando pacote de tradução PT-BR..."
EXIT_CODE=0
"$NODE_BIN" "$SCRIPT_DIR/patch-antigravity.cjs" "$AGY_DIR" || EXIT_CODE=$?

if [ "$EXIT_CODE" -eq 10 ]; then
    echo -e "${CYAN}[i] Antigravity já está traduzido e atualizado nesta versão!${NC}"
elif [ "$EXIT_CODE" -ne 0 ]; then
    echo -e "${RED}[x] Falha ao aplicar a tradução (código de saída: $EXIT_CODE).${NC}"
    exit "$EXIT_CODE"
fi

# 8. Limpar cache da interface para carregar os novos recursos
echo ""
echo -e "[4/4] Limpando caches de interface do Antigravity..."
clean_ui_caches
echo -e "    ${GREEN}[OK] Caches de interface limpos com sucesso.${NC}"

echo ""
if [ "$EXIT_CODE" -eq 10 ]; then
    echo -e "${CYAN}====================================================================${NC}"
    echo -e "${CYAN}   O ANTIGRAVITY JÁ ESTÁ TRADUZIDO; NÃO FOI NECESSÁRIO REAPLICAR    ${NC}"
    echo -e "${CYAN}====================================================================${NC}"
else
    echo -e "${GREEN}====================================================================${NC}"
    echo -e "${GREEN}       TRADUÇÃO ANTIGRAVITY APLICADA COM SUCESSO!                   ${NC}"
    echo -e "${GREEN}====================================================================${NC}"
fi
echo ""
echo -e "O backup original de fábrica fica em:"
echo -e "${CYAN}$VERSION_BACKUP_DIR${NC}"
echo ""
echo -e "${BOLD}Para ver a interface em português:${NC}"
echo -e "Inicie o Antigravity pelo menu de aplicativos ou pelo terminal: ${GREEN}antigravity${NC}"
echo ""
