# 🚀 Настройка GitHub для проекта domio

## ✅ Что уже сделано:

1. ✅ Git репозиторий инициализирован в папке `5`
2. ✅ Все файлы закоммичены
3. ✅ Remote добавлен: `https://github.com/maaarkushaaa/domio.git`
4. ✅ Убран `header-show-navigation` со страницы

## 📝 ШАГ: Создайте репозиторий на GitHub

### Вариант 1: Через веб-интерфейс GitHub

1. Откройте: https://github.com/new
2. Repository name: **domio**
3. Выберите: Public или Private
4. НЕ добавляйте README, .gitignore или лицензию
5. Нажмите **Create repository**

### Вариант 2: Через GitHub CLI

```bash
gh repo create domio --public --source=. --remote=origin --push
```

## 🚀 После создания репозитория:

```bash
# Убедитесь, что вы в папке 5
cd C:\sitecopy\5

# Загрузите код на GitHub
git push -u origin main
```

## ⚙️ Настройка Vercel:

После загрузки на GitHub:

1. Откройте: https://vercel.com/new
2. Подключите GitHub аккаунт
3. Выберите репозиторий **domio** из списка
4. Vercel автоматически обнаружит `vercel.json`
5. Нажмите **Deploy**

Vercel автоматически задеплоит проект и выдаст URL!

## 📁 Структура проекта:

```
5/
├── configurator_assets/    # Все файлы конфигуратора
│   ├── configurator_2508f3617e1046cba5b985f3a7ea393a_page.html
│   ├── wardrobe_config_rubles.json
│   ├── css/
│   ├── js/
│   ├── gfx/
│   └── ...
├── package.json
├── vercel.json             # Конфигурация для Vercel
├── .gitignore
└── README_DEPLOY.md
```

## ✅ После успешного деплоя:

1. Проверьте сайт по URL от Vercel
2. Убедитесь, что `header-show-navigation` удален
3. Проверьте русификацию
4. Проверьте валюту в рублях

## 🎉 Готово!

Ваш конфигуратор будет доступен на:
- **https://domio.vercel.app** (или похожий URL)

