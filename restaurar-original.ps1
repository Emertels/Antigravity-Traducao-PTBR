# ==============================================================================
#  Restaurador do Google Antigravity Original de Fabrica
#  Pacote de Tradução por: Emerson Teles
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
$Host.UI.RawUI.WindowTitle = "Restaurar Antigravity Original - Emerson Teles"

function Write-Header {
    Clear-Host
    Write-Host ""
    Write-Host " ==================================================================== " -ForegroundColor Yellow
    Write-Host "           RESTAURAR ANTIGRAVITY ORIGINAL DE FÁBRICA                  " -ForegroundColor White
    Write-Host "              Pacote de Tradução por: Emerson Teles                   " -ForegroundColor Cyan
    Write-Host " ==================================================================== " -ForegroundColor Yellow
    Write-Host ""
}

function Copy-FileWithProgress {
    param(
        [string]$Source,
        [string]$Destination,
        [string]$Label = "Restaurando"
    )

    if ((Test-Path -LiteralPath $Destination -PathType Leaf) -and
        (Get-FileHash -LiteralPath $Source -Algorithm SHA256).Hash -eq (Get-FileHash -LiteralPath $Destination -Algorithm SHA256).Hash) {
        Write-Host "    [i] $Label já está original; restauração desnecessária." -ForegroundColor Cyan
        return
    }
    $script:restoreChanged = $true

    $sourceFile = New-Object System.IO.FileInfo($Source)
    $totalBytes = $sourceFile.Length
    $totalMB = [math]::Round($totalBytes / 1MB, 1)

    $bufferSize = 2MB
    $buffer = New-Object byte[] $bufferSize

    $sourceStream = [System.IO.File]::OpenRead($Source)
    $destStream = [System.IO.File]::Create($Destination)

    $totalRead = 0
    $lastPercent = -1

    Write-Host "  $Label..." -ForegroundColor Cyan

    try {
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
    }
    finally {
        if ($sourceStream) { $sourceStream.Close() }
        if ($destStream) { $destStream.Close() }
    }
}

