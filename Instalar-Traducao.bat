@echo off
title Instalador PT-BR - Antigravity - Emerson Teles
cls
echo ================================================================
echo      ANTIGRAVITY - TRADUCAO PT-BR - EMERSON TELES
echo ================================================================
echo.
set "AGY_FROM_BAT=1"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0aplicar-traducao.ps1"
set "PS_EXIT=%ERRORLEVEL%"
if not "%PS_EXIT%"=="0" (
    echo.
    pause
)
exit /b %PS_EXIT%
