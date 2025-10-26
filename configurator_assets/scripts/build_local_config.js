// scripts/build_local_config.js
const fs = require('fs');
const path = require('path');

const root = process.cwd(); // Cursor: запусти ИЗ configurator_assets
function ensureExists(p){ if(!fs.existsSync(path.join(root,p))){ console.error('MISSING:', p); } }

const cfgPath = path.join(root,'config_data.json');
if(!fs.existsSync(cfgPath)){ console.warn('WARN: config_data.json missing — will create minimal wrapper'); }

function loadJson(name){
  try{ return JSON.parse(fs.readFileSync(path.join(root,name), 'utf8')); }catch(e){ return null; }
}
function deepMerge(a,b){
  if(!a || typeof a!=='object') return JSON.parse(JSON.stringify(b||{}));
  const out = Array.isArray(a)? a.slice() : {...a};
  for(const k of Object.keys(b||{})){
    const v = b[k];
    if(v && typeof v==='object' && !Array.isArray(v)) out[k] = deepMerge(out[k], v);
    else out[k] = v;
  }
  return out;
}

const base = loadJson('config_data.json') || {};
const ruDict = loadJson('ru-RU.json') || {};
const localOverrides = loadJson('config_data_wardrobe_local.json') || {};

let translations = {};
if(base.translations && typeof base.translations==='object') translations = deepMerge(translations, base.translations);
if(ruDict && typeof ruDict==='object') translations = deepMerge(translations, ruDict);
if(localOverrides && localOverrides.translations) translations = deepMerge(translations, localOverrides.translations);

// Ensure translations is object
base.translations = translations;
base.locale = base.locale || 'ru';
base.countryId = base.countryId || 'RU';

// write
const outPath = path.join(root,'config_data_ru_local.json');
fs.writeFileSync(outPath, JSON.stringify(base, null, 2), 'utf8');
console.log('WROTE', outPath, 'translations keys:', Object.keys(translations||{}).length);