function Find-AntigravityInstallation {
    $candidates = @()

    $proc = Get-Process -Name "Antigravity" -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($proc -and $proc.Path) {
        $candidates += (Split-Path $proc.Path -Parent)
    }

    $candidates += (Join-Path $env:LOCALAPPDATA "Programs\antigravity")
    $candidates += (Join-Path $env:LOCALAPPDATA "Programs\Antigravity")
    $candidates += (Join-Path $env:ProgramFiles "antigravity")
    $candidates += (Join-Path $env:ProgramFiles "Antigravity")
    if (${env:ProgramFiles(x86)}) {
        $candidates += (Join-Path ${env:ProgramFiles(x86)} "antigravity")
        $candidates += (Join-Path ${env:ProgramFiles(x86)} "Antigravity")
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

Write-Header

# 1. Fechar processos do Antigravity
$running = Get-Process | Where-Object { $_.ProcessName -like "*antigravity*" -and $_.ProcessName -notlike "*language_server*" }
if ($running) {
    Write-Host "[-] Fechando processos da janela do Antigravity para restaurar arquivos..." -ForegroundColor Yellow
    $running | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
}

# 2. Localizar instalação
Write-Host "[1/3] Localizando instalação do Antigravity..." -ForegroundColor White
$agyDir = Find-AntigravityInstallation

if (-not $agyDir) {
    Write-Host "[!] Não foi possivel detectar a pasta do Antigravity automaticamente." -ForegroundColor Yellow
    $userInput = Read-Host "Digite o caminho da pasta onde o Antigravity esta instalado"
    if (Test-Path (Join-Path $userInput "resources\app.asar")) {
        $agyDir = $userInput
    } else {
        Write-Host "[x] Caminho invalido! Operacao abortada." -ForegroundColor Red
        Pause
        Exit 1
    }
}

Write-Host "    -> Antigravity localizado em: $agyDir" -ForegroundColor Green
$resourcesDir = Join-Path $agyDir "resources"
$targetAsar = Join-Path $resourcesDir "app.asar"
$targetWebBundle = Join-Path $resourcesDir "web-bundle"

$backupDir = Join-Path $agyDir "_backups"
$installedWebBundleMarker = Join-Path $targetWebBundle ".agy-ptbr-installed"

$detectedVersion = $null
$exePath = Join-Path $agyDir "Antigravity.exe"
if (Test-Path $exePath) {
    try {
        $detectedVersion = (Get-Item $exePath).VersionInfo.FileVersion
        if (-not $detectedVersion) { $detectedVersion = (Get-Item $exePath).VersionInfo.ProductVersion }
        if ($detectedVersion) { $v = $detectedVersion.Split('.'); if ($v.Length -ge 3) { $detectedVersion = $v[0..2] -join '.' } }
    } catch { }
}

# 3. Restaurar backup da pasta _backups
Write-Host ""
if ($detectedVersion) {
    Write-Host "[2/3] Restaurando backup original da versão $detectedVersion..." -ForegroundColor White
} else {
    Write-Host "[2/3] Restaurando backup original..." -ForegroundColor White
}

$versionBackupDir = Join-Path $backupDir $detectedVersion
$foundBackup = Join-Path $versionBackupDir "app.asar"
if (-not $detectedVersion -or -not (Test-Path $foundBackup)) {
    # Uma instalação recém-reparada/reinstalada pode já estar original sem ter
    # criado _backups ainda. Só classificar como original após validar o ASAR
    # da versão ativa e confirmar ausência de marcadores conhecidos no bundle.
    $verifier = Join-Path $PSScriptRoot "tools\verify-clean-asar.cjs"
    $node = Get-Command node -ErrorAction SilentlyContinue
    $installedAsarClean = $false
    if ($detectedVersion -and $node -and (Test-Path $verifier) -and (Test-Path $targetAsar)) {
        $verifyOutput = & $node.Source $verifier "antigravity" $targetAsar $detectedVersion 2>&1
        $installedAsarClean = ($LASTEXITCODE -eq 0)
    }
    $webBundleTranslated = Test-Path $installedWebBundleMarker
    if (-not $webBundleTranslated -and (Test-Path $targetWebBundle -PathType Container)) {
        $translationMarkers = @("Emerson Teles", "Tradução PT-BR: Emerson Teles", "Nenhum agente em execução", "Configurando o WSL:")
        foreach ($bundleFile in Get-ChildItem -LiteralPath $targetWebBundle -Recurse -File -ErrorAction SilentlyContinue) {
            if ($bundleFile.Length -gt 0 -and $bundleFile.Length -lt 50MB) {
                $bundleText = [IO.File]::ReadAllText($bundleFile.FullName)
                foreach ($marker in $translationMarkers) {
                    if ($bundleText.Contains($marker)) { $webBundleTranslated = $true; break }
                }
            }
            if ($webBundleTranslated) { break }
        }
    }
    if ($installedAsarClean -and -not $webBundleTranslated) {
        Write-Host "[i] Antigravity já está original. Nenhuma restauração necessária." -ForegroundColor Cyan
        if (Test-Path $exePath) {
            if (Read-OpenChoice "Deseja iniciar o Antigravity original? [S = abrir | N/Enter/Esc = fechar]: ") {
                Start-Process -FilePath "explorer.exe" -ArgumentList "`"$exePath`""
            }
        }
        Exit 0
    }
    Write-Host "[x] Não há backup da versão exata instalada em $backupDir." -ForegroundColor Red
    Write-Host "    Nenhum arquivo foi alterado. Repare/instale o Antigravity oficial por cima e tente novamente." -ForegroundColor Cyan
    Write-Host "    Mantenha as pastas de dados do usuário; projetos e configurações ficam fora da pasta do programa." -ForegroundColor Cyan
    Pause
    Exit 1
}
$verifier = Join-Path $PSScriptRoot "tools\verify-clean-asar.cjs"
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node -or -not (Test-Path $verifier)) {
    Write-Host "[x] Não foi possível verificar o backup. Confirme o Node.js e os arquivos do pacote." -ForegroundColor Red
    Pause
    Exit 1
}
& $node.Source $verifier "antigravity" $foundBackup $detectedVersion
if ($LASTEXITCODE -ne 0) {
    Write-Host "[x] O ASAR de backup não passou na verificação; restauração cancelada." -ForegroundColor Red
    Pause
    Exit 1
}
$backupWebBundle = Join-Path $versionBackupDir "web-bundle-original"
$webBundleWasAbsent = Join-Path $versionBackupDir "web-bundle-was-absent.txt"
if ((Test-Path $backupWebBundle) -and (Test-Path (Join-Path $backupWebBundle ".agy-ptbr-installed"))) {
    Write-Host "[x] O web-bundle salvo contém a marca de tradução e não será restaurado como original." -ForegroundColor Red
    Pause
    Exit 1
}
if ((Test-Path $installedWebBundleMarker) -and -not (Test-Path $backupWebBundle) -and -not (Test-Path $webBundleWasAbsent)) {
    Write-Host "[x] O web-bundle instalado está traduzido, mas não existe backup original desta versão." -ForegroundColor Red
    Write-Host "    Restauração interrompida sem alterar o app.asar." -ForegroundColor Yellow
    Write-Host "    Repare/instale o Antigravity oficial por cima e tente novamente. Mantenha os dados do usuário." -ForegroundColor Cyan
    Pause
    Exit 1
}
$restoreChanged = $false
Write-Host "    -> Restaurando backup exato: $foundBackup" -ForegroundColor Cyan
Copy-FileWithProgress -Source $foundBackup -Destination $targetAsar -Label "Restaurando app.asar original"
$backupExe = Join-Path $versionBackupDir "Antigravity.exe"
if (Test-Path $backupExe) { Copy-FileWithProgress -Source $backupExe -Destination $exePath -Label "Restaurando executável original" }
if (Test-Path $backupWebBundle) {
    $webBundleEqual = $false
    if (Test-Path $targetWebBundle -PathType Container) {
        $savedFiles = @(Get-ChildItem -LiteralPath $backupWebBundle -File -Recurse | Sort-Object FullName)
        $liveFiles = @(Get-ChildItem -LiteralPath $targetWebBundle -File -Recurse | Sort-Object FullName)
        if ($savedFiles.Count -eq $liveFiles.Count) {
            $webBundleEqual = $true
            for ($i = 0; $i -lt $savedFiles.Count; $i++) {
                $savedRelative = $savedFiles[$i].FullName.Substring($backupWebBundle.Length).TrimStart('\')
                $liveRelative = $liveFiles[$i].FullName.Substring($targetWebBundle.Length).TrimStart('\')
                if ($savedRelative -ine $liveRelative -or (Get-FileHash -LiteralPath $savedFiles[$i].FullName -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath $liveFiles[$i].FullName -Algorithm SHA256).Hash) { $webBundleEqual = $false; break }
            }
        }
    }
    if ($webBundleEqual) {
        Write-Host "    [i] web-bundle já está original; restauração desnecessária." -ForegroundColor Cyan
    } else {
        if (Test-Path $targetWebBundle) { Remove-Item -LiteralPath $targetWebBundle -Recurse -Force }
        Copy-Item -LiteralPath $backupWebBundle -Destination $targetWebBundle -Recurse
        $restoreChanged = $true
        Write-Host "    -> web-bundle original restaurado." -ForegroundColor Green
    }
} elseif ((Test-Path $webBundleWasAbsent) -and (Test-Path (Join-Path $targetWebBundle ".agy-ptbr-installed"))) {
    Remove-Item -LiteralPath $targetWebBundle -Recurse -Force
    $restoreChanged = $true
    Write-Host "    -> web-bundle criado pela tradução removido." -ForegroundColor Green
}
# 4.1 Limpar cache de bytecode para restaurar a interface original sem resíduos
$roamingAgy = Join-Path $env:APPDATA "Antigravity"
$cachesToClean = @("Cache", "Code Cache", "GPUCache", "DawnGraphiteCache", "DawnWebGPUCache")
foreach ($cName in $cachesToClean) {
    $cPath = Join-Path $roamingAgy $cName
    if (Test-Path $cPath) {
        Remove-Item -Path $cPath -Recurse -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "    [OK] Cache de interface renovado para carregar o original." -ForegroundColor Green

Write-Host ""
if ($restoreChanged) {
    Write-Host " ==================================================================== " -ForegroundColor Green
    Write-Host "       ANTIGRAVITY ORIGINAL RESTAURADO COM SUCESSO!                   " -ForegroundColor Green
    Write-Host " ==================================================================== " -ForegroundColor Green
    Write-Host "  Restauração concluída com sucesso." -ForegroundColor Green
} else {
    Write-Host " ==================================================================== " -ForegroundColor Cyan
    Write-Host "  O ANTIGRAVITY JÁ ESTÁ ORIGINAL; RESTAURAÇÃO NÃO NECESSÁRIA          " -ForegroundColor Cyan
    Write-Host " ==================================================================== " -ForegroundColor Cyan
    Write-Host "  O pacote original já está instalado; não é necessário restaurar." -ForegroundColor Cyan
}
Write-Host ""

$exePath = Join-Path $agyDir "Antigravity.exe"
if (Test-Path $exePath) {
    if (Read-OpenChoice "Deseja iniciar o Antigravity original? [S = abrir | N/Enter/Esc = fechar]: ") {
        Write-Host "Iniciando Antigravity de forma independente..." -ForegroundColor Cyan
        Start-Process -FilePath "explorer.exe" -ArgumentList "`"$exePath`""
        Start-Sleep -Milliseconds 400
        Exit 0
    } else {
        Write-Host "Restauração concluída. Finalizando..." -ForegroundColor Gray
        Start-Sleep -Milliseconds 300
        Exit 0
    }
}
Exit 0
