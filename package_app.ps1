# Script đóng gói ứng dụng thành gói Portable mang sang máy khác
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

$sourceDir = $PSScriptRoot
$targetDir = Join-Path $sourceDir "GiangDayCNTT_App"

Write-Output "=== BẮT ĐẦU ĐÓNG GÓI ỨNG DỤNG GIANG DAY CNTT ==="

# 1. Tạo thư mục đích
if (Test-Path $targetDir) {
    Write-Output "Làm sạch thư mục đóng gói cũ..."
    Remove-Item -Path $targetDir -Recurse -Force
}
New-Item -ItemType Directory -Path $targetDir | Out-Null

# 2. Sao chép tệp thực thi chính GiangDayCNTT.exe
$exeSource = Join-Path $sourceDir "GiangDayCNTT.exe"
if (Test-Path $exeSource) {
    Copy-Item $exeSource -Destination $targetDir -Force
    Write-Output "Đã chép GiangDayCNTT.exe"
} else {
    throw "Không tìm thấy GiangDayCNTT.exe! Vui lòng chạy build_exe.ps1 trước."
}

# 3. Sao chép server.cjs
$serverSource = Join-Path $sourceDir "server.cjs"
Copy-Item $serverSource -Destination $targetDir -Force
Write-Output "Đã chép server.cjs"

# 4. Sao chép runtime Node.js (đảm bảo máy khác không cần cài đặt Node.js)
$runtimeDir = Join-Path $targetDir "runtime"
New-Item -ItemType Directory -Path $runtimeDir | Out-Null
$nodeExePath = "C:\Program Files\nodejs\node.exe"
if (Test-Path $nodeExePath) {
    Copy-Item $nodeExePath -Destination (Join-Path $runtimeDir "node.exe") -Force
    Write-Output "Đã chép runtime/node.exe (Portable Node.js)"
} else {
    Write-Output "Cảnh báo: Không tìm thấy $nodeExePath, máy khác sẽ cần cài đặt Node.js."
}

# 5. Sao chép thư mục dist/ (Giao diện ứng dụng đã build)
$distSource = Join-Path $sourceDir "dist"
if (Test-Path $distSource) {
    Copy-Item -Path $distSource -Destination (Join-Path $targetDir "dist") -Recurse -Force
    Write-Output "Đã chép thư mục dist/ (Giao diện React Production)"
} else {
    throw "Không tìm thấy thư mục dist! Vui lòng chạy npm run build trước."
}

# 6. Sao chép thư mục public/ (Tài liệu TaiLieu, ThungRac, data)
$publicSource = Join-Path $sourceDir "public"
if (Test-Path $publicSource) {
    Copy-Item -Path $publicSource -Destination (Join-Path $targetDir "public") -Recurse -Force
    Write-Output "Đã chép thư mục public/ (Tài liệu, Thùng rác, Dữ liệu điểm danh)"
}

# 7. Tạo tệp khởi chạy dự phòng Chay_He_Thong.bat
$batContent = @"
@echo off
chcp 65001 >nul
title Hệ thống Đào tạo CNTT
cd /d "%~dp0"

echo ========================================================
echo   HỆ THỐNG GIẢNG DẠY & QUẢN LÝ ĐÀO TẠO CNTT
echo ========================================================
echo Đang khởi động hệ thống...

if exist "runtime\node.exe" (
    set "NODE_BIN=runtime\node.exe"
) else (
    set "NODE_BIN=node"
)

start "" /B "%NODE_BIN%" server.cjs 3899

timeout /t 2 /nobreak >nul

if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:3899 --user-data-dir="%TEMP%\GiangDayCNTT_Profile" --window-size=1366,850
) else if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    start "" "C:\Program Files\Microsoft\Edge\Application\msedge.exe" --app=http://localhost:3899 --user-data-dir="%TEMP%\GiangDayCNTT_Profile" --window-size=1366,850
) else (
    start http://localhost:3899
)

exit
"@
Set-Content -Path (Join-Path $targetDir "Chay_He_Thong.bat") -Value $batContent -Encoding UTF8
Write-Output "Đã tạo Chay_He_Thong.bat"

# 8. Tạo file Hướng dẫn sử dụng HUONG_DAN_SU_DUNG.txt
$guideContent = @"
========================================================================
         HƯỚNG DẪN SỬ DỤNG - HỆ THỐNG ĐÀO TẠO & GIẢNG DẠY CNTT
========================================================================

