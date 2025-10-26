#!/usr/bin/env python3
import hashlib, json, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASELINE = os.path.join(ROOT, "scripts", "baseline_hashes.json")

# 1) Файлы, которые нельзя менять
PROTECTED = [
    "js/conf2.umd.min.js",
    "js/app.js",
    "js/cms-elements.js",
]

# 2) Входная страница (авто-детект)
CANDIDATES = ["index_wardrobe.html", "wardrobe.html", "index.html"]

def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1<<20), b""):
            h.update(chunk)
    return h.hexdigest()

def find_entry_html():
    for name in CANDIDATES:
        p = os.path.join(ROOT, name)
        if os.path.exists(p):
            # предпочитаем index_wardrobe.html
            if "wardrobe" in name:
                return name
    # fallback
    for name in CANDIDATES:
        if os.path.exists(os.path.join(ROOT, name)):
            return name
    print("ERROR: entry HTML not found", file=sys.stderr)
    sys.exit(2)

def load_html(name):
    with open(os.path.join(ROOT, name), "r", encoding="utf-8", errors="ignore") as f:
        return f.read()

def ensure_no_override_ru(html):
    if re.search(r'override-ru\.js', html):
        print("ERROR: override-ru.js is referenced in entry HTML. Remove it.", file=sys.stderr)
        sys.exit(3)

def extract_conf2config(html):
    # грубый захват объекта window.conf2config = { ... };
    m = re.search(r'window\.conf2config\s*=\s*\{.*?\};', html, re.S)
    if not m:
        print("ERROR: window.conf2config not found in entry HTML", file=sys.stderr)
        sys.exit(4)
    block = m.group(0)
    return block

def assert_conf_targets(block):
    # Проверяем locale
    if not re.search(r'"locale"\s*:\s*"(?:ru|ru-RU)"', block):
        print('ERROR: conf2config.locale is not set to "ru" or "ru-RU"', file=sys.stderr)
        sys.exit(5)
    
    # Проверяем type
    if not re.search(r'"type"\s*:\s*"wardrobe"', block):
        print('ERROR: conf2config.type is not set to "wardrobe"', file=sys.stderr)
        sys.exit(5)
    
    # configUrl must target /configuration/2000003/ru/RU (с учетом экранированных слешей)
    if not re.search(r'"configUrl"\s*:\s*"\\/configuration\\/2000003\\/ru\\/RU"', block):
        print('ERROR: conf2config.configUrl must be "/configuration/2000003/ru/RU"', file=sys.stderr)
        sys.exit(6)

def init_or_check_baseline():
    # build current hashes
    current = {}
    for rel in PROTECTED:
        p = os.path.join(ROOT, rel)
        if os.path.exists(p):
            current[rel] = sha256(p)
    if not os.path.exists(BASELINE):
        with open(BASELINE, "w") as f:
            json.dump(current, f, indent=2, ensure_ascii=False)
        print("Baseline created for protected assets.")
        return
    # compare
    with open(BASELINE) as f:
        baseline = json.load(f)
    for rel, oldh in baseline.items():
        p = os.path.join(ROOT, rel)
        if not os.path.exists(p):
            print(f"ERROR: protected file missing: {rel}", file=sys.stderr)
            sys.exit(7)
        curh = sha256(p)
        if curh != oldh:
            print(f"ERROR: protected file modified: {rel}", file=sys.stderr)
            sys.exit(8)
    print("Protected assets OK.")

def check_config_endpoint():
    # best effort: try common URL from conf2config if we can parse; fallback to default
    # we expect server on localhost:8081
    url = "http://localhost:8081/configuration/2000003/ru/RU"
    try:
        with urllib.request.urlopen(url, timeout=3) as r:
            data = json.load(r)
        cur = data.get("currency") or data.get("Currency") or ""
        if cur != "RUB":
            print("ERROR: config_data.currency != RUB", file=sys.stderr)
            sys.exit(9)
        if not isinstance(data.get("translations"), dict):
            print("ERROR: config_data.translations missing", file=sys.stderr)
            sys.exit(10)
        print("Config endpoint OK.")
    except Exception as e:
        print(f"ERROR: cannot GET {url}: {e}", file=sys.stderr)
        sys.exit(11)

def main():
    init_or_check_baseline()
    entry = find_entry_html()
    html = load_html(entry)
    ensure_no_override_ru(html)
    block = extract_conf2config(html)
    assert_conf_targets(block)
    # endpoint check
    check_config_endpoint()
    print("All checks passed!")

if __name__ == "__main__":
    main()
