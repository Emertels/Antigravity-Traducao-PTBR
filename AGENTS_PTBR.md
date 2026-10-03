# AGENTS_PTBR.md — Diretrizes de manutenção do Antigravity PT-BR

Mantenha o pacote de localização do Antigravity, o patch dinâmico do ASAR, o pacote da interface web e os atalhos de instalação/restauração em um clique.

## Aplicativo e backups

- `patch-antigravity.cjs` detecta a versão do ASAR instalado e só aplica alterações sobre um arquivo limpo e verificado da mesma versão. Se essa base não existir, deve interromper com segurança.
- Os backups brutos ficam dentro da pasta instalada: `<pasta-do-Antigravity>\_backups\<versão>\app.asar`. Antes de alterar, o instalador também salva ali o executável original e o `web-bundle` original daquela versão. Nunca sobrescreva um backup limpo existente.
- `_backups` é a única pasta de backup. Os instaladores e restauradores leem e gravam backups na raiz do programa instalado; a pasta do projeto mantém somente scripts, documentação e arquivos de tradução.
- Nunca use o `app-pt.asar` do repositório como backup original ou fallback para uma versão mais nova.
- Se o `web-bundle` instalado tiver a marca PT-BR, mas não houver backup limpo dessa versão, interrompa a instalação antes de aplicar o patch. Nunca registre um bundle traduzido como original.
- Preserve a versão do aplicativo e o fluxo de instalar/restaurar em um clique.

## Segurança da interface

- `web-bundle/main.js` é a fonte PT-BR da interface web. Adicione mapeamentos exatos dos textos originais e preserve o comportamento da aplicação.
- Não altere nós de texto em editores ricos, campos de entrada, Monaco, Lexical ou Slate. Evite observadores DOM que possam modificar o estado do editor.
- Não encerre `language_server.exe` ao fechar janelas do Antigravity.
- Atualize as variantes do README, `LEIA-ME.txt` e estas instruções sempre que o comportamento mudar.

## Verificação

- Execute `node --check` nos JavaScript alterados e valide a sintaxe dos PowerShell antes da entrega.
- Confirme a versão e a limpeza do backup antes de instalar/restaurar. Nunca restaure um ASAR não verificado ou já traduzido.
- Não declare a tradução completa da interface só com base em uma varredura estática.
## Reexecução e restauração
- Ao executar novamente, o instalador reconhece uma tradução completa e informa que não precisa reaplicá-la. Se estiver parcial, recompõe a tradução a partir do backup original limpo e exato da versão.
- O backup original é criado uma única vez em `<pasta instalada>\_backups\<versão>` e nunca é substituído pela tradução. Se uma instalação já modificada não tiver backup confiável, o instalador interrompe e informa isso.
- Na restauração, arquivos que já correspondem ao original são identificados e não são copiados novamente. Sem backup, o script só informa que já está original quando o ASAR da versão ativa passa na verificação de limpeza e o web-bundle não contém marcadores conhecidos da tradução; se houver sinais de modificação ou backup inválido, interrompe sem alterar os arquivos.
- O crédito de localização é exibido como `Tradução PT-BR: Emerson Teles`, na cor turquesa `#00adb5`, no local de crédito disponível na interface.
### Mensagens do instalador e créditos
- Se já estiver traduzido, o instalador mostra uma mensagem ciano clara e não reaplica o pacote.
- Se já estiver original, a restauração avisa em ciano que não é necessária; uma restauração real termina com a confirmação verde de sucesso.
- No prompt final, S abre o aplicativo em processo independente e a janela do CMD iniciada pelo atalho fecha automaticamente; N, Enter ou Esc encerra sem abrir o aplicativo.
- Crédito: Tradução PT-BR: Emerson Teles, em turquesa #00adb5. O crédito fica somente em Configurações → Aplicativo; ele não aparece no menu superior.
## Backup original ausente
Se o backup original da versão não estiver em _backups, o restaurador não consegue reconstruir os arquivos de fábrica e deve informar que a restauração não é possível. Repare ou instale a versão oficial do aplicativo por cima da instalação existente, preservando os projetos e dados do perfil do usuário; depois execute novamente o instalador ou restaurador.
