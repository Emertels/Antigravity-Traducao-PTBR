# ==============================================================================
#  Instalador Universal de Tradução PT-BR para Google Antigravity
#  Tradução e Personalizacao por: Emerson Teles
# ==============================================================================
$utf8Console = New-Object System.Text.UTF8Encoding($false)
[Console]::InputEncoding = $utf8Console
[Console]::OutputEncoding = $utf8Console
$OutputEncoding = $utf8Console

function Read-OpenChoice([string]$Prompt) {
    Write-Host $Prompt -NoNewline -ForegroundColor White
    while ($true) {
        $key = [Console]::ReadKey($true)
        if ($key.KeyChar -eq 's' -or $key.KeyChar -eq 'S') { Write-Host 'S'; return $true }
        if ($key.KeyChar -eq 'n' -or $key.KeyChar -eq 'N') { Write-Host 'N'; return $false }
        if ($key.Key -eq [ConsoleKey]::Enter) { Write-Host 'Enter'; return $false }
        if ($key.Key -eq [ConsoleKey]::Escape) { Write-Host 'Esc'; return $false }
    }
}
$Host.UI.RawUI.WindowTitle = "Instalador Antigravity PT-BR - Emerson Teles"

function Write-Header {
    Clear-Host
    Write-Host ""
    Write-Host " ==================================================================== " -ForegroundColor Cyan
    Write-Host "        TRADUÇÃO GOOGLE ANTIGRAVITY PARA PORTUGUÊS DO BRASIL          " -ForegroundColor Green
    Write-Host "            Desenvolvido e Personalizado por: Emerson Teles           " -ForegroundColor Yellow
    Write-Host " ==================================================================== " -ForegroundColor Cyan
    Write-Host ""
}

function Copy-FileWithProgress {
    param(
        [string]$Source,
        [string]$Destination,
        [string]$Label = "Copiando"
    )

    $sourceFile = New-Object System.IO.FileInfo($Source)
    $totalBytes = $sourceFile.Length
    $totalMB = [math]::Round($totalBytes / 1MB, 1)

    $bufferSize = 2MB
    $buffer = New-Object byte[] $bufferSize

    $retryCount = 0
    $maxRetries = 5
    $success = $false

    while (-not $success -and $retryCount -lt $maxRetries) {
        try {
            $destParent = Split-Path $Destination -Parent
            if (-not (Test-Path $destParent)) {
                New-Item -ItemType Directory -Path $destParent -Force | Out-Null
            }

            $sourceStream = [System.IO.File]::OpenRead($Source)
            $destStream = [System.IO.File]::Create($Destination)

            $totalRead = 0
            $lastPercent = -1

            Write-Host "  $Label..." -ForegroundColor Cyan

            while (($bytesRead = $sourceStream.Read($buffer, 0, $buffer.Length)) -gt 0) {
                $destStream.Write($buffer, 0, $bytesRead)
                $totalRead += $bytesRead
                $percent = [math]::Floor(($totalRead / $totalBytes) * 100)

                if ($percent -ne $lastPercent) {
                    $lastPercent = $percent
                    $copiedMB = [math]::Round($totalRead / 1MB, 1)
                    $barLen = 22
                    $filled = [math]::Floor(($percent / 100) * $barLen)
                    $bar = ('=' * $filled) + (' ' * ($barLen - $filled))
                    $msg = "`r    [$bar] $percent% ($copiedMB MB / $totalMB MB)   "
                    Write-Host -NoNewline $msg
                    Start-Sleep -Milliseconds 5
                }
            }
            Write-Host ""
            $success = $true
        }
        catch {
            $retryCount++
            Write-Host "`n    [!] Arquivo temporariamente em uso. Tentativa $retryCount de $maxRetries em 2 segundos..." -ForegroundColor Yellow
            Start-Sleep -Seconds 2
        }
        finally {
            if ($sourceStream) { $sourceStream.Close() }
            if ($destStream) { $destStream.Close() }
        }
    }

    if (-not $success) {
        Write-Host "[x] Erro: Não foi possivel copiar para $Destination. Verifique se ha processos abertos." -ForegroundColor Red
        throw "Falha na copia do arquivo"
    }
}

