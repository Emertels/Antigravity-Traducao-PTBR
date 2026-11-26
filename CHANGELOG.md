## v1.8.0 — Antigravity 2.35.1 / 2.35.2 — 26/11/2026

### Interface, Permissões, Chat de Voz & Tempo Relativo
- **Tempo Relativo por Extenso:** Atualizado o formatador `zD` e o fallback em `_trAgy` para exibir unidades por extenso no singular e plural (`1 minuto`, `7 minutos`, `1 hora`, `2 horas`, `1 dia`, `6 dias`, `1 semana`, `2 semanas`, `1 mês`, `2 meses`, `1 ano`, `3 anos`).
- **Seletor de Largura & Chat de Voz:** Traduzidos `"Fill"` $\rightarrow$ *"Preencher"* (ao lado de *Estreito*, *Padrão*, *Largo*) e `"You"` $\rightarrow$ *"Você"* no indicador de áudio/transcrição de voz.
- **Permissões, Ações e Padronização:** Adicionada regra dinâmica para *"Yes, and always allow \<comando\>"* $\rightarrow$ *"Sim, e sempre permitir \<comando\>"*, traduzido *"Skip (Esc), Skip All (Ctrl+Esc)"* $\rightarrow$ *"Pular (Esc), Pular tudo (Ctrl+Esc)"*, ajustado *"Adicionar Contexto"* $\rightarrow$ *"Adicionar contexto"* e padronizado *"Checking for ..."* $\rightarrow$ *"Verificando ..."* além de *"1 turn"* / *"N turns"* $\rightarrow$ *"1 turno"* / *"N turnos"*.
- **Restaurador (`Restaurar-Original.ps1`):** Corrigida recursão infinita em `Wait-IfStandalone` quando executado diretamente fora do `.bat`.
- **Marketplace, Atalhos & Filtros:** Traduzidos `Only Archived` $\rightarrow$ *"Apenas arquivadas"*, `Only Automations` $\rightarrow$ *"Apenas automações"*, `Submit (↵)` $\rightarrow$ *"Enviar (↵)"*, `Search shortcuts...` $\rightarrow$ *"Pesquisar atalhos..."*, `No` $\rightarrow$ *"Não"*, descrições de plugins no Marketplace (`Kling AI`, `Meshy`, `Midpage Legal Research`, `mumo`, `Orca Security`, `Passim AI`) e removido `text-transform: capitalize` de *"Interface do sistema"* e *"Solicitar revisão"*.
- **Visualizador Biomolecular (`biomolecular-sidecar`):** Traduzidos *"Found N structure files."* $\rightarrow$ *"N arquivo(s) de estrutura encontrado(s)."* e *"Error scanning files:"* $\rightarrow$ *"Erro ao verificar arquivos:"*.

## v1.7.0 — Antigravity 2.35.1 — 25/11/2026

### Seletor de Modelos, Esforço de Pensamento & Tooltips de Planos
- **Tag de Modelos Novos (`Novo`):** Corrigida a tradução do emblema `"New"` de *"Nova"* para *"Novo"* no seletor de modelos (ex.: `Gemini 4 Hydrogen`).
- **Esforço de Pensamento (`Extra High`):** Adicionada tradução para *"Extra alto"* (além de *"Muito alto"*, *"Ultra alto"* e *"Mínimo"*), incluindo combinações com sufixo de janela de contexto (ex.: `Extra alto · 1M`) e parênteses nos nomes de modelos (`(Extra alto)`, `(Alto)`, `(Baixo)`, `(Mínimo)`).
- **Tooltips dos Modelos e Planos:** Traduzidos os avisos do seletor de modelos (*"Disponível nos planos pagos Google AI Pro e Ultra. Não incluído no seu plano atual."*, *"O \<modelo\> já está disponível nos planos pagos Pro e Ultra. O acesso a modelos de terceiros não estará mais disponível no seu plano atual a partir de \<data\>."* de forma dinâmica para modelos como `Opus 5.5` e `Sonnet 5.5`, *"Para velocidade e eficiência em tarefas de execução"*, *"Delega etapas rotineiras para um executor mais rápido. Mesma qualidade, menos tokens usados."*, *"Modelos personalizados são compatíveis apenas com máquinas Linux."*, *"Padrão (Gemini Pro)"* e *"O planejador próprio do Orquestrador"*).

