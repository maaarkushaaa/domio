// js/aggressive-api-interceptor.js
// Агрессивный перехватчик API запросов

console.log('[AGGRESSIVE-API-INTERCEPTOR] Starting...');

// Перехватываем fetch ДО того как он будет использован
const originalFetch = window.fetch;

window.fetch = async function(input, init) {
    const url = (typeof input === 'string') ? input : (input && input.url) || '';
    
    console.log('[AGGRESSIVE-API-INTERCEPTOR] Fetch request:', url);
    
    // Перехватываем запросы к condor.pickawood.com
    if (url.includes('condor.pickawood.com/configuration')) {
        console.log('[AGGRESSIVE-API-INTERCEPTOR] 🎯 INTERCEPTING condor request:', url);
        
        try {
            // Загружаем локальную конфигурацию
            const response = await originalFetch('/wardrobe_config_rubles.json', {
                method: 'GET',
                credentials: 'same-origin'
            });
            
            if (response.ok) {
                const config = await response.json();
                console.log('[AGGRESSIVE-API-INTERCEPTOR] ✅ Returning local wardrobe config');
                
                // Создаем новый Response с локальными данными
                return new Response(JSON.stringify(config), {
                    status: 200,
                    statusText: 'OK',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                    }
                });
            } else {
                console.error('[AGGRESSIVE-API-INTERCEPTOR] Failed to load local config:', response.status);
            }
        } catch (error) {
            console.error('[AGGRESSIVE-API-INTERCEPTOR] Error loading local config:', error);
        }
    }
    
    // Для всех остальных запросов используем оригинальный fetch
    return originalFetch(input, init);
};

// Также перехватываем XMLHttpRequest
const originalXHR = window.XMLHttpRequest;

window.XMLHttpRequest = function() {
    const xhr = new originalXHR();
    const originalOpen = xhr.open;
    const originalSend = xhr.send;
    
    xhr.open = function(method, url, ...args) {
        this._method = method;
        this._url = url;
        console.log('[AGGRESSIVE-API-INTERCEPTOR] XHR open:', method, url);
        return originalOpen.apply(this, [method, url, ...args]);
    };
    
    xhr.send = function(body) {
        // Перехватываем запросы к condor.pickawood.com
        if (this._url && this._url.includes('condor.pickawood.com/configuration')) {
            console.log('[AGGRESSIVE-API-INTERCEPTOR] 🎯 INTERCEPTING XHR condor request:', this._url);
            
            // Загружаем локальную конфигурацию
            originalFetch('/wardrobe_config_rubles.json', {
                method: 'GET',
                credentials: 'same-origin'
            })
            .then(response => response.json())
            .then(config => {
                console.log('[AGGRESSIVE-API-INTERCEPTOR] ✅ Returning local wardrobe config via XHR');
                
                // Симулируем успешный ответ
                Object.defineProperty(this, 'readyState', { value: 4, writable: false });
                Object.defineProperty(this, 'status', { value: 200, writable: false });
                Object.defineProperty(this, 'statusText', { value: 'OK', writable: false });
                Object.defineProperty(this, 'responseText', { value: JSON.stringify(config), writable: false });
                Object.defineProperty(this, 'response', { value: JSON.stringify(config), writable: false });
                
                // Вызываем обработчики
                if (this.onreadystatechange) this.onreadystatechange();
                if (this.onload) this.onload();
            })
            .catch(error => {
                console.error('[AGGRESSIVE-API-INTERCEPTOR] Error loading local config for XHR:', error);
                // Fallback к оригинальному запросу
                return originalSend.apply(this, arguments);
            });
            
            return;
        }
        
        return originalSend.apply(this, arguments);
    };
    
    return xhr;
};

console.log('[AGGRESSIVE-API-INTERCEPTOR] Ready - intercepting condor.pickawood.com requests');
