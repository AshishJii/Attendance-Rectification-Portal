@echo off

cd .\RectifyAPI
if not exist node_modules (
    echo Installing API dependencies...
    call npm install
) else (
    echo API dependencies already installed.
)
cd ..\

cd .\RectifyFrontEnd
if not exist node_modules (
    echo Installing Frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed.
)
cd ..\

start cmd /c "cd .\RectifyAPI && npm start"
start cmd /c "cd .\RectifyFrontEnd && npm start"

timeout /t 2 >nul
start "" "http://localhost:3333/Request.html"
