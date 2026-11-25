# ==============================================================================
#  Sincronizador PT-BR para Sidecars Android (Device Hub & Compose Preview)
#  Desenvolvido por: Emerson Teles
# ==============================================================================
param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('Preflight', 'Install', 'Restore')]
    [string]$Mode,
    [string]$AntigravityInstallDir = ''
)

$ErrorActionPreference = 'Stop'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

$androidPacksRoot = Join-Path $env:USERPROFILE '.android\cli\packs'
if (-not (Test-Path -LiteralPath $androidPacksRoot -PathType Container)) {
    if ($Mode -eq 'Install') {
        Write-Host '[i] Pacotes do Android CLI não encontrados neste computador; painéis Android ignorados com segurança.' -ForegroundColor DarkGray
    }
    return $false
}

$sidecarSpecs = @(
    @{ Name = 'device-hub'; File = 'hub.bundle.js'; Kind = 'hub' },
    @{ Name = 'compose-preview'; File = 'preview.bundle.js'; Kind = 'preview' }
)

$targets = @()
foreach ($packVer in Get-ChildItem -LiteralPath $androidPacksRoot -Directory -ErrorAction SilentlyContinue) {
    $sidecarsDir = Join-Path $packVer.FullName 'sidecars'
    if (-not (Test-Path -LiteralPath $sidecarsDir -PathType Container)) { continue }
    foreach ($spec in $sidecarSpecs) {
        $bundlePath = Join-Path (Join-Path $sidecarsDir $spec.Name) $spec.File
        if (Test-Path -LiteralPath $bundlePath -PathType Leaf) {
            $targets += [pscustomobject]@{
                PackVersion = $packVer.Name
                Name = $spec.Name
                Kind = $spec.Kind
                BundlePath = $bundlePath
                OriginalPath = "$bundlePath.original"
            }
        }
    }
}

if ($targets.Count -eq 0) {
    if ($Mode -eq 'Install') {
        Write-Host '[i] Bundles do Android Device Hub / Compose Preview não encontrados; nenhuma alteração necessária.' -ForegroundColor DarkGray
    }
    return $false
}

if ($Mode -eq 'Preflight') {
    return $true
}

$marker = '/* __AGY_ANDROID_PTBR_V171__ */'

