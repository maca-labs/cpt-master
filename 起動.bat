@echo off
setlocal
where pwsh.exe >nul 2>nul
if %errorlevel%==0 (
    pwsh.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dpn0.ps1"
) else (
    powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dpn0.ps1"
)
set "CPT_EXIT_CODE=%errorlevel%"
if not "%CPT_EXIT_CODE%"=="0" (
    echo.
    echo CPT Master did not start. Check the message above.
    pause
)
endlocal & exit /b %CPT_EXIT_CODE%
