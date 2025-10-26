// js/ru-bootstrap.js
// Безопасная русификация поверх прод-сборки: RU дефолт, мягкие переводы, без правок ядра и цен.
// ВАРИАНТ 1: Раннее перехватывание window.conf2config

(() => {
  const LOG_TAG = "[RU-BOOTSTRAP]";
  const log  = (...a) => console.debug(LOG_TAG, ...a);
  const err  = (...a) => console.error(LOG_TAG, ...a);

  // ---------- 0) PREFLIGHT: проверяем, что запущены СТРОГО как требуется ----------
  try {
    const mustRoot = /\/configurator_assets(\/|$)/;
    const mustPage = /configurator_2508f3617e1046cba5b985f3a7ea393a_page\.html$/;
    const okRoot = mustRoot.test(location.pathname) || mustRoot.test(location.href);
    const okPage = mustPage.test(location.pathname) || mustPage.test(location.href);
    if (!okRoot || !okPage) {
      err("НЕВЕРНЫЙ КОНТЕКСТ ЗАПУСКА.",
          "Нужно: root=http(s)://…/configurator_assets/,",
          "страница=configurator_…_page.html");
      // Ничего не делаем, чтобы не сломать загрузку в другом месте
      return;
    }
  } catch (e) {
    err("Preflight провален:", e);
    return;
  }

  // ---------- 1) РАННЕЕ ПЕРЕХВАТЫВАНИЕ window.conf2config ----------
  log("Setting up early conf2config interception...");
  
  // Сохраняем оригинальный conf2config если он уже существует
  const originalConf2Config = window.conf2config;
  
  // Создаем геттер для перехватывания conf2config
  Object.defineProperty(window, 'conf2config', {
    get: function() {
      log("conf2config accessed, applying RU overrides...");
      
      // Берем оригинальную конфигурацию или создаем базовую
      const baseConfig = originalConf2Config || {
        productId: 1000001,
        countryId: 16,
        locale: "en",
        type: "wardrobe",
        configurationId: "2508f3617e1046cba5b985f3a7ea393a"
      };
      
      // Применяем русские настройки
      const ruConfig = {
        ...baseConfig,
        locale: "ru",
        countryId: 643, // RU
        configurationUrl: baseConfig.configurationUrl?.replace('/en/', '/ru/') || baseConfig.configurationUrl,
        configUrl: baseConfig.configUrl?.replace('/en/', '/ru/') || baseConfig.configUrl,
        configurationSaveUrl: baseConfig.configurationSaveUrl?.replace('/en/', '/ru/') || baseConfig.configurationSaveUrl,
        configurationCartUrl: baseConfig.configurationCartUrl?.replace('/en/', '/ru/') || baseConfig.configurationCartUrl,
        cartUrl: baseConfig.cartUrl?.replace('/en/', '/ru/') || baseConfig.cartUrl,
        configurationLoadUrl: baseConfig.configurationLoadUrl?.replace('/en/', '/ru/') || baseConfig.configurationLoadUrl
      };
      
      log("Applied RU config:", ruConfig);
      return ruConfig;
    },
    configurable: true,
    enumerable: true
  });

  // ---------- 2) Минимальная фиксация RU локали ----------
  try { document.documentElement && (document.documentElement.lang = "ru"); } catch {}
  try {
    const getter = () => "ru-RU";
    Object.defineProperty(navigator, "language", { get: getter, configurable: true });
    Object.defineProperty(navigator, "languages", { get: () => ["ru-RU","ru"], configurable: true });
  } catch {}

  // Подсказка ядру (если оно её читает)
  window.__CONF2_FORCE_LOCALE__ = { lang: "ru", locale: "ru-RU", countryId: "RU" };

  // ---------- 3) Перехватывание window.locale и window.lang ----------
  log("Setting up locale/lang interception...");
  
  // Перехватываем window.locale
  Object.defineProperty(window, 'locale', {
    get: function() {
      log("window.locale accessed, returning 'ru-RU'");
      return 'ru-RU';
    },
    configurable: true,
    enumerable: true
  });
  
  // Перехватываем window.lang
  Object.defineProperty(window, 'lang', {
    get: function() {
      log("window.lang accessed, returning 'ru'");
      return 'ru';
    },
    configurable: true,
    enumerable: true
  });

  // ---------- 4) Узкий fetch-перехват: ТОЛЬКО словари/маркетинговые EN-URL ----------
  const passthroughHosts = new Set(["sentry.io"]);
  const origFetch = window.fetch?.bind(window);

  function cloneGetRequest(input, newUrl) {
    // Переносим только то, что безопасно для GET
    return (typeof input === "string")
      ? newUrl
      : new Request(newUrl, { method: input.method || "GET", headers: input.headers, mode: input.mode, credentials: input.credentials, cache: input.cache, redirect: input.redirect, referrer: input.referrer, referrerPolicy: input.referrerPolicy, integrity: input.integrity, keepalive: input.keepalive });
  }

  if (origFetch) {
    window.fetch = async (input, init) => {
      try {
        let url = typeof input === "string" ? input : (input && input.url) || "";
        const method = (init && init.method) || (typeof input !== "string" && input && input.method) || "GET";

        // Пропускаем телеметрию и чужие хосты
        try {
          const u = new URL(url, location.origin);
          if (u.origin !== location.origin || passthroughHosts.has(u.host)) {
            return origFetch(input, init);
          }
        } catch { /* невалидный URL -> пусть идёт как есть */ }

        if (method === "GET") {
          // /en/configurator/... -> /ru/configurator/...
          if (/\/en\/configurator\//i.test(url)) {
            const newUrl = url.replace("/en/configurator/", "/ru/configurator/");
            log("redirect en→ru:", url, "→", newUrl);
            input = cloneGetRequest(input, newUrl);
          }
          // любые словари переводов -> наш ru-RU.json
          if (/\/(locales|i18n|translations)\/.*\.json(\?|$)/i.test(url)) {
            log("force RU dict for:", url);
            input = "/ru-RU.json";
          }
        }

        return await origFetch(input, init);
      } catch (e) {
        log("fetch passthrough (safe):", e);
        return origFetch(input, init);
      }
    };
  }

  // ---------- 5) Загрузка RU-словаря + локальных translations из config_data_wardrobe_local.json ----------
  async function loadRuDict() {
    let dict = {};
    try {
      const r = await fetch("/ru-RU.json", { credentials: "same-origin" });
      if (r.ok) dict = await r.json();
      else log("ru-RU.json not ok:", r.status);
    } catch (e) { log("ru-RU.json fetch error:", e); }

    try {
      const r2 = await fetch("/config_data_wardrobe_local.json", { credentials: "same-origin" });
      if (r2.ok) {
        const cd = await r2.json();
        if (cd && cd.translations && typeof cd.translations === "object") {
          dict = deepMerge(dict, cd.translations);
          log("merged config_data_wardrobe_local.translations");
        }
        if (cd) {
          cd.locale = "ru";
          cd.countryId = cd.countryId || "RU";
          window.__CONF2_LOCAL_OVERRIDES__ = { locale: cd.locale, countryId: cd.countryId };
        }
      }
    } catch { /* файла может не быть — это ок */ }

    return dict;
  }

  function deepMerge(a, b) {
    if (!a || typeof a !== "object") return JSON.parse(JSON.stringify(b));
    const o = Array.isArray(a) ? a.slice() : { ...a };
    for (const k of Object.keys(b || {})) {
      const v = b[k];
      if (v && typeof v === "object" && !Array.isArray(v)) o[k] = deepMerge(o[k], v);
      else o[k] = v;
    }
    return o;
  }

  // ---------- 6) Обёртка t(...) — если есть, мягко подменяем на RU ----------
  function wrapI18nIfPresent(dict) {
    const fmt = (s, vars) => typeof s === "string"
      ? s.replace(/%\{(\w+)\}/g, (_, k) => (vars && vars[k] != null ? String(vars[k]) : ""))
      : s;

    const getPath = (obj, path) => {
      if (!obj || !path) return undefined;
      return String(path).split(".").reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj);
    };

    const wrapOne = (obj) => {
      if (!obj || typeof obj.t !== "function" || obj.__RU_WRAPPED__) return false;
      const orig = obj.t.bind(obj);
      obj.t = (key, vars) => {
        const v = getPath(dict, key);
        if (typeof v === "string") return fmt(v, vars);
        try { return orig(key, vars); } catch { return key; }
      };
      obj.language = "ru-RU";
      obj.__RU_WRAPPED__ = true;
      return true;
    };

    let wrapped = false;
    if (wrapOne(window.i18n)) { wrapped = true; log("wrapped window.i18n.t"); }

    // Ограниченный скан глобалов — не более 200 ключей
    let scanned = 0;
    for (const k of Object.keys(window)) {
      if (scanned++ > 200) break;
      try {
        const v = window[k];
        if (v && typeof v === "object" && typeof v.t === "function") {
          if (wrapOne(v)) { wrapped = true; log("wrapped", `window.${k}.t`); }
        }
      } catch {}
    }
    if (!wrapped) log("no t() found to wrap — ok");
  }

  // ---------- 7) Локализация прелоадера (если статичен) + наблюдатель ----------
  function localizeLoaderOnce() {
    try {
      const cand = document.querySelector('[data-conf-loader], .conf-loader, .configurator-loader, [data-loader-text]');
      if (cand && /loading/i.test(cand.textContent || "")) cand.textContent = "Загружаем конфигуратор…";
    } catch {}
  }

  const mo = new MutationObserver(() => localizeLoaderOnce());

  document.addEventListener("DOMContentLoaded", async () => {
    localizeLoaderOnce();
    try { mo.observe(document.documentElement || document.body, { childList: true, subtree: true }); } catch {}
    const dict = await loadRuDict();
    wrapI18nIfPresent(dict);
    window.__RU_BOOTSTRAP_OK__ = true;
    log("ready");
  });

  window.addEventListener("load", () => {
    // Финальная проверка загрузки страницы
    if (!window.__RU_BOOTSTRAP_OK__) err("RU bootstrap not confirmed");
  });
})();