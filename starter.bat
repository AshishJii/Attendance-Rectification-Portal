@echo off

cd .\Rectify
if not exist node_modules (
    echo Installing API dependencies...
    call npm install
) else (
    echo API dependencies already installed.
)

start cmd /c "npm start"

timeout /t 2 >nul
start "" "http://localhost:4001/Request.html"
