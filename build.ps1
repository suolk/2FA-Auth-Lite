$src = "edge-extension"
$out = "Tiny Auth.zip"
$tmp = "temp_build"
$files = @(
    "manifest.json",
    "popup.html",
    "popup.css",
    "popup.js",
    "ui.js",
    "qr.js",
    "state.js",
    "totp.js",
    "storage.js",
    "i18n.js",
    "sites.js",
    "zxing.js",
    "LICENSE",
    "icons"
)

Write-Host "===================================="
Write-Host "   Tiny Auth Extension Builder"
Write-Host "===================================="
Write-Host ""

if (Test-Path $out) {
    Remove-Item $out -Force
    Write-Host "[OK] Deleted old $out"
}

if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
New-Item -ItemType Directory -Path $tmp | Out-Null

foreach ($f in $files) {
    $fp = Join-Path $src $f
    if (Test-Path $fp) {
        $dp = Join-Path $tmp $f
        $dd = Split-Path -Parent $dp
        if ($dd -and -not (Test-Path $dd)) {
            New-Item -ItemType Directory -Path $dd -Force | Out-Null
        }
        if (Test-Path $fp -PathType Container) {
            Copy-Item -Recurse -Force $fp $dp
        } else {
            Copy-Item -Force $fp $dp
        }
        Write-Host "[+] $f"
    } else {
        Write-Host "[!] Skip: $f"
    }
}

Write-Host ""
Write-Host "[*] Compressing..."
Compress-Archive -Path "$tmp\*" -DestinationPath $out -Force
Remove-Item -Recurse -Force $tmp

$size = [math]::Round((Get-Item $out).Length / 1KB, 2)
Write-Host ""
Write-Host "[OK] Done: $out ($size KB)"
