# AGENTS_PTBR.md — Diretrizes de manutenção do Antigravity PT-BR

Mantenha o pacote de localização do Antigravity, o patch dinâmico do ASAR, o pacote da interface web e os atalhos de instalação/restauração em um clique.

## Aplicativo e backups

- `patch-antigravity.cjs` detecta a versão do ASAR instalado e só aplica alterações sobre um arquivo limpo e verificado da mesma versão. Se essa base não existir, deve interromper com segurança.
- Os backups brutos ficam dentro da pasta instalada: `<pasta-do-Antigravity>\_backups\<versão>\app.asar`. Antes de alterar, o instalador também salva ali o executável original e o `web-bundle` original daquela versão. Nunca sobrescreva um backup limpo existente.
- `_backups` é a única pasta de backup. Os instaladores e restauradores leem e gravam backups na raiz do programa instalado; a pasta do projeto mantém somente scripts, documentação e arquivos de tradução.
- Nunca use o `app-pt.asar` do repositório como backup original ou fallback para uma versão mais nova.
- Se o `web-bundle` instalado tiver a marca PT-BR, mas não houver backup limpo dessa versão, interrompa a instalação antes de aplicar o patch. Nunca registre um bundle traduzido como original.
- Preserve a versão do aplicativo e o fluxo de instalar/restaurar em um clique.
- O sidecar do Visualizador Biomolecular é um pacote independente: mantenha o pacote original e traduzido versionados em `biomolecular-sidecar`, valide versão e hashes no pré-teste, salve backups em `<pasta-do-Antigravity>\\_backups\\biomolecular-sidecar` e restaure somente quando os arquivos ativos forem o original, a tradução atual ou uma tradução anterior identificada por hash exato no manifesto. Atualize o manifesto de hashes traduzidos após a cópia. Se a versão do plugin mudar, não sobrescreva; atualize primeiro os originais e traduções correspondentes.
- Procure o sidecar tanto no cache de marketplaces quanto no pacote ativo `~/.gemini/config/plugins/science/sidecars/biomolecular_structure_viewer`. Nesse local, leia a versão de `plugin.json`, valide os arquivos por hash antes de alterar e mantenha backup próprio sob `gemini-config`; o cache não é necessariamente a cópia servida pelo Antigravity.
- Depois de todos os pré-testes e imediatamente antes de alterar arquivos, instalador e restaurador encerram à força os processos da interface do Antigravity, sem encerrar `language_server.exe`. Verifique por até 3 segundos em intervalos curtos; se algum processo não terminar, aborte sem alterar arquivos e mostre nome e PID.
- Após toda instalação bem-sucedida, limpe os caches de interface do Antigravity mesmo se o patch principal e o sidecar já estiverem instalados; isso permite carregar novas traduções do web-bundle e do sidecar.
- Instalador e restaurador validam primeiro caminhos do processo, registro e locais conhecidos; só quando nenhum candidato válido contém Antigravity.exe e `resources\app.asar` iniciam a busca profunda em unidades fixas e removíveis. A busca ignora pastas raiz do sistema e junctions, valida também o arquivo-chave, deduplica caminhos, mantém instalações distintas selecionáveis e exibe o progresso no título da janela, nunca com `Write-Progress`. Mantenha `Find-Installations.ps1` ao lado dos scripts.

## Segurança da interface

- `web-bundle/main.js` é a fonte PT-BR da interface web. Adicione mapeamentos exatos dos textos originais e preserve o comportamento da aplicação.
- Não altere nós de texto em editores ricos, campos de entrada, Monaco, Lexical ou Slate. Evite observadores DOM que possam modificar o estado do editor.
- A varredura inicial do DOM deve ser incremental e limitada por quadro (sem percorrer sincronicamente todo o `document.body`). Agrupe mutações em fila, limite o trabalho por quadro e mantenha os editores excluídos.
- Não exclua elementos por uma classe genérica contendo `editor`; restrinja a proteção a editores/campos identificáveis para que barras de ferramentas e diffs continuem traduzidos.
- Não encerre `language_server.exe` ao fechar janelas do Antigravity.
- Atualize as variantes do README, `LEIA-ME.txt` e estas instruções sempre que o comportamento mudar.

## Atualização 1.4.0 — Antigravity 2.24.0 — 16/10/2026
- A versão do `app.asar` instalada localmente é 2.24.0. O pré-teste estrutural passou; o bundle web mantido neste projeto continua derivado da interface 2.23.0, e não deve ser descrito como bundle 2.24.0.
- O mapa DOM pode localizar textos dinâmicos de extensões, tooltips e prévias renderizadas sem editar o arquivo de origem. Não traduza nem grave conteúdo dentro de arquivos do usuário; identificadores de comandos e nomes técnicos permanecem inalterados.
- Para limites com tempo variável, mantenha tradução dinâmica de dias, horas e minutos. Preserve editores, áreas de código e a resposta original de arquivos.

