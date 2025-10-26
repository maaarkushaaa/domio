#!/usr/bin/env node
// debug_api_interception.js - Детальная диагностика перехвата API

const puppeteer = require('puppeteer');

async function debugApiInterception() {
    console.log('🔍 Детальная диагностика перехвата API...');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        devtools: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Перехватываем все запросы
    const requests = [];
    const responses = [];
    
    page.on('request', request => {
        const url = request.url();
        if (url.includes('condor.pickawood.com') || url.includes('pickawood.com/api')) {
            console.log('🌐 API REQUEST:', url);
            requests.push({ url, method: request.method() });
        }
    });
    
    page.on('response', response => {
        const url = response.url();
        if (url.includes('condor.pickawood.com') || url.includes('pickawood.com/api')) {
            console.log('📡 API RESPONSE:', url, response.status());
            responses.push({ url, status: response.status() });
        }
    });
    
    // Перехватываем console.log
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('LOCAL-CONFIG-SERVER') || text.includes('INTERCEPTING') || text.includes('RETURNING LOCAL') || text.includes('FETCH ATTEMPT')) {
            console.log('📝 CONSOLE:', text);
        }
    });
    
    try {
        console.log('📄 Загружаем страницу...');
        await page.goto('http://localhost:8080/configurator_2508f3617e1046cba5b985f3a7ea393a_page.html', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        
        console.log('⏳ Ждем загрузки конфигуратора...');
        await page.waitForTimeout(5000);
        
        // Проверяем наличие элементов с символами валюты
        const priceElements = await page.$$eval('*', elements => {
            return elements
                .filter(el => el.textContent && (el.textContent.includes('=C2=A3') || el.textContent.includes('£')))
                .map(el => ({ tag: el.tagName, text: el.textContent.substring(0, 100) }));
        });
        
        console.log('💰 Элементы с символами валюты:', priceElements.length);
        priceElements.forEach(el => console.log(`  ${el.tag}: ${el.text}`));
        
        // Проверяем наличие элементов с символами доставки
        const deliveryElements = await page.$$eval('*', elements => {
            return elements
                .filter(el => el.textContent && (el.textContent.includes('=E2=80=91') || el.textContent.includes('–')))
                .map(el => ({ tag: el.tagName, text: el.textContent.substring(0, 100) }));
        });
        
        console.log('🚚 Элементы с символами доставки:', deliveryElements.length);
        deliveryElements.forEach(el => console.log(`  ${el.tag}: ${el.text}`));
        
        // Проверяем, загружается ли наш локальный файл
        const localFileRequest = await page.evaluate(() => {
            return fetch('/wardrobe_config_symbols_fixed.json')
                .then(response => response.ok ? 'OK' : 'FAILED')
                .catch(() => 'ERROR');
        });
        
        console.log('📁 Статус загрузки локального файла:', localFileRequest);
        
        // Проверяем содержимое локального файла
        const localFileContent = await page.evaluate(() => {
            return fetch('/wardrobe_config_symbols_fixed.json')
                .then(response => response.text())
                .then(text => {
                    const hasPound = text.includes('£');
                    const hasDash = text.includes('–');
                    return { hasPound, hasDash, size: text.length };
                })
                .catch(() => ({ hasPound: false, hasDash: false, size: 0 }));
        });
        
        console.log('📄 Содержимое локального файла:', localFileContent);
        
        console.log('\n📊 Статистика запросов:');
        console.log('API запросов:', requests.length);
        console.log('API ответов:', responses.length);
        
        requests.forEach(req => console.log(`  ${req.method} ${req.url}`));
        responses.forEach(res => console.log(`  ${res.status} ${res.url}`));
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    }
    
    console.log('\n⏳ Оставляем браузер открытым для ручной проверки...');
    console.log('Нажмите Ctrl+C для закрытия');
    
    // Не закрываем браузер, чтобы можно было проверить вручную
    await new Promise(() => {});
}

debugApiInterception().catch(console.error);




