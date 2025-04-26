import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Настройки Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCpjGgyQu_0YeK8bp93MwurF8na4WuSg-E",
  authDomain: "ron-bucks-converter.firebaseapp.com",
  databaseURL: "https://ron-bucks-converter-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ron-bucks-converter",
  storageBucket: "ron-bucks-converter.firebasestorage.app",
  messagingSenderId: "833359153928",
  appId: "1:833359153928:web:ca68420138bdd556453abd",
  measurementId: "G-2MBE7ELRLC"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentRate = 1488; // Стартовый курс

// Получаем курс из базы данных
const rateRef = ref(db, 'rate');

get(rateRef).then((snapshot) => {
  if (snapshot.exists()) {
    currentRate = snapshot.val();
    console.log(`[${new Date().toLocaleTimeString()}] Курс загружен: ${currentRate}`);
  } else {
    set(rateRef, currentRate);
    console.log(`[${new Date().toLocaleTimeString()}] Курс установлен стартовый: ${currentRate}`);
  }
});

// Обновление курса на странице
function updateRateDisplay(newRate, oldRate) {
  const rateElement = document.getElementById('rate');
  rateElement.innerText = `Текущий курс: 1 Рон-бакс = ${newRate} долларов`;

  // Анимация и цвет:
  if (newRate > oldRate) {
    rateElement.style.color = "green"; // курс вырос
  } else if (newRate < oldRate) {
    rateElement.style.color = "red"; // курс упал
  } else {
    rateElement.style.color = "black"; // если курс не изменился
  }
}

// Обновляем курс
function updateRate() {
  const changeAmount = Math.floor(Math.random() * 20) + 1; // Случайное число от 1 до 20
  const oldRate = currentRate;

  // 50% шанс увеличить курс и 50% шанс уменьшить
  const chance = Math.random();

  if (chance < 0.5) {
    // 50% шанс увеличить курс на 1-20
    currentRate += changeAmount;
    console.log(`[${new Date().toLocaleTimeString()}] Курс увеличился на +${changeAmount} → ${currentRate}`);
  } else {
    // 50% шанс уменьшить курс на 1-20
    currentRate -= changeAmount;
    console.log(`[${new Date().toLocaleTimeString()}] Курс уменьшился на -${changeAmount} → ${currentRate}`);
  }

  // Ограничение курса
  if (currentRate < 100) currentRate = 100;
  if (currentRate > 100000) currentRate = 100000;

  // Сохраняем новый курс в Firebase
  set(rateRef, currentRate);

  // Обновляем отображение курса
  updateRateDisplay(currentRate, oldRate);
}

// Запускаем обновление курса каждые 60 секунд (60000 миллисекунд)
setInterval(updateRate, 60000); // каждые 60 секунд

// Конвертация
window.convert = function convert() {
  const ronbucks = document.getElementById('ronbucks').value;
  if (ronbucks && currentRate) {
    const dollars = ronbucks * currentRate;
    document.getElementById('result').innerText = `${ronbucks} Рон-баксов = ${dollars.toLocaleString()} долларов`;
  } else {
    document.getElementById('result').innerText = 'Введите количество Рон-баксов!';
  }
};