<!-- ag-agent-AGENTS_PTBR.md -->
## Bundle e modo Turbo por versão
- A presença de rótulos/enumerações não prova que a UI seja compatível. Antes de fechar processos, alterar Fuse ou criar backups, rode o pré-teste do patch-antigravity.cjs.
- A base web atual é o frontend original 2.26.0; preserve a tabela funcional do seletor e a lista de modos visíveis, incluindo Turbo. O pré-teste verifica os rótulos PT-BR Solicitar revisão e Padrão, as descrições atuais de Request Review, Default e Turbo, o placeholder de busca traduzido, `AgentPermissionPreset.TURBO` e a inclusão de Turbo na lista exibida. Se a estrutura da versão instalada mudar, interrompa sem alterar a instalação e atualize o bundle a partir da compilação correspondente; nunca substitua a interface atual por um bundle antigo.
- A camada PT-BR deve permanecer antes do código original do frontend e traduzir somente conteúdo renderizado. Não altere chaves do modelo de permissões, valores de enumeração ou a lista de modos.
- Instalações repetidas por fontes distintas devem ser deduplicadas após normalizar o caminho; mantenha seleção para cópias em pastas realmente diferentes.
<!-- /ag-agent-AGENTS_PTBR.md -->

## Verificação

- Execute `node --check` nos JavaScript alterados e valide a sintaxe dos PowerShell antes da entrega.
- Confirme a versão e a limpeza do backup antes de instalar/restaurar. Nunca restaure um ASAR não verificado ou já traduzido.
- Não declare a tradução completa da interface só com base em uma varredura estática.
## Reexecução e restauração
- Ao executar novamente, o instalador compara o hash do `web-bundle/main.js` instalado com o pacote atual. Se estiver atualizado, informa que não precisa reaplicar; se houver novas traduções, recompõe o pacote a partir do backup original limpo e exato da versão.
- O backup original é criado uma única vez em `<pasta instalada>\_backups\<versão>` e nunca é substituído pela tradução. Se uma instalação já modificada não tiver backup confiável, o instalador interrompe e informa isso.
- Na restauração, arquivos que já correspondem ao original são identificados e não são copiados novamente. Sem backup, o script só informa que já está original quando o ASAR da versão ativa passa na verificação de limpeza e o web-bundle não contém marcadores conhecidos da tradução; se houver sinais de modificação ou backup inválido, interrompe sem alterar os arquivos.
- O crédito de localização é exibido como `Tradução PT-BR: Emerson Teles`, na cor turquesa `#00adb5`, em Configurações → Versão, dentro do cartão da versão, abaixo do número e separado por linha cinza translúcida.
### Mensagens do instalador e créditos
- Se já estiver traduzido, o instalador mostra uma mensagem ciano clara e não reaplica o pacote.
- Se já estiver original, a restauração avisa em ciano que não é necessária; uma restauração real termina com a confirmação verde de sucesso.
- No prompt final, S abre o aplicativo em processo independente e a janela do CMD iniciada pelo atalho fecha automaticamente; N, Enter ou Esc encerra sem abrir o aplicativo.
- Crédito: Tradução PT-BR: Emerson Teles, em turquesa #00adb5. O crédito fica somente em Configurações → Versão, dentro do mesmo cartão da versão, abaixo do número e separado por contorno cinza translúcido; não aparece no menu superior.
## Backup original ausente
Se o backup original da versão não estiver em _backups, o restaurador não consegue reconstruir os arquivos de fábrica e deve informar que a restauração não é possível. Repare ou instale a versão oficial do aplicativo por cima da instalação existente, preservando os projetos e dados do perfil do usuário; depois execute novamente o instalador ou restaurador.
### Interface web — Antigravity 2.24.0 — 16/10/2026
- “Other Customizations” é localizado como “Outras personalizações”. O observador incremental também acompanha raízes Shadow DOM abertas e iframes da mesma origem, sem alterar editores, para alcançar rótulos do visualizador e menus encapsulados.
- Frases divididas por links devem ter mapeamentos por fragmento; o texto inteiro não corresponde a um único nó de texto. O instalador verifica os fragmentos críticos e a cobertura de Shadow DOM antes de modificar a instalação.
- O patch dinâmico verifica a presença dessas traduções antes de modificar a instalação 2.24.0.

## Atualização 1.5.0 — 24/10/2026
- Preserve o crédito exato Tradução PT-BR: Emerson Teles, #00adb5, como segundo item do cartão da versão. O pré-teste exige uma única marca ptbr-translation-credit; ao atualizar o frontend, migre também esse elemento e as traduções diretas.
- O bundle atual foi obtido do servidor original do Antigravity 2.26.0. Preserve os assets atuais, os identificadores de permissões e a lista funcional do Turbo; não fixe nomes minificados na validação.
- Use process.execPath e execFileSync nas verificações de JavaScript e mantenha o stderr real nos erros. O ZIP distribui Node.js portátil com licença.
- Science 1.3.0 e 1.3.1 compartilham os mesmos originais do visualizador por SHA-256; mantenha backups por versão e por origem. Outras versões exigem nova conferência.
- ZIPs de release excluem README, README.ag, LEIA-ME, AGENTS e CHANGELOG; as notas completas ficam na release e no repositório.
