@echo off
echo 🚀 Запуск сервера конфигуратора...
echo.

REM Проверяем наличие Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Ошибка: Node.js не найден
    echo    Установите Node.js с https://nodejs.org/
    pause
    exit /b 1
)

REM Проверяем наличие основных файлов
if not exist "configurator_2508f3617e1046cba5b985f3a7ea393a_page.html" (
    echo ❌ Ошибка: Файл конфигуратора не найден
    echo    Убедитесь, что вы находитесь в правильной папке
    pause
    exit /b 1
)

if not exist "wardrobe_config_rubles.json" (
    echo ❌ Ошибка: Файл конфигурации с рублями не найден
    echo    Убедитесь, что wardrobe_config_rubles.json существует
    pause
    exit /b 1
)

if not exist "local_config_server.js" (
    echo ❌ Ошибка: Сервер перехвата API не найден
    echo    Убедитесь, что local_config_server.js существует
    pause
    exit /b 1
)

echo ✅ Все файлы найдены
echo.

REM Запускаем сервер
echo 🎯 Запуск сервера...
node start_server.js

pause