function Get-AndroidPtBrFooter([string]$kind) {
    $hubDict = @'
var _ptAndDict = {
  "Create Virtual Device": "Criar dispositivo virtual",
  "Create virtual device": "Criar dispositivo virtual",
  "Select a hardware profile. The device uses the latest system image for it.": "Selecione um perfil de hardware. O dispositivo usa a imagem de sistema mais recente para ele.",
  "Hardware profile:": "Perfil de hardware:",
  "Hardware profile": "Perfil de hardware",
  "No profiles available": "Nenhum perfil disponível",
  "Select a profile": "Selecionar um perfil",
  "Cancel": "Cancelar",
  "Create": "Criar",
  "Delete": "Excluir",
  "No devices connected": "Nenhum dispositivo conectado",
  "Plug in a device with USB debugging turned on, or get one below.": "Conecte um dispositivo com a depuração USB ativada ou obtenha um abaixo.",
  "Lease a remote device": "Alugar um dispositivo remoto",
  "or": "ou",
  "Copy command": "Copiar comando",
  "Copied": "Copiado",
  "Cannot copy the command": "Não foi possível copiar o comando",
  "Back to devices": "Voltar aos dispositivos",
  "Select Device": "Selecionar dispositivo",
  "Devices": "Dispositivos",
  "Device actions": "Ações do dispositivo",
  "Group": "Agrupar",
  "Group by": "Agrupar por",
  "None": "Nenhum",
  "Form Factor": "Formato",
  "Status": "Status",
  "Type": "Tipo",
  "Name": "Nome",
  "API": "API",
  "Actions": "Ações",
  "Online": "Online",
  "Offline": "Offline",
  "Virtual": "Virtual",
  "Remote": "Remoto",
  "Physical": "Físico",
  "Unauthorized": "Não autorizado",
  "Gone": "Indisponível",
  "Error": "Erro",
  "Retry": "Tentar novamente",
  "Reconnect": "Reconectar",
  "Cannot list devices": "Não foi possível listar os dispositivos",
  "Searching for devices…": "Procurando dispositivos…",
  "Searching for devices...": "Procurando dispositivos...",
  "Start mirroring": "Iniciar espelhamento",
  "More actions": "Mais ações",
  "Cold Boot": "Inicialização a frio",
  "Stop": "Parar",
  "Start": "Iniciar",
  "Mirroring": "Espelhamento",
  "Send screen to agent": "Enviar tela para o agente",
  "Cannot send the screen to the agent": "Não foi possível enviar a tela para o agente",
  "Device controls": "Controles do dispositivo",
  "Power": "Ligar/Desligar",
  "Volume Up": "Aumentar volume",
  "Volume Down": "Diminuir volume",
  "Rotate Left": "Girar à esquerda",
  "Rotate Right": "Girar à direita",
  "Back": "Voltar",
  "Home": "Início",
  "Overview": "Visão geral",
  "Extended Controls": "Controles estendidos",
  "Posture controls": "Controles de postura",
  "Fold/Unfold": "Dobrar/Desdobrar",
  "Extended Controls Toolbar": "Barra de controles estendidos",
  "Extended Controls Panel": "Painel de controles estendidos",
  "Fingerprint": "Impressão digital",
  "Battery": "Bateria",
  "Select fingerprint to simulate touch sensor event:": "Selecione a impressão digital para simular o evento do sensor de toque:",
  "Select Fingerprint": "Selecionar impressão digital",
  "Touch Sensor": "Sensor de toque",
  "Device display": "Tela do dispositivo",
  "Resize Panels": "Redimensionar painéis",
  "Dismiss": "Dispensar",
  "Log": "Registro",
  "Handheld": "Portátil",
  "Desktop": "Desktop",
  "Automotive": "Automotivo",
  "Disconnected": "Desconectado",
  "Device disconnected": "Dispositivo desconectado",
  "The mirror connection was closed": "A conexão de espelhamento foi encerrada",
  "Connection to the device hub sidecar was closed": "A conexão com o sidecar do Device Hub foi encerrada",
  "Cannot fetch the jobs": "Não foi possível buscar as tarefas",
  "Cannot fetch the devices": "Não foi possível buscar os dispositivos",
  "Cannot fetch the hardware profiles": "Não foi possível buscar os perfis de hardware",
  "Cannot fetch the server log": "Não foi possível buscar o registro do servidor",
  "Accept the 'Allow USB debugging?' prompt on the device": "Aceite a solicitação 'Permitir depuração USB?' no dispositivo",
  "This browser can't decode the video of the device (WebCodecs is not available).": "Este navegador não consegue decodificar o vídeo do dispositivo (WebCodecs indisponível).",
  "Medium Phone": "Celular médio",
  "Small Phone": "Celular pequeno",
  "Large Phone": "Celular grande",
  "Medium Tablet": "Tablet médio",
  "Large Tablet": "Tablet grande",
  "Small Desktop": "Desktop pequeno",
  "Medium Desktop": "Desktop médio",
  "Large Desktop": "Desktop grande",
  "Foldable 1 1": "Dobrável 1:1",
  "Foldable 4 3": "Dobrável 4:3",
  "Resizable Experimental": "Redimensionável experimental"
};
'@

    $prevDict = @'
var _ptAndDict = {
  "No preview yet": "Nenhuma prévia ainda",
  "Compose Preview": "Compose Preview",
  "Settings": "Configurações",
  "Reset": "Redefinir",
  "Dismiss": "Dispensar",
  "Cancel": "Cancelar",
  "Zoom": "Zoom",
  "Zoom out": "Reduzir zoom",
  "Zoom in": "Ampliar",
  "Zoom level": "Nível de zoom",
  "Zoom level of the smallest image, fit to the pane": "Nível de zoom da menor imagem, ajustado ao painel",
  "Fit the images to the pane, without enlarging them": "Ajustar as imagens ao painel sem ampliá-las",
  "Actual size (100%): one pixel of the image per pixel of the screen": "Tamanho real (100%): um pixel da imagem por pixel da tela",
  "Collapse all": "Recolher tudo",
  "Expand all": "Expandir tudo",
  "Rendering…": "Renderizando…",
  "Rendering...": "Renderizando...",
  "Re-render all previews": "Renderizar novamente todas as prévias",
  "Cannot reach the Android Compose Preview server": "Não foi possível conectar ao servidor do Android Compose Preview",
  "Loading…": "Carregando…",
  "Loading...": "Carregando...",
  "Not rendered yet.": "Ainda não renderizado.",
  "Show output": "Mostrar saída",
  "Hide output": "Ocultar saída",
  "Fix with agent": "Corrigir com o agente",
  "Sent to the agent": "Enviado ao agente",
  "The agent will look at the failed previews.": "O agente analisará as prévias com falha.",
  "Could not send to the agent": "Não foi possível enviar ao agente",
  "Show fully qualified names": "Mostrar nomes totalmente qualificados",
  "Bounds unit": "Unidade dos limites",
  "dp uses the density of each image; images rendered without one show pixels.": "dp usa a densidade de cada imagem; imagens renderizadas sem densidade exibem pixels.",
  "Keep the renderer running": "Manter o renderizador em execução",
  "Re-render shortcut": "Atalho para renderizar novamente",
  "All nodes": "Todos os nós",
  "Properties": "Propriedades",
  "Tree": "Árvore",
  "Show the bounds as": "Mostrar limites como",
  "Bounds in pixels of the image": "Limites em pixels da imagem",
  "No @Preview function found": "Nenhuma função @Preview encontrada",
  "Could not preview the workspace": "Não foi possível pré-visualizar o espaço de trabalho",
  "1 preview": "1 prévia",
  "Desk": "Mesa",
  "Car": "Carro",
  "Appliance": "Eletrodoméstico",
  "Watch": "Relógio",
  "VR headset": "Óculos VR"
};
'@

    $dictBlock = if ($kind -eq 'hub') { $hubDict } else { $prevDict }

    $commonTranslator = @'
function _trAnd(s) {
  if (typeof s !== "string") return s;
  var t = s.trim();
  if (!t) return s;
  var r = _ptAndDict[t];
  if (r) {
    if (s.startsWith(" ") || s.endsWith(" ")) {
      var l = s.match(/^\s*/)[0], tr = s.match(/\s*$/)[0];
      return l + r + tr;
    }
    return r;
  }
  if (/^(\d+)\s+devices?$/i.test(t)) return t.replace(/^(\d+)\s+devices?$/i, function(_, n){ return n + (n === "1" ? " dispositivo" : " dispositivos"); });
  if (/^Connecting to\s+(.+?)(\u2026|\.\.\.)?$/i.test(t)) return t.replace(/^Connecting to\s+(.+?)(\u2026|\.\.\.)?$/i, "Conectando a $1…");
  if (/^(.+?)\s+disconnected$/i.test(t)) return t.replace(/^(.+?)\s+disconnected$/i, "$1 desconectado");
  if (/^Couldn't connect to\s+(.+)$/i.test(t)) return t.replace(/^Couldn't connect to\s+(.+)$/i, "Não foi possível conectar a $1");
  if (/^Lost connection to\s+(.+)$/i.test(t)) return t.replace(/^Lost connection to\s+(.+)$/i, "Conexão perdida com $1");
  if (/^(.+?)\s+is gone$/i.test(t)) return t.replace(/^(.+?)\s+is gone$/i, "$1 não está mais disponível");
  if (/^Allow USB debugging on\s+(.+)$/i.test(t)) return t.replace(/^Allow USB debugging on\s+(.+)$/i, "Permitir depuração USB em $1");
  if (/^No permission to use\s+(.+?)\s+over USB$/i.test(t)) return t.replace(/^No permission to use\s+(.+?)\s+over USB$/i, "Sem permissão para usar $1 via USB");
  if (/^Cannot start\s+(.+)$/i.test(t)) return t.replace(/^Cannot start\s+(.+)$/i, "Não foi possível iniciar $1");
  if (/^Cannot stop\s+(.+)$/i.test(t)) return t.replace(/^Cannot stop\s+(.+)$/i, "Não foi possível parar $1");
  if (/^Cannot delete\s+(.+)$/i.test(t)) return t.replace(/^Cannot delete\s+(.+)$/i, "Não foi possível excluir $1");
  if (/^Cannot create a (.+?) device$/i.test(t)) return t.replace(/^Cannot create a (.+?) device$/i, function(_, p){ return "Não foi possível criar um dispositivo " + (_ptAndDict[p] || p); });
  if (/^Delete\s+(.+?)\?$/i.test(t)) return t.replace(/^Delete\s+(.+?)\?$/i, "Excluir $1?");
  if (/^The virtual device and its data \((.+?)\) will be deleted\. This cannot be undone\.$/i.test(t)) return t.replace(/^The virtual device and its data \((.+?)\) will be deleted\. This cannot be undone\.$/i, "O dispositivo virtual e seus dados ($1) serão excluídos. Isso não pode ser desfeito.");
  if (/^Device is\s+(.+)$/i.test(t)) return t.replace(/^Device is\s+(.+)$/i, "O dispositivo está $1");
  if (/^Device display\s+(\d+)$/i.test(t)) return t.replace(/^Device display\s+(\d+)$/i, "Tela do dispositivo $1");
  if (/^Finger\s+(\d+)$/i.test(t)) return t.replace(/^Finger\s+(\d+)$/i, "Dedo $1");
  if (/^Fold\/Unfold \(currently\s+(.+?)\)$/i.test(t)) return t.replace(/^Fold\/Unfold \(currently\s+(.+?)\)$/i, "Dobrar/Desdobrar (atual: $1)");
  if (/^Copy\s+"(.+)"$/i.test(t)) return t.replace(/^Copy\s+"(.+)"$/i, 'Copiar "$1"');
  if (/^Re-render all previews \((.+?)\)$/i.test(t)) return t.replace(/^Re-render all previews \((.+?)\)$/i, "Renderizar novamente todas as prévias ($1)");
  if (/^(\d+)\s+previews$/i.test(t)) return t.replace(/^(\d+)\s+previews$/i, "$1 prévias");
  if (/^(\d+)\s+images?$/i.test(t)) return t.replace(/^(\d+)\s+images?$/i, function(_, n){ return n + (n === "1" ? " imagem" : " imagens"); });
  if (/^(\d+)\s+nodes$/i.test(t)) return t.replace(/^(\d+)\s+nodes$/i, "$1 nós");
  if (/^There is no @Preview function in\s+(.+)\.$/i.test(t)) return t.replace(/^There is no @Preview function in\s+(.+)\.$/i, "Não há função @Preview em $1.");
  if (/^Ask the agent of this conversation to fix\s+(.+)$/i.test(t)) return t.replace(/^Ask the agent of this conversation to fix\s+(.+)$/i, "Pedir ao agente desta conversa para corrigir $1");
  if (/^Ask the agent to preview a Compose screen, e\.g\.\s*(.*)$/i.test(t)) return t.replace(/^Ask the agent to preview a Compose screen, e\.g\.\s*(.*)$/i, "Peça ao agente para pré-visualizar uma tela do Compose, ex.: $1");
  if (/^Click the shortcut and press a new key combination, or Backspace to clear \(default:\s*(.+?)\)\.?$/i.test(t)) return t.replace(/^Click the shortcut and press a new key combination, or Backspace to clear \(default:\s*(.+?)\)\.?$/i, "Clique no atalho e pressione uma nova combinação de teclas, ou Backspace para limpar (padrão: $1).");
  return s;
}
if (typeof window !== "undefined" && typeof document !== "undefined") {
  var _andObs = new WeakSet();
  function _andSkip(el) {
    if (!el || el.nodeType !== 1) return false;
    var tag = el.tagName;
    if (tag === "CODE" || tag === "PRE" || tag === "INPUT" || tag === "TEXTAREA" || tag === "SCRIPT" || tag === "STYLE" || tag === "KBD") return true;
    if (typeof el.closest === "function" && el.closest("code, pre, input, textarea, kbd")) return true;
    return false;
  }
  function _andAttrs(el) {
    if (!el || el.nodeType !== 1 || typeof el.getAttribute !== "function") return;
    ["title", "aria-label", "placeholder", "alt"].forEach(function(a) {
      var v = el.getAttribute(a);
      if (v) { var tr = _trAnd(v); if (tr !== v) el.setAttribute(a, tr); }
    });
  }
  function _andWalk(root) {
    if (!root) return;
    if (root.nodeType === 3) {
      if (_andSkip(root.parentElement)) return;
      var v = root.nodeValue;
      if (v && v.trim()) {
        var tr = _trAnd(v.trim());
        if (tr !== v.trim()) root.nodeValue = v.replace(v.trim(), tr);
      }
      return;
    }
    if (root.nodeType === 1) {
      if (_andSkip(root)) return;
      _andAttrs(root);
      var ch = root.childNodes;
      for (var i = 0; ch && i < ch.length; i++) _andWalk(ch[i]);
    }
  }
  function _andInit(r) {
    if (!r || _andObs.has(r)) return;
    _andObs.add(r);
    _andWalk(r);
    if (typeof MutationObserver === "function") {
      new MutationObserver(function(ms) {
        for (var i = 0; i < ms.length; i++) {
          var m = ms[i];
          if (m.type === "characterData") _andWalk(m.target);
          else if (m.type === "attributes") _andAttrs(m.target);
          else if (m.addedNodes) {
            for (var j = 0; j < m.addedNodes.length; j++) _andWalk(m.addedNodes[j]);
          }
        }
      }).observe(r, { childList: true, characterData: true, attributes: true, attributeFilter: ["title", "aria-label", "placeholder", "alt"], subtree: true });
    }
  }
  if (document.body) _andInit(document.body);
  else document.addEventListener("DOMContentLoaded", function(){ _andInit(document.body); });
  setInterval(function(){ if (document.body) _andWalk(document.body); }, 800);
}
'@

    return "`n$marker`n$dictBlock`n$commonTranslator`n"
}

