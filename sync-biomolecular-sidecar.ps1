param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('Preflight', 'Install', 'Restore')]
    [string]$Mode,
    [Parameter(Mandatory = $true)]
    [string]$AntigravityInstallDir,
    [Parameter(Mandatory = $true)]
    [string]$PackageRoot
)

$ErrorActionPreference = 'Stop'
# Alguns hosts PowerShell iniciam sem importar Microsoft.PowerShell.Utility.
# O sincronizador só precisa do SHA-256; mantenha o pré-teste funcional nesses hosts.
if (-not (Get-Command Get-FileHash -ErrorAction SilentlyContinue)) {
    function Get-FileHash {
        param(
            [Parameter(Mandatory = $true)][string]$LiteralPath,
            [string]$Algorithm = 'SHA256'
        )
        if ($Algorithm -ne 'SHA256') { throw "Algoritmo de hash não suportado: $Algorithm" }
        $sha = [System.Security.Cryptography.SHA256]::Create()
        try {
            $stream = [System.IO.File]::OpenRead($LiteralPath)
            try { $hash = $sha.ComputeHash($stream) } finally { $stream.Dispose() }
            [pscustomobject]@{ Algorithm = 'SHA256'; Hash = ([BitConverter]::ToString($hash) -replace '-', ''); Path = $LiteralPath }
        } finally { $sha.Dispose() }
    }
}
$supportedVersion = '1.3.0'
# Science 1.3.1 contém os mesmos dois arquivos do visualizador, confirmados por SHA-256.
# O pacote é compartilhado, mas os backups continuam separados pela versão do plugin.
$supportedPluginVersions = @('1.3.0', '1.3.1')
$marketplacesRoot = Join-Path $env:USERPROFILE '.gemini\antigravity\cache\marketplaces'
$configScienceRoot = Join-Path $env:USERPROFILE '.gemini\config\plugins\science'
$packageVersionRoot = Join-Path $PackageRoot $supportedVersion
$originalRoot = Join-Path $packageVersionRoot 'original'
$translatedRoot = Join-Path $packageVersionRoot 'translated'
$files = @('ui.html', 'dist\main.js')
$legacyTranslatedHashes = @{
    'ui.html' = '4A9F7D80A2E6BBB98C477B33E55D72183B7474A892138DA024E8362A7BDF8226'
    'dist\main.js' = 'DB9F87483BC28D84296DAB2D944ED4B9ADE5BA889512302376FCC38111FCEBD9'
}

foreach ($relativeFile in $files) {
    if (-not (Test-Path -LiteralPath (Join-Path $originalRoot $relativeFile) -PathType Leaf) -or
        -not (Test-Path -LiteralPath (Join-Path $translatedRoot $relativeFile) -PathType Leaf)) {
        throw "Pacote do Visualizador Biomolecular incompleto: $relativeFile"
    }
}

$targets = @()
if (Test-Path -LiteralPath $marketplacesRoot -PathType Container) {
    foreach ($marketplace in Get-ChildItem -LiteralPath $marketplacesRoot -Directory -ErrorAction SilentlyContinue) {
        $scienceRoot = Join-Path $marketplace.FullName 'plugins\science'
        if (-not (Test-Path -LiteralPath $scienceRoot -PathType Container)) { continue }
        foreach ($pluginVersion in Get-ChildItem -LiteralPath $scienceRoot -Directory -ErrorAction SilentlyContinue) {
            $sidecarRoot = Join-Path $pluginVersion.FullName 'sidecars\biomolecular_structure_viewer'
            if (Test-Path -LiteralPath (Join-Path $sidecarRoot 'sidecar.json') -PathType Leaf) {
                $targets += [pscustomobject]@{
                    Label = "cache $($marketplace.Name)"
                    BackupKey = $marketplace.Name
                    Version = $pluginVersion.Name
                    Root = $sidecarRoot
                }
            }
        }
    }
}

