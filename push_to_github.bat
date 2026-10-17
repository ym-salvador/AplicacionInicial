@echo off
title Subir a GitHub - Aplicacion Inicial
echo =========================================================================
echo   SUBIENDO PROYECTO A GITHUB: ym-salvador/AplicacionInicial
echo =========================================================================
echo.
git push -u origin main
echo.
if %errorlevel% equ 0 (
    echo =========================================================================
    echo   EXITO: Tu proyecto se ha subido correctamente a GitHub!
    echo   Repositorio: https://github.com/ym-salvador/AplicacionInicial.git
    echo =========================================================================
) else (
    echo.
    echo Si te solicito iniciar sesion en el navegador, autoriza la conexion.
    echo Si necesitas usar un Token de Acceso Personal (PAT), pegalo cuando lo pida.
)
echo.
pause
