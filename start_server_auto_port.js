#!/usr/bin/env node
/**
 * Запуск сервера конфигуратора с выбором порта
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Функция для проверки доступности порта
function checkPort(port) {
    return new Promise((resolve) => {
        const server = http.createServer();
        server.listen(port, () => {
            server.close(() => resolve(true));
        });
        server.on('error', () => resolve(false));
    });
}

// Функция для поиска свободного порта
async function findFreePort(startPort = 8000) {
    for (let port = startPort; port < startPort + 100; port++) {
        if (await checkPort(port)) {
            return port;
        }
    }
    throw new Error('Не удалось найти свободный порт');
}

// Остальной код сервера (копируем из start_server.js)
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

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

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

async function startServer() {
    const CONFIGURATOR_PAGE = 'configurator_2508f3617e1046cba5b985f3a7ea393a_page.html';
    
    try {
        // Пытаемся найти свободный порт
        const port = await findFreePort(8000);
        
        const server = http.createServer((req, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

            if (req.method === 'OPTIONS') {
                res.writeHead(200);
                res.end();
                return;
            }

            let filePath = req.url;
            if (filePath.includes('?')) {
                filePath = filePath.split('?')[0];
            }

            if (filePath === '/') {
                filePath = '/' + CONFIGURATOR_PAGE;
            }

            filePath = filePath.substring(1);

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

        server.listen(port, () => {
            console.log('🚀 Сервер конфигуратора запущен!');
            console.log('');
            console.log('📋 Информация:');
            console.log(`   Порт: ${port}`);
            console.log(`   URL: http://localhost:${port}`);
            console.log(`   Конфигуратор: http://localhost:${port}/${CONFIGURATOR_PAGE}`);
            console.log('');
            console.log('🎯 Особенности:');
            console.log('   ✅ Русские переводы');
            console.log('   ✅ Валюта в рублях (₽)');
            console.log('   ✅ Локальная конфигурация');
            console.log('   ✅ Перехват API запросов');
            console.log('');
            console.log('🛑 Для остановки нажмите Ctrl+C');
            console.log('');

            // Автооткрытие браузера
            const url = `http://localhost:${port}`;
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

        server.on('error', (err) => {
            console.error('❌ Ошибка сервера:', err.message);
            process.exit(1);
        });

        process.on('SIGINT', () => {
            console.log('\n🛑 Остановка сервера...');
            server.close(() => {
                console.log('✅ Сервер остановлен');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        process.exit(1);
    }
}

startServer();




