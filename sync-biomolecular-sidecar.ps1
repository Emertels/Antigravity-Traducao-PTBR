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
# Suporte a versoes de plugins que contem o visualizador (science 1.3.x e structural-biology 1.0.x)
$supportedPluginVersions = @('1.0.0', '1.3.0', '1.3.1')
$marketplacesRoot = Join-Path $env:USERPROFILE '.gemini\antigravity\cache\marketplaces'
$pluginNames = @('science', 'structural-biology')
$files = @('ui.html', 'dist\main.js', 'sidecar.json')

function Get-SidecarPackageVersion([string]$pluginVer) {
    if ($pluginVer -eq '1.0.0') { return '1.0.0' }
    return '1.3.0'
}

# Validar integridade dos pacotes disponiveis (1.0.0 e 1.3.0)
foreach ($ver in @('1.0.0', '1.3.0')) {
    $verRoot = Join-Path $PackageRoot $ver
    if (Test-Path -LiteralPath $verRoot -PathType Container) {
        foreach ($relativeFile in $files) {
            if (-not (Test-Path -LiteralPath (Join-Path (Join-Path $verRoot 'original') $relativeFile) -PathType Leaf) -or
                -not (Test-Path -LiteralPath (Join-Path (Join-Path $verRoot 'translated') $relativeFile) -PathType Leaf)) {
                throw "Pacote do Visualizador Biomolecular $ver incompleto: $relativeFile"
            }
        }
    }
}

$targets = @()
if (Test-Path -LiteralPath $marketplacesRoot -PathType Container) {
    foreach ($marketplace in Get-ChildItem -LiteralPath $marketplacesRoot -Directory -ErrorAction SilentlyContinue) {
        foreach ($pName in $pluginNames) {
            $pRoot = Join-Path $marketplace.FullName "plugins\$pName"
            if (-not (Test-Path -LiteralPath $pRoot -PathType Container)) { continue }
            foreach ($pluginVersion in Get-ChildItem -LiteralPath $pRoot -Directory -ErrorAction SilentlyContinue) {
                $sidecarRoot = Join-Path $pluginVersion.FullName 'sidecars\biomolecular_structure_viewer'
                if (Test-Path -LiteralPath (Join-Path $sidecarRoot 'sidecar.json') -PathType Leaf) {
                    $targets += [pscustomobject]@{
                        Label = "cache $($marketplace.Name) ($pName)"
                        BackupKey = "$($marketplace.Name)-$pName"
                        Version = $pluginVersion.Name
                        Root = $sidecarRoot
                        PluginName = $pName
                    }
                }
            }
        }
    }
}

