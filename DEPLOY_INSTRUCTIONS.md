# 🚀 Быстрая инструкция по деплою

## ✅ Что уже сделано:

1. ✅ Создан `package.json`
2. ✅ Создан `vercel.json` с конфигурацией
3. ✅ Создан `.vercelignore`
4. ✅ Запущен локальный сервер (порт 8000)

## 📦 Деплой на Vercel

### Шаг 1: Установить Vercel CLI (если не установлен)
```bash
npm i -g vercel
```

### Шаг 2: Войти в аккаунт
```bash
vercel login
```

### Шаг 3: Задеплоить проект
```bash
vercel
```

При первом запуске Vercel задаст вопросы:
- Set up and deploy "..."? → **Yes**
- Which scope? → выберите свой аккаунт
- Link to existing project? → **No**
- Project name → любое имя (например: configurator)
- Directory → **.** (текущая директория)

### Шаг 4: Получить URL
После деплоя Vercel выдаст URL:
```
https://your-project.vercel.app
```

Откройте его в браузере!

## 🔄 Для повторного деплоя
```bash
vercel --prod
```

## 🧪 Локальное тестирование
Сервер уже запущен на `http://localhost:8000`

Откройте в браузере:
- http://localhost:8000/ - главная страница конфигуратора
- http://localhost:8000/configurator_2508f3617e1046cba5b985f3a7ea393a_page.html - напрямую

## 📁 Структура проекта для Vercel

Vercel будет обслуживать статические файлы из:
- `configurator_assets/` - все ресурсы конфигуратора

**URL структура:**
```
https://your-project.vercel.app/
→ configurator_2508f3617e1046cba5b985f3a7ea393a_page.html

https://your-project.vercel.app/wardrobe_config_rubles.json
→ configurator_assets/wardrobe_config_rubles.json

https://your-project.vercel.app/css/app.css
→ configurator_assets/css/app.css
```

## ⚠️ Важно

1. **Все файлы уже в папке `configurator_assets/`** ✅
2. **Конфигурация Vercel настроена в `vercel.json`** ✅
3. **CORS заголовки добавлены** ✅

## 🎯 Что работает

- ✅ Русская локализация
- ✅ Рубли (₽)
- ✅ Локальная конфигурация (без внешних API)
- ✅ Перехват запросов
- ✅ Все ресурсы (изображения, шрифты, 3D)

## 🐛 Отладка

### Проверить логи на Vercel
```bash
vercel logs
```

### Проверить локально
1. Откройте http://localhost:8000
2. Откройте DevTools (F12)
3. Проверьте консоль на ошибки

## 📝 Дополнительная информация

См. полную инструкцию в `README_DEPLOY.md`

