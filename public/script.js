let isAdmin = false;
let cars = [];

document.addEventListener("DOMContentLoaded", () => {
  const carList = document.getElementById("car-list");
  const form = document.getElementById("add-car-form");
  const searchInput = document.getElementById("search");
  const authStatus = document.getElementById("auth-status");
  const addSection = document.getElementById("add-section");
  const logoutBtn = document.getElementById("logout-btn");
  const modal = document.getElementById("image-modal");
  const modalImg = document.getElementById("modal-img");
  const closeModal = document.querySelector(".close");

  function renderCars(data) {
    carList.innerHTML = "";
    data.forEach(car => {
      const div = document.createElement("div");
      div.className = "car";
      div.innerHTML = `
        <img src="${car.image}" alt="Фото ${car.brand}" onclick="showImage('${car.image}')">
        <div>
          <h3>${car.brand} ${car.model} (${car.year})</h3>
          <p><b>Цена:</b> $${car.price}</p>
          <p><b>Пробег:</b> ${car.mileage} км</p>
          <p><b>Кузов:</b> ${car.bodyType}</p>
          <p>${car.description}</p>
          ${isAdmin ? `
            <button onclick="editCar(${car.id})">Редактировать</button>
            <button onclick="deleteCar(${car.id})">Удалить</button>
          ` : ""}
        </div>
      `;
      carList.appendChild(div);
    });
  }

  function loadCars() {
    fetch("/api/cars")
      .then(res => res.json())
      .then(data => {
        cars = data;
        renderCars(cars);
      });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(form);
    const car = {};
    formData.forEach((value, key) => car[key] = value);

    car.year = parseInt(car.year);
    car.price = parseFloat(car.price);
    car.mileage = parseInt(car.mileage);

    // Валидация
    if (!car.brand || !car.model || isNaN(car.year) || isNaN(car.price) || !car.image) {
      alert("Пожалуйста, заполните все поля корректно.");
      return;
    }

    fetch("/api/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(car)
    }).then(() => {
      form.reset();
      loadCars();
    });
  });

  document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const login = document.getElementById("login").value;
    const password = document.getElementById("password").value;

    fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password })
    }).then(res => res.json())
      .then(data => {
        if (data.success) {
          isAdmin = true;
          authStatus.textContent = "Вход выполнен как админ";
          addSection.style.display = "block";
          logoutBtn.style.display = "inline-block";
          loadCars();
        } else {
          authStatus.textContent = "Неверный логин или пароль";
        }
      });
  });

  logoutBtn.addEventListener("click", () => {
    isAdmin = false;
    addSection.style.display = "none";
    logoutBtn.style.display = "none";
    authStatus.textContent = "Вы вышли из админки";
    loadCars();
  });

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();
    const filtered = cars.filter(c => c.brand.toLowerCase().includes(q) || c.model.toLowerCase().includes(q));
    renderCars(filtered);
  });

  window.deleteCar = function(id) {
  if (confirm("Вы уверены, что хотите удалить автомобиль?")) {
    fetch(`/api/cars/${id}`, { method: "DELETE" })
      .then(() => loadCars());
  }
};


  window.editCar = function(id) {
    const car = cars.find(c => c.id === id);
    const updated = {
      brand: prompt("Марка:", car.brand),
      model: prompt("Модель:", car.model),
      year: parseInt(prompt("Год:", car.year)),
      price: parseFloat(prompt("Цена:", car.price)),
      mileage: parseInt(prompt("Пробег:", car.mileage)),
      bodyType: prompt("Тип кузова:", car.bodyType),
      description: prompt("Описание:", car.description),
      image: prompt("URL изображения:", car.image)
    };

    fetch(`/api/cars/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    }).then(() => loadCars());
  };

  window.showImage = function(url) {
    modal.style.display = "block";
    modalImg.src = url;
  };

  closeModal.onclick = () => modal.style.display = "none";
  modal.onclick = () => modal.style.display = "none";

  loadCars();
});