foreach ($pName in $pluginNames) {
    $configPluginRoot = Join-Path $env:USERPROFILE ".gemini\config\plugins\$pName"
    $configPluginManifest = Join-Path $configPluginRoot 'plugin.json'
    $configSidecarRoot = Join-Path $configPluginRoot 'sidecars\biomolecular_structure_viewer'
    if (Test-Path -LiteralPath (Join-Path $configSidecarRoot 'sidecar.json') -PathType Leaf) {
        if (Test-Path -LiteralPath $configPluginManifest -PathType Leaf) {
            try {
                $configPlugin = Get-Content -LiteralPath $configPluginManifest -Raw | ConvertFrom-Json -ErrorAction Stop
                if ($configPlugin.name -eq $pName -and -not [string]::IsNullOrWhiteSpace([string]$configPlugin.version)) {
                    $targets += [pscustomobject]@{
                        Label = "plugin $pName ativo"
                        BackupKey = "gemini-config-$pName"
                        Version = [string]$configPlugin.version
                        Root = $configSidecarRoot
                        PluginName = $pName
                    }
                }
            } catch {}
        }
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

function Get-TargetOriginalRoot($target) {
    $pkgVer = Get-SidecarPackageVersion $target.Version
    return Join-Path (Join-Path $PackageRoot $pkgVer) 'original'
}

function Get-TargetTranslatedRoot($target) {
    $pkgVer = Get-SidecarPackageVersion $target.Version
    return Join-Path (Join-Path $PackageRoot $pkgVer) 'translated'
}

function Test-TrustedRecoveryCopy($target) {
    foreach ($relativeFile in $files) {
        $recoveryPath = Get-TrustedRecoveryPath $target $relativeFile
        $origRoot = Get-TargetOriginalRoot $target
        $packageOriginal = Join-Path $origRoot $relativeFile
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
            $transRoot = Get-TargetTranslatedRoot $target
            $origRoot = Get-TargetOriginalRoot $target
            $translatedHash = (Get-FileHash -LiteralPath (Join-Path $transRoot $relativeFile) -Algorithm SHA256).Hash
            $originalSource = if ($backupPresent -eq $files.Count) { Join-Path $backupRoot $relativeFile } else { Join-Path $origRoot $relativeFile }
            $originalHash = (Get-FileHash -LiteralPath $originalSource -Algorithm SHA256).Hash
            if ($currentHash -ne $translatedHash -and $currentHash -ne $originalHash -and $backupPresent -ne $files.Count) {
                $recoveryPath = Get-TrustedRecoveryPath $target $relativeFile
                $packageOriginalHash = (Get-FileHash -LiteralPath (Join-Path $origRoot $relativeFile) -Algorithm SHA256).Hash
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
    $transRoot = Get-TargetTranslatedRoot $target
    $origRoot = Get-TargetOriginalRoot $target

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
                $transRoot = Get-TargetTranslatedRoot $target
                $origRoot = Get-TargetOriginalRoot $target
                $translatedPath = Join-Path $transRoot $relativeFile
                if (-not (Test-Path -LiteralPath $livePath -PathType Leaf) -or
                    (Get-FileHash -LiteralPath $livePath -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath $translatedPath -Algorithm SHA256).Hash) {
                    $targetAlreadyTranslated = $false
                    break
                }
            }
            if (-not $targetAlreadyTranslated) {
                foreach ($relativeFile in $files) {
                    $livePath = Join-Path $target.Root $relativeFile
                    $originalPath = Join-Path $origRoot $relativeFile
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
                $backupSource = if ($targetAlreadyTranslated) { Join-Path $origRoot $relativeFile } elseif ($needsNormalization) { Get-TrustedRecoveryPath $target $relativeFile } else { Join-Path $target.Root $relativeFile }
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
                $previousTranslatedHashes = @{}
            }
            $stateIsOriginalOrTranslated = $true
            foreach ($relativeFile in $files) {
                $livePath = Join-Path $target.Root $relativeFile
                $currentHash = (Get-FileHash -LiteralPath $livePath -Algorithm SHA256).Hash
                $originalHash = (Get-FileHash -LiteralPath (Join-Path $backupRoot $relativeFile) -Algorithm SHA256).Hash
                $translatedHash = (Get-FileHash -LiteralPath (Join-Path $transRoot $relativeFile) -Algorithm SHA256).Hash
                $previousTranslatedHash = if ($previousTranslatedHashes -and $previousTranslatedHashes.ContainsKey($relativeFile)) { $previousTranslatedHashes[$relativeFile] } else { $null }
                if ($currentHash -ne $originalHash -and $currentHash -ne $translatedHash -and ($null -ne $previousTranslatedHash -and $currentHash -ne $previousTranslatedHash)) {
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
                $source = Join-Path $transRoot $relativeFile
                $destination = Join-Path $target.Root $relativeFile
                Copy-Item -LiteralPath $source -Destination $destination -Force -ErrorAction Stop
            }
            $currentTranslatedHashes = @{}
            foreach ($relativeFile in $files) {
                $currentTranslatedHashes[$relativeFile] = (Get-FileHash -LiteralPath (Join-Path $transRoot $relativeFile) -Algorithm SHA256).Hash
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
            if (@($files | Where-Object { Test-Path -LiteralPath (Join-Path $origRoot $_) -PathType Leaf }).Count -eq $files.Count) {
                $backupRoot = $origRoot
                $backupComplete = $true
            } else {
                Write-Host "[i] Backup original do sidecar $($target.Label) não encontrado; nenhum arquivo alterado." -ForegroundColor DarkGray
                continue
            }
        }
        $liveIsOriginal = $true
        $liveIsOurs = $true
        foreach ($relativeFile in $files) {
            $livePath = Join-Path $target.Root $relativeFile
            if (-not (Test-Path -LiteralPath $livePath -PathType Leaf)) { $liveIsOurs = $false; $liveIsOriginal = $false; break }
            $transRoot = Get-TargetTranslatedRoot $target
            $liveHash = (Get-FileHash -LiteralPath $livePath -Algorithm SHA256).Hash
            $transHash = (Get-FileHash -LiteralPath (Join-Path $transRoot $relativeFile) -Algorithm SHA256).Hash
            $origHash = (Get-FileHash -LiteralPath (Join-Path $backupRoot $relativeFile) -Algorithm SHA256).Hash
            if ($liveHash -ne $transHash) { $liveIsOurs = $false }
            if ($liveHash -ne $origHash) { $liveIsOriginal = $false }
        }
        if ($liveIsOriginal) {
            Write-Host "    [i] Visualizador biomolecular ($($target.Label)) já está original de fábrica em inglês." -ForegroundColor Cyan
            continue
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
