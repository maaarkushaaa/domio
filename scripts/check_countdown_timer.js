const puppeteer = require('puppeteer');

async function checkCountdownTimer() {
    console.log('=== Проверка таймера обратного отсчета ===');
    
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Перехватываем консольные сообщения
        page.on('console', msg => {
            if (msg.text().includes('ADD-COUNTDOWN-TIMER') || msg.text().includes('countdown')) {
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
        
        // Проверяем наличие таймера
        const countdownInfo = await page.evaluate(() => {
            const countdownTimer = document.querySelector('.simple-countdown-timer') || 
                                  document.querySelector('.countdown-timer');
            if (countdownTimer) {
                const computedStyle = window.getComputedStyle(countdownTimer);
                return {
                    found: true,
                    visible: countdownTimer.offsetParent !== null,
                    display: computedStyle.display,
                    text: countdownTimer.textContent.trim(),
                    days: countdownTimer.querySelector('.countdown-days')?.textContent,
                    hours: countdownTimer.querySelector('.countdown-hours')?.textContent,
                    minutes: countdownTimer.querySelector('.countdown-minutes')?.textContent,
                    seconds: countdownTimer.querySelector('.countdown-seconds')?.textContent
                };
            }
            return { found: false };
        });
        
        console.log('\n📋 Таймер обратного отсчета:');
        if (countdownInfo.found) {
            console.log(`   ✅ Найден!`);
            console.log(`   Видимый: ${countdownInfo.visible}`);
            console.log(`   Display: ${countdownInfo.display}`);
            console.log(`   Текст: ${countdownInfo.text}`);
            console.log(`   Дни: ${countdownInfo.days}`);
            console.log(`   Часы: ${countdownInfo.hours}`);
            console.log(`   Минуты: ${countdownInfo.minutes}`);
            console.log(`   Секунды: ${countdownInfo.seconds}`);
        } else {
            console.log('   ❌ Таймер не найден');
        }
        
        // Проверяем футер конфигуратора
        const footerInfo = await page.evaluate(() => {
            const footer = document.querySelector('.configurator-footer') ||
                          document.querySelector('[class*="footer"]') ||
                          document.querySelector('[class*="cart"]') ||
                          document.querySelector('[class*="price"]');
            
            if (footer) {
                return {
                    found: true,
                    className: footer.className,
                    text: footer.textContent.trim().substring(0, 200),
                    visible: footer.offsetParent !== null
                };
            }
            return { found: false };
        });
        
        console.log('\n📋 Футер конфигуратора:');
        if (footerInfo.found) {
            console.log(`   ✅ Найден!`);
            console.log(`   Класс: ${footerInfo.className}`);
            console.log(`   Видимый: ${footerInfo.visible}`);
            console.log(`   Текст: ${footerInfo.text}`);
        } else {
            console.log('   ❌ Футер не найден');
        }
        
        // Делаем скриншот
        await page.screenshot({ path: 'countdown_check.png', fullPage: true });
        console.log('\n📸 Скриншот сохранен как countdown_check.png');
        
        console.log('\n✅ Проверка завершена!');
        
    } catch (error) {
        console.error('Ошибка:', error.message);
    } finally {
        await browser.close();
    }
}

checkCountdownTimer().catch(console.error);
