const puppeteer = require('puppeteer');

async function checkBannerStatus() {
    console.log('=== Проверка статуса баннера ===');
    
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Перехватываем консольные сообщения
        page.on('console', msg => {
            if (msg.text().includes('FIX-BANNER-DATES') || msg.text().includes('banner')) {
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
        
        // Проверяем bannerInfoBar
        const bannerInfo = await page.evaluate(() => {
            return {
                bannerInfoBar: window.bannerInfoBar,
                bannerVoucher: window.bannerVoucher,
                bannerElements: document.querySelectorAll('[class*="banner"]').length,
                banner725: document.querySelector('.banner-725') ? 'found' : 'not found'
            };
        });
        
        console.log('\n📋 Данные баннера:');
        console.log('   BannerInfoBar:', bannerInfo.bannerInfoBar ? 'найден' : 'не найден');
        console.log('   BannerVoucher:', bannerInfo.bannerVoucher ? 'найден' : 'не найден');
        console.log('   Banner элементов:', bannerInfo.bannerElements);
        console.log('   Banner-725:', bannerInfo.banner725);
        
        if (bannerInfo.bannerInfoBar) {
            console.log('   Текст:', bannerInfo.bannerInfoBar.text);
            console.log('   Даты:', bannerInfo.bannerInfoBar.date);
        }
        
        // Проверяем все баннеры
        const allBanners = await page.evaluate(() => {
            const banners = document.querySelectorAll('[class*="banner"]');
            const results = [];
            
            banners.forEach((banner, index) => {
                const computedStyle = window.getComputedStyle(banner);
                results.push({
                    index: index + 1,
                    className: banner.className,
                    text: banner.textContent.trim().substring(0, 100),
                    visible: banner.offsetParent !== null,
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    opacity: computedStyle.opacity
                });
            });
            
            return results;
        });
        
        console.log('\n📋 Все найденные баннеры:');
        if (allBanners.length > 0) {
            allBanners.forEach(banner => {
                console.log(`   ${banner.index}. Класс: ${banner.className}`);
                console.log(`      Видимый: ${banner.visible}`);
                console.log(`      Display: ${banner.display}`);
                console.log(`      Visibility: ${banner.visibility}`);
                console.log(`      Opacity: ${banner.opacity}`);
                console.log(`      Текст: ${banner.text}`);
                console.log('');
            });
        } else {
            console.log('   ❌ Баннеры не найдены');
        }
        
        // Делаем скриншот
        await page.screenshot({ path: 'banner_status_check.png', fullPage: true });
        console.log('\n📸 Скриншот сохранен как banner_status_check.png');
        
        console.log('\n✅ Проверка завершена!');
        
    } catch (error) {
        console.error('Ошибка:', error.message);
    } finally {
        await browser.close();
    }
}

checkBannerStatus().catch(console.error);