### Teclas de Atalho, Chat por Voz, Swarm & Interface Geral
- **Proteção de Teclas (`Enter` e `<kbd>`):** Corrigido `"Enter": "Entrar"` para `"Enter": "Enter"`, eliminando *"Enviar mensagem Entrar"* (agora exibe corretamente *"Enviar mensagem Enter"*). Protegidos os elementos `<kbd>` e `.agy-shortcut-keycap` no observador DOM para preservar nomes de teclas (`Enter`, `Tab`, `Delete`, `End`, etc.). Traduzidos também *"Pressione as teclas..."* (`Press keys...`), *"Parar edição"* (`Stop Editing`), *"Redefinir tudo para o padrão"* (`Reset All to Defaults`) e o rótulo de gravação de atalho na aba Atalhos.
- **Limpeza de Substituições Cegas no `_trToolPhrase`:** Removidas substituições isoladas de palavras soltas no meio de frases (`translation`, `Details`, `Modes`, `Targets`, `Schemas`, `Commands`, `Toolkit`, `Installer`, `Remote Control`, `In Progress`, `Danger Zone`, etc.) que geravam textos híbridos como *"Checked Portuguese tradução..."*, *"Copy version detalhes"* e *"Use this form if you cannot connect to Controle Remoto..."*.
- **Termo `Swarm` Preservado:** Mantida a palavra técnica *"Swarm"* / *"Swarms"* sem traduzir para *"enxame"* (*"Nenhum swarm nesta conversa"*, *"Swarms iniciados nesta conversa..."*, *"Aguardando por um swarm"*).
- **Chat por Voz & Títulos:** Traduzidos *"Chat por voz iniciado · ..."*, *"Chat por voz encerrado · ..."*, *"Transcrição de voz"*, *"Transcrição ao vivo"*, *"Editar título da conversa"* (apenas inicial maiúscula), *"Criar novo projeto"* (apenas inicial maiúscula), *"Escuro Padrão"* / *"Claro Padrão"* (padronizados com P maiúsculo no seletor de tema), *"Verificar versão do Antigravity"* e *"Conversa de teste simples"*.
- **Ações de Cópia & Notificação de Arquivamento:** Traduzidos *"Copiar comando"*, *"Copiar transcrição"*, *"Copiar imagem"*, *"Copiar comando gh auth login"*, *"Copiar detalhes da versão"*, *"Copiar como Markdown"*, *"Copiar para a área de transferência"* e o toast com ícone embutido *"Veja os itens arquivados na barra lateral (menu)."* / *"(Personalizar barra lateral)."*.
- **Onboarding (Termos & Telemetria), Cota de Uso (`Weekly limit, resets in ...`) & WSL (`dist/wsl.js`):** Traduzido o modal *"Mais uma coisa antes de começar…"* (*"Personalize sua experiência no agente..."*, *"Proteções automatizadas ajudam..."*, *"Os agentes do Antigravity são poderosos..."*, *"Ajude-nos a melhorar o Antigravity."*, *"Permita que o Google colete e use seus dados de interações, sujeito aos Termos de Serviço do Google Antigravity e à Política de Privacidade do Google. Você pode controlar isso nas suas configurações a qualquer momento."*, *"Inscreva-se para receber boletins informativos..."*, *"A telemetria está desativada para a sua conta..."* e botão *"Continuar"*); corrigido o formato combinado *"Weekly limit, resets in ..."* $\rightarrow$ *"Limite semanal, redefine em ..."* (e diário/por hora); traduzidas as mensagens do WSL em `dist/wsl.js` (*"Baixando o binário do Antigravity…"*, *"Instalando em \<distro\>…"* e erros/avisos de caminho) e alertas de falha do WSL em `dist/main.js` pelo `patch-antigravity.cjs`.
- **Formulário Completo de Feedback & Dispositivos de Áudio:** Traduzidas todas as categorias (*Relatório de bug*, *Solicitação de recurso*, *Autenticação e faturamento*, *Problema no Controle Remoto*, *Feedback geral*), descrições detalhadas, listas com marcadores, placeholders, validações e anexo de logs/capturas; corrigido também o prefixo `Communications -` $\rightarrow$ *"Comunicações - "* na lista de microfones das Configurações de Voz e no tradutor dinâmico.
- **Menu de Exibição e Ordenação da Barra Lateral:** Traduzidos *"Ordenar projetos"* (`Sort Projects`), *"Ordenar espaços de trabalho"* (`Sort Workspaces`), *"Decorações"* (`Decorations`) e *"Ambiente"* (`Environment`).
- **Aba Contas de Plugins (`Contas`):** Traduzidos *"Used for:"* → *"Usado para:"*, *"Domains:"* → *"Domínios:"*, *"Add account"* → *"Adicionar conta"*, *"Add label"* → *"Adicionar rótulo"*, *"Signing out…"* → *"Saindo…"* e os rótulos dinâmicos de acessibilidade (*"Adicionar rótulo para ..."*, *"Tornar ... a conta padrão de ..."*, *"Novo segredo para ..."*).
- **Indicadores de Execução (`1 task running`):** Adicionada regra dinâmica para *"1 task running"* / *"N tasks running"* (*"1 tarefa em execução"* / *"N tarefas em execução"*), cobrindo também tarefas em segundo plano, agentes, subagentes, etapas, combinações (`subagents/tasks running`, bloqueados, timers e *"Still running"* → *"Ainda em execução"*) e swarms em execução.
- **Progresso do Checklist de Etapas (`2/5 steps`):** Adicionada regra dinâmica para o chip `step-plan-chip` (*"2/5 steps"* → *"2/5 etapas"*, incluindo sufixos com `failed` / `skipped` e contadores isolados *"N steps"* → *"N etapas"*).
- **Cotas de 5 Horas, Erros & IDs (`Configurações > Modelos` e Chat):** Adicionada tradução para *"You have hit your 5-hour limit, so the weekly limit does not currently apply. Your 5-hour limit will refresh in ..."* e o trecho *"If on a supported paid plan, you can use AI credits in the interim."*; corrigido o aviso *"Erro: cota individual atingida..."* e traduzido *"Error ID:"* → *"ID do erro:"*.
- **Créditos da Tradução (`Configurações > Versão`):** Removidos o fundo acinzentado, o `marginTop` e a borda dupla do bloco `ptbr-translation-credit`, mantendo a mesma cor de fundo do aplicativo e apenas a linha divisória principal entre *Versão do aplicativo* e *Tradução PT-BR: Emerson Teles*.
- **Menu de Diff, Gmail & Ajustes de Capitalização:** Traduzidos *"Show Whitespace Changes"* → *"Mostrar alterações de espaços em branco"*, a descrição da skill `/gmail` e seus exemplos de prompts (*"Summarize my unread emails from today"*, *"Draft a reply to the latest thread about launch readiness"*, *"Find emails with attachments from last week"*), além do ajuste *"Opções de Exibição"* → *"Opções de exibição"*.
- **Espaçamento do Tempo Relativo na Barra Lateral (`7 min`, `2 h`, `17 dias`):** Corrigido o formatador `zD` (e o fallback em `_trAgy`) para separar o número da unidade em todas as escalas de tempo (`7 min`, `2 h`, `1 dia`/`17 dias`, `2 sem`, `1 mês`/`2 meses`, `1 ano`/`2 anos`), evitando rótulos colados como `7min`.
- **Correção da Paleta de Comandos (`Ctrl+Shift+P`, `Ctrl+K`, `Ctrl+P`, `Ctrl+Shift+K`):** Restaurados os identificadores internos de `S_.Commands.title`, `S_.Files.title`, `S_.Conversations.title` e `S_.Projects.title` no código do seletor rápido (`uBc` / `vBc` / `Pjc` dependiam dos valores em inglês para abrir cada categoria e trocar o filtro no menu suspenso, mantendo a tradução visual automática via observador DOM); adicionado também *"Search code..."* $\rightarrow$ *"Pesquisar código..."*.
- **Varredura Adicional de UI:** Traduzidas mais de 400 strings adicionais de configurações, modal SSH, permissões granulares do GitHub, integração/onboarding e SSO, navegador integrado, depuração remota do Chrome, perguntas paralelas, visualizador de PDF, worktrees, atualizações e mensagens do Git.

