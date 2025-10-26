#!/usr/bin/env node
// deep_debug.js - Глубокая диагностика проблемы

const puppeteer = require('puppeteer');

async function deepDebug() {
    console.log('🔍 Глубокая диагностика проблемы...');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        devtools: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Перехватываем все console.log
    page.on('console', msg => {
        const text = msg.text();
        console.log('📝 CONSOLE:', text);
    });
    
    // Перехватываем все запросы
    const requests = [];
    const responses = [];
    
    page.on('request', request => {
        const url = request.url();
        console.log('🌐 REQUEST:', request.method(), url);
        requests.push({ url, method: request.method() });
    });
    
    page.on('response', response => {
        const url = response.url();
        console.log('📡 RESPONSE:', response.status(), url);
        responses.push({ url, status: response.status() });
    });
    
    try {
        console.log('📄 Загружаем страницу...');
        await page.goto('http://localhost:8080/configurator_2508f3617e1046cba5b985f3a7ea393a_page.html', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        
        console.log('⏳ Ждем загрузки конфигуратора...');
        await page.waitForTimeout(10000);
        
        // Проверяем window.conf2config
        const conf2config = await page.evaluate(() => {
            return window.conf2config ? {
                productId: window.conf2config.productId,
                locale: window.conf2config.locale,
                countryId: window.conf2config.countryId,
                type: window.conf2config.type
            } : null;
        });
        
        console.log('🔧 window.conf2config:', conf2config);
        
        // Проверяем наличие наших скриптов
        const scripts = await page.evaluate(() => {
            const scriptTags = Array.from(document.querySelectorAll('script[src]'));
            return scriptTags.map(script => script.src).filter(src => 
                src.includes('local_config_server') || 
                src.includes('decode_quoted_printable') ||
                src.includes('aggressive_symbol_fix') ||
                src.includes('simple_fix')
            );
        });
        
        console.log('📜 Наши скрипты:', scripts);
        
        // Проверяем наличие наших флагов
        const flags = await page.evaluate(() => {
            return {
                RU_BOOTSTRAP_OK: window.__RU_BOOTSTRAP_OK__,
                CONFIG_DATA_OVERRIDDEN: window.__CONFIG_DATA_OVERRIDDEN__,
                RU_BOOTSTRAP_LOGS: window.__RU_BOOTSTRAP_LOGS__
            };
        });
        
        console.log('🚩 Флаги:', flags);
        
        // Проверяем все элементы с закодированными символами
        const encodedElements = await page.$$eval('*', elements => {
            return elements
                .filter(el => el.textContent && (el.textContent.includes('=C2=A3') || el.textContent.includes('=E2=80=91')))
                .map(el => ({ 
                    tag: el.tagName, 
                    className: el.className,
                    id: el.id,
                    text: el.textContent.substring(0, 200) 
                }));
        });
        
        console.log('⚠️ Элементы с закодированными символами:', encodedElements.length);
        encodedElements.forEach(el => console.log(`  ${el.tag}#${el.id}.${el.className}: ${el.text}`));
        
        // Проверяем все элементы с правильными символами
        const correctElements = await page.$$eval('*', elements => {
            return elements
                .filter(el => el.textContent && (el.textContent.includes('£') || el.textContent.includes('–')))
                .map(el => ({ 
                    tag: el.tagName, 
                    className: el.className,
                    id: el.id,
                    text: el.textContent.substring(0, 200) 
                }));
        });
        
        console.log('✅ Элементы с правильными символами:', correctElements.length);
        correctElements.forEach(el => console.log(`  ${el.tag}#${el.id}.${el.className}: ${el.text}`));
        
        // Проверяем, загружается ли наш локальный файл
        const localFileStatus = await page.evaluate(() => {
            return fetch('/wardrobe_config_original_symbols.json')
                .then(response => ({
                    status: response.status,
                    ok: response.ok,
                    size: response.headers.get('content-length')
                }))
                .catch(error => ({ error: error.message }));
        });
        
        console.log('📁 Статус локального файла:', localFileStatus);
        
        // Проверяем содержимое локального файла
        const localFileContent = await page.evaluate(() => {
            return fetch('/wardrobe_config_original_symbols.json')
                .then(response => response.text())
                .then(text => {
                    const hasEncodedPound = text.includes('=C2=A3');
                    const hasEncodedDash = text.includes('=E2=80=91');
                    const hasDecodedPound = text.includes('£');
                    const hasDecodedDash = text.includes('–');
                    return {
                        hasEncodedPound,
                        hasEncodedDash,
                        hasDecodedPound,
                        hasDecodedDash,
                        size: text.length
                    };
                })
                .catch(error => ({ error: error.message }));
        });
        
        console.log('📄 Содержимое локального файла:', localFileContent);
        
        // Проверяем Vue.js приложение
        const vueApp = await page.evaluate(() => {
            const vueElements = document.querySelectorAll('[data-v-]');
            return {
                vueElementsCount: vueElements.length,
                vueElements: Array.from(vueElements).slice(0, 5).map(el => ({
                    tag: el.tagName,
                    className: el.className,
                    text: el.textContent.substring(0, 100)
                }))
            };
        });
        
        console.log('🖼️ Vue.js элементы:', vueApp);
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    }
    
    console.log('\n⏳ Оставляем браузер открытым для ручной проверки...');
    console.log('Нажмите Ctrl+C для закрытия');
    
    // Не закрываем браузер, чтобы можно было проверить вручную
    await new Promise(() => {});
}

deepDebug().catch(console.error);




