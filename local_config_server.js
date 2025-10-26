// local_config_server.js - Локальный сервер конфигурации
console.log('[LOCAL-CONFIG-SERVER] Starting...');

let localConfig = null;

async function loadLocalConfig() {
    if (!localConfig) {
        try {
            const response = await fetch('/wardrobe_config_rubles.json'); // Используем файл с рублями
            if (!response.ok) {
                console.error('[LOCAL-CONFIG-SERVER] Failed to load config:', response.status);
                return null;
            }
            localConfig = await response.json();
            console.log('[LOCAL-CONFIG-SERVER] Local config loaded:', localConfig.type);
            console.log('[LOCAL-CONFIG-SERVER] Settings sections:', Object.keys(localConfig.settings || {}).length);
            console.log('[LOCAL-CONFIG-SERVER] Translations:', Object.keys(localConfig.translations || {}).length);
        } catch (e) {
            console.error('[LOCAL-CONFIG-SERVER] Error loading config:', e);
            return null;
        }
    }
    return localConfig;
}


// Перехватываем fetch для возврата локальной конфигурации
const originalFetch = window.fetch;
window.fetch = async function(input, init) {
    const url = (typeof input === 'string') ? input : (input && input.url) || '';
    
    // Если это запрос к API конфигурации wardrobe
    if (url.includes('condor.pickawood.com/configuration/1000001/en/GB')) {
        console.log('[LOCAL-CONFIG-SERVER] Intercepting config request:', url);
        
        const config = await loadLocalConfig();
        if (config) {
            console.log('[LOCAL-CONFIG-SERVER] Returning local wardrobe configuration');
            
            return new Response(JSON.stringify(config), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            });
        }
    }
    
    // Для всех остальных запросов используем оригинальный fetch
    return originalFetch(input, init);
};

// Перехватываем XMLHttpRequest
const originalXHR = window.XMLHttpRequest;
window.XMLHttpRequest = function() {
    const xhr = new originalXHR();
    const originalOpen = xhr.open;
    
    xhr.open = function(method, url, ...args) {
        this._url = url;
        return originalOpen.apply(this, [method, url, ...args]);
    };
    
    const originalSend = xhr.send;
    xhr.send = function(body) {
        // Если это запрос к API конфигурации wardrobe
        if (this._url && this._url.includes('condor.pickawood.com/configuration/1000001/en/GB')) {
            console.log('[LOCAL-CONFIG-SERVER] Intercepting XHR wardrobe config request:', this._url);
            
            loadLocalConfig().then(config => {
                if (config) {
                    console.log('[LOCAL-CONFIG-SERVER] Returning local wardrobe configuration via XHR');
                    
                    // Симулируем успешный ответ
                    Object.defineProperty(this, 'readyState', { value: 4, writable: false });
                    Object.defineProperty(this, 'status', { value: 200, writable: false });
                    Object.defineProperty(this, 'responseText', { value: JSON.stringify(config), writable: false });
                    Object.defineProperty(this, 'response', { value: JSON.stringify(config), writable: false });
                    
                    // Вызываем обработчики
                    if (this.onreadystatechange) this.onreadystatechange();
                    if (this.onload) this.onload();
                }
            });
            
            return;
        }
        
        return originalSend.apply(this, arguments);
    };
    
    return xhr;
};

console.log('[LOCAL-CONFIG-SERVER] Local config server ready');
