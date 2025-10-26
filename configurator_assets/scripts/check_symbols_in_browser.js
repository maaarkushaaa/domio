#!/usr/bin/env node
// check_symbols_in_browser.js - Проверка символов в браузере

const puppeteer = require('puppeteer');

async function checkSymbolsInBrowser() {
    console.log('🔍 Проверяем символы в браузере...');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        devtools: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Перехватываем console.log
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('AGGRESSIVE-SYMBOL-FIX') || text.includes('Fixed') || text.includes('symbols')) {
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
        
        // Проверяем наличие закодированных символов
        const encodedSymbols = await page.$$eval('*', elements => {
            return elements
                .filter(el => el.textContent && (el.textContent.includes('=C2=A3') || el.textContent.includes('=E2=80=91')))
                .map(el => ({ tag: el.tagName, text: el.textContent.substring(0, 100) }));
        });
        
        console.log('⚠️ Элементы с закодированными символами:', encodedSymbols.length);
        encodedSymbols.forEach(el => console.log(`  ${el.tag}: ${el.text}`));
        
        // Проверяем наличие правильных символов
        const correctSymbols = await page.$$eval('*', elements => {
            return elements
                .filter(el => el.textContent && (el.textContent.includes('£') || el.textContent.includes('–')))
                .map(el => ({ tag: el.tagName, text: el.textContent.substring(0, 100) }));
        });
        
        console.log('✅ Элементы с правильными символами:', correctSymbols.length);
        correctSymbols.forEach(el => console.log(`  ${el.tag}: ${el.text}`));
        
        // Проверяем футер с ценой и доставкой
        const footerElements = await page.$$eval('.footer, [class*="footer"], [class*="price"], [class*="delivery"]', elements => {
            return elements.map(el => ({ 
                tag: el.tagName, 
                className: el.className,
                text: el.textContent.substring(0, 200) 
            }));
        });
        
        console.log('💰 Элементы футера:', footerElements.length);
        footerElements.forEach(el => console.log(`  ${el.tag}.${el.className}: ${el.text}`));
        
        // Проверяем все элементы с текстом, содержащим символы валюты
        const currencyElements = await page.$$eval('*', elements => {
            return elements
                .filter(el => el.textContent && (el.textContent.includes('£') || el.textContent.includes('=C2=A3') || el.textContent.includes('price') || el.textContent.includes('Price')))
                .map(el => ({ 
                    tag: el.tagName, 
                    className: el.className,
                    text: el.textContent.substring(0, 100) 
                }));
        });
        
        console.log('💷 Элементы с валютой:', currencyElements.length);
        currencyElements.forEach(el => console.log(`  ${el.tag}.${el.className}: ${el.text}`));
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    }
    
    console.log('\n⏳ Оставляем браузер открытым для ручной проверки...');
    console.log('Нажмите Ctrl+C для закрытия');
    
    // Не закрываем браузер, чтобы можно было проверить вручную
    await new Promise(() => {});
}

checkSymbolsInBrowser().catch(console.error);