### Painéis Android Completos (`sync-android-sidecars.ps1`)
- **Android Device Hub (`hub.bundle.js`):** Tradução completa do modal *"Criar dispositivo virtual"* (*"Selecione um perfil de hardware. O dispositivo usa a imagem de sistema mais recente para ele."*, *"Perfil de hardware:"*, *"Cancelar"*, *"Criar"*), perfis de hardware (*"Celular médio"*, *"Tablet médio"*, *"Desktop pequeno"*, *"Desktop médio"*, *"Desktop grande"*, *"Dobrável 1:1"*, *"Dobrável 4:3"*), controles do emulador (*"Ligar/Desligar"*, *"Aumentar volume"*, *"Diminuir volume"*, *"Girar à esquerda"*, *"Girar à direita"*, *"Controles estendidos"*, *"Sensor de toque"*), barra de dispositivos e ações (*"Inicialização a frio"*, *"Iniciar espelhamento"*, *"Enviar tela para o agente"*).
- **Android Compose Preview (`preview.bundle.js`):** Tradução completa da barra de zoom, árvore de componentes, propriedades, atalho de re-renderização e configurações (*"Manter o renderizador em execução"*, *"Unidade dos limites"*, *"Mostrar saída"*, *"Corrigir com o agente"*).

### Coerência dos Scripts (`.bat` / `.ps1`) & Backups
- **Fechamento Automático do CMD:** Corrigidos `Instalar-Traducao.bat` e `Restaurar-Original.bat` para não pausarem novamente quando o usuário escolhe abrir o Antigravity (`S`) ou sair (`N`/`Enter`/`Esc`) após o término da operação, mantendo pausa automática apenas em caso de erro.
- **Reinstalação e Restauração Forçadas:** Ao confirmar reinstalação (`S`) em instalação já traduzida, o `aplicar-traducao.ps1` agora repassa `--force` ao `patch-antigravity.cjs`; ao confirmar restauração forçada (`S`) em instalação já original, o `restaurar-original.ps1` agora força a regravação a partir de `_backups\<versão>\`.
- **Backup Unificado e Completo:** Garantida a geração de `backup-info.txt` em `_backups\<versão>\` além da cópia e restauração automática dos backups dos sidecars Android (`_backups\android-sidecars\`).

### Compatibilidade Oficial com Antigravity 2.35.1
- **Pareamento com o Antigravity 2.35.1:** Atualização e testes de compatibilidade total com a nova versão oficial da Google (v2.35.1), garantindo preservação de versão instalada e patch modular dinâmico sem riscos de downgrade.
- **Correção Definitiva da Tela Preta (Black Screen):** O executável `Antigravity.exe` agora tem seu Electron Fuse de integridade ASAR comutado para `'0'` diretamente pelo instalador e pelo patcher com validação pós-escrita no disco. Isso impede que o Electron recuse o carregamento do `app.asar` com `--web_bundle_path`, eliminando definitivamente a tela preta de inicialização.
- **Preservação de Assets Nativos:** Preservados e validados todos os 541 assets nativos de runtime extraídos de `language_server.exe` (incluindo `workers/shiki_worker.js`, `page_agent_bundle.js`, `page_facade_bundle.js`, esquemas ConnectRPC/Protobuf e sons de notificação `antigravityActionRequired.mp3` e `antigravityCascadeDone.mp3`).

### Idempotência Inteligente & Encerramento Seguro de Processos
- **Instalador Inteligente (`Instalar-Traducao.bat` / `aplicar-traducao.ps1`):** Detecta se a tradução PT-BR já está instalada e ativa antes de alterar qualquer arquivo. Caso já esteja traduzido, exibe mensagem informativa amigável e encerra sem fechar processos nem acusar erro de PID preso.
- **Restaurador Inteligente (`Restaurar-Original.bat` / `restaurar-original.ps1`):** Localiza a instalação e detecta se o Antigravity já está no estado original de fábrica (em inglês). Caso já esteja original, exibe mensagem informativa clara e encerra sem fechar processos nem refazer cópias desnecessárias.
- **Encerramento Robusto de Processos:** Implementado encerramento via `taskkill.exe /F /T` para derrubar toda a árvore de processos do `Antigravity.exe` e `language_server.exe`, acompanhado de verificação de liberação de alça de escrita no arquivo executável antes de prosseguir com o patch.
- **Script de Automação na Área de Trabalho:** Disponibilizado `Aplicar-Traducao-Automatica.bat` diretamente na Área de Trabalho para aplicar a tradução em 2 segundos e abrir o Antigravity já traduzido automaticamente.

### Tempo Relativo nas Conversas & Textos de Configuração
- **Correção da Abreviação de Mês ("1mo" / "2mo"):** As conversas antigas exibiam "1mo" e "2mo" (abreviação em inglês de *1 month* / *2 months*). A função de tempo relativo agora formata expressamente para *"1 mês"* e *"2 meses"* (e *"há 1 mês"* / *"há 2 meses"*).
- **Configurações > Conversas:** Corrigido o texto misto de idiomas para *"Configurações para conversas fora de projetos."*.

### Automações, Agendamentos & Personalizações (Skills)
- **Editor de Agendamentos Customizados:** Nós JSX diretos do editor traduzidos (*"Repetir a cada"*, *"no dia"*, *"nos dias"*, *"Dia da semana"*, *"Número de horas"*, *"Unidade de repetição"*, *"Dia do mês"*, *"Dias"*), corrigindo o texto do botão de unidade que ficava fixo em inglês (*"week"*, *"hours"*, *"month"*).
- **Ações e Rótulos de Personalizações:** Ações da lista de plugins e habilidades traduzidas (*"Copiar caminho"*, *"Caminho copiado!"*, *"Espaço de trabalho"*, *"Excluir agente"*, *"Excluir plugin"*).
- **Tradução de Descrições de Habilidades:** Mapeamento integrado para descrições técnicas de plugins instalados (quimioinformática, Chrome DevTools, depuração de vazamento de memória e ferramentas Android).

### Visualizador Biomolecular (Sidecar Mol*)
- **Paleta de Cores e Swatches:** Nomes das cores traduzidos em `title` e `aria-label` ao passar o mouse sobre cada swatch (*"Magenta"*, *"Vermelho"*, *"Laranja"*, *"Amarelo"*, *"Verde"*, *"Ciano"*, *"Azul"*, *"Rosa"*).
- **Seletor de Cor Personalizada:** Botão de conta-gotas e seletor de cores hexadecimal traduzidos (*"Cor personalizada"*, *"Cor hex, #rrggbb"*, *"Cor hex personalizada, #rrggbb"* e mensagem de validação de formato *"Digite uma cor como #rrggbb"*).
- **Notificações de Alternância de Visualização:** Mensagens dinâmicas de transição traduzidas em tempo real (*"Alternando visualização para Bastão…"*, *"Alternando visualização para Esfera…"*, *"Alternando visualização para Cartoon…"*, *"Alternando visualização para Superfície…"*, *"Alternando visualização para Linha…"*) cobrindo todos os presets moleculares.
- **Controle de Visibilidade de Anotações e pLDDT:** Botões de alternância de exibição localizados como *"Mostrar anotações"* / *"Ocultar anotações"* e *"Mostrar coloração pLDDT"* / *"Ocultar coloração pLDDT"*.

### Painéis Android (Device Hub & Compose Preview)
- **Localização Direta nos Bundles dos Sidecars:** Tradução dos assets servidos isoladamente via iframe pelo `sidecar-web-server`:
  - **Android Device Hub:** Estado vazio (*"Nenhum dispositivo conectado"*), instrução (*"Conecte um dispositivo com a depuração USB ativada ou obtenha um abaixo."*), ação (*"Criar dispositivo virtual"*), divisor (*"ou"*) e aluguel (*"Alugar um dispositivo remoto"*).
  - **Android Compose Preview:** Estado vazio (*"Nenhuma prévia ainda"*), instrução com aspas tipográficas corretas (*"Peça ao agente para pré-visualizar uma tela do Compose, ex.: “Mostrar HomeScreenPreview no Android Compose Preview”."*).

### Editor de Automações, Agendamentos e Modelos
- **Seletor de Recorrência e Unidades:** Configuração de agendamentos localizada (*"Repetir a cada"*, *"A cada hora"*, *"Todos os dias"*, *"Dias úteis"*, *"Toda semana"*, *"Personalizado…"*, *"horas"*, *"semana"*, *"mês"*).
- **Abreviação e Acessibilidade dos Dias da Semana:** Botões de dias da semana mapeados com padrão do Brasil (`S  T  Q  Q  S  S  D` para Segunda a Domingo) e rótulos acessíveis completos (`aria-label` de Segunda a Domingo).
- **Conectores e Datas:** Textos de ligação traduzidos (*"em"*, *"no dia"*, *"dia {X}"*, *"às"*).
- **Níveis de Raciocínio de Modelos:** Níveis traduzidos dinamicamente nos seletores de modelo: `(High)` → `(Alto)`, `(XHigh)` → `(Muito alto)`, `(Low)` → `(Baixo)` (mantendo os já suportados `(Médio)` e `(Pensando)`).
- **Tooltip de Validação de Criação:** Mensagem de campos pendentes traduzida dinamicamente para *"Necessário para criar: título, instruções"* e *"Necessário para salvar: ..."*.
- **Comando `/automation`:** Prompt padrão preenchido automaticamente traduzido para *"Oriente-me na criação de uma tarefa automatizada"*.

### Gerenciador de Plugins (Aba Permissões)
- **Cabeçalhos e Descrições de Permissão:** Localizados os nós JSX hardcoded da aba Permissões de plugins (*"Permitido por você"*, *"Nada é sempre permitido. Você será consultado antes que este plugin faça alterações."*, *"Incluído no plugin"*, *"Estes vêm com o plugin e não podem ser revogados."*).
- **Linhas de Concessão e Ações:** Traduzidos os escopos e botões (*"Sempre permitido"*, *"Permitido em {Projeto}"*, *"Qualquer recurso"*, *"Nome indisponível"*, *"Revogar tudo"*, *"Revogar: {Recurso}"* e diálogo de confirmação).

### Menu de Projetos, Barra de Status e Aparência
- **Padronização de Capitalização (Minúsculas em Palavras Secundárias):** Ajustados os textos para evitar Title Case excessivo em português:
  - Barra inferior e menu: *"Nenhum projeto"* (com 'N' maiúsculo e 'p' minúsculo, corrigindo o antigo "Nenhum Projeto").
  - Menus de criação: *"Novo projeto"* e *"Projeto CLI"*.
  - Cabeçalhos: *"Selecionar projeto"* e *"Selecionar espaço de trabalho"*.
- **Configurações de Aparência:** Fonte *"System UI"* traduzida para *"Interface do sistema"*.
- **Dispositivos de Áudio:** Prefixo *"Communications - "* traduzido para *"Comunicações - "* nos dispositivos de comunicação padrão do Windows.
- **Seletor de Modelos e Cotas:** Banner de limites básicos mínimos para usuários gratuitos e aviso de disponibilidade do Sonnet 5.5 em planos pagos localizados em português.

### Paleta de Comandos Completa (`Ctrl+Shift+P`)
- **Tradução Integral dos 48 Comandos:** Traduzidos diretamente no registro central de comandos (`Vj`) todas as 48 ações do aplicativo (gerenciamento de conversas, pastas, abas, terminais, automações, SSH, atalhos de teclado e alternância de temas claro/escuro).
- **Interface da Paleta:** Traduzido o campo de pesquisa (*"Pesquisar comandos..."*), seletor de categorias (*"Comandos"*, *"Arquivos"*, *"Conversas"*, *"Projetos"*) e mensagem de estado vazio (*"Nenhum resultado encontrado"*).

### Barra do Navegador Interno & Drawer de Downloads
- **Drawer de Downloads:** Título *"Downloads"*, estado vazio *"Nenhum download recente"*, botão *"Limpar"*, botão *"Fechar downloads"* e tooltips de progresso (*"Downloads, em andamento"*, *"Downloads, X% concluído"*).
- **Barra de Navegação e Ferramentas:** Botões *"Inspecionar elemento para comentar"*, *"Sair do modo de inspeção de elemento (Esc)"*, *"Adicionar captura de tela à conversa"*, *"Abrir no navegador externo"* e *"Recarregar"*.
- **Rascunhos de Comentários:** Tooltips e botões *"Retomar rascunho de comentário"*, *"Descartar rascunho de comentário"* e contador de rascunhos (*"1 rascunho"*).

### Controles de Áudio, Gravação e Envio de Mensagens
- **Botão de Envio e Modos de Disparo:** Tooltips contextualizados para envio primário e secundário (*"Enviar mensagem Enter"*, *"Enfileirar mensagem (Alt+Enter)"*, *"Enviar imediatamente (Alt+Enter)"*).
- **Gravação de Voz:** Tooltips e rótulos interativos (*"Gravar áudio"*, *"Parar gravação"*, *"Gravando"*, *"Parar gravação e enviar"*), além de notificação do microfone (*"O modo de voz do Chefe de Gabinete está ativo"*).
- **Feedback de Envio e Transcrição:** Localizados os nós JSX hardcoded do botão de áudio/envio: *"Finalizando..."*, *"Finalizando transcrição..."*, *"Enviando mensagem transcrita..."* e *"Carregando..."*.
- **Banner de Alerta e Seletor de Microfone:** Tradução do menu popover de microfones (*"Microfone"*, *"Padrão do sistema"*, *"Padrão do sistema (X)"*), banner de advertência (*"Sem áudio de X"*, *"Nenhum áudio do microfone detectado"*, *"Trocar microfone"*, *"Dispensar aviso do microfone"*, *"Usando X"* e *"Usando o microfone padrão do sistema"*), além de todas as mensagens de permissão e bloqueio do microfone no Windows/Mac.
- **Botão de Cancelamento de Geração:** Tooltip e acessibilidade do botão vermelho de cancelamento localizados como *"Cancelar (Ctrl+D)"* e *"Cancelar (⌘C)"*.

### Varredura Completa de Configurações e Preferências
- **Opções do Painel de Configurações:** Tradução completa de todas as chaves e descrições das configurações gerais e de aparência (*"Verificação automática de atualizações"*, *"Impedir suspensão"*, *"Manter na barra de menus"*, *"Modo de leitor de tela"*, *"Largura da conversa"*, *"Posicionamento do terminal"*, *"Largura de artefatos Markdown"*, *"Menus de contexto personalizados"*, *"Habilitar agente de navegador"*, *"Indicador de contexto e cota"*, *"Seleção de modelo"*, *"Ativar telemetria"*, etc.).
- **Tempo Relativo e Notificações de Erro:** Carimbos temporais traduzidos para *"agora mesmo"* e *"há {X}m/h/d"*. Toasts de erro de mídia localizados para *"Mídia inválida"* e *"Não foi possível anexar a imagem: ..."*.

### Sincronizador do Visualizador Biomolecular (`sync-biomolecular-sidecar.ps1`)
- **Suporte Abrangente a Versões (1.0.0 e 1.3.0/1.3.1):** Pacotes de sidecar contendo conjuntos completos `original` e `translated` para as versões 1.0.0 e 1.3.0.
- **Tradução do Título da Aba (`sidecar.json`):** Incluído `sidecar.json` no ciclo de tradução e restauração, localizando o título da aba no painel lateral.
- **Fallback Automático de Restauração:** Caso a pasta `_backups` seja removida em atualizações da Google, o restaurador utiliza os arquivos originais em inglês embutidos no pacote para garantir a reversão a 100% inglês.
- **Tratamento Resiliente:** Se executado em máquinas que ainda não possuem o plugin de biologia estrutural instalado, o instalador avisa amigavelmente e segue sem falhas.

### Sistema de Backup e Restauração de Fábrica Reforçado
- **Preservação de Integridade:** Backup automático do executável oficial com o Electron Fuse de fábrica preservado em `1` antes de desativar a verificação de integridade para a tradução.
- **Marcador de Ausência de Bundle:** Registro de `web-bundle-was-absent.txt` para que a restauração remova completamente a pasta `web-bundle`, eliminando resíduos em português ao voltar para o inglês.
- **Restauração Responsiva e Idempotente (`restaurar-original.ps1`):** Restaura com 1 clique o `app.asar` limpo da Google, restaura o executável original, remove o web-bundle traduzido, reverte os sidecars para o inglês e limpa o cache do Electron.
- **Auditoria Final de Tradução:** 857 candidatos inspecionados via `tools/scan-untranslated.cjs`, com **0 termos em inglês sem mapeamento**.
- **Crédito de Autoria Preservado:** Mantido o crédito oficial `"Tradução PT-BR: Emerson Teles"` em destaque azul-turquesa `#00adb5` no cartão da versão em Configurações.
- **Terminologia Padronizada:** Aderência integral ao padrão de Emerson Teles: "aplicativo" (nunca "app"), "tokens" e Português do Brasil (`pt-BR`).

## v1.6.0 — Antigravity 2.28.2 — 30/10/2026

### Atualização do frontend e traduções
- Revisados os prints desta conversa: acrescentadas traduções para navegação de conversas, categorias de plugins, textos de automação, metadados, descrições visíveis e aviso de privacidade. Os nomes próprios dos serviços foram preservados.
- Ampliada a cobertura dos cartões dos prints: adicionados 42 mapeamentos por prefixo para descrições de plugins de design, produtividade, hospedagem, ferramentas de desenvolvimento e negócios, incluindo trechos que aparecem misturados em inglês e português. Os prefixos traduzem a descrição completa iniciada pelo mesmo texto, mesmo quando o cartão a corta visualmente.
- Corrigidos rótulos de navegação “Move Conversation Up/Down” e metadados “Website”, “Repository”, “View less” e “automation”; as frases de privacidade e as categorias também ficam cobertas pelos textos completos do catálogo.
- Traduzido o controle da barra lateral “Show Less” como “Mostrar menos”, junto de “Show All” → “Mostrar tudo”.
- Traduzido o rótulo “Trigger” no formulário de nova automação como “Agendamento”.
- Traduzido o seletor de projetos: “Search Projects”, “Search Recent Workspaces”, “This Computer” e “Cloud”, incluindo o placeholder misto “Search Projects...”.
- Corrigido o seletor após conferência visual: além do dicionário e dos atributos de busca, os rótulos estáticos do componente React/portal são localizados diretamente no bundle (“Recentes”, “Este computador”, “Novo Projeto”, “Nenhum Projeto” e “Configurações do projeto”), e os placeholders das buscas locais e remotas usam português desde a renderização inicial.
- Ajustado o valor personalizado salvo de `projectSearchPlaceholder` para passar por `_trAgy` antes de ser exibido; isso cobre preferências antigas que ainda armazenam “Search Projects”. Traduzido também o rótulo de “Configurações do projeto” no menu contextual de “Nenhum Projeto”.
- Traduzidos os rótulos e o comando misto “Background comandos” / “Atualizar Chocolatey package” para “Comandos em segundo plano” / “Atualizar pacote do Chocolatey”.
- Traduzida a tela de erro do Android Compose Preview: título, explicação da CLI Android ausente, instruções de instalação/PATH e botão “Retry”. O nome da aba passou a “Prévia do Compose para Android”; “Android Device Hub” também foi localizado como “Central de dispositivos Android”.
- Adicionada regra dinâmica para “1 file changed” e plurais, exibindo “1 arquivo alterado” / “N arquivos alterados”; os contadores `+26` e `-0` permanecem intactos.
- Traduzido o carimbo relativo “just now” como “agora mesmo” e confirmados nos prints os nomes localizados dos painéis Android Compose Preview e Android Device Hub.
- Traduzidas diretamente no componente de busca as dicas “Match Case (Aa)”, “Match Whole Word (ab)” e “Use Regular Expression (.*)”, que não eram alcançadas pelo dicionário por causa da capitalização/renderização do tooltip. Reinstalação validada no Antigravity 2.28.2.
- Nova auditoria combinada do frontend 2.28.2: **814 candidatos de rótulos, descrições e amostras do catálogo remoto** revisados, com **0 sem mapeamento**. A métrica anterior de 798 cobria apenas propriedades de texto presentes no bundle; as descrições do Marketplace são carregadas dinamicamente e não entravam nessa varredura. O scanner agora inclui frases dos prints e entende também os prefixos específicos do catálogo remoto.
- Corrigidas descrições que ainda apareciam inteiras ou parcialmente em inglês nos cartões do Marketplace: Visualizador Biomolecular, depuração de cookies com Chrome DevTools MCP, Google Agenda, Dropbox, Notion, Netlify, Railway, Vercel e Wix. As regras prioritárias substituem o texto completo antes da aplicação de mapeamentos genéricos, evitando frases híbridas.
- Corrigidos “Build with Google” e sua descrição, além do trecho “global permissions” em Configurações de permissões. Revisados os três trechos do aviso de privacidade do Google sobre ferramentas de desenvolvedores de terceiros, inclusive quando aparecem juntos no mesmo bloco de texto.
- Tornado o pré-teste do Visualizador Biomolecular independente da importação automática do cmdlet `Get-FileHash`; quando necessário, o sincronizador calcula SHA-256 pelo .NET, sem alterar os critérios de identificação e backup.
- Corrigido o texto composto do cartão “Subagente do navegador”: além do requisito do Chrome, a instrução para iniciar com `/browser` agora traduz o trecho junto quando o frontend o renderiza no mesmo nó.
- Atualizado `web-bundle/main.js` a partir do frontend servido pela instalação original Antigravity 2.28.2; preservada a camada PT-BR existente e reaplicados os mapeamentos sobre a compilação atual.
- Traduzido o aviso de pesquisa entre conversas: “This page is going away soon”, “Search conversations with”, “in the top left.”, “View archived in the sidebar” e o botão “Dismiss”. Mantida a busca nas conversas arquivadas pelo menu de filtros.
- Mantido o crédito “Tradução PT-BR: Emerson Teles” em azul-turquesa no cartão da versão, atualizado para a estrutura do frontend 2.28.2.
- Atualizados `compiled_tailwind.css`, `jetbox.css` e `prism_bundle.js` a partir da interface 2.28.2 servida localmente.
- Atualizado o pré-teste do seletor e do placeholder para a estrutura e os textos atuais da versão 2.28.2, mantendo a validação do perfil Turbo.
- Traduzidos os rótulos do painel de uso do modelo (“Model”, “Usage”, limites semanais/diários, estado indisponível e provedores) e adicionadas regras dinâmicas para percentuais restantes (`86% left`) e janelas como `5h limit`. A regra existente para tempos de redefinição cobre `Resets in 2d 5h`.
- Correção refinada após conferir o DOM da 2.28.2: o percentual é renderizado em um nó separado e o sufixo é literalmente `% left`, não a frase completa `86% left`; o sufixo agora é traduzido diretamente para `% restante`.
- Patcher pré-testado contra o ASAR instalado 2.28.2; sintaxe JavaScript e do scanner validadas. Instalação 2.28.2 e varredura combinada concluídas; 0 candidatos sem mapeamento. ZIP portátil sem documentação, com 26 arquivos e 39.631.850 bytes. SHA-256: `FEAEC81ACC13D5AB13DDBA78CA5007D0B5B33030CF3F95D7885C37F90C9CB6F9`. Release v1.6.0 atualizada em 30/10/2026.

## v1.5.0 — Antigravity 2.26.0 — 24/10/2026

### Tradução e interface atual

- Incorporado o frontend original servido pelo Antigravity 2.26.0: JavaScript principal, Tailwind, Jetbox e worker de diferenças. A camada de tradução foi reaplicada sobre essa interface, preservando os recursos atuais e o seletor Turbo.
- Adicionados **87 mapeamentos de texto**, com **450 palavras nos valores PT-BR adicionados**. Contagem lexical automática de sequências de letras, ignorando placeholders; mapeamentos e palavras são métricas diferentes.
- Cobertos os novos controles de sons e notificações, ações do navegador, autenticação e atualização de plugins, provedores de contexto, arquivos e recursos na nuvem, cópia de links/imagens, telemetria, contas e ações de painéis.
- Incorporadas as revisões locais de “Display” → “Exibição”, “Archived Only” → “Somente arquivados” e “Project Settings” → “Configurações do projeto”.
- Preservadas 13 regras de tradução direta dos seletores, projetos, ambientes, busca e criação de automações. Incluída “Give Feedback” → **“Enviar feedback”** no catálogo e no rótulo original do menu.
- Restaurado **“Tradução PT-BR: Emerson Teles”** em azul-turquesa **#00adb5**, dentro do cartão da versão, abaixo da linha do número e com separador discreto. O pré-teste exige um único crédito para impedir sua perda ou duplicação em atualizações futuras.
- A varredura de propriedades da interface examinou **894 candidatos** e terminou com **zero textos em inglês sem mapeamento** nesse conjunto. “a2a (ttv2)” e “Flash Lite” são identificadores/nomes preservados; “Novo Projeto” já está em português. A métrica não representa todos os textos possíveis de serviços externos.

