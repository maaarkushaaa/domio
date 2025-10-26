const puppeteer = require('puppeteer');

async function checkLogo() {
    console.log('=== Проверка логотипа DOMIO ===');
    
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
        await page.waitForTimeout(3000);
        
        // Проверяем логотип в заголовке
        const headerLogo = await page.evaluate(() => {
            const logo = document.querySelector('.logo img');
            if (logo) {
                return {
                    src: logo.src,
                    alt: logo.alt,
                    width: logo.width,
                    height: logo.height
                };
            }
            return null;
        });
        
        console.log('\n📋 Логотип в заголовке:');
        if (headerLogo) {
            console.log(`   Src: ${headerLogo.src}`);
            console.log(`   Alt: ${headerLogo.alt}`);
            console.log(`   Размер: ${headerLogo.width}x${headerLogo.height}`);
        } else {
            console.log('   ❌ Логотип не найден');
        }
        
        // Проверяем логотип в футере конфигуратора
        const footerLogo = await page.evaluate(() => {
            const logo = document.querySelector('.configurator-footer .logo img');
            if (logo) {
                return {
                    src: logo.src,
                    alt: logo.alt
                };
            }
            return null;
        });
        
        console.log('\n📋 Логотип в футере:');
        if (footerLogo) {
            console.log(`   Src: ${footerLogo.src}`);
            console.log(`   Alt: ${footerLogo.alt}`);
        } else {
            console.log('   ❌ Логотип не найден');
        }
        
        // Проверяем метаданные
        const metadata = await page.evaluate(() => {
            return {
                title: document.title,
                appName: document.querySelector('meta[name="application-name"]')?.content,
                appleAppName: document.querySelector('meta[name="apple-mobile-web-app-title"]')?.content
            };
        });
        
        console.log('\n📋 Метаданные:');
        console.log(`   Title: ${metadata.title}`);
        console.log(`   App Name: ${metadata.appName}`);
        console.log(`   Apple App Name: ${metadata.appleAppName}`);
        
        // Проверяем JSON-LD
        const jsonLd = await page.evaluate(() => {
            const script = document.querySelector('script[type="application/ld+json"]');
            if (script) {
                try {
                    const data = JSON.parse(script.textContent);
                    const store = data['@graph']?.find(item => item['@type'] === 'FurnitureStore');
                    if (store) {
                        return {
                            name: store.name,
                            legalName: store.legalName,
                            logo: store.logo,
                            brand: store.brand?.name,
                            priceRange: store.priceRange
                        };
                    }
                } catch (e) {
                    console.error('Ошибка парсинга JSON-LD:', e);
                }
            }
            return null;
        });
        
        console.log('\n📋 JSON-LD данные:');
        if (jsonLd) {
            console.log(`   Name: ${jsonLd.name}`);
            console.log(`   Legal Name: ${jsonLd.legalName}`);
            console.log(`   Logo: ${jsonLd.logo}`);
            console.log(`   Brand: ${jsonLd.brand}`);
            console.log(`   Price Range: ${jsonLd.priceRange}`);
        } else {
            console.log('   ❌ JSON-LD данные не найдены');
        }
        
        console.log('\n✅ Проверка завершена!');
        
    } catch (error) {
        console.error('Ошибка:', error.message);
    } finally {
        await browser.close();
    }
}

checkLogo().catch(console.error);




