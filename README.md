git push -u origin main --force
git push -u origin main --force
# 🚗 ZizaAuto

**ZizaAuto** — это информационная система автосалона, созданная для управления автомобилями, пользователями и продажами. Система поддерживает роли администратора и клиента, работу с авто, авторизацию и бронирование.

## 🔧 Возможности

### 👤 Клиенты
- Регистрация и авторизация
- Просмотр списка автомобилей
- Бронирование и покупка авто
- Просмотр изображений и информации
- Модальные окна для ввода данных

### 🔐 Админ-панель
- Вход через логин `admin`, пароль `1234`
- Добавление / удаление / редактирование авто
- Блокировка пользователей
- Получение уведомлений о продаже
- Просмотр проданных авто

### 📁 Хранение данных
- Локально в JSON-файлах:
  - `cars.json`
  - `users.json`
  - `sold.json`
  - `sales.log`

## 🛠️ Технологии

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js (Express)
- **Хранение:** JSON-файлы (временно, с возможным переходом на SQLite)

## 📂 Структура проекта

ZizaAuto/
├── public/
│ ├── index.html # Админка
│ ├── client.html # Клиентская часть
│ ├── script.js # JS для админки
│ ├── client.js # JS для клиентов
│ └── styles/ # Стили
├── data/
│ ├── cars.json
│ ├── users.json
│ ├── sold.json
│ └── sales.log
├── server.js # Сервер Node.js
├── package.json
└── README.md

perl
Копировать
Редактировать

## 🚀 Запуск

```bash
npm install
node server.js
Открой в браузере: http://localhost:3000

📌 Примечания
Проект в процессе разработки.

Переход на SQLite планируется для повышения надёжности и масштабируемости.

🤝 Автор
Venere Zimu
