function Find-ExecutableDirectoriesOnAllDrives {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)][string]$ExecutableName,
        [Parameter(Mandatory = $true)][string]$ProductLabel,
        [Parameter(Mandatory = $true)][string]$ValidationRelativePath
    )

    $results = New-Object 'System.Collections.Generic.List[string]'
    $seen = New-Object 'System.Collections.Generic.HashSet[string]' ([System.StringComparer]::OrdinalIgnoreCase)
    $originalTitle = $null
    try { $originalTitle = $Host.UI.RawUI.WindowTitle } catch { }
    $systemRoots = @('Windows', '$Recycle.Bin', 'System Volume Information', 'Recovery', 'Config.Msi', '$WinREAgent', 'PerfLogs')
    $drives = @()
    try {
        $drives = [System.IO.DriveInfo]::GetDrives() | Where-Object {
            $_.IsReady -and $_.DriveType.ToString() -in @('Fixed', 'Removable')
        }
    } catch { }

    foreach ($driveInfo in $drives) {
        $root = $driveInfo.RootDirectory.FullName
        Write-Host "    Busca profunda em $root (pastas do sistema serão ignoradas)..." -ForegroundColor DarkGray
        $pending = New-Object 'System.Collections.Generic.Stack[string]'
        $pending.Push($root)
        $visited = 0
        $lastProgress = [DateTime]::UtcNow

        while ($pending.Count -gt 0) {
            $directory = $pending.Pop()
            $visited++

            try {
                $executable = [System.IO.Path]::Combine($directory, $ExecutableName)
                $validationFile = [System.IO.Path]::Combine($directory, $ValidationRelativePath)
                if ([System.IO.File]::Exists($executable) -and [System.IO.File]::Exists($validationFile)) {
                    $normalized = [System.IO.Path]::GetFullPath($directory)
                    if ($seen.Add($normalized)) {
                        $results.Add($normalized)
                        Write-Host "    [OK] Candidato localizado: $normalized" -ForegroundColor DarkGray
                    }
                }
            } catch { }

            try {
                foreach ($child in [System.IO.Directory]::EnumerateDirectories($directory)) {
                    try {
                        $childName = [System.IO.Path]::GetFileName($child)
                        if ([string]::Equals($directory, $root, [System.StringComparison]::OrdinalIgnoreCase) -and $systemRoots -contains $childName) { continue }
                        $attributes = [System.IO.File]::GetAttributes($child)
                        if (($attributes -band [System.IO.FileAttributes]::ReparsePoint) -eq [System.IO.FileAttributes]::ReparsePoint) { continue }
                        $pending.Push($child)
                    } catch { }
                }
            } catch { }

            $now = [DateTime]::UtcNow
            if (($now - $lastProgress).TotalMilliseconds -ge 1500) {
                try { $Host.UI.RawUI.WindowTitle = "Busca $ProductLabel | $root | $visited pastas | $($results.Count) candidatas" } catch { }
                $lastProgress = $now
            }
        }
    }

    if ($originalTitle) { try { $Host.UI.RawUI.WindowTitle = $originalTitle } catch { } }

    return $results.ToArray()
}
