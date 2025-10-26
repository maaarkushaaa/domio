// scripts/verify_override.js
const puppeteer = require('puppeteer');
(async ()=>{
  const browser = await puppeteer.launch({args:['--no-sandbox']});
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => logs.push({type:'console', text: msg.text()}));
  const requests = [];
  page.on('request', req => requests.push(req.url()));
  await page.goto('http://localhost:8080/configurator_2508f3617e1046cba5b985f3a7ea393a_page.html', {waitUntil:'domcontentloaded', timeout: 120000});
  const cfgOverridden = await page.evaluate(()=> !!window.__CONFIG_DATA_OVERRIDDEN__);
  const ok = await page.evaluate(()=> !!window.__RU_BOOTSTRAP_OK__);
  const injected = await page.evaluate(()=> !!window.__INJECTED_CONFIG_FROM_LOCAL__);
  console.log('CONFIG_OVERRIDDEN=', cfgOverridden);
  console.log('BOOTSTRAP_OK=', ok);
  console.log('INJECTED_VAR_PRESENT=', injected);
  console.log('Requests count:', requests.length);
  // detect any request urls matching observedApiUrls (Cursor: fill the array)
  const observedApiPatterns = [
    /pickawood\.com.*configuration/i,
    /condor\.pickawood\.com/i,
    /\/configuration\//i,
    /\/api\/configuration/gi,
    /\/load-configuration/i,
    /\/api\/popups/i,
    /\/config_data/i,
    /\/translations/i,
    /\/locales/i
  ];
  const apiHits = requests.filter(u=> observedApiPatterns.some(rx=> rx.test(u)));
  console.log('API hits detected matching patterns:', apiHits.length, apiHits.slice(0,10));
  // check 3D element presence
  const hasModelViewer = await page.evaluate(()=> !!document.querySelector('model-viewer, [data-3d-root], #three-canvas'));
  console.log('Has 3D root:', hasModelViewer);
  await browser.close();
  process.exit(apiHits.length>0 ? 2 : 0);
})();