1. CÁCH KHỞI ĐỘNG HỆ THỐNG:
---------------------------
- Nhấp đúp chuột vào tệp: GiangDayCNTT.exe
- Hệ thống sẽ tự động khởi động máy chủ nội bộ và mở giao diện ứng dụng dưới dạng cửa sổ Desktop chuyên nghiệp (Microsoft Edge App Mode).
- (Nếu máy tính có thiết lập bảo mật chặn .exe lạ, bạn có thể nhấp đúp vào Chay_He_Thong.bat để chạy thay thế).

2. ĐEM SANG MÁY TÍNH KHÁC SỬ DỤNG:
---------------------------------
- Gói ứng dụng này là bản PORTABLE độc lập hoàn chỉnh.
- Máy tính khác KHÔNG CẦN CÀI ĐẶT BẤT KỲ PHẦN MỀM LẬP TRÌNH NÀO (Không cần cài Node.js, Git, hay VS Code).
- Bạn chỉ cần:
  + Chép toàn bộ thư mục 'GiangDayCNTT_App' (hoặc tệp GiangDayCNTT_App.zip rồi giải nén) vào ổ đĩa (C:, D:, Desktop) hoặc USB của máy tính mới.
  + Nhấp đúp vào GiangDayCNTT.exe là sử dụng được ngay lập tức!

3. CẤU TRÚC VÀ VỊ TRÍ DỮ LIỆU CỦA HỆ THỐNG:
------------------------------------------
- GiangDayCNTT.exe      : Tệp chạy chính của hệ thống.
- Chay_He_Thong.bat     : Trình khởi chạy dự phòng 1-click.
- runtime/node.exe      : Môi trường chạy Node.js đóng gói sẵn độc lập.
- dist/                 : Giao diện web ứng dụng đã được biên dịch tối ưu.
- public/TaiLieu/       : Thư mục chứa tài liệu học tập của các môn (Word, Excel, PowerPoint, Tìm hiểu và các danh mục tự tạo).
  * Bạn có thể chép trực tiếp các tệp Word (.docx), Excel (.xlsx), PowerPoint (.pptx), PDF vào các thư mục con tương ứng, hệ thống sẽ tự động quét và nhận diện ngay.
- public/ThungRac/      : Thùng rác dự án chứa các tệp đã xóa vĩnh viễn (kèm trash_manifest.json).
- public/data/          : Chứa dữ liệu danh sách lớp điểm danh (attendance_classes.json) và các danh mục học tập tự tạo.

4. CÁC TÍNH NĂNG CHÍNH ĐÃ ĐƯỢC BẢO TOÀN ĐẦY ĐỦ:
------------------------------------------------
✓ Mở tài liệu Word (.docx), Excel (.xlsx), PowerPoint (.pptx), PDF trực tiếp bằng bộ Microsoft Office của máy tính.
✓ Điểm danh sinh viên, import danh sách từ Excel theo đơn vị phòng ban có kiểm tra logic và báo lỗi từng dòng.
✓ Thêm/xóa danh mục học tập tự tạo, tự động tạo thư mục vật lý tương ứng trên ổ cứng.
✓ Quản lý thùng rác dự án: xóa tạm thời vào thùng rác hệ thống, xóa vĩnh viễn vào thư mục public/ThungRac/ và khôi phục khi cần.
✓ Hoạt động offline 100% không cần kết nối Internet.

Chúc quý thầy cô và các bạn sử dụng hiệu quả!
========================================================================
"@
Set-Content -Path (Join-Path $targetDir "HUONG_DAN_SU_DUNG.txt") -Value $guideContent -Encoding UTF8
Write-Output "Đã tạo HUONG_DAN_SU_DUNG.txt"

# 9. Nén thành file zip duy nhất GiangDayCNTT_App.zip để tiện sao chép / gửi qua Zalo / Drive
$zipOutput = Join-Path $sourceDir "GiangDayCNTT_App.zip"
if (Test-Path $zipOutput) {
    Remove-Item -Path $zipOutput -Force
}
Write-Output "Đang nén thành tệp GiangDayCNTT_App.zip..."
Compress-Archive -Path "$targetDir\*" -DestinationPath $zipOutput -CompressionLevel Optimal
Write-Output "ĐÃ TẠO THÀNH CÔNG TỆP NÉN: GiangDayCNTT_App.zip"

$zipItem = Get-Item $zipOutput
Write-Output "Kích thước tệp zip: $([Math]::Round($zipItem.Length / 1MB, 2)) MB"
Write-Output "=== ĐÓNG GÓI HOÀN TẤT THÀNH CÔNG ==="
