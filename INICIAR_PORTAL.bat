@echo off
title Portal de POPs e Treinamento - Eletromidia
cd /d "%~dp0"
echo ========================================================
echo   Iniciando Portal de Treinamento Eletromidia...
echo   Acesse no navegador: http://localhost:5173/
echo ========================================================
start "" "http://localhost:5173/"
npm run dev -- --port 5173 --host
pause