function Copy-DirectoryWithProgress {
    param(
        [string]$SourceDir,
        [string]$DestinationDir,
        [string]$Label = "Copiando pacote da interface web"
    )

    if (-not (Test-Path $DestinationDir)) {
        New-Item -ItemType Directory -Path $DestinationDir -Force | Out-Null
    }

    $allFiles = Get-ChildItem -Path $SourceDir -Recurse -File
    $totalFiles = $allFiles.Count
    $currentFile = 0

    Write-Host "  $Label..." -ForegroundColor Cyan

    foreach ($file in $allFiles) {
        $currentFile++
        $relative = $file.FullName.Substring($SourceDir.Length).TrimStart('\', '/')
        $targetFile = Join-Path $DestinationDir $relative
        $targetParent = Split-Path $targetFile -Parent
        if (-not (Test-Path $targetParent)) {
            New-Item -ItemType Directory -Path $targetParent -Force | Out-Null
        }

        $copied = $false
        $attempts = 0
        while (-not $copied -and $attempts -lt 5) {
            try {
                Copy-Item -Path $file.FullName -Destination $targetFile -Force -ErrorAction Stop
                $copied = $true
            }
            catch {
                $attempts++
                Start-Sleep -Milliseconds 500
            }
        }

        $percent = [math]::Floor(($currentFile / $totalFiles) * 100)
        $barLen = 22
        $filled = [math]::Floor(($percent / 100) * $barLen)
        $bar = ('=' * $filled) + (' ' * ($barLen - $filled))
        $msg = "`r    [$bar] $percent% ($currentFile de $totalFiles arquivos)   "
        Write-Host -NoNewline $msg
        Start-Sleep -Milliseconds 5
    }
    Write-Host ""
}

function Disable-AsarIntegrityFuse {
    param([string]$ExePath)

    if (-not (Test-Path $ExePath)) { return }

    try {
        if (-not ([System.Management.Automation.PSTypeName]'FastFuse').Type) {
            Add-Type -TypeDefinition @'
using System;
using System.IO;
using System.Text;

public class FastFuse {
    public static int FindAndPatch(string path) {
        if (!File.Exists(path)) return -1;
        byte[] bytes = File.ReadAllBytes(path);
        byte[] magic = Encoding.ASCII.GetBytes("WNKmHXBZaB9tsX");
        for (int i = 0; i <= bytes.Length - magic.Length - 16; i++) {
            if (bytes[i] == magic[0]) {
                bool match = true;
                for (int j = 1; j < magic.Length; j++) {
                    if (bytes[i + j] != magic[j]) { match = false; break; }
                }
                if (match) {
                    int fuseIndex = i + magic.Length + 6;
                    if (fuseIndex < bytes.Length) {
                        if (bytes[fuseIndex] == (byte)'1') {
                            bytes[fuseIndex] = (byte)'0';
                            File.WriteAllBytes(path, bytes);
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                }
            }
        }
        return -2;
    }
}
'@
        }

        $res = [FastFuse]::FindAndPatch($ExePath)
        if ($res -eq 1) {
            Write-Host "    [OK] Verificação de integridade ASAR desativada com sucesso no executavel." -ForegroundColor Green
        } elseif ($res -eq 0) {
            Write-Host "    [OK] Executavel ja esta configurado para aceitar pacotes personalizados." -ForegroundColor Green
        } else {
            Write-Host "    [i] Executavel verificado com sucesso." -ForegroundColor Green
        }
    } catch {
        Write-Host "    [!] Aviso ao verificar integridade do executavel: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

function Update-AsarPackageVersion {
    param(
        [Parameter(Mandatory=$true)]
        [string]$AsarPath,
        [Parameter(Mandatory=$true)]
        [string]$TargetVersion
    )

    if (-not (Test-Path $AsarPath)) { return $false }

    $stream = $null
    try {
        $stream = [System.IO.File]::Open($AsarPath, [System.IO.FileMode]::Open, [System.IO.FileAccess]::ReadWrite, [System.IO.FileShare]::None)

        $sizeBuf = New-Object byte[] 8
        if ($stream.Read($sizeBuf, 0, 8) -ne 8) { $stream.Close(); return $false }

        $headerSize = [System.BitConverter]::ToUInt32($sizeBuf, 4)
        $totalHeader = 8 + $headerSize

        $headerBytes = New-Object byte[] $headerSize
        if ($stream.Read($headerBytes, 0, $headerSize) -ne $headerSize) { $stream.Close(); return $false }

        $jsonLen = [System.BitConverter]::ToUInt32($headerBytes, 4)
        $jsonStr = [System.Text.Encoding]::UTF8.GetString($headerBytes, 8, $jsonLen)

        $header = $jsonStr | ConvertFrom-Json
        $pkgNode = $header.files.'package.json'
        if (-not $pkgNode) { $stream.Close(); return $false }

        $pkgSize = [int]$pkgNode.size
        $pkgOffset = [long]$pkgNode.offset
        $absOffset = $totalHeader + $pkgOffset

        $stream.Seek($absOffset, [System.IO.SeekOrigin]::Begin) | Out-Null
        $pkgBytes = New-Object byte[] $pkgSize
        if ($stream.Read($pkgBytes, 0, $pkgSize) -ne $pkgSize) { $stream.Close(); return $false }

        $pkgText = [System.Text.Encoding]::UTF8.GetString($pkgBytes)
        $parsedPkg = $pkgText.Trim() | ConvertFrom-Json
        $parsedPkg.version = $TargetVersion

        $baseJson = $parsedPkg | ConvertTo-Json -Depth 5
        $baseBytes = [System.Text.Encoding]::UTF8.GetByteCount($baseJson)

        if ($baseBytes -gt $pkgSize) {
            $baseJson = $parsedPkg | ConvertTo-Json -Compress -Depth 5
            $baseBytes = [System.Text.Encoding]::UTF8.GetByteCount($baseJson)
        }

        if ($baseBytes -gt $pkgSize) {
            $stream.Close()
            return $false
        }

        $padLen = $pkgSize - $baseBytes
        $finalText = $baseJson
        if ($padLen -gt 0) {
            $lastBrace = $finalText.LastIndexOf('}')
            $finalText = $finalText.Substring(0, $lastBrace) + (' ' * $padLen) + '}'
        }

        $finalBytes = [System.Text.Encoding]::UTF8.GetBytes($finalText)
        if ($finalBytes.Length -ne $pkgSize) {
            $stream.Close()
            return $false
        }

        $stream.Seek($absOffset, [System.IO.SeekOrigin]::Begin) | Out-Null
        $stream.Write($finalBytes, 0, $pkgSize)
        $stream.Flush()
        $stream.Close()
        return $true
    }
    catch {
        if ($stream) { $stream.Close() }
        Write-Host "    [!] Erro ao ajustar versão no pacote do aplicativo: $($_.Exception.Message)" -ForegroundColor Yellow
        return $false
    }
}

function Find-AntigravityInstallation {
    $candidates = @()

    $proc = Get-Process -Name "Antigravity" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($proc -and $proc.Path) {
        $candidates += (Split-Path $proc.Path -Parent)
    }

    $candidates += "$env:LOCALAPPDATA\Programs\antigravity"
    $candidates += "$env:LOCALAPPDATA\Programs\Antigravity"
    $candidates += (Join-Path $env:LOCALAPPDATA "Programs\antigravity")
    $candidates += (Join-Path $env:LOCALAPPDATA "Programs\Antigravity")
    $candidates += (Join-Path $env:ProgramFiles "antigravity")
    $candidates += (Join-Path $env:ProgramFiles "Antigravity")
    if (${env:ProgramFiles(x86)}) {
        $candidates += (Join-Path ${env:ProgramFiles(x86)} "antigravity")
        $candidates += (Join-Path ${env:ProgramFiles(x86)} "Antigravity")
    }
    $candidates += (Join-Path $env:APPDATA "antigravity")

    $regPaths = @(
        "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*",
        "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*",
        "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*"
    )
    foreach ($rp in $regPaths) {
        try {
            $keys = Get-ItemProperty -Path $rp -ErrorAction SilentlyContinue | Where-Object { $_.DisplayName -like "*Antigravity*" }
            foreach ($k in $keys) {
                if ($k.InstallLocation -and (Test-Path $k.InstallLocation)) {
                    $candidates += $k.InstallLocation
                }
            }
        } catch { }
    }

    $drives = Get-PSDrive -PSProvider FileSystem | Select-Object -ExpandProperty Root
    foreach ($d in $drives) {
        $candidates += (Join-Path $d "antigravity")
        $candidates += (Join-Path $d "Programs\antigravity")
    }

    foreach ($cand in ($candidates | Where-Object { $_ } | Select-Object -Unique)) {
        if ((Test-Path (Join-Path $cand "resources\app.asar")) -or (Test-Path (Join-Path $cand "Antigravity.exe"))) {
            return $cand
        }
    }

    return $null
}

# Inicio da Execucao
Write-Header

# 1. Fechar processos da interface grafica do Antigravity (preservando servicos de fundo como language_server)
$running = Get-Process | Where-Object { $_.ProcessName -like "*antigravity*" -and $_.ProcessName -notlike "*language_server*" }
if ($running) {
    Write-Host "[-] Fechando janela ativa do Antigravity para atualizar arquivos com segurança..." -ForegroundColor Yellow
    $running | Stop-Process -Force -ErrorAction SilentlyContinue
    
    $timeout = 10
    while ($timeout -gt 0) {
        $check = Get-Process | Where-Object { $_.ProcessName -like "*antigravity*" -and $_.ProcessName -notlike "*language_server*" }
        if (-not $check) { break }
        Start-Sleep -Seconds 1
        $timeout--
    }
    Start-Sleep -Seconds 2
}

# 2. Localizar instalação do Antigravity
Write-Host "[1/4] Procurando instalação do Antigravity no computador..." -ForegroundColor White
$agyDir = Find-AntigravityInstallation

while (-not $agyDir -or -not (Test-Path $agyDir)) {
    Write-Host ""
    Write-Host "[!] Não foi possivel detectar a pasta do Antigravity automaticamente." -ForegroundColor Yellow
    $userInput = Read-Host "Por favor, digite ou cole o caminho da pasta onde o Antigravity esta instalado"
    if ([string]::IsNullOrWhiteSpace($userInput)) {
        Write-Host "[x] Operacao cancelada pelo usuario." -ForegroundColor Red
        Exit 1
    }
    if (Test-Path (Join-Path $userInput "resources\app.asar")) {
        $agyDir = $userInput
    } else {
        Write-Host "[x] Caminho invalido ou 'resources\app.asar' não encontrado nessa pasta!" -ForegroundColor Red
    }
}

Write-Host "    -> Antigravity localizado em: $agyDir" -ForegroundColor Green

# 2.1 Desativar verificação de integridade no executavel (Electron Fuse)
$exePath = Join-Path $agyDir "Antigravity.exe"
if (Test-Path $exePath) {
}

# 2.2 Detectar versão instalada do aplicativo de forma modular
$detectedVersion = $null
if (Test-Path $exePath) {
    try {
        $detectedVersion = (Get-Item $exePath).VersionInfo.FileVersion
        if (-not $detectedVersion) {
            $detectedVersion = (Get-Item $exePath).VersionInfo.ProductVersion
        }
        if ($detectedVersion) {
            $versionParts = $detectedVersion.Split('.')
            if ($versionParts.Length -ge 3) { $detectedVersion = $versionParts[0..2] -join '.' }
            Write-Host "    -> Versão detectada do Antigravity: $detectedVersion" -ForegroundColor Cyan
        }
    } catch { }
}

$resourcesDir = Join-Path $agyDir "resources"
$targetAsar = Join-Path $resourcesDir "app.asar"
$targetWebBundle = Join-Path $resourcesDir "web-bundle"

# Pasta padronizada de backup dentro do diretorio do programa
$backupDir = Join-Path $agyDir "_backups"

# 3. Localizar arquivos desta pasta
$scriptDir = $PSScriptRoot
if (-not $scriptDir) { $scriptDir = (Get-Location).Path }

$sourceWebBundle = Join-Path $scriptDir "web-bundle"

if (-not (Test-Path $sourceWebBundle)) {
    Write-Host "[x] Erro: Pasta 'web-bundle' não encontrada nesta pasta!" -ForegroundColor Red
    Pause
    Exit 1
}

# 4. Preservar os arquivos originais da instalação dentro da pasta do programa.
Write-Host ""; Write-Host "[2/4] Verificando backups imutáveis desta versão..." -ForegroundColor White
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
if (-not $detectedVersion) { Write-Host "[x] Não foi possível detectar a versão. Backup interrompido." -ForegroundColor Red; Pause; Exit 1 }
$versionBackupDir = Join-Path $backupDir $detectedVersion
New-Item -ItemType Directory -Path $versionBackupDir -Force | Out-Null
$versionBackupAsar = Join-Path $versionBackupDir "app.asar"
$backupExe = Join-Path $versionBackupDir "Antigravity.exe"
$backupWebBundle = Join-Path $versionBackupDir "web-bundle-original"
$webBundleWasAbsent = Join-Path $versionBackupDir "web-bundle-was-absent.txt"
 $installedWebBundleMarker = Join-Path $targetWebBundle ".agy-ptbr-installed"
if ((Test-Path $installedWebBundleMarker) -and -not (Test-Path $backupWebBundle) -and -not (Test-Path $webBundleWasAbsent)) {
    Write-Host "[x] A pasta web-bundle já está traduzida, mas não existe uma cópia original salva para a versão $detectedVersion." -ForegroundColor Red
    Write-Host "    Instalação interrompida; não vou salvar os arquivos traduzidos como backup original." -ForegroundColor Yellow
    Write-Host "    Repare/instale o Antigravity oficial por cima e tente novamente. Mantenha as pastas de dados do usuário." -ForegroundColor Cyan
    Pause
    Exit 1
}
if ((Test-Path $backupWebBundle) -and (Test-Path (Join-Path $backupWebBundle ".agy-ptbr-installed"))) {
    Write-Host "[x] O backup web-bundle desta versão contém a marca de tradução; não será usado como original." -ForegroundColor Red
    Write-Host "    Repare/instale o Antigravity oficial por cima e tente novamente; mantenha as pastas de dados do usuário." -ForegroundColor Cyan
    Pause
    Exit 1
}
if ((Test-Path $exePath) -and -not (Test-Path $backupExe)) { Copy-Item -LiteralPath $exePath -Destination $backupExe }
if (-not (Test-Path $backupWebBundle) -and -not (Test-Path $webBundleWasAbsent)) {
    if ((Test-Path $targetWebBundle) -and -not (Test-Path (Join-Path $targetWebBundle ".agy-ptbr-installed"))) {
        Copy-Item -LiteralPath $targetWebBundle -Destination $backupWebBundle -Recurse
    } elseif (-not (Test-Path $targetWebBundle)) {
        [IO.File]::WriteAllText($webBundleWasAbsent,"web-bundle ausente antes da tradução",$utf8NoBom)
    }
}
if (Test-Path $exePath) { Disable-AsarIntegrityFuse -ExePath $exePath }
# 5. Aplicar patch modular dinâmico
Write-Host ""
Write-Host "[3/4] Instalando pacote principal traduzido..." -ForegroundColor White
$patcherScript = Join-Path $scriptDir "patch-antigravity.cjs"
$patchedDynamically = $false
$translationAlreadyInstalled = $false

$nodeCmd = Get-Command "node" -ErrorAction SilentlyContinue
if ($nodeCmd -and (Test-Path $patcherScript)) {
    Write-Host "    -> Executando Patcher Dinâmico Modular (preserva versão instalada sem downgrade)..." -ForegroundColor Cyan
    try {
        & $nodeCmd.Source $patcherScript "$agyDir"
        if ($LASTEXITCODE -eq 10) {
            $patchedDynamically = $true
            $translationAlreadyInstalled = $true
            Write-Host "    [i] Antigravity já está em Português (Brasil). Nenhuma tradução necessária." -ForegroundColor Cyan
        } elseif ($LASTEXITCODE -eq 0) {
            $patchedDynamically = $true
            Write-Host "    [OK] Patch dinâmico aplicado com sucesso na versão instalada!" -ForegroundColor Green
        }
    } catch {
        Write-Host "    [!] Falha no patch dinâmico da versão instalada: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

if (-not $patchedDynamically) {
    if ($LASTEXITCODE -eq 11) {
        Write-Host "[x] Antigravity está modificado, mas não há backup original limpo desta versão." -ForegroundColor Red
        Write-Host "    Repare/instale o Antigravity oficial por cima e tente novamente; mantenha as pastas de dados do usuário." -ForegroundColor Cyan
        Pause
        Exit 1
    }
    Write-Host "[x] Patch seguro da versão atual indisponível. O ASAR estático não será usado para evitar downgrade." -ForegroundColor Red
    Pause
    Exit 1
}
# 6.1 Limpar cache de bytecode (V8 Code Cache) para carregar a interface traduzida imediatamente
if (-not $translationAlreadyInstalled) {
    $roamingAgy = Join-Path $env:APPDATA "Antigravity"
    $cachesToClean = @("Cache", "Code Cache", "GPUCache", "DawnGraphiteCache", "DawnWebGPUCache")
    foreach ($cName in $cachesToClean) {
        $cPath = Join-Path $roamingAgy $cName
        if (Test-Path $cPath) {
            Remove-Item -Path $cPath -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    Write-Host "    [OK] Cache de interface renovado para carregar a tradução sem resíduos anteriores." -ForegroundColor Green
}

# Conclusao
Write-Host ""
if ($translationAlreadyInstalled) {
    Write-Host " ==================================================================== " -ForegroundColor Cyan
    Write-Host "      PACOTE DE IDIOMA PT-BR JÁ INSTALADO NO ANTIGRAVITY              " -ForegroundColor Cyan
    Write-Host " ==================================================================== " -ForegroundColor Cyan
} else {
    Write-Host " ==================================================================== " -ForegroundColor Green
    Write-Host "         TRADUÇÃO ANTIGRAVITY INSTALADA COM SUCESSO!                  " -ForegroundColor Green
    Write-Host " ==================================================================== " -ForegroundColor Green
}
Write-Host ""
if ($translationAlreadyInstalled) {
    Write-Host "  Não é necessário traduzir novamente; o idioma Português (Brasil) já está aplicado." -ForegroundColor Cyan
} else {
    Write-Host "  A tradução PT-BR foi aplicada à versão instalada." -ForegroundColor White
}
if ($detectedVersion) {
    Write-Host "  Versão ativa: $detectedVersion (sincronizada de forma automatizada)" -ForegroundColor Green
}
Write-Host "  Seu backup original de fábrica está seguro em:" -ForegroundColor Gray
Write-Host "  $backupDir" -ForegroundColor Yellow
Write-Host ""

$exePath = Join-Path $agyDir "Antigravity.exe"
if (Test-Path $exePath) {
    if (Read-OpenChoice "Deseja iniciar o Antigravity? [S = abrir | N/Enter/Esc = fechar]: ") {
        Write-Host "Iniciando Antigravity de forma independente..." -ForegroundColor Cyan
        Start-Process -FilePath "explorer.exe" -ArgumentList "`"$exePath`""
        Start-Sleep -Milliseconds 400
        Exit 0
    } else {
        Write-Host "Instalação concluída. Finalizando..." -ForegroundColor Gray
        Start-Sleep -Milliseconds 300
        Exit 0
    }
}
Exit 0
