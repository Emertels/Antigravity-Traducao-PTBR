### Organização visual do crédito — Antigravity 2.23.0 — 13/10/2026
- O crédito “Tradução PT-BR: Emerson Teles” agora fica dentro do mesmo cartão da versão do aplicativo, abaixo do número, com separador e fundo cinza translúcido; o texto turquesa foi preservado.

# Histórico de Alterações

### Teste confirmado — Antigravity 2.23.0 — 14/10/2026
- O usuário confirmou que testou a versão com o crédito dentro do cartão da versão e que o Antigravity está funcionando.

### Correções de interface e crédito — Antigravity 2.23.0 — 13/10/2026
- Corrigido o tratamento de textos dinâmicos e atributos do DOM; adicionadas regras por prefixo para descrições de cartões truncadas, que não correspondiam às chaves completas do dicionário. A auditoria de 834 candidatos de rótulos e descrições terminou com zero itens sem mapeamento.
- Traduzidos o prompt sugerido de `/automation`, o diálogo de criação de automação, os textos do WSL e o estado de disponibilidade do Gemini 4 Argon para assinantes Ultra.
- Recolocado “Tradução PT-BR: Emerson Teles” abaixo da versão do aplicativo em Configurações, com cor turquesa `#00adb5`.
- Preservado o identificador funcional `/automation`; somente o texto sugerido ao usuário foi localizado.

### Tradução do seletor e da busca — Antigravity 2.23.0 — 13/10/2026
- Traduzidos diretamente no frontend os rótulos “Request Review” → “Solicitar revisão” e “Default” → “Padrão”, que não eram substituídos pelo dicionário DOM do seletor.
- Traduzido o placeholder de busca para “Pesquisar abas, arquivos, plugins, subagentes, artefatos e tarefas...” e o nome acessível do campo.
- 4 strings aplicadas/validadas nesta revisão; modos e descrições, incluindo Turbo, preservados. O pré-teste exige os rótulos PT-BR e o placeholder sem relaxar a validação estrutural do seletor.

### Correção do Turbo e atualização do bundle — Antigravity 2.23.0 — 13/10/2026
- Atualizado `web-bundle/main.js` com a interface exata 2.23.0 obtida do cache do Antigravity instalado. O seletor atual (`CM`) e a lista de modos visíveis (`R1a`) são preservados, incluindo Request Review, Default, Vetted, Auto e Turbo.
- Adaptado o pré-teste para validar a tabela atual, o identificador `AgentPermissionPreset.TURBO` e a presença explícita do Turbo na lista visível. A instalação é recusada se qualquer parte não corresponder.
- Incorporada a folha de estilos atual da interface 2.23.0.
- Acrescentadas 4 traduções do seletor: “Vetted (Preview)”, sua descrição, “Auto (Preview)” e sua descrição. O rótulo Turbo e a descrição já existentes permanecem traduzidos.
- `node --check` aprovado e instalação completa do patch aprovada em uma cópia temporária do `app.asar` 2.23.0; a instalação real permaneceu intacta.

### Padronização do console e compatibilidade Turbo — 13/10/2026
- Lançadores CMD configuram UTF-8 e os scripts PowerShell usam BOM UTF-8 para preservar acentos e cedilhas no Windows PowerShell.
- O teste inicial detectava corretamente que o bundle era antigo e bloqueava a instalação. A entrada acima registra a atualização do bundle e a correção que removeu esse bloqueio sem perder o seletor Turbo.

## [Em desenvolvimento]

### Correção da busca de instalações — 13/10/2026
- Instalador e restaurador validam primeiro caminhos do processo, registro e locais conhecidos; só quando nenhum candidato válido contém Antigravity.exe e `resources\app.asar` iniciam a busca profunda em unidades fixas e removíveis. A busca ignora pastas raiz do sistema e junctions, deduplica caminhos, mantém instalações distintas selecionáveis e não usa a barra sobreposta do PowerShell. Mantenha `Find-Installations.ps1` ao lado dos scripts.
- A busca mostra a unidade atual, o número de pastas verificadas e as candidatas encontradas; não segue junctions/reparse points para evitar ciclos. Por cobrir todo o volume, pode levar mais tempo em discos grandes ou externos.
- Esta correção altera apenas a localização: 0 novas strings de interface foram adicionadas nesta etapa.
- A mensagem “já está original” continua sendo exibida após a busca; agora a etapa mostra progresso durante a localização.

