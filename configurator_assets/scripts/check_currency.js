const puppeteer = require('puppeteer');

async function checkCurrency() {
    console.log('=== Currency Check ===');
    
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Перехватываем консольные сообщения
        page.on('console', msg => {
            if (msg.text().includes('₽') || msg.text().includes('=C2=A3')) {
                console.log('Console:', msg.text());
            }
        });
        
        console.log('Loading page...');
        await page.goto('http://localhost:8000/configurator_2508f3617e1046cba5b985f3a7ea393a_page.html', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        
        // Ждем загрузки конфигуратора
        await page.waitForTimeout(5000);
        
        // Проверяем наличие символа рубля в DOM
        const rubleElements = await page.evaluate(() => {
            const elements = [];
            const allElements = document.querySelectorAll('*');
            
            allElements.forEach(el => {
                if (el.textContent && el.textContent.includes('₽')) {
                    elements.push({
                        tag: el.tagName,
                        text: el.textContent.trim().substring(0, 100),
                        className: el.className
                    });
                }
            });
            
            return elements;
        });
        
        console.log(`Found ${rubleElements.length} elements with ₽ symbol:`);
        rubleElements.forEach((el, i) => {
            console.log(`${i + 1}. ${el.tag} (${el.className}): ${el.text}`);
        });
        
        // Проверяем наличие закодированных символов
        const encodedElements = await page.evaluate(() => {
            const elements = [];
            const allElements = document.querySelectorAll('*');
            
            allElements.forEach(el => {
                if (el.textContent && el.textContent.includes('=C2=A3')) {
                    elements.push({
                        tag: el.tagName,
                        text: el.textContent.trim().substring(0, 100),
                        className: el.className
                    });
                }
            });
            
            return elements;
        });
        
        if (encodedElements.length > 0) {
            console.log(`\n⚠️  Found ${encodedElements.length} elements with encoded =C2=A3:`);
            encodedElements.forEach((el, i) => {
                console.log(`${i + 1}. ${el.tag} (${el.className}): ${el.text}`);
            });
        } else {
            console.log('\n✅ No encoded =C2=A3 symbols found');
        }
        
        // Проверяем window.conf2config
        const config = await page.evaluate(() => {
            return window.conf2config ? {
                currencyShortcut: window.conf2config.settings?.currencyShortcut,
                locale: window.conf2config.settings?.locale,
                countryId: window.conf2config.settings?.countryId
            } : null;
        });
        
        console.log('\n=== Window Config ===');
        if (config) {
            console.log(`Currency: ${config.currencyShortcut}`);
            console.log(`Locale: ${config.locale}`);
            console.log(`Country: ${config.countryId}`);
        } else {
            console.log('No window.conf2config found');
        }
        
        // Проверяем bootstrap флаги
        const flags = await page.evaluate(() => {
            return {
                configOverridden: window.__CONFIG_DATA_OVERRIDDEN__,
                ruBootstrap: window.__RU_BOOTSTRAP_OK__,
                logs: window.__RU_BOOTSTRAP_LOGS__ || []
            };
        });
        
        console.log('\n=== Bootstrap Flags ===');
        console.log(`Config Overridden: ${flags.configOverridden}`);
        console.log(`RU Bootstrap: ${flags.ruBootstrap}`);
        console.log(`Logs: ${flags.logs.length} entries`);
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await browser.close();
    }
}

checkCurrency().catch(console.error);




