# git-autosync.ps1
# TechStack AI: Background Git Auto-sync tool
# Watches the project directory for changes and automatically pushes them to GitHub.

$folder = Get-Location
$filter = "*.*"

$fsw = New-Object IO.FileSystemWatcher $folder, $filter
$fsw.IncludeSubdirectories = $true
$fsw.EnableRaisingEvents = $true

# Debounce tracker
$lastRun = [DateTime]::MinValue

function Sync-To-GitHub($path) {
    # Exclude dependency, build, temp, git metadata, and environment keys
    if ($path -match '\\(node_modules|dist|\.git|\.env|git-autosync\.ps1)') {
        return
    }

    # Debounce checks: only run sync once every 5 seconds to group edits
    $now = Get-Date
    if (($now - $script:lastRun).TotalSeconds -lt 5) {
        return
    }
    $script:lastRun = $now

    Write-Host "----------------------------------------"
    Write-Host "Sync Triggered by change in: $path"
    Write-Host "Running Auto-sync..."
    
    try {
        & "C:\Program Files\Git\cmd\git.exe" add .
        
        $commitMessage = "Auto-sync update: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        & "C:\Program Files\Git\cmd\git.exe" commit -m $commitMessage
        
        Write-Host "Pushing changes to GitHub remote..."
        & "C:\Program Files\Git\cmd\git.exe" push origin main
        
        Write-Host "Auto-sync complete. GitHub repository updated."
    } catch {
        Write-Warning "Auto-sync failed: $_"
    }
    Write-Host "----------------------------------------"
}

# Bind file events
$createdEvent = Register-ObjectEvent $fsw Created -Action { Sync-To-GitHub $Event.SourceEventArgs.FullPath }
$changedEvent = Register-ObjectEvent $fsw Changed -Action { Sync-To-GitHub $Event.SourceEventArgs.FullPath }
$deletedEvent = Register-ObjectEvent $fsw Deleted -Action { Sync-To-GitHub $Event.SourceEventArgs.FullPath }

Write-Host "=================================================="
Write-Host "🚀 TechStack AI: GitHub Auto-Sync Watcher Active"
Write-Host "Watching: $folder"
Write-Host "Any code edits will automatically sync to GitHub."
Write-Host "To stop the watcher, run: Unregister-Event *"
Write-Host "=================================================="

# Loop to keep the watcher active
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    # Unregister events on exit
    Unregister-Event -SourceIdentifier $createdEvent.Name -ErrorAction SilentlyContinue
    Unregister-Event -SourceIdentifier $changedEvent.Name -ErrorAction SilentlyContinue
    Unregister-Event -SourceIdentifier $deletedEvent.Name -ErrorAction SilentlyContinue
    $fsw.Dispose()
    Write-Host "Autosync watcher terminated."
}