$configPluginManifest = Join-Path $configScienceRoot 'plugin.json'
$configSidecarRoot = Join-Path $configScienceRoot 'sidecars\biomolecular_structure_viewer'
if (Test-Path -LiteralPath (Join-Path $configSidecarRoot 'sidecar.json') -PathType Leaf) {
    if (-not (Test-Path -LiteralPath $configPluginManifest -PathType Leaf)) {
        throw "O plugin Science ativo não tem plugin.json para validar sua versão: $configPluginManifest"
    }
    try {
        $configPlugin = Get-Content -LiteralPath $configPluginManifest -Raw | ConvertFrom-Json -ErrorAction Stop
    } catch {
        throw "Não foi possível ler a versão do plugin Science ativo: $configPluginManifest"
    }
    if ($configPlugin.name -ne 'science' -or [string]::IsNullOrWhiteSpace([string]$configPlugin.version)) {
        throw "O manifesto do plugin Science ativo não informa um nome e uma versão válidos: $configPluginManifest"
    }
    $targets += [pscustomobject]@{
        Label = 'plugin Science ativo'
        BackupKey = 'gemini-config'
        Version = [string]$configPlugin.version
        Root = $configSidecarRoot
    }
}

if ($targets.Count -eq 0) {
    Write-Host '[i] O Visualizador de Estruturas Biomoleculares não foi encontrado nos plugins ativos nem no cache; nenhuma alteração necessária.' -ForegroundColor DarkGray
    return $false
}

$unsupported = @($targets | Where-Object { $_.Version -notin $supportedPluginVersions })
if ($unsupported.Count -gt 0) {
    foreach ($target in $unsupported) {
        Write-Host "[i] Visualizador biomolecular $($target.Label) $($target.Version) não corresponde às versões suportadas; ignorado com segurança." -ForegroundColor Yellow
    }
}
$targets = @($targets | Where-Object { $_.Version -in $supportedPluginVersions })
if ($targets.Count -eq 0) { return $false }

function Get-TrustedRecoveryPath($target, [string]$relativeFile) {
    $recoveryPath = Join-Path $target.Root (Join-Path 'ptbr-original' $relativeFile)
    if (-not (Test-Path -LiteralPath $recoveryPath -PathType Leaf) -and $relativeFile -eq 'dist\main.js') {
        $recoveryPath = Join-Path $target.Root 'ptbr-original\main.js'
    }
    return $recoveryPath
}

function Test-TrustedRecoveryCopy($target) {
    foreach ($relativeFile in $files) {
        $recoveryPath = Get-TrustedRecoveryPath $target $relativeFile
        $packageOriginal = Join-Path $originalRoot $relativeFile
        if (-not (Test-Path -LiteralPath $recoveryPath -PathType Leaf) -or
            (Get-FileHash -LiteralPath $recoveryPath -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath $packageOriginal -Algorithm SHA256).Hash) {
            return $false
        }
    }
    return $true
}

if ($Mode -eq 'Preflight') {
    foreach ($target in $targets) {
        $backupRoot = Join-Path $AntigravityInstallDir (Join-Path '_backups\biomolecular-sidecar' (Join-Path $target.BackupKey $target.Version))
        $backupPresent = @($files | Where-Object { Test-Path -LiteralPath (Join-Path $backupRoot $_) -PathType Leaf }).Count
        if ($Mode -eq 'Preflight' -and $backupPresent -gt 0 -and $backupPresent -ne $files.Count) {
            throw "O backup do sidecar está incompleto; pré-teste interrompido sem alterações: $backupRoot"
        }
        foreach ($relativeFile in $files) {
            $livePath = Join-Path $target.Root $relativeFile
            if (-not (Test-Path -LiteralPath $livePath -PathType Leaf)) {
                throw "Arquivo esperado não encontrado no visualizador biomolecular: $($target.Root)\$relativeFile"
            }
            $currentHash = (Get-FileHash -LiteralPath $livePath -Algorithm SHA256).Hash
            $translatedHash = (Get-FileHash -LiteralPath (Join-Path $translatedRoot $relativeFile) -Algorithm SHA256).Hash
            $originalSource = if ($backupPresent -eq $files.Count) { Join-Path $backupRoot $relativeFile } else { Join-Path $originalRoot $relativeFile }
            $originalHash = (Get-FileHash -LiteralPath $originalSource -Algorithm SHA256).Hash
            if ($currentHash -ne $translatedHash -and $currentHash -ne $originalHash) {
                $recoveryPath = Get-TrustedRecoveryPath $target $relativeFile
                $packageOriginalHash = (Get-FileHash -LiteralPath (Join-Path $originalRoot $relativeFile) -Algorithm SHA256).Hash
                if (-not (Test-TrustedRecoveryCopy $target) -or
                    (Get-FileHash -LiteralPath $recoveryPath -Algorithm SHA256).Hash -ne $packageOriginalHash) {
                    throw "O sidecar biomolecular foi alterado ou atualizado; pré-teste interrompido para evitar sobrescrever arquivos diferentes: $livePath"
                }
            }
        }
    }
    Write-Host "[OK] Pacote biomolecular 1.3.0/1.3.1 compatível com $($targets.Count) instalação(ões) encontrada(s)." -ForegroundColor Green
    return $true
}

