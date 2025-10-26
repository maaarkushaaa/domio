// scripts/check_configurator.js
const http = require('http');

function checkConfigurator() {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:8080/configurator_2508f3617e1046cba5b985f3a7ea393a_page.html', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Check for inline script
                const hasInlineScript = data.includes('RU BOOTSTRAP INLINE');
                const hasVueOverride = data.includes('setupVueI18nOverride');
                const hasDOMReplacement = data.includes('replaceTranslationKeysInDOM');
                
                // Check for removed conflicting script
                const hasConflictingScript = data.includes('ru-bootstrap-dom-replace.js');
                
                console.log('=== Configurator Check ===');
                console.log('Status:', res.statusCode);
                console.log('Has Inline Script:', hasInlineScript);
                console.log('Has Vue Override:', hasVueOverride);
                console.log('Has DOM Replacement:', hasDOMReplacement);
                console.log('Has Conflicting Script:', hasConflictingScript);
                console.log('Content Length:', data.length);
                
                if (hasInlineScript && hasVueOverride && hasDOMReplacement && !hasConflictingScript) {
                    console.log('✅ All improvements applied successfully');
                    resolve(true);
                } else {
                    console.log('❌ Some improvements missing');
                    resolve(false);
                }
            });
        });
        
        req.on('error', (err) => {
            console.error('Request failed:', err.message);
            reject(err);
        });
        
        req.setTimeout(10000, () => {
            console.error('Request timeout');
            reject(new Error('Timeout'));
        });
    });
}

async function runCheck() {
    try {
        await checkConfigurator();
        console.log('\n🎉 Configurator is ready for testing!');
        console.log('Open: http://localhost:8080/configurator_2508f3617e1046cba5b985f3a7ea393a_page.html');
        console.log('Check browser console for bootstrap logs and translation activity.');
    } catch (err) {
        console.error('Check failed:', err.message);
    }
}

runCheck();




