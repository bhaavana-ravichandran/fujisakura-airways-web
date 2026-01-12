@echo off
echo ========================================
echo   Preparing Fujisakura Airways for GitHub
echo ========================================
echo.
echo Creating upload folder...
mkdir github-upload 2>nul

echo Copying essential files...
xcopy src github-upload\src /E /I /Y >nul
copy package.json github-upload\ >nul
copy package-lock.json github-upload\ >nul
copy next.config.js github-upload\ >nul
copy tailwind.config.js github-upload\ >nul
copy postcss.config.js github-upload\ >nul
copy jsconfig.json github-upload\ >nul
copy README.md github-upload\ >nul
copy PROJECT_SUMMARY.md github-upload\ >nul
copy .gitignore github-upload\ >nul

echo.
echo ✅ SUCCESS! Files ready for GitHub upload
echo.
echo 📁 Files are in: github-upload folder
echo 🌐 Go to: https://github.com/bhaavana-ravichandran/fujisakura-airways-web
echo 📤 Click "uploading an existing file"
echo 📂 Drag the contents of github-upload folder
echo.
echo Files prepared:
dir github-upload /B
echo.
echo ⚡ Ready to upload to GitHub!
pause