### Instalador e restaurador

- A checagem sintática usa `execFileSync(process.execPath, ...)`, chamando o mesmo Node que iniciou o patcher. Isso remove a dependência de `node` no PATH que podia causar falha em instalações com runtime portátil.
- Erros de sintaxe agora exibem o diagnóstico real do Node, incluindo stderr, para distinguir problemas no código de problemas no ambiente.
- Mantido o Node.js portátil **24.21.0**, com licença, para instalação e restauração sem exigir Node global.
- O pré-teste do Turbo reconhece a estrutura funcional e os valores dos perfis sem depender dos nomes minificados da compilação. Valores de permissões e modos originais permanecem preservados.
- Adicionado suporte ao Science **1.3.1** no sincronizador biomolecular. Os dois arquivos originais foram confirmados como idênticos por SHA-256 aos da 1.3.0; o pacote de 39 substituições é compartilhado, com backups independentes por versão e por origem ativa/cache.
- Padronizados os finais de linha dos scripts por `.gitattributes`; mantida a codificação de console com acentos e cedilhas.

### Verificações realizadas

- Pré-teste estrutural, sintaxe JavaScript/PowerShell e reconstrução sobre o Antigravity 2.26.0 aprovados.
- Patcher executado com **PATH vazio e Node portátil**, sem depender de Node global.
- Instalação, restauração e reinstalação locais concluídas. O SHA-256 do ASAR restaurado correspondeu exatamente ao backup original 2.26.0.
- Crédito testado no componente gerado: posição dentro do cartão, texto exato, cor #00adb5 e versões obtidas tanto do servidor quanto do fallback nativo.
- Tradução aplicada também às cópias ativa e em cache do visualizador biomolecular 1.3.1.

### Pacote de distribuição

- ZIP portátil com tradução, instalador, restaurador, verificadores necessários, sidecar, runtime e licenças.
- **Sem README, README.ag, LEIA-ME, AGENTS ou CHANGELOG dentro do ZIP.** O histórico desta versão fica nesta descrição da release e no repositório.
- O pacote não inclui ASAR estático para substituir versões oficiais mais novas; a reconstrução usa o original limpo da versão instalada.

### Arquivo da release

Antigravity-Traducao-PTBR-v1.5.0-Portable.zip — 25 arquivos, 39543789 bytes.

SHA-256: E5CEA1A54B2DBF66A415D7D997A72250780C8F9D6BBB69968ABF3D5A0F221179


## v1.4.0 — Antigravity 2.24.0 — 18/10/2026

### Revisão local — Antigravity 2.25
- 22/10/2026: traduzidos os itens “Display” → “Exibição” e “Archived Only” → “Somente arquivados” no submenu de filtros do histórico; as traduções foram aplicadas diretamente aos rótulos renderizados e acrescentadas ao catálogo.

### Diagnóstico do instalador e runtime portátil — 18/10/2026
- Corrigida a mensagem ambígua “Node.js ou patch-antigravity.cjs não encontrado”, que não indicava qual dependência faltava e interrompia a instalação em computadores sem Node.js no `PATH`.
- O ZIP portátil agora inclui o runtime oficial Node.js 24.21.0 para Windows x64 em `runtime/node.exe`, além da licença distribuída pela Node.js Foundation. O instalador e o restaurador preferem esse runtime e usam `node.exe` do `PATH` como alternativa.
- Separadas as mensagens de arquivo `.cjs` ausente e runtime ausente. Os avisos orientam extrair o ZIP completo e confirmam que nenhum arquivo foi alterado.
- O binário foi obtido da distribuição oficial e conferido pelo SHA-256 `158f7685b44de51f6c0df1d153526cbcd3e1bc739a8dfc607721cef75de9e541` publicado no arquivo `SHASUMS256.txt` do Node.js.
- Traduzido o carimbo de tempo relativo “just now” da interface como “Agora mesmo”.
- Acrescentada uma regra dinâmica para os tempos compactos em minutos: `2m ago` agora aparece como `há 2 min`, com suporte a qualquer quantidade de minutos.
- Corrigido o tempo compacto mostrado na nova captura: `27d ago` agora aparece como `há 27 dias`. Também foram incluídas regras dinâmicas com singular e plural para semanas (`w ago`), meses (`mo ago`) e anos (`y ago`), cobrindo os formatos compactos equivalentes.
- Corrigidos rótulos que continuavam em inglês no seletor de projeto/ambiente: “New Project”, “Quick Start” e “No Project” também são traduzidos diretamente na configuração e no JSX do menu, além do catálogo DOM. O tooltip com atalho é montado em fragmentos pelo Antigravity; o prefixo agora é localizado no próprio componente como “Selecionar ambiente (Ctrl+.)”. “New worktree” passa a “Nova árvore de trabalho”.
- Traduzido o rótulo curto “Notice” como “Aviso” no catálogo da interface e na regra dinâmica.
- 19/10/2026: corrigido o tooltip “Project Settings” do seletor de projetos. Embora já existisse no catálogo, o texto era passado como `label` de uma ação dinâmica e escapava da tradução DOM; as duas ações agora recebem diretamente “Configurações do projeto”.
- Removido do diretório local e excluído do pacote o backup temporário `web-bundle/main.js.bak`; apenas o bundle atual é distribuído.

### Correção da origem ativa do Visualizador Biomolecular — 17/10/2026
- Corrigido o motivo de o painel continuar inteiramente em inglês: o Antigravity estava servindo o pacote ativo `~/.gemini/config/plugins/science/sidecars/biomolecular_structure_viewer`, enquanto o sincronizador anterior atualizava apenas a cópia do cache de marketplaces.
- Atualizado o sincronizador para localizar as duas origens, validar a versão da cópia ativa pelo `plugin.json` do plugin Science e manter backup original separado sob `_backups/biomolecular-sidecar/gemini-config/1.3.0`.
- Aplicadas as 39 substituições ao pacote ativo do Visualizador Biomolecular 1.3.0; o backup original foi criado a partir dos arquivos verificados. Após reabrir o app, as rotas ativas `/ui.html` e `/main.js` responderam HTTP 200; o HTML declara `lang="pt-BR"`, o bundle servido tem 184.209 bytes e contém os 23 rótulos visíveis conferidos no print — incluindo “Representação”, “Componentes”, “Selecionar e personalizar”, “Nenhuma seleção ainda” e “Salvar”. A frase original “No selections yet” não aparece na resposta ativa.

