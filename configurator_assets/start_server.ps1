# PowerShell скрипт для запуска сервера конфигуратора
Write-Host "🚀 Запуск сервера конфигуратора..." -ForegroundColor Green
Write-Host ""

# Проверяем наличие Node.js
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Node.js не найден"
    }
    Write-Host "✅ Node.js найден: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Ошибка: Node.js не найден" -ForegroundColor Red
    Write-Host "   Установите Node.js с https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

# Проверяем наличие основных файлов
$requiredFiles = @(
    "configurator_2508f3617e1046cba5b985f3a7ea393a_page.html",
    "wardrobe_config_rubles.json", 
    "local_config_server.js",
    "simple_fix.js"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "❌ Ошибка: Не найдены файлы:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "   • $file" -ForegroundColor Yellow
    }
    Write-Host "   Убедитесь, что вы находитесь в правильной папке" -ForegroundColor Yellow
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Write-Host "✅ Все необходимые файлы найдены" -ForegroundColor Green
Write-Host ""

# Показываем информацию о конфигураторе
Write-Host "📋 Информация о конфигураторе:" -ForegroundColor Cyan
Write-Host "   • Русские переводы: ✅" -ForegroundColor Green
Write-Host "   • Валюта в рублях (₽): ✅" -ForegroundColor Green  
Write-Host "   • Локальная конфигурация: ✅" -ForegroundColor Green
Write-Host "   • Перехват API запросов: ✅" -ForegroundColor Green
Write-Host ""

# Запускаем сервер
Write-Host "🎯 Запуск сервера..." -ForegroundColor Yellow
Write-Host "   Для остановки нажмите Ctrl+C" -ForegroundColor Gray
Write-Host ""

try {
    node start_server.js
} catch {
    Write-Host "❌ Ошибка при запуске сервера: $_" -ForegroundColor Red
    Read-Host "Нажмите Enter для выхода"
    exit 1
}




