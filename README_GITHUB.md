# GitHub и Vercel Setup - Финальная инструкция

## Что сделано:

✅ Git репозиторий создан  
✅ Файлы закоммичены  
✅ Remote добавлен: `https://github.com/maaarkushaaa/domio.git`  
✅ Header navigation убран

## ШАГИ ДЛЯ ЗАВЕРШЕНИЯ:

### 1. Создайте репозиторий на GitHub

Откройте: https://github.com/new

- Repository name: **domio**
- Public или Private (на ваше усмотрение)
- НЕ добавляйте README, .gitignore или лицензию
- Нажмите **Create repository**

### 2. Загрузите код на GitHub

В терминале (в папке `C:\sitecopy\5`):

```bash
git push -u origin main
```

### 3. Подключите к Vercel

1. Откройте: https://vercel.com/new
2. Подключите GitHub (если еще не подключен)
3. Выберите репозиторий **domio**
4. Нажмите **Deploy**

Vercel автоматически задеплоит проект!

### 4. Получите URL

После деплоя Vercel выдаст URL типа:
**https://domio-xxx.vercel.app**

## Текущее состояние:

- Все файлы готовы к деплою
- Конфигурация Vercel готова
- Локальный сервер работает на http://localhost:8000

## После деплоя:

Проверьте что:
- ✅ `header-show-navigation` удален
- ✅ Русские переводы работают
- ✅ Валюта в рублях (₽)
- ✅ Все ресурсы загружаются

