@echo off
title Antigravity PT-BR - Emerson Teles
cls
echo ================================================================
echo      ANTIGRAVITY - TRADUCAO PT-BR - EMERSON TELES
echo ================================================================
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0aplicar-traducao.ps1"
set "PS_EXIT=%ERRORLEVEL%"
if not "%PS_EXIT%"=="0" pause
exit /b %PS_EXIT%
