@echo off
echo ========================================
echo   AI跨境电商 - 一人公司运营平台
echo   启动脚本 v1.0
echo ========================================
echo.

:: Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js
    echo 下载地址: https://nodejs.org/zh-cn/download/
    echo 推荐版本: Node.js 18+ LTS
    echo.
    pause
    exit /b 1
)

echo [检测] Node.js 版本:
node -v
echo.

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [安装] 正在安装依赖...
    npm install
    echo.
)

:: Start dev server
echo [启动] 正在启动开发服务器...
echo.
echo 启动后请访问: http://localhost:3000/dashboard
echo 按 Ctrl+C 停止服务器
echo.
npx next dev