### Interface e extensões
- Traduzido “Other Customizations” como “Outras personalizações” na tela de uso de tokens das personalizações.
- Traduzidos os novos rótulos do Visualizador de Estruturas Biomoleculares: representação, componentes, águas, açúcares, ligantes, cadeias laterais, seleção de resíduos, anotações e estados vazios.
- Corrigida a cobertura do tradutor em raízes Shadow DOM abertas e iframes da mesma origem, onde estavam vários textos do visualizador e dos menus de projeto.
- Traduzidos trechos separados por links: a descrição de permissões do projeto e o aviso “Attaching logs requires an email address”, além dos fragmentos do link Legal Help.
- Corrigido o texto contextual “This project was created for the … automation” para “Este projeto foi criado para a automação do …”.
- Adicionadas regras para a dica dinâmica “Switching view to…” e para a contagem de seleções; “Resets in 6d 5h” agora é exibido como “Redefine em 6 dias e 5 horas”.
- Traduzidos o aviso de disponibilidade do Gemini 4 Argon para assinantes Ultra e Pro pagos, os textos de histórico “This page is going away soon” e “Mark All as Read”, a ajuda jurídica e as descrições dos plugins Google Agenda e Google Drive.
- Acrescentados os rótulos de projeto “New Project” e “Quick Start”, além da dica “Select Environment (Ctrl+`)”. O trecho de regra mostrado na prévia de AGENTS.md é localizado somente na interface; o arquivo e seu conteúdo permanecem intactos.
- Revisados os textos dos prints e o texto colado do Modern Web Guidance (441 linhas e 5.016 palavras no arquivo recebido). O catálogo recebeu 382 entradas novas ou ampliadas nesta revisão; esse total conta chaves/mapeamentos, não palavras traduzidas. Inclui títulos, descrições, prompts e trechos de acessibilidade, IA integrada e CSS.
- O pacote do Visualizador Biomolecular aplica 39 substituições literais na interface, incluindo rótulos, seleção, estados vazios, acessibilidade, estados de anotação e as dicas de atualização e envio de arquivos; nomes internos, formatos PDB/CIF e integração Mol* são preservados.
- Acrescentadas traduções para descrições e exemplos de Google Developer Knowledge, Google Cloud Developer, Google Maps Platform, Dart e Flutter e Data Agent Kit, além de prompts do Firebase, Google Workspace, Gemini API e Android CLI. Identificadores, comandos, nomes de APIs e caminhos permanecem preservados.
- O instalador e o restaurador agora incluem o sidecar do Visualizador Biomolecular 1.3.0. O pré-teste confere a versão e os hashes dos arquivos; backups ficam em `<pasta-do-Antigravity>\\_backups\\biomolecular-sidecar`, e a restauração só substitui arquivos que ainda correspondem à tradução desta versão.
- Corrigido o encerramento lento do instalador/restaurador: após os pré-testes, os scripts forçam o fechamento dos processos da interface do Antigravity, preservam `language_server.exe` e verificam o encerramento por até 3 segundos, em intervalos de 100 ms. Se algum processo não puder ser finalizado, exibem nome e PID; o próprio atalho apresenta uma única pausa de erro.
- Corrigidos os acentos do console: os scripts de instalação/restauração selecionam a página de código UTF-8 antes de imprimir mensagens e configuram a codificação de entrada/saída do PowerShell.
- Corrigida a atualização de textos em Personalizações: o instalador agora limpa os caches de interface em toda execução bem-sucedida, inclusive quando o patch principal e o sidecar já estão aplicados. Foram acrescentadas 4 chaves ao catálogo para o menu de agentes (“Main Agent”, “Agent options” e “Click to Open Docs”) e o campo de pasta, além de 4 substituições literais ao pacote do visualizador para rótulos acessíveis e estados de anotação; o HTML do visualizador agora declara `pt-BR`.
- Comparação de hashes confirmou que o `web-bundle/main.js` instalado ainda era anterior às traduções mais recentes; reinstalação do pacote atualiza o bundle e renova o cache de interface.
- Corrigida a atualização do sidecar biomolecular quando o pacote 1.3.0 recebe novas traduções: o sincronizador reconhece apenas os hashes exatos da tradução anterior e registra os hashes da nova versão ao lado do backup original. O sincronizador agora usa UTF-8 com BOM para preservar acentos no Windows PowerShell.
- A verificação anterior comparava hashes da cópia no cache de marketplaces, mas não confirmava a origem servida pelo processo do visualizador. A consulta HTTP local revelou que o Antigravity carregava o plugin ativo em `~/.gemini/config/plugins/science`; esse caminho foi acrescentado ao pré-teste, à instalação e à restauração.
- Instalação das correções adicionais concluída em 17/10/2026. O instalador encontrou as duas cópias do plugin Science 1.3.0, atualizou ambas e criou o backup original independente do pacote ativo em `_backups/biomolecular-sidecar/gemini-config/1.3.0`.
- Teste confirmado pelo usuário: restaurador e instalador executaram corretamente de primeira após a correção do encerramento dos processos e da saída do console.
- O instalador valida previamente o sidecar e restaura os arquivos do sidecar a partir do backup se uma cópia falhar. O restaurador limpa o cache de interface depois da restauração.
- Verificação local: pré-testes do patch 2.24.0 e do sidecar 1.3.0 aprovados; validação de sintaxe JavaScript/PowerShell e `git diff --check` aprovados. A tentativa anterior do instalador foi interrompida pelo fechamento normal ineficaz e não alterou os arquivos instalados; a rotina foi corrigida para usar encerramento forçado.

### Revisões anteriores incorporadas à versão
- Mantidas as traduções “Hide Whitespace Changes”, “Good Response” e “Bad Response”, o tempo compacto “6h ago” e os contadores de linhas/itens adicionais.
- Mantido o processamento incremental do observador DOM para evitar travamentos da interface, com áreas de edição protegidas por seletores específicos e observação de conteúdo em Shadow DOM/iframes acessíveis.
- Confirmada a compatibilidade estrutural do patch com o `app.asar` local Antigravity 2.24.0. O bundle de interface usado pelo projeto permanece baseado na compilação 2.23.0; as novas extensões e textos dinâmicos são localizados pela camada DOM.

### Traduções adicionais da interface — Antigravity 2.23.0 — 14/10/2026
- Adicionadas “Hide Whitespace Changes”, “Good Response” e “Bad Response” ao catálogo PT-BR.
- Acrescentada a forma compacta “6h ago” com tradução por horas variáveis e suporte a reticências tipográficas em “Show N more…”. A regra existente para “+ N more lines” foi confirmada com o valor da captura.
- Refinada a proteção de editores: removida a exclusão ampla por qualquer classe que contenha `editor`, que podia pular rótulos da interface de diff. A proteção continua usando seletores conhecidos para Monaco, CodeMirror, ProseMirror, Tiptap, Lexical e Slate.

### Interface responsiva após a tradução — Antigravity 2.23.0 — 14/10/2026
- Substituída a varredura síncrona e recursiva de todo o `document.body` por uma fila incremental processada em quadros de animação, limitada a 250 nós ou aproximadamente 6 ms por quadro.
- Mantido o acompanhamento de conteúdo dinâmico e atributos. Editores e áreas de código continuam excluídos da tradução.
- Validado com 1.000 nós em uma simulação, com tradução distribuída por quadros, sem alterações no Monaco e com novos textos dinâmicos traduzidos. O pré-teste e a recompilação da instalação 2.23.0 também passaram.

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
