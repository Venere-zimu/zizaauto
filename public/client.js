let currentUser = null;
let cars = [];

document.addEventListener("DOMContentLoaded", () => {
  const authForm = document.getElementById("user-auth-form");
  const registerBtn = document.getElementById("register-btn");
  const authStatus = document.getElementById("user-auth-status");
  const carSection = document.getElementById("car-section");
  const carList = document.getElementById("car-list");

  authForm.addEventListener("submit", e => {
    e.preventDefault();
    const login = document.getElementById("user-login").value;
    const password = document.getElementById("user-password").value;

    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: login, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          currentUser = { username: login };
          authStatus.textContent = `Добро пожаловать, ${login}`;
          authForm.style.display = "none";
          carSection.style.display = "block";
          loadCars();
        } else {
          authStatus.textContent = "Ошибка входа: " + (data.message || "Неверный логин или пароль");
        }
      });
  });

  registerBtn.addEventListener("click", () => {
    const login = document.getElementById("user-login").value;
    const password = document.getElementById("user-password").value;

    fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: login, password })
    })
      .then(res => res.json())
      .then(data => {
        authStatus.textContent = data.success
          ? "Регистрация успешна. Теперь вы можете войти."
          : data.message || "Ошибка регистрации.";
      });
  });

  function loadCars() {
    fetch("/api/cars")
      .then(res => res.json())
      .then(data => {
        cars = data;
        renderCars();
      });
  }

  function renderCars() {
    carList.innerHTML = "";
    cars.forEach(car => {
      const div = document.createElement("div");
      div.className = "car";
      div.innerHTML = `
        <img src="${car.image || 'placeholder.jpg'}" alt="${car.brand}">
        <h3>${car.brand} ${car.model} (${car.year})</h3>
        <p><strong>Цена:</strong> $${car.price}</p>
        <p><strong>Пробег:</strong> ${car.mileage || '-'} км</p>
        <p><strong>Тип:</strong> ${car.bodyType || '-'}</p>
        <button onclick="bookCar(${car.id})">Бронировать</button>
        <button onclick="buyCar(${car.id})">Купить</button>
      `;
      carList.appendChild(div);
    });
  }

  window.bookCar = function(id) {
    alert(`Вы забронировали автомобиль ID ${id}`);
  };

  window.buyCar = function(id) {
    alert(`Вы купили автомобиль ID ${id}`);
  };
});
