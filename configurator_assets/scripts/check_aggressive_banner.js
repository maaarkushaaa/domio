const puppeteer = require('puppeteer');

async function checkAggressiveBanner() {
    console.log('=== Проверка агрессивного отображения баннера ===');
    
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Перехватываем консольные сообщения
        page.on('console', msg => {
            if (msg.text().includes('AGGRESSIVE-SHOW-BANNER') || msg.text().includes('banner')) {
                console.log('Console:', msg.text());
            }
        });
        
        console.log('Загрузка страницы...');
        await page.goto('http://localhost:8000/configurator_2508f3617e1046cba5b985f3a7ea393a_page.html', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        
        // Ждем загрузки и выполнения скриптов
        await page.waitForTimeout(8000);
        
        // Проверяем все баннеры
        const bannerInfo = await page.evaluate(() => {
            const banners = document.querySelectorAll('[class*="banner"], [id*="banner"]');
            const results = [];
            
            banners.forEach((banner, index) => {
                const computedStyle = window.getComputedStyle(banner);
                results.push({
                    index: index + 1,
                    id: banner.id,
                    className: banner.className,
                    text: banner.textContent.trim().substring(0, 100),
                    visible: banner.offsetParent !== null,
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    opacity: computedStyle.opacity,
                    zIndex: computedStyle.zIndex,
                    position: computedStyle.position
                });
            });
            
            return results;
        });
        
        console.log('\n📋 Все найденные баннеры:');
        if (bannerInfo.length > 0) {
            bannerInfo.forEach(banner => {
                console.log(`   ${banner.index}. ID: ${banner.id || 'нет'}`);
                console.log(`      Класс: ${banner.className}`);
                console.log(`      Видимый: ${banner.visible}`);
                console.log(`      Display: ${banner.display}`);
                console.log(`      Visibility: ${banner.visibility}`);
                console.log(`      Opacity: ${banner.opacity}`);
                console.log(`      Z-index: ${banner.zIndex}`);
                console.log(`      Position: ${banner.position}`);
                console.log(`      Текст: ${banner.text}`);
                console.log('');
            });
        } else {
            console.log('   ❌ Баннеры не найдены');
        }
        
        // Проверяем агрессивный баннер
        const aggressiveBanner = await page.evaluate(() => {
            const banner = document.querySelector('#aggressive-special-offer-banner');
            if (banner) {
                const computedStyle = window.getComputedStyle(banner);
                return {
                    found: true,
                    visible: banner.offsetParent !== null,
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    opacity: computedStyle.opacity,
                    text: banner.textContent.trim().substring(0, 100)
                };
            }
            return { found: false };
        });
        
        console.log('\n📋 Агрессивный баннер:');
        if (aggressiveBanner.found) {
            console.log(`   ✅ Найден!`);
            console.log(`   Видимый: ${aggressiveBanner.visible}`);
            console.log(`   Display: ${aggressiveBanner.display}`);
            console.log(`   Visibility: ${aggressiveBanner.visibility}`);
            console.log(`   Opacity: ${aggressiveBanner.opacity}`);
            console.log(`   Текст: ${aggressiveBanner.text}`);
        } else {
            console.log('   ❌ Агрессивный баннер не найден');
        }
        
        // Проверяем стили body
        const bodyStyles = await page.evaluate(() => {
            const body = document.body;
            const computedStyle = window.getComputedStyle(body);
            return {
                paddingTop: computedStyle.paddingTop,
                marginTop: computedStyle.marginTop
            };
        });
        
        console.log('\n📋 Стили body:');
        console.log(`   Padding-top: ${bodyStyles.paddingTop}`);
        console.log(`   Margin-top: ${bodyStyles.marginTop}`);
        
        // Делаем скриншот
        await page.screenshot({ path: 'banner_check.png', fullPage: true });
        console.log('\n📸 Скриншот сохранен как banner_check.png');
        
        console.log('\n✅ Проверка завершена!');
        
    } catch (error) {
        console.error('Ошибка:', error.message);
    } finally {
        await browser.close();
    }
}

checkAggressiveBanner().catch(console.error);




