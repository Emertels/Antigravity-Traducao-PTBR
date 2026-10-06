# Histórico de Alterações

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
