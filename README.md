# Quiz Game

Fullstack веб-приложение игры «Своя игра»

Проект позволяет зарегистрироваться, войти в систему, начать игровую сессию, выбирать вопросы с поля, отвечать на них, получать или терять очки и сохранять прогресс на сервере

## Что умеет проект

- регистрация и вход пользователя;
- восстановление сессии после перезагрузки страницы;
- игровое поле с категориями и стоимостью вопросов;
- открытие вопроса в модальном окне и отправка ответа;
- подсчет очков за правильные и неправильные ответы;
- сохранение активной игры на сервере;
- просмотр собственных результатов и таблицы лидеров.

## Стек

### Frontend

- Next.js
- React
- TypeScript
- Redux Toolkit
- Axios

### Backend

- Node.js
- Express 5
- Sequelize
- PostgreSQL
- JWT
- cookie-based refresh session

## Структура репозитория

```text
client/   frontend на Next.js
server/   backend на Express, API, модели Sequelize и миграции
```

## Переменные окружения

### Frontend

Создайте файл `client/.env.local` на основе `client/.env.example`.

### Backend

Создайте файл `server/.env` на основе `server/.env.example`.


## Локальный запуск

### 1. Установка зависимостей

```bash
cd client
npm install

cd ../server
npm install
```

### 2. Подготовка базы данных

Создайте PostgreSQL-базу и укажите строку подключения в `server/.env`.

После этого выполните миграции:

```bash
cd server
npx sequelize db:migrate
```
Если нужен быстрый сброс базы и повторное применение миграций:

```bash
cd server
npm run db:reset
```

### 3. Запуск приложения

Запустите backend:

```bash
cd server
npm run dev
```

В отдельном терминале запустите frontend:

```bash
cd client
npm run dev
```

## Адреса в development

- frontend: `http://localhost:5173`
- backend API: `http://localhost:3000/api`