### Busca em camadas sem barra sobreposta — 13/10/2026
- O instalador e o restaurador validam primeiro caminhos obtidos do processo, registro e locais conhecidos. Só se nenhum contiver `Antigravity.exe` e `resources\app.asar` fazem busca profunda em unidades fixas/removíveis.
- A busca profunda ignora pastas de sistema na raiz e junctions, valida o executável junto com `resources\app.asar`, deduplica caminhos e mantém instalações distintas selecionáveis. O progresso aparece no título da janela; a barra `Write-Progress` foi removida.
- Esta melhoria altera a busca, não a interface: 0 novas strings.


### Correção do seletor de instalação — 13/10/2026
- Corrigida a deduplicação de instalações encontradas por fontes diferentes (processo, registro, locais conhecidos e raiz das unidades). O instalador e o restaurador agora normalizam e comparam caminhos sem diferenciar maiúsculas de minúsculas, evitando mostrar duas vezes o mesmo diretório.
- Ampliada a busca automática para localizar `Antigravity.exe` recursivamente em todas as unidades montadas, inclusive discos externos e pastas com nomes personalizados; cada resultado precisa conter também `resources\app.asar`.

### Falha segura do instalador — 13/10/2026
- O pré-teste também valida `dist/languageServer.js` e o ponto de injeção usado pelo patch dinâmico. Se a compilação tiver uma estrutura diferente, o instalador para antes de fechar o app, alterar o Fuse ou criar backups; não tenta substituir o patch por um ASAR estático antigo.
- Se uma falha inesperada ocorrer depois do pré-teste, o instalador tenta restaurar o executável, o `app.asar` e o `web-bundle` a partir dos backups da versão antes de encerrar.
- Nenhuma string da interface foi adicionada nesta correção; versões ainda não compatíveis podem continuar exibindo uma mensagem de erro, mas a incompatibilidade deve ser detectada antes de qualquer alteração.

### Acentuação dos scripts — 13/10/2026
- Corrigidos 3 textos de terminal do instalador/restaurador, incluindo “possível”, “há” e “cópia”. Nenhuma string da interface do Antigravity foi adicionada ou alterada.

### Antigravity 2.23.0 — interface e investigação do modo Turbo
- Conferidos os textos do seletor Turbo: os rótulos e as três descrições já estão no dicionário PT-BR; o bloqueio atual é a estrutura incompatível do bundle com a versão 2.23.0, não a falta dessas traduções. O pré-teste continua impedindo uma aplicação que poderia ocultar o seletor.
- Preparadas no bundle do pacote as traduções do aviso “Security Notice & Data Use”, do texto de segurança e privacidade e do botão “Accept and continue”; a versão 2.23.0 ainda não recebe o bundle por incompatibilidade estrutural.
- O usuário confirmou que o modo Turbo reaparece no original e some após aplicar a tradução. O Antigravity 2.23.0 original não contém `resources/web-bundle`, enquanto o arquivo do projeto usa textos e a estrutura antiga do seletor. A diferença estrutural foi confirmada comparando as três descrições atuais com a tabela `m1` do bundle.
- Adicionado pré-teste no patcher e no instalador: quando a estrutura do Turbo não corresponde à versão instalada, a execução para antes de fechar o app, alterar o Fuse, criar backup ou substituir arquivos. Naquela revisão, o frontend 2.23.0 ainda não havia sido incorporado; a entrada de 13/10/2026 acima registra a correção com o bundle atual.
- Revisados instalador e restaurador: ambos procuram `Antigravity.exe` em todas as subpastas das unidades montadas, validam também `resources\app.asar` e permitem selecionar entre cópias distintas.
- O restaurador recupera os arquivos do backup original associado à versão selecionada e interrompe se o backup não for confiável.
- O pacote contém traduções para 3 textos do aviso inicial de segurança/dados e mantém as traduções dos perfis; elas ainda não são aplicadas ao Antigravity 2.23.0 até existir um bundle compatível. A varredura do `app.asar` isolado retorna 28 mensagens de runtime/técnicas que não são rótulos visíveis da interface web; não foram contabilizadas como traduções pendentes da tela.

