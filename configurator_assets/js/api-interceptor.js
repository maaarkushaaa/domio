// js/api-interceptor.js
// Перехват API запросов к конфигурации и замена на локальные данные

(() => {
  const LOG_TAG = "[API-INTERCEPTOR]";
  const log = (...a) => console.debug(LOG_TAG, ...a);
  const err = (...a) => console.error(LOG_TAG, ...a);

  log("Starting API interception...");

  // Перехватываем fetch
  const originalFetch = window.fetch?.bind(window);
  if (originalFetch) {
    window.fetch = async (input, init) => {
      try {
        let url = typeof input === "string" ? input : (input && input.url) || "";
        const method = (init && init.method) || (typeof input !== "string" && input && input.method) || "GET";

        log("Fetch request:", method, url);

        // Перехватываем запросы к конфигурации
        if (url.includes('condor.pickawood.com/configuration') || 
            url.includes('pickawood.com/api/configuration') ||
            url.includes('/configuration/')) {
          
          log("Intercepting configuration request:", url);
          
          try {
            // Пытаемся загрузить локальный файл конфигурации
            const localConfigResponse = await originalFetch('/wardrobe_config_rubles — русс.json', {
              method: 'GET',
              credentials: 'same-origin'
            });
            
            if (localConfigResponse.ok) {
              const localConfig = await localConfigResponse.json();
              log("Returning local configuration");
              
              // Создаем новый ответ с локальными данными
              return new Response(JSON.stringify(localConfig), {
                status: 200,
                statusText: 'OK',
                headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                  'Access-Control-Allow-Origin': '*'
                }
              });
            }
          } catch (e) {
            log("Failed to load local config:", e);
          }
        }

        // Перехватываем запросы к переводам
        if (url.includes('/translations') || url.includes('/i18n') || url.includes('/locales')) {
          log("Intercepting translations request:", url);
          
          try {
            const localTranslationsResponse = await originalFetch('/ru-RU.json', {
              method: 'GET',
              credentials: 'same-origin'
            });
            
            if (localTranslationsResponse.ok) {
              const localTranslations = await localTranslationsResponse.json();
              log("Returning local translations");
              
              return new Response(JSON.stringify(localTranslations), {
                status: 200,
                statusText: 'OK',
                headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                  'Access-Control-Allow-Origin': '*'
                }
              });
            }
          } catch (e) {
            log("Failed to load local translations:", e);
          }
        }

        // Перехватываем запросы к config_data
        if (url.includes('/config_data') || url.includes('/config_data.json')) {
          log("Intercepting config_data request:", url);
          
          try {
            const localConfigDataResponse = await originalFetch('/config_data_wardrobe_local.json', {
              method: 'GET',
              credentials: 'same-origin'
            });
            
            if (localConfigDataResponse.ok) {
              const localConfigData = await localConfigDataResponse.json();
              log("Returning local config_data");
              
              return new Response(JSON.stringify(localConfigData), {
                status: 200,
                statusText: 'OK',
                headers: {
                  'Content-Type': 'application/json; charset=utf-8',
                  'Access-Control-Allow-Origin': '*'
                }
              });
            }
          } catch (e) {
            log("Failed to load local config_data:", e);
          }
        }

        // Для всех остальных запросов используем оригинальный fetch
        return await originalFetch(input, init);
      } catch (e) {
        err("Fetch interception error:", e);
        return originalFetch(input, init);
      }
    };
  }

  // Перехватываем XMLHttpRequest
  const originalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = function() {
    const xhr = new originalXHR();
    const originalOpen = xhr.open;
    const originalSend = xhr.send;

    xhr.open = function(method, url) {
      this._method = method;
      this._url = url;
      log("XHR open:", method, url);
      return originalOpen.apply(this, arguments);
    };

    xhr.send = function(data) {
      if (this._url && (
        this._url.includes('condor.pickawood.com/configuration') ||
        this._url.includes('pickawood.com/api/configuration') ||
        this._url.includes('/configuration/') ||
        this._url.includes('/translations') ||
        this._url.includes('/i18n') ||
        this._url.includes('/locales') ||
        this._url.includes('/config_data')
      )) {
        log("Intercepting XHR request:", this._method, this._url);
        
        const originalOnReadyStateChange = this.onreadystatechange;
        this.onreadystatechange = function() {
          if (this.readyState === 4) {
            // Заменяем ответ на локальные данные
            let localData = null;
            
            if (this._url.includes('condor.pickawood.com/configuration') || 
                this._url.includes('pickawood.com/api/configuration') ||
                this._url.includes('/configuration/')) {
              
              // Загружаем локальную конфигурацию
              fetch('/wardrobe_config_rubles — русс.json')
                .then(response => response.json())
                .then(data => {
                  localData = data;
                  this.status = 200;
                  this.statusText = 'OK';
                  this.responseText = JSON.stringify(localData);
                  this.response = JSON.stringify(localData);
                  
                  if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                  }
                })
                .catch(e => {
                  log("Failed to load local config for XHR:", e);
                  if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                  }
                });
              return;
            }
            
            if (this._url.includes('/translations') || 
                this._url.includes('/i18n') || 
                this._url.includes('/locales')) {
              
              // Загружаем локальные переводы
              fetch('/ru-RU.json')
                .then(response => response.json())
                .then(data => {
                  localData = data;
                  this.status = 200;
                  this.statusText = 'OK';
                  this.responseText = JSON.stringify(localData);
                  this.response = JSON.stringify(localData);
                  
                  if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                  }
                })
                .catch(e => {
                  log("Failed to load local translations for XHR:", e);
                  if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                  }
                });
              return;
            }
            
            if (this._url.includes('/config_data')) {
              // Загружаем локальные config_data
              fetch('/config_data_wardrobe_local.json')
                .then(response => response.json())
                .then(data => {
                  localData = data;
                  this.status = 200;
                  this.statusText = 'OK';
                  this.responseText = JSON.stringify(localData);
                  this.response = JSON.stringify(localData);
                  
                  if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                  }
                })
                .catch(e => {
                  log("Failed to load local config_data for XHR:", e);
                  if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(this, arguments);
                  }
                });
              return;
            }
          }
          
          if (originalOnReadyStateChange) {
            originalOnReadyStateChange.apply(this, arguments);
          }
        };
      }
      
      return originalSend.apply(this, arguments);
    };

    return xhr;
  };

  log("API interception setup complete");
})();
