const puppeteer = require('puppeteer');

async function checkSpecialOfferBlock() {
    console.log('=== Проверка информативного блока о специальном предложении ===');
    
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        console.log('Загрузка страницы...');
        await page.goto('http://localhost:8000/configurator_2508f3617e1046cba5b985f3a7ea393a_page.html', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        
        // Ждем загрузки
        await page.waitForTimeout(5000);
        
        // Проверяем наличие bannerInfoBar
        const bannerInfoBar = await page.evaluate(() => {
            return window.bannerInfoBar ? {
                text: window.bannerInfoBar.text,
                responsive_text: window.bannerInfoBar.responsive_text,
                background_color: window.bannerInfoBar.background_color,
                voucher_code: window.bannerInfoBar.voucher?.code
            } : null;
        });
        
        console.log('\n📋 Banner Info Bar:');
        if (bannerInfoBar) {
            console.log(`   Текст: ${bannerInfoBar.text}`);
            console.log(`   Responsive текст: ${bannerInfoBar.responsive_text}`);
            console.log(`   Цвет фона: ${bannerInfoBar.background_color}`);
            console.log(`   Код ваучера: ${bannerInfoBar.voucher_code}`);
        } else {
            console.log('   ❌ Banner Info Bar не найден');
        }
        
        // Проверяем наличие bannerVoucher
        const bannerVoucher = await page.evaluate(() => {
            return window.bannerVoucher ? {
                code: window.bannerVoucher.code,
                subtitle: window.bannerVoucher.subtitle,
                sales_count: window.bannerVoucher.sales?.length,
                first_sale: window.bannerVoucher.sales?.[0]
            } : null;
        });
        
        console.log('\n📋 Banner Voucher:');
        if (bannerVoucher) {
            console.log(`   Код: ${bannerVoucher.code}`);
            console.log(`   Подзаголовок: ${bannerVoucher.subtitle}`);
            console.log(`   Количество скидок: ${bannerVoucher.sales_count}`);
            if (bannerVoucher.first_sale) {
                console.log(`   Первая скидка: ${bannerVoucher.first_sale.discount} от ${bannerVoucher.first_sale.minimal_limit}`);
            }
        } else {
            console.log('   ❌ Banner Voucher не найден');
        }
        
        // Проверяем наличие информативного блока в DOM
        const infoBlock = await page.evaluate(() => {
            const block = document.querySelector('.banner-info-bar') || 
                         document.querySelector('.info-bar') ||
                         document.querySelector('[class*="banner"]') ||
                         document.querySelector('[class*="voucher"]');
            
            if (block) {
                return {
                    found: true,
                    text: block.textContent.trim().substring(0, 200),
                    visible: block.offsetParent !== null,
                    className: block.className
                };
            }
            return { found: false };
        });
        
        console.log('\n📋 Информативный блок в DOM:');
        if (infoBlock.found) {
            console.log(`   ✅ Блок найден!`);
            console.log(`   Видимый: ${infoBlock.visible}`);
            console.log(`   Класс: ${infoBlock.className}`);
            console.log(`   Текст: ${infoBlock.text}`);
        } else {
            console.log('   ❌ Информативный блок не найден в DOM');
        }
        
        // Проверяем валютные символы
        const currencyInfo = await page.evaluate(() => {
            return {
                currency_symbol: window.currency_symbol,
                currency_shortcut_shop: window.currency_shortcut_shop,
                exchange_rate: window.exchange_rate
            };
        });
        
        console.log('\n📋 Валютная информация:');
        console.log(`   Символ валюты: ${currencyInfo.currency_symbol}`);
        console.log(`   Валюта магазина: ${currencyInfo.currency_shortcut_shop}`);
        console.log(`   Курс обмена: ${currencyInfo.exchange_rate}`);
        
        console.log('\n✅ Проверка завершена!');
        
    } catch (error) {
        console.error('Ошибка:', error.message);
    } finally {
        await browser.close();
    }
}

checkSpecialOfferBlock().catch(console.error);




