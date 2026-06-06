@echo off
chcp 65001 >nul
echo.
echo ============================================
echo   AI跨境电商 · 一键部署脚本
echo ============================================
echo.

:: Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [错误] 未检测到 Python，请先安装 Python 3.10+
    echo 下载: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo [1/4] 检查 Python 环境...
python --version

echo.
echo [2/4] 安装后端依赖...
cd backend
pip install -r requirements.txt -q
echo       依赖安装完成

echo.
echo [3/4] 初始化数据库...
echo       请在 Supabase 中执行 schema.sql
echo       或跳过此步使用内存模式

echo.
echo [4/4] 启动后端服务...
echo.
echo ============================================
echo   后端 API: http://localhost:8000
echo   API 文档: http://localhost:8000/docs
echo   前端界面: http://localhost:3000/dashboard
echo ============================================
echo.
echo 提示: 另开终端运行 "cd .. && npm run dev" 启动前端
echo.

python main.py
pause
