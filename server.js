const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const USERS_PATH = path.join(__dirname, 'data', 'users.json');
const CARS_PATH = path.join(__dirname, 'data', 'cars.json');

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '1234';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

/* --- CARS --- */

// Получить все авто
app.get('/api/cars', (req, res) => {
  const cars = fs.existsSync(CARS_PATH) ? JSON.parse(fs.readFileSync(CARS_PATH)) : [];
  res.json(cars);
});

// Добавить авто
app.post('/api/cars', (req, res) => {
  const cars = fs.existsSync(CARS_PATH) ? JSON.parse(fs.readFileSync(CARS_PATH)) : [];
  const newCar = { id: Date.now(), ...req.body };
  cars.push(newCar);
  fs.writeFileSync(CARS_PATH, JSON.stringify(cars, null, 2));
  res.json(newCar);
});

// Обновить авто
app.put('/api/cars/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let cars = JSON.parse(fs.readFileSync(CARS_PATH));
  cars = cars.map(car => car.id === id ? { ...car, ...req.body } : car);
  fs.writeFileSync(CARS_PATH, JSON.stringify(cars, null, 2));
  res.json({ success: true });
});

// Удалить авто
app.delete('/api/cars/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let cars = JSON.parse(fs.readFileSync(CARS_PATH));
  cars = cars.filter(car => car.id !== id);
  fs.writeFileSync(CARS_PATH, JSON.stringify(cars, null, 2));
  res.json({ success: true });
});

/* --- USERS --- */

// Регистрация пользователя
app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  let users = fs.existsSync(USERS_PATH) ? JSON.parse(fs.readFileSync(USERS_PATH)) : [];

  if (users.find(u => u.username === username)) {
    return res.json({ success: false, message: 'Пользователь уже существует' });
  }

  const newUser = { id: Date.now(), username, password, blocked: false };
  users.push(newUser);
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
  res.json({ success: true });
});

// Авторизация
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    return res.json({ success: true, isAdmin: true });
  }

  const users = fs.existsSync(USERS_PATH) ? JSON.parse(fs.readFileSync(USERS_PATH)) : [];
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    if (user.blocked) {
      return res.json({ success: false, message: 'Пользователь заблокирован' });
    }
    return res.json({ success: true, isAdmin: false });
  }

  res.json({ success: false, message: 'Неверный логин или пароль' });
});

// Получение всех пользователей (для админа)
app.get('/api/users', (req, res) => {
  const users = fs.existsSync(USERS_PATH) ? JSON.parse(fs.readFileSync(USERS_PATH)) : [];
  res.json(users);
});

// Блокировка пользователя
app.post('/api/users/block', (req, res) => {
  const { username } = req.body;
  let users = JSON.parse(fs.readFileSync(USERS_PATH));
  users = users.map(u => u.username === username ? { ...u, blocked: true } : u);
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
  res.json({ success: true });
});

/* --- HTML Pages --- */

// Админская страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Клиентская страница
app.get('/client', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client.html'));
});

/* --- Start Server --- */
app.listen(PORT, () => {
  console.log(`🚗 ZizaAuto сервер работает: http://localhost:${PORT}`);
});
