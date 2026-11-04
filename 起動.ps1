[CmdletBinding()]
param(
    [switch]$UseSystemCA,
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$ProjectRoot = $PSScriptRoot
$AppUrl = 'http://127.0.0.1:5173/'
$PreviousDirectory = Get-Location
$BrowserHelper = $null

function Test-LocalPort {
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $pending = $client.ConnectAsync('127.0.0.1', 5173)
        return ($pending.Wait(500) -and $client.Connected)
    }
    catch { return $false }
    finally { $client.Dispose() }
}

function Get-AppServerState {
    try {
        $page = Invoke-WebRequest -Uri $AppUrl -UseBasicParsing -TimeoutSec 2 -MaximumRedirection 0
        if ($page.Content -match '(?is)<title\b[^>]*>\s*CPT Master(?:\s|<|—|–|-)') {
            return 'cpt'
        }
        return 'occupied'
    }
    catch {
        if (Test-LocalPort) { return 'occupied' }
        return 'free'
    }
}

function Invoke-ProjectNpm {
    param([ValidateSet('ci', 'run build', 'run preview -- --port 5173 --strictPort')][string]$Command)
    $start = New-Object System.Diagnostics.ProcessStartInfo
    $start.FileName = Join-Path $env:SystemRoot 'System32\cmd.exe'
    $start.Arguments = '/d /s /c ""' + $NpmPath + '" ' + $Command + '"'
    $start.WorkingDirectory = $ProjectRoot
    $start.UseShellExecute = $false
    $start.CreateNoWindow = $false
    $start.EnvironmentVariables['NPM_CONFIG_STRICT_SSL'] = 'true'
    $start.EnvironmentVariables['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
    if ($UseSystemCA) {
        $start.EnvironmentVariables['NODE_USE_SYSTEM_CA'] = '1'
    }
    $process = New-Object System.Diagnostics.Process
    $process.StartInfo = $start
    try {
        [void]$process.Start()
        $process.WaitForExit()
        return $process.ExitCode
    }
    finally { $process.Dispose() }
}

try {
    Set-Location -LiteralPath $ProjectRoot
    $packagePath = Join-Path $ProjectRoot 'package.json'
    if (-not (Test-Path -LiteralPath $packagePath -PathType Leaf)) {
        throw 'このフォルダーにpackage.jsonがありません。CPT Masterのプロジェクト直下で実行してください。'
    }
    $package = Get-Content -LiteralPath $packagePath -Raw | ConvertFrom-Json
    if ($package.name -ne 'cpt-master') {
        throw 'CPT Masterのプロジェクトではありません。起動処理を中止しました。'
    }
    $npmCommand = Get-Command npm.cmd -CommandType Application -ErrorAction SilentlyContinue
    $nodeCommand = Get-Command node.exe -CommandType Application -ErrorAction SilentlyContinue
    if (-not $npmCommand -or -not $nodeCommand) {
        throw 'Node.jsとnpmが見つかりません。Node.jsを導入してから、この起動ファイルを開き直してください。'
    }
    $NpmPath = $npmCommand.Source
    $state = Get-AppServerState
    if ($state -eq 'cpt') {
        Write-Host ('起動中のCPT Masterを開きます: ' + $AppUrl) -ForegroundColor Green
        if (-not $NoBrowser) { Start-Process -FilePath $AppUrl }
        return
    }
    if ($state -eq 'occupied') {
        throw '5173番ポートは別のアプリ、またはCPT Masterと確認できないサーバーが使用中です。ポートは変更しません。使用中のアプリを確認してください。'
    }

    if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot 'node_modules') -PathType Container)) {
        Write-Host '初回の依存関係をnpm ciで導入しています。' -ForegroundColor Cyan
        $installExit = Invoke-ProjectNpm -Command 'ci'
        if ($installExit -ne 0) {
            throw 'npm ciに失敗しました。ネット接続と表示されたエラーを確認してください。Windowsの信頼済み証明書が必要な場合は、起動.ps1 -UseSystemCAを使用できます。SSL検証は無効にしないでください。'
        }
    }
    if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot 'node_modules\vite\bin\vite.js') -PathType Leaf)) {
        throw 'Viteの依存関係を確認できません。このプロジェクトでnpm ciを実行し、起動し直してください。'
    }

    Write-Host '基本PWAを含む表示用ファイルをビルドしています。' -ForegroundColor Cyan
    $buildExit = Invoke-ProjectNpm -Command 'run build'
    if ($buildExit -ne 0) {
        throw 'ビルドに失敗しました。上に表示されたエラーを確認してください。'
    }
    # Installation/build may take time; do not replace a server started meanwhile.
    $state = Get-AppServerState
    if ($state -eq 'cpt') {
        Write-Host ('起動中のCPT Masterを開きます: ' + $AppUrl) -ForegroundColor Green
        if (-not $NoBrowser) { Start-Process -FilePath $AppUrl }
        return
    }
    if ($state -eq 'occupied') {
        throw 'ビルド中に5173番ポートが使用されました。既存のアプリを確認してください。ポートは変更しません。'
    }

    if (-not $NoBrowser) {
        # Only the browser readiness helper runs hidden. Preview stays in this console.
        $openCode = @'
$ErrorActionPreference = 'SilentlyContinue'
$url = 'http://127.0.0.1:5173/'
$deadline = [DateTime]::UtcNow.AddSeconds(40)
while ([DateTime]::UtcNow -lt $deadline) {
    try {
        $page = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2 -MaximumRedirection 0 -ErrorAction Stop
        if ($page.Content -match '(?is)<title\b[^>]*>\s*CPT Master(?:\s|<|—|–|-)') {
            Start-Process -FilePath $url
            break
        }
    }
    catch {}
    Start-Sleep -Milliseconds 400
}
'@
        $encodedCode = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($openCode))
        $shellPath = (Get-Process -Id $PID).Path
        $BrowserHelper = Start-Process -FilePath $shellPath -ArgumentList '-NoLogo', '-NoProfile', '-EncodedCommand', $encodedCode -WindowStyle Hidden -PassThru
    }

    Write-Host ('CPT Masterを起動します: ' + $AppUrl) -ForegroundColor Green
    Write-Host 'この画面を開いたまま使ってください。終了するときはCtrl+Cを押します。'
    $serverExit = Invoke-ProjectNpm -Command 'run preview -- --port 5173 --strictPort'
    if ($serverExit -ne 0) {
        throw ('プレビューが終了しました（終了コード ' + $serverExit + '）。上の表示を確認してください。')
    }
}
catch {
    Write-Host ('起動できません: ' + $_.Exception.Message) -ForegroundColor Red
    exit 1
}
finally {
    if ($BrowserHelper) {
        try {
            if (-not $BrowserHelper.HasExited) { $BrowserHelper.Kill() }
        }
        catch {}
        finally { $BrowserHelper.Dispose() }
    }
    Set-Location -LiteralPath $PreviousDirectory.Path
}