$changed = $false
foreach ($t in $targets) {
    if ($Mode -eq 'Restore') {
        if (Test-Path -LiteralPath $t.OriginalPath -PathType Leaf) {
            Copy-Item -LiteralPath $t.OriginalPath -Destination $t.BundlePath -Force
            Write-Host "    [OK] Sidecar Android ($($t.Name)) restaurado para o original." -ForegroundColor Green
            $changed = $true
        } else {
            $curText = [IO.File]::ReadAllText($t.BundlePath, $utf8NoBom)
            $mIdx = $curText.IndexOf($marker)
            if ($mIdx -ge 0) {
                [IO.File]::WriteAllText($t.BundlePath, $curText.Substring(0, $mIdx).TrimEnd(), $utf8NoBom)
                Write-Host "    [OK] Camada PT-BR removida do sidecar Android ($($t.Name))." -ForegroundColor Green
                $changed = $true
            }
        }
        continue
    }

    if ($Mode -eq 'Install') {
        # Sempre partir do .original limpo se existir; se o arquivo atual já foi parcialmente alterado anteriormente e tem .original, usar .original!
        $sourceText = $null
        if (Test-Path -LiteralPath $t.OriginalPath -PathType Leaf) {
            $sourceText = [IO.File]::ReadAllText($t.OriginalPath, $utf8NoBom)
        } else {
            $curText = [IO.File]::ReadAllText($t.BundlePath, $utf8NoBom)
            if ($curText.Contains($marker)) {
                $curText = $curText.Substring(0, $curText.IndexOf($marker)).TrimEnd()
            }
            [IO.File]::WriteAllText($t.OriginalPath, $curText, $utf8NoBom)
            $sourceText = $curText
        }

        if ($AntigravityInstallDir) {
            $bkSidecarDir = Join-Path (Join-Path $AntigravityInstallDir '_backups') "android-sidecars\$($t.PackVersion)\$($t.Name)"
            if (-not (Test-Path -LiteralPath $bkSidecarDir -PathType Container)) {
                New-Item -ItemType Directory -Path $bkSidecarDir -Force | Out-Null
            }
            $bkOrigFile = Join-Path $bkSidecarDir "$($t.Name -replace '.*','')"
            $bkFile = Join-Path $bkSidecarDir ([IO.Path]::GetFileName($t.BundlePath))
            if (-not (Test-Path -LiteralPath $bkFile -PathType Leaf)) {
                [IO.File]::WriteAllText($bkFile, $sourceText, $utf8NoBom)
            }
        }

        $footer = Get-AndroidPtBrFooter $t.Kind
        $finalText = $sourceText.TrimEnd() + $footer
        [IO.File]::WriteAllText($t.BundlePath, $finalText, $utf8NoBom)
        Write-Host "    [OK] Sidecar Android ($($t.Name)) atualizado com tradução PT-BR." -ForegroundColor Green
        $changed = $true
    }
}

return $changed
