Add-Type -AssemblyName System.Drawing

# 1. Tạo app.ico từ ảnh computer-pc.png
$pngPath = Join-Path $PSScriptRoot "dist\assets\computer-pc.png"
$icoPath = Join-Path $PSScriptRoot "app.ico"

if (Test-Path $pngPath) {
    try {
        $bmp = [System.Drawing.Bitmap]::FromFile($pngPath)
        $resized = New-Object System.Drawing.Bitmap 64, 64
        $g = [System.Drawing.Graphics]::FromImage($resized)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.DrawImage($bmp, 0, 0, 64, 64)
        $g.Dispose()

        $hIcon = $resized.GetHicon()
        $icon = [System.Drawing.Icon]::FromHandle($hIcon)
        $fs = New-Object System.IO.FileStream $icoPath, ([System.IO.FileMode]::Create)
        $icon.Save($fs)
        $fs.Close()
        $icon.Dispose()
        $resized.Dispose()
        $bmp.Dispose()
        Write-Output "Created app.ico successfully"
    } catch {
        Write-Output "Warning: Could not create icon: $_"
    }
}

# 2. Biên dịch GiangDayCNTT.cs thành GiangDayCNTT.exe
$csc = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
$csFile = Join-Path $PSScriptRoot "GiangDayCNTT.cs"
$outFile = Join-Path $PSScriptRoot "GiangDayCNTT.exe"

$compileArgs = @(
    "/target:winexe",
    "/optimize+",
    "/platform:anycpu",
    "/r:System.dll",
    "/r:System.Windows.Forms.dll",
    "/r:System.Drawing.dll",
    "/out:$outFile",
    "$csFile"
)

if (Test-Path $icoPath) {
    $compileArgs += "/win32icon:$icoPath"
}

Write-Output "Compiling GiangDayCNTT.exe with csc.exe..."
& $csc $compileArgs

if (Test-Path $outFile) {
    $item = Get-Item $outFile
    Write-Output "SUCCESS: GiangDayCNTT.exe created, size: $($item.Length) bytes"
} else {
    Write-Output "ERROR: Compilation failed"
}

