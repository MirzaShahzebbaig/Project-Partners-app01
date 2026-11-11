@echo off
title Building ProjectPartner Android APK...
echo =============================================================
echo  🚀 Building ProjectPartner Android APK...
echo =============================================================

set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
set "PATH=%JAVA_HOME%\bin;%PATH%"

cd /d "%~dp0client"
echo [1/3] Building Web Assets...
call npm run build

echo [2/3] Syncing Capacitor Android...
call npx cap sync android
call node scripts/patch-android.mjs

echo [3/3] Compiling Debug APK with Gradle...
cd /d "%~dp0client\android"
call "%~dp0client\android\gradlew.bat" assembleDebug

echo.
echo =============================================================
echo  ✅ APK Build Complete!
echo  📁 APK File: client\android\app\build\outputs\apk\debug\app-debug.apk
echo =============================================================
pause
