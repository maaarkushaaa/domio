#!/usr/bin/env node
/**
 * Запуск сервера конфигуратора с русской локализацией
 * 
 * Этот скрипт запускает локальный сервер для тестирования
 * конфигуратора с русскими переводами и рублями
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8000;
const CONFIGURATOR_PAGE = 'configurator_2508f3617e1046cba5b985f3a7ea393a_page.html';

// MIME типы для различных файлов
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject'
};

// Функция для определения MIME типа
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

// Функция для обслуживания статических файлов
function serveStaticFile(res, filePath) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('Файл не найден: ' + filePath);
            return;
        }

        const mimeType = getMimeType(filePath);
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(data);
    });
}

// Создаем HTTP сервер
const server = http.createServer((req, res) => {
    // Устанавливаем CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Обрабатываем OPTIONS запросы
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    let filePath = req.url;

    // Убираем query параметры
    if (filePath.includes('?')) {
        filePath = filePath.split('?')[0];
    }

    // Если запрашивается корень, показываем главную страницу конфигуратора
    if (filePath === '/') {
        filePath = '/' + CONFIGURATOR_PAGE;
    }

    // Убираем ведущий слеш для работы с файловой системой
    filePath = filePath.substring(1);

    // Проверяем существование файла
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Файл не найден</title>
                </head>
                <body>
                    <h1>404 - Файл не найден</h1>
                    <p>Запрашиваемый файл: ${req.url}</p>
                    <p><a href="/">Перейти к конфигуратору</a></p>
                </body>
                </html>
            `);
            return;
        }

        serveStaticFile(res, filePath);
    });
});

// Запускаем сервер
server.listen(PORT, () => {
    console.log('🚀 Сервер конфигуратора запущен!');
    console.log('');
    console.log('📋 Информация:');
    console.log(`   Порт: ${PORT}`);
    console.log(`   URL: http://localhost:${PORT}`);
    console.log(`   Конфигуратор: http://localhost:${PORT}/${CONFIGURATOR_PAGE}`);
    console.log('');
    console.log('🎯 Особенности:');
    console.log('   ✅ Русские переводы');
    console.log('   ✅ Валюта в рублях (₽)');
    console.log('   ✅ Локальная конфигурация');
    console.log('   ✅ Перехват API запросов');
    console.log('');
    console.log('📁 Основные файлы:');
    console.log(`   • ${CONFIGURATOR_PAGE} - главная страница`);
    console.log('   • wardrobe_config_rubles.json - конфигурация с рублями');
    console.log('   • local_config_server.js - перехват API');
    console.log('   • simple_fix.js - переводы');
    console.log('');
    console.log('🛑 Для остановки нажмите Ctrl+C');
    console.log('');

    // Пытаемся автоматически открыть браузер
    const url = `http://localhost:${PORT}`;
    const start = process.platform === 'darwin' ? 'open' : 
                  process.platform === 'win32' ? 'start' : 'xdg-open';
    
    exec(`${start} ${url}`, (error) => {
        if (error) {
            console.log('💡 Откройте браузер и перейдите по адресу:');
            console.log(`   ${url}`);
        } else {
            console.log('🌐 Браузер открыт автоматически');
        }
    });
});

// Обработка ошибок сервера
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Ошибка: Порт ${PORT} уже используется`);
        console.error('   Попробуйте другой порт или остановите другой сервер');
    } else {
        console.error('❌ Ошибка сервера:', err.message);
    }
    process.exit(1);
});

// Обработка сигналов завершения
process.on('SIGINT', () => {
    console.log('\n🛑 Остановка сервера...');
    server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Получен сигнал завершения...');
    server.close(() => {
        console.log('✅ Сервер остановлен');
        process.exit(0);
    });
});




