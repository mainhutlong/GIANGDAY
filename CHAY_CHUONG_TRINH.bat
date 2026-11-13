@echo off
chcp 65001 > nul
title HỆ THỐNG GIẢNG DẠY VÀ QUẢN LÝ ĐIỂM DANH CNTT

echo ======================================================================
echo        HỆ THỐNG GIẢNG DẠY & QUẢN LÝ ĐIỂM DANH TIN HỌC (CNTT)
echo ======================================================================
echo.
echo [1/3] Đang kiểm tra môi trường trên máy tính này...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [LỖI] Máy tính này chưa cài đặt Node.js!
    echo Vui lòng cài đặt Node.js (phiên bản LTS) từ: https://nodejs.org
    echo Sau khi cài xong, vui lòng nhấp lại vào tệp này.
    echo.
    pause
    exit /b
)

if not exist "node_modules" (
    echo.
    echo [2/3] Phát hiện lần đầu chạy trên máy mới!
    echo Đang tự động cài đặt các thư viện cần thiết, vui lòng đợi...
    call npm install
)

echo.
echo [3/3] Đang khởi động hệ thống...
echo Trình duyệt sẽ tự động mở tại địa chỉ: http://localhost:5173
echo.

start http://localhost:5173
call npm run dev

pause

