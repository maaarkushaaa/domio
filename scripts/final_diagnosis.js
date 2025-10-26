#!/usr/bin/env node
// final_diagnosis.js - Финальная диагностика проблемы

const puppeteer = require('puppeteer');

async function finalDiagnosis() {
    console.log('🔍 ФИНАЛЬНАЯ ДИАГНОСТИКА ПРОБЛЕМЫ...');
    
    const browser = await puppeteer.launch({ 
        headless: false,
        devtools: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Перехватываем ВСЕ console.log
    page.on('console', msg => {
        const text = msg.text();
        console.log('📝 CONSOLE:', text);
    });
    
    // Перехватываем все запросы
    page.on('request', request => {
        const url = request.url();
        if (url.includes('wardrobe_config') || url.includes('condor.pickawood.com')) {
            console.log('🌐 REQUEST:', request.method(), url);
        }
    });
    
    // Перехватываем все ответы
    page.on('response', response => {
        const url = response.url();
        if (url.includes('wardrobe_config') || url.includes('condor.pickawood.com')) {
            console.log('📡 RESPONSE:', response.status(), url);
        }
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
            if (window.conf2config) {
                const settings = window.conf2config.settings || {};
                return {
                    productId: window.conf2config.productId,
                    locale: window.conf2config.locale,
                    countryId: window.conf2config.countryId,
                    type: window.conf2config.type,
                    settingsCount: Object.keys(settings).length,
                    translationsCount: Object.keys(settings.translations || {}).length,
                    currencyShortcut: settings.currencyShortcut,
                    exchangeRate: settings.exchangeRate,
                    lang: settings.lang,
                    currencyPosition: settings.currencyPosition,
                    deliveryTranslation: settings.translations?.['conf2-footer-price-delivery'],
                    cartTranslation: settings.translations?.['conf2-footer-add_to_cart'],
                    taxTranslation: settings.translations?.['conf2-footer-price-tax']
                };
            }
            return null;
        });
        
        console.log('🔧 window.conf2config:', conf2config);
        
        // Проверяем наличие наших скриптов
        const scripts = await page.evaluate(() => {
            const scriptTags = Array.from(document.querySelectorAll('script[src]'));
            return scriptTags.map(script => script.src).filter(src => 
                src.includes('local_config_server') || 
                src.includes('decode_quoted_printable') ||
                src.includes('aggressive_symbol_fix') ||
                src.includes('simple_fix') ||
                src.includes('simple_decode') ||
                src.includes('force_decode_footer')
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
        
        // Ищем ВСЕ элементы с закодированными символами
        const encodedElements = await page.$$eval('*', elements => {
            return elements
                .filter(el => el.textContent && (el.textContent.includes('=C2=A3') || el.textContent.includes('=E2=80=91')))
                .map(el => ({ 
                    tag: el.tagName, 
                    className: el.className,
                    id: el.id,
                    text: el.textContent.substring(0, 200),
                    parentTag: el.parentElement?.tagName,
                    parentClass: el.parentElement?.className
                }));
        });
        
        console.log('⚠️ Элементы с закодированными символами:', encodedElements.length);
        encodedElements.forEach(el => console.log(`  ${el.tag}#${el.id}.${el.className} (parent: ${el.parentTag}.${el.parentClass}): ${el.text}`));
        
        // Ищем ВСЕ элементы с правильными символами
        const correctElements = await page.$$eval('*', elements => {
            return elements
                .filter(el => el.textContent && (el.textContent.includes('£') || el.textContent.includes('–')))
                .map(el => ({ 
                    tag: el.tagName, 
                    className: el.className,
                    id: el.id,
                    text: el.textContent.substring(0, 200),
                    parentTag: el.parentElement?.tagName,
                    parentClass: el.parentElement?.className
                }));
        });
        
        console.log('✅ Элементы с правильными символами:', correctElements.length);
        correctElements.forEach(el => console.log(`  ${el.tag}#${el.id}.${el.className} (parent: ${el.parentTag}.${el.parentClass}): ${el.text}`));
        
        // Ищем элементы футера
        const footerElements = await page.$$eval('*', elements => {
            return elements
                .filter(el => el.textContent && (
                    el.textContent.includes('price') || 
                    el.textContent.includes('Price') || 
                    el.textContent.includes('delivery') || 
                    el.textContent.includes('Delivery') ||
                    el.textContent.includes('cart') ||
                    el.textContent.includes('Cart') ||
                    el.textContent.includes('VAT') ||
                    el.textContent.includes('1220') ||
                    el.textContent.includes('1.220')
                ))
                .map(el => ({ 
                    tag: el.tagName, 
                    className: el.className,
                    id: el.id,
                    text: el.textContent.substring(0, 200),
                    parentTag: el.parentElement?.tagName,
                    parentClass: el.parentElement?.className
                }));
        });
        
        console.log('💰 Элементы футера:', footerElements.length);
        footerElements.forEach(el => console.log(`  ${el.tag}#${el.id}.${el.className} (parent: ${el.parentTag}.${el.parentClass}): ${el.text}`));
        
        // Проверяем Vue.js приложение
        const vueApp = await page.evaluate(() => {
            const vueElements = document.querySelectorAll('[data-v-]');
            return {
                vueElementsCount: vueElements.length,
                vueElements: Array.from(vueElements).slice(0, 10).map(el => ({
                    tag: el.tagName,
                    className: el.className,
                    text: el.textContent.substring(0, 100)
                }))
            };
        });
        
        console.log('🖼️ Vue.js элементы:', vueApp);
        
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
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
    }
    
    console.log('\n⏳ Оставляем браузер открытым для ручной проверки...');
    console.log('Нажмите Ctrl+C для закрытия');
    
    // Не закрываем браузер, чтобы можно было проверить вручную
    await new Promise(() => {});
}

finalDiagnosis().catch(console.error);