$changed = $false
foreach ($target in $targets) {
    $backupRoot = Join-Path $AntigravityInstallDir (Join-Path '_backups\biomolecular-sidecar' (Join-Path $target.BackupKey $target.Version))

    if ($Mode -eq 'Install') {
        $backupComplete = @($files | Where-Object { Test-Path -LiteralPath (Join-Path $backupRoot $_) -PathType Leaf }).Count -eq $files.Count
        $backupAny = @($files | Where-Object { Test-Path -LiteralPath (Join-Path $backupRoot $_) -PathType Leaf }).Count -gt 0
        if ($backupAny -and -not $backupComplete) {
            throw "O backup do sidecar está incompleto; nenhum arquivo foi alterado: $backupRoot"
        }
        $needsNormalization = $false
        if (-not $backupComplete) {
            $targetAlreadyTranslated = $true
            foreach ($relativeFile in $files) {
                $livePath = Join-Path $target.Root $relativeFile
                $translatedPath = Join-Path $translatedRoot $relativeFile
                if (-not (Test-Path -LiteralPath $livePath -PathType Leaf) -or
                    (Get-FileHash -LiteralPath $livePath -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath $translatedPath -Algorithm SHA256).Hash) {
                    $targetAlreadyTranslated = $false
                    break
                }
            }
            if (-not $targetAlreadyTranslated) {
                foreach ($relativeFile in $files) {
                    $livePath = Join-Path $target.Root $relativeFile
                    $originalPath = Join-Path $originalRoot $relativeFile
                    if ((Get-FileHash -LiteralPath $livePath -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath $originalPath -Algorithm SHA256).Hash) {
                        $recoveryPath = Get-TrustedRecoveryPath $target $relativeFile
                        $originalHash = (Get-FileHash -LiteralPath $originalPath -Algorithm SHA256).Hash
                        if (-not (Test-TrustedRecoveryCopy $target) -or
                            (Get-FileHash -LiteralPath $recoveryPath -Algorithm SHA256).Hash -ne $originalHash) {
                            throw "O sidecar biomolecular foi atualizado ou alterado; não vou criar um backup potencialmente incorreto: $livePath"
                        }
                        $needsNormalization = $true
                    }
                }
            }
            New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null
            foreach ($relativeFile in $files) {
                $destination = Join-Path $backupRoot $relativeFile
                New-Item -ItemType Directory -Path (Split-Path -Parent $destination) -Force | Out-Null
                $backupSource = if ($targetAlreadyTranslated) { Join-Path $originalRoot $relativeFile } elseif ($needsNormalization) { Get-TrustedRecoveryPath $target $relativeFile } else { Join-Path $target.Root $relativeFile }
                Copy-Item -LiteralPath $backupSource -Destination $destination
            }
            $backupComplete = $true
        }

        if ($needsNormalization) {
            foreach ($relativeFile in $files) {
                Copy-Item -LiteralPath (Join-Path $backupRoot $relativeFile) -Destination (Join-Path $target.Root $relativeFile) -Force
            }
        }

        if ($backupComplete) {
            $translationManifestPath = Join-Path $backupRoot 'translated-sha256.json'
            $previousTranslatedHashes = @{}
            if (Test-Path -LiteralPath $translationManifestPath -PathType Leaf) {
                try {
                    $manifestData = Get-Content -LiteralPath $translationManifestPath -Raw | ConvertFrom-Json -ErrorAction Stop
                    foreach ($property in $manifestData.PSObject.Properties) {
                        $previousTranslatedHashes[$property.Name] = [string]$property.Value
                    }
                } catch {
                    throw "Manifesto de hashes do sidecar inválido; nenhum arquivo foi alterado: $translationManifestPath"
                }
            } else {
                $previousTranslatedHashes = $legacyTranslatedHashes
            }
            $stateIsOriginalOrTranslated = $true
            foreach ($relativeFile in $files) {
                $livePath = Join-Path $target.Root $relativeFile
                $currentHash = (Get-FileHash -LiteralPath $livePath -Algorithm SHA256).Hash
                $originalHash = (Get-FileHash -LiteralPath (Join-Path $backupRoot $relativeFile) -Algorithm SHA256).Hash
                $translatedHash = (Get-FileHash -LiteralPath (Join-Path $translatedRoot $relativeFile) -Algorithm SHA256).Hash
                $previousTranslatedHash = $previousTranslatedHashes[$relativeFile]
                if ($currentHash -ne $originalHash -and $currentHash -ne $translatedHash -and $currentHash -ne $previousTranslatedHash) {
                    $stateIsOriginalOrTranslated = $false
                    break
                }
            }
            if (-not $stateIsOriginalOrTranslated) {
                throw "O sidecar biomolecular mudou após o backup; preservado sem sobrescrever: $($target.Root)"
            }
        }

        try {
            foreach ($relativeFile in $files) {
                $source = Join-Path $translatedRoot $relativeFile
                $destination = Join-Path $target.Root $relativeFile
                Copy-Item -LiteralPath $source -Destination $destination -Force -ErrorAction Stop
            }
            $currentTranslatedHashes = @{}
            foreach ($relativeFile in $files) {
                $currentTranslatedHashes[$relativeFile] = (Get-FileHash -LiteralPath (Join-Path $translatedRoot $relativeFile) -Algorithm SHA256).Hash
            }
            $manifestJson = ConvertTo-Json -InputObject $currentTranslatedHashes -Depth 4
            [IO.File]::WriteAllText($translationManifestPath, $manifestJson, (New-Object System.Text.UTF8Encoding($false)))
        } catch {
            if ($backupComplete) {
                foreach ($relativeFile in $files) {
                    Copy-Item -LiteralPath (Join-Path $backupRoot $relativeFile) -Destination (Join-Path $target.Root $relativeFile) -Force -ErrorAction SilentlyContinue
                }
            }
            throw
        }
        $changed = $true
        Write-Host "[OK] Visualizador biomolecular traduzido ($($target.Label), $($target.Version)). Backup original: $backupRoot" -ForegroundColor Green
        continue
    }

    if ($Mode -eq 'Restore') {
        $backupComplete = @($files | Where-Object { Test-Path -LiteralPath (Join-Path $backupRoot $_) -PathType Leaf }).Count -eq $files.Count
        if (-not $backupComplete) {
            Write-Host "[i] Backup original do sidecar $($target.Label) não encontrado; nenhum arquivo alterado." -ForegroundColor DarkGray
            continue
        }
        $liveIsOurs = $true
        foreach ($relativeFile in $files) {
            $livePath = Join-Path $target.Root $relativeFile
            if (-not (Test-Path -LiteralPath $livePath -PathType Leaf)) { $liveIsOurs = $false; break }
            if ((Get-FileHash -LiteralPath $livePath -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath (Join-Path $translatedRoot $relativeFile) -Algorithm SHA256).Hash) {
                $liveIsOurs = $false
                break
            }
        }
        if (-not $liveIsOurs) {
            Write-Host "[!] O sidecar $($target.Label) mudou desde a tradução; preservado para evitar substituir arquivos da versão nova." -ForegroundColor Yellow
            continue
        }
        foreach ($relativeFile in $files) {
            Copy-Item -LiteralPath (Join-Path $backupRoot $relativeFile) -Destination (Join-Path $target.Root $relativeFile) -Force
        }
        $changed = $true
        Write-Host "[OK] Visualizador biomolecular restaurado ($($target.Label), $($target.Version))." -ForegroundColor Green
    }
}
return $changed
