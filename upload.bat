@echo off
:: השמה אוטומטית של התיקייה שבה רץ קובץ ה-BAT
set "REPO_DIR=%~dp0"
set "REPO_DIR=%REPO_DIR:~0,-1%"
set "TARGET_DIR=%REPO_DIR%"

set "GITHUB_USER=BizTechoff"
set "GITHUB_TOKEN=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"
set "REPO_NAME=bto-land"
set "BRANCH=main"

echo [1/4] Checking for files modified in the last 5 minutes...

cd /d "%REPO_DIR%"

powershell -Command "Get-ChildItem -Path '%TARGET_DIR%' -Recurse | Where-Object { $_.LastWriteTime -gt (Get-Date).AddMinutes(-5) -and !$_.PSIsContainer } | ForEach-Object { Write-Output $_.FullName; exit 0 }" > nul
if %ERRORLEVEL% NEQ 0 (
    echo No files modified in the last 5 minutes. Exiting.
    exit /b
)

echo [2/4] Files found! Stage modifications...
git add "%TARGET_DIR%\*"

git diff --cached --quiet
if %ERRORLEVEL% EQU 0 (
    echo No actual changes to commit.
    exit /b
)

echo [3/4] Committing changes...
set "COMMIT_MSG=Automated update"
git commit -m "%COMMIT_MSG%"

echo [4/4] Pushing to GitHub...
git push https://%GITHUB_USER%:%GITHUB_TOKEN%@github.com/%GITHUB_USER%/%REPO_NAME%.git %BRANCH%

echo Done!
pause