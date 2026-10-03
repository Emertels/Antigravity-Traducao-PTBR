@echo off
title Restaurar ANTIGRAVITY Original - Emerson Teles
cls
echo ================================================================
echo      RESTAURAR ANTIGRAVITY ORIGINAL - EMERSON TELES
echo ================================================================
echo.
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0restaurar-original.ps1"
set "PS_EXIT=%ERRORLEVEL%"
if not "%PS_EXIT%"=="0" pause
exit /b %PS_EXIT%