### Traduções PT-BR
- Atualizados os textos dos perfis de segurança do agente que mudaram na versão recente: aprovação de comandos, confirmação de operações sensíveis e execução sem restrições.
- A varredura estática encontrou e traduziu uma mensagem de erro que ainda estava em inglês: “Aborted due to condition callback returning false.”
- A busca em todas as subpastas agora também encontra instalações personalizadas em caminhos profundos, como `E:\Ferramentas\Editor\Antigravity IDE`.
- Corrigida a mensagem “No plugins available” no menu de plugins, que aparecia sem ponto final e não correspondia à entrada já traduzida.
- Adicionado o script `tools/patch-plugin-empty-state.cjs` para aplicar essa tradução ao bundle de forma segura e repetível.
- O instalador agora compara o hash do `main.js` instalado com o pacote atual e atualiza o bundle quando há novas traduções, mesmo se o núcleo já estiver em PT-BR.

## [1.2.0] - 2026-10-06

### Traduções PT-BR
- Traduzidas 34 descrições de cartões do catálogo MCP: Splunk, Wiz, Neon, Google Cloud Organization Policy, Google Cloud API Keys, Personalized Service Health, Google Cloud Unified Maintenance, Neo4j, mabl, Miro, Parallel Search, Grafana Cloud, Exa, CrowdStrike Falcon, Vercel, FactSet AI-Ready Data, Relativity, Daloopa, Finnhub, S&P Global, LSEG, Harvey, Guidepoint, Fiscal.ai, DocuSign, LegalZoom, NetDocuments, iManage, Salesforce, Courtroom5, Opsera AI Agents, Forge, Endor Labs e Canva.
- Traduzidas 7 descrições de habilidades/plugins: gerenciamento de plugins, recomendações do Managed Service for Apache Airflow, atualização de jobs Spark/Dataproc, diagnóstico de Spark/Dataproc, extensões do Chrome e autoria e consulta de grafos do BigQuery.
- Corrigida a detecção por prefixo de 4 descrições que ainda apareciam em inglês ou parcialmente traduzidas: gcp-spark-troubleshooting, chrome-extensions, bigquery-graph-author e bigquery-graph-query. A descrição de generative_ui foi conferida e já estava em PT-BR.
- Traduzido o rótulo alternativo “Mcp Tools” para “Ferramentas MCP”.

### Mensagens de erro MCP
- Traduzidos 4 padrões de erro/configuração: falha ao alternar servidor, falha ao excluir servidor, falha ao ler o arquivo MCP e caminho do arquivo de configuração indisponível.
- A mensagem de falha ao alternar mantém o detalhe variável retornado pelo servidor para ajudar no diagnóstico.

## [1.1.1] - 2026-10-06

### Traduções PT-BR
- Traduzidas as mensagens e os estados de erro dos servidores MCP do Google Cloud, incluindo ausência de credenciais ADC, variáveis de endpoint e servidor ausente na configuração.
- Traduzidos os textos de ajuda e tooltips das ferramentas MCP, os controles de detalhamento e as contagens de ferramentas.
- Acrescentadas traduções para descrições das habilidades BigQuery exibidas nos prints: BigFrames, Data Transfer Service, grafos e atribuição de recursos.
- Traduzidas as descrições das habilidades de planilhas (xlsx) e criação de habilidades exibidas na interface.

## [1.1.0] - 2026-10-05

### Interface Web
- O usuário confirmou que as correções e traduções desta atualização estão funcionando no Antigravity.
- Acrescentadas traduções para o seletor `Google (internal)`, mensagens de erro interno e estados de sidecar (`Running`, `Stopped`, `Errored`, `Backoff` e `Unknown`).
- Traduzidas as instruções, ações e mensagens de configuração da tela Jetski Chat, mantendo nomes técnicos e comandos originais.
- Traduzidas as descrições das habilidades `automation`, `ui-extension` e `ui-plugin-navigation`, além das habilidades do Data Agent Kit: Bigtable, Airflow, Spark, segurança do GCS, autenticação do Google Cloud, Cloud Storage, Cloud Storage FUSE, configuração regional de MCP e mapeamento de esquemas.
- Mantidos sem alteração os identificadores técnicos de habilidades, ferramentas e comandos para assegurar o funcionamento dos complementos.
- Auditoria estática do `web-bundle/main.js` concluída com sucesso.

## [1.0.0] - 2026-10-03

### Lançamento Inicial
- Tradução completa e profunda do núcleo Electron e da interface gráfica web do Google Antigravity para Português do Brasil (PT-BR).
- Patcher dinâmico com backup modular por versão.
- Scripts de instalação e restauração em um clique (`Instalar-Traducao.bat` e `Restaurar-Original.bat`).
