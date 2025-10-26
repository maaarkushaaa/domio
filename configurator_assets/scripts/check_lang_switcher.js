const puppeteer = require('puppeteer');

async function checkLanguageSwitcher() {
    console.log('=== Проверка удаления переключателя языка ===');
    
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
        
        // Проверяем наличие переключателя языка
        const langSwitcher = await page.evaluate(() => {
            const switcher = document.querySelector('.lang-switcher');
            if (switcher) {
                return {
                    found: true,
                    visible: switcher.offsetParent !== null,
                    text: switcher.textContent.trim().substring(0, 100)
                };
            }
            return { found: false };
        });
        
        console.log('\n📋 Переключатель языка:');
        if (langSwitcher.found) {
            console.log('   ❌ Переключатель языка найден!');
            console.log(`   Видимый: ${langSwitcher.visible}`);
            console.log(`   Текст: ${langSwitcher.text}`);
        } else {
            console.log('   ✅ Переключатель языка удален!');
        }
        
        // Проверяем наличие ссылок на альтернативные языки
        const altLinks = await page.evaluate(() => {
            const links = document.querySelectorAll('link[hreflang]');
            return Array.from(links).map(link => ({
                hreflang: link.getAttribute('hreflang'),
                href: link.getAttribute('href')
            }));
        });
        
        console.log('\n📋 Ссылки на альтернативные языки:');
        if (altLinks.length > 0) {
            console.log(`   ❌ Найдено ${altLinks.length} ссылок:`);
            altLinks.forEach(link => {
                console.log(`     ${link.hreflang}: ${link.href}`);
            });
        } else {
            console.log('   ✅ Ссылки на альтернативные языки удалены!');
        }
        
        // Проверяем заголовок страницы
        const title = await page.evaluate(() => {
            return document.title;
        });
        
        console.log('\n📋 Заголовок страницы:');
        console.log(`   ${title}`);
        
        // Проверяем мета-теги
        const metaTags = await page.evaluate(() => {
            const appName = document.querySelector('meta[name="application-name"]')?.content;
            const appleAppName = document.querySelector('meta[name="apple-mobile-web-app-title"]')?.content;
            return { appName, appleAppName };
        });
        
        console.log('\n📋 Мета-теги:');
        console.log(`   Application Name: ${metaTags.appName}`);
        console.log(`   Apple App Name: ${metaTags.appleAppName}`);
        
        console.log('\n✅ Проверка завершена!');
        
    } catch (error) {
        console.error('Ошибка:', error.message);
    } finally {
        await browser.close();
    }
}

checkLanguageSwitcher().catch(console.error);




