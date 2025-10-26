// scripts/simple_test.js
const http = require('http');
const fs = require('fs');

function testServer() {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:8080/configurator_2508f3617e1046cba5b985f3a7ea393a_page.html', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                // Check if inline script is present
                const hasInlineScript = data.includes('RU BOOTSTRAP INLINE');
                const hasBootstrapCode = data.includes('window.__RU_BOOTSTRAP_OK__');
                
                console.log('Server Response Status:', res.statusCode);
                console.log('Has Inline Script:', hasInlineScript);
                console.log('Has Bootstrap Code:', hasBootstrapCode);
                console.log('Content Length:', data.length);
                
                if (hasInlineScript && hasBootstrapCode) {
                    console.log('✅ Inline override script is present in HTML');
                    resolve(true);
                } else {
                    console.log('❌ Inline override script is missing');
                    resolve(false);
                }
            });
        });
        
        req.on('error', (err) => {
            console.error('Request failed:', err.message);
            reject(err);
        });
        
        req.setTimeout(5000, () => {
            console.error('Request timeout');
            reject(new Error('Timeout'));
        });
    });
}

async function testLocalConfig() {
    try {
        const configPath = './config_data_ru_local.json';
        if (fs.existsSync(configPath)) {
            const data = JSON.parse(fs.readFileSync(configPath, 'utf8'));
            console.log('✅ Local config file exists');
            console.log('Translations keys:', Object.keys(data.translations || {}).length);
            console.log('Locale:', data.locale);
            console.log('Country ID:', data.countryId);
            return true;
        } else {
            console.log('❌ Local config file missing');
            return false;
        }
    } catch (err) {
        console.error('❌ Error reading local config:', err.message);
        return false;
    }
}

async function runTests() {
    console.log('=== Configurator Override Test ===\n');
    
    // Test 1: Local config file
    console.log('1. Testing local config file...');
    const configOk = await testLocalConfig();
    console.log('');
    
    // Test 2: Server response
    console.log('2. Testing server response...');
    const serverOk = await testServer();
    console.log('');
    
    // Summary
    console.log('=== Test Summary ===');
    console.log('Local Config:', configOk ? '✅ PASS' : '❌ FAIL');
    console.log('Server Response:', serverOk ? '✅ PASS' : '❌ FAIL');
    console.log('Overall:', (configOk && serverOk) ? '✅ SUCCESS' : '❌ FAILED');
    
    if (configOk && serverOk) {
        console.log('\n🎉 Override setup appears to be working!');
        console.log('You can now open http://localhost:8080/configurator_2508f3617e1046cba5b985f3a7ea393a_page.html in your browser');
        console.log('and check the browser console for bootstrap logs.');
    } else {
        console.log('\n⚠️  Some tests failed. Check the output above for details.');
    }
}

runTests().catch(console.error);




