const puppeteer = require('puppeteer');

async function debugSpecialOfferBlock() {
    console.log('=== Отладка информативного блока о специальном предложении ===');
    
    const browser = await puppeteer.launch({ 
        headless: false, // Запускаем в видимом режиме для отладки
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Перехватываем консольные сообщения
        page.on('console', msg => {
            if (msg.text().includes('banner') || msg.text().includes('voucher') || msg.text().includes('special')) {
                console.log('Console:', msg.text());
            }
        });
        
        console.log('Загрузка страницы...');
        await page.goto('http://localhost:8000/configurator_2508f3617e1046cba5b985f3a7ea393a_page.html', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        
        // Ждем загрузки
        await page.waitForTimeout(5000);
        
        // Проверяем все элементы с классом banner
        const bannerElements = await page.evaluate(() => {
            const banners = document.querySelectorAll('[class*="banner"]');
            const results = [];
            
            banners.forEach((banner, index) => {
                results.push({
                    index: index,
                    className: banner.className,
                    text: banner.textContent.trim().substring(0, 100),
                    visible: banner.offsetParent !== null,
                    style: banner.style.cssText,
                    computedStyle: window.getComputedStyle(banner).display
                });
            });
            
            return results;
        });
        
        console.log('\n📋 Найденные элементы с классом banner:');
        if (bannerElements.length > 0) {
            bannerElements.forEach(banner => {
                console.log(`   ${banner.index + 1}. Класс: ${banner.className}`);
                console.log(`      Видимый: ${banner.visible}`);
                console.log(`      Display: ${banner.computedStyle}`);
                console.log(`      Текст: ${banner.text}`);
                console.log('');
            });
        } else {
            console.log('   ❌ Элементы с классом banner не найдены');
        }
        
        // Проверяем все элементы с классом info-bar
        const infoBarElements = await page.evaluate(() => {
            const infoBars = document.querySelectorAll('[class*="info-bar"]');
            const results = [];
            
            infoBars.forEach((infoBar, index) => {
                results.push({
                    index: index,
                    className: infoBar.className,
                    text: infoBar.textContent.trim().substring(0, 100),
                    visible: infoBar.offsetParent !== null,
                    style: infoBar.style.cssText,
                    computedStyle: window.getComputedStyle(infoBar).display
                });
            });
            
            return results;
        });
        
        console.log('\n📋 Найденные элементы с классом info-bar:');
        if (infoBarElements.length > 0) {
            infoBarElements.forEach(infoBar => {
                console.log(`   ${infoBar.index + 1}. Класс: ${infoBar.className}`);
                console.log(`      Видимый: ${infoBar.visible}`);
                console.log(`      Display: ${banner.computedStyle}`);
                console.log(`      Текст: ${infoBar.text}`);
                console.log('');
            });
        } else {
            console.log('   ❌ Элементы с классом info-bar не найдены');
        }
        
        // Проверяем JavaScript переменные
        const jsVars = await page.evaluate(() => {
            return {
                bannerInfoBar: window.bannerInfoBar ? 'exists' : 'not found',
                bannerVoucher: window.bannerVoucher ? 'exists' : 'not found',
                bannerInfoBarText: window.bannerInfoBar?.text || 'no text',
                bannerVoucherCode: window.bannerVoucher?.code || 'no code'
            };
        });
        
        console.log('\n📋 JavaScript переменные:');
        console.log(`   bannerInfoBar: ${jsVars.bannerInfoBar}`);
        console.log(`   bannerVoucher: ${jsVars.bannerVoucher}`);
        console.log(`   Текст bannerInfoBar: ${jsVars.bannerInfoBarText}`);
        console.log(`   Код bannerVoucher: ${jsVars.bannerVoucherCode}`);
        
        // Попробуем принудительно показать блок
        const forceShow = await page.evaluate(() => {
            const banners = document.querySelectorAll('[class*="banner"]');
            let shown = 0;
            
            banners.forEach(banner => {
                if (banner.classList.contains('d-none')) {
                    banner.classList.remove('d-none');
                    banner.style.display = 'block';
                    banner.style.visibility = 'visible';
                    shown++;
                }
            });
            
            return shown;
        });
        
        console.log(`\n📋 Принудительно показано блоков: ${forceShow}`);
        
        // Ждем еще немного и делаем скриншот
        await page.waitForTimeout(2000);
        await page.screenshot({ path: 'debug_banner.png', fullPage: true });
        console.log('📸 Скриншот сохранен как debug_banner.png');
        
        console.log('\n✅ Отладка завершена!');
        console.log('🌐 Браузер остается открытым для ручной проверки...');
        
        // Не закрываем браузер, чтобы можно было посмотреть вручную
        await new Promise(() => {}); // Бесконечное ожидание
        
    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}

debugSpecialOfferBlock().catch(console.error);




