#!/usr/bin/env node
// check_api_interception.js - Проверка перехвата API

const puppeteer = require('puppeteer');

async function checkApiInterception() {
    console.log('🔍 Проверяем перехват API...');
    
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
        if (text.includes('LOCAL-CONFIG-SERVER') || text.includes('INTERCEPTING') || text.includes('RETURNING LOCAL')) {
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
        
        // Проверяем наличие элементов калькулятора
        const priceElement = await page.$('[data-testid="price"], .price, [class*="price"]');
        const deliveryElement = await page.$('[data-testid="delivery"], .delivery, [class*="delivery"]');
        
        console.log('💰 Элемент цены найден:', !!priceElement);
        console.log('🚚 Элемент доставки найден:', !!deliveryElement);
        
        if (priceElement) {
            const priceText = await page.evaluate(el => el.textContent, priceElement);
            console.log('💰 Текст цены:', priceText);
        }
        
        if (deliveryElement) {
            const deliveryText = await page.evaluate(el => el.textContent, deliveryElement);
            console.log('🚚 Текст доставки:', deliveryText);
        }
        
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

checkApiInterception().catch(console.error);




