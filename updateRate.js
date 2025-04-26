import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Настройки Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCpjGgyQu_0YeK8bp93MwurF8na4WuSg-E",
  authDomain: "ron-bucks-converter.firebaseapp.com",
  databaseURL: "https://ron-bucks-converter-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ron-bucks-converter",
  storageBucket: "ron-bucks-converter.appspot.com",
  messagingSenderId: "833359153928",
  appId: "1:833359153928:web:ca68420138bdd556453abd",
  measurementId: "G-2MBE7ELRLC"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentRate = 1488; // Стартовый курс

// Ссылка на курс в базе данных
const rateRef = ref(db, 'rate');

// Загружаем курс из базы
get(rateRef).then((snapshot) => {
  if (snapshot.exists()) {
    currentRate = snapshot.val();
    console.log(`[${new Date().toLocaleTimeString()}] Курс загружен: ${currentRate}`);
    updateRateDisplay(currentRate, currentRate); // сразу показать курс
  } else {
    set(rateRef, currentRate);
    console.log(`[${new Date().toLocaleTimeString()}] Курс установлен стартовый: ${currentRate}`);
    updateRateDisplay(currentRate, currentRate); // сразу показать курс
  }
});

// Функция для обновления отображения курса
function updateRateDisplay(newRate, oldRate) {
  const rateElement = document.getElementById('rate');
  rateElement.innerText = `Текущий курс: 1 Рон-бакс = ${newRate} долларов`;

  if (newRate > oldRate) {
    rateElement.style.color = "green"; // курс вырос
  } else if (newRate < oldRate) {
    rateElement.style.color = "red"; // курс упал
  } else {
    rateElement.style.color = "black"; // курс не изменился
  }

  // Анимация изменения курса
  rateElement.style.transition = 'transform 0.3s ease';
  rateElement.style.transform = 'scale(1.05)';
  setTimeout(() => {
    rateElement.style.transform = 'scale(1)';
  }, 300);
}

// Логика плавного изменения курса
function updateRate() {
  const oldRate = currentRate;
  const chance = Math.random(); // шанс изменения

  if (chance < 0.9) {
    // 90% шанс увеличения на 1–5
    const increaseAmount = Math.floor(Math.random() * 5) + 1; // от 1 до 5
    currentRate += increaseAmount;
    console.log(`[${new Date().toLocaleTimeString()}] Курс увеличился на +${increaseAmount} → ${currentRate}`);
  } else {
    // 10% шанс уменьшения на 1–2
    const decreaseAmount = Math.floor(Math.random() * 2) + 1; // от 1 до 2
    currentRate -= decreaseAmount;
    console.log(`[${new Date().toLocaleTimeString()}] Курс уменьшился на -${decreaseAmount} → ${currentRate}`);
  }

  // Ограничения курса
  if (currentRate < 100) currentRate = 100;
  if (currentRate > 100000) currentRate = 100000;

  // Обновляем базу и экран
  set(rateRef, currentRate);
  updateRateDisplay(currentRate, oldRate);
}

// Обновляем курс каждые 10 секунд
setInterval(updateRate, 10000);

// Функция конвертации Рон-баксов в доллары
window.convert = function convert() {
  const ronbucks = document.getElementById('ronbucks').value;
  if (ronbucks && currentRate) {
    const dollars = ronbucks * currentRate;
    document.getElementById('result').innerText = `${ronbucks} Рон-баксов = ${dollars.toLocaleString()} долларов`;
  } else {
    document.getElementById('result').innerText = 'Введите количество Рон-баксов!';
  }
};

// Функция конвертации долларов в Рон-баксы
window.convertBack = function convertBack() {
  const dollars = document.getElementById('dollars').value;
  if (dollars && currentRate) {
    const ronbucks = dollars / currentRate;
    document.getElementById('resultBack').innerText = `${dollars} долларов = ${ronbucks.toFixed(4)} Рон-баксов`;
  } else {
    document.getElementById('resultBack').innerText = 'Введите количество долларов!';
  }
};
