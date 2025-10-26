#!/usr/bin/env node
// check_decoding.js - Проверка декодирования в браузере

const puppeteer = require('puppeteer');

async function checkDecoding() {
    console.log('🔍 Проверяем декодирование в браузере...');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        devtools: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Перехватываем console.log
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('DECODE-QUOTED-PRINTABLE') || text.includes('Fixed') || text.includes('decoded')) {
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
        const footerElements = await page.$$eval('*', elements => {
            return elements
                .filter(el => el.textContent && (el.textContent.includes('price') || el.textContent.includes('Price') || el.textContent.includes('delivery') || el.textContent.includes('Delivery')))
                .map(el => ({ 
                    tag: el.tagName, 
                    className: el.className,
                    text: el.textContent.substring(0, 200) 
                }));
        });
        
        console.log('💰 Элементы с ценой и доставкой:', footerElements.length);
        footerElements.forEach(el => console.log(`  ${el.tag}.${el.className}: ${el.text}`));
        
        // Проверяем все элементы с текстом, содержащим символы валюты
        const currencyElements = await page.$$eval('*', elements => {
            return elements
                .filter(el => el.textContent && (el.textContent.includes('£') || el.textContent.includes('=C2=A3') || el.textContent.includes('1.220') || el.textContent.includes('1220')))
                .map(el => ({ 
                    tag: el.tagName, 
                    className: el.className,
                    text: el.textContent.substring(0, 100) 
                }));
        });
        
        console.log('💷 Элементы с валютой:', currencyElements.length);
        currencyElements.forEach(el => console.log(`  ${el.tag}.${el.className}: ${el.text}`));
        
        // Проверяем все элементы с текстом, содержащим сроки доставки
        const deliveryElements = await page.$$eval('*', elements => {
            return elements
                .filter(el => el.textContent && (el.textContent.includes('8') && el.textContent.includes('11') && (el.textContent.includes('–') || el.textContent.includes('=E2=80=91'))))
                .map(el => ({ 
                    tag: el.tagName, 
                    className: el.className,
                    text: el.textContent.substring(0, 100) 
                }));
        });
        
        console.log('🚚 Элементы с сроками доставки:', deliveryElements.length);
        deliveryElements.forEach(el => console.log(`  ${el.tag}.${el.className}: ${el.text}`));
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    }
    
    console.log('\n⏳ Оставляем браузер открытым для ручной проверки...');
    console.log('Нажмите Ctrl+C для закрытия');
    
    // Не закрываем браузер, чтобы можно было проверить вручную
    await new Promise(() => {});
}

checkDecoding().catch(console.error);




