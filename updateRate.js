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

// Получаем курс из базы данных
const rateRef = ref(db, 'rate');

get(rateRef).then((snapshot) => {
  if (snapshot.exists()) {
    currentRate = snapshot.val();
    console.log(`[${new Date().toLocaleTimeString()}] Курс загружен: ${currentRate}`);
    updateRateDisplay(currentRate, currentRate); // сразу обновляем на странице
  } else {
    set(rateRef, currentRate);
    console.log(`[${new Date().toLocaleTimeString()}] Курс установлен стартовый: ${currentRate}`);
    updateRateDisplay(currentRate, currentRate);
  }
});

// Обновление курса на странице
function updateRateDisplay(newRate, oldRate) {
  const rateElement = document.getElementById('rate');
  rateElement.innerText = `Текущий курс: 1 Рон-бакс = ${newRate} долларов`;

  // Цвет текста
  if (newRate > oldRate) {
    rateElement.style.color = "green"; // курс вырос
  } else if (newRate < oldRate) {
    rateElement.style.color = "red"; // курс упал
  } else {
    rateElement.style.color = "black"; // без изменений
  }
}

// Обновляем курс
function updateRate() {
  const oldRate = currentRate;
  const chance = Math.random();

  if (chance < 0.9) {
    // 90% шанс чуть-чуть увеличить курс
    const increasePercent = 0.0005 + Math.random() * 0.0015; // от 0.05% до 0.2%
    const increaseAmount = Math.floor(currentRate * increasePercent);
    currentRate += increaseAmount;
    console.log(`[${new Date().toLocaleTimeString()}] Курс увеличился на +${increaseAmount} → ${currentRate}`);
  } else {
    // 10% шанс слегка уменьшить курс
    const decreasePercent = 0.0005; // фиксированное уменьшение 0.05%
    const decreaseAmount = Math.floor(currentRate * decreasePercent);
    currentRate -= decreaseAmount;
    console.log(`[${new Date().toLocaleTimeString()}] Курс уменьшился на -${decreaseAmount} → ${currentRate}`);
  }

  // Ограничения
  if (currentRate < 100) currentRate = 100;
  if (currentRate > 100000) currentRate = 100000;

  // Сохраняем в Firebase
  set(rateRef, currentRate);

  // Обновляем текст на странице
  updateRateDisplay(currentRate, oldRate);
}

// Запускаем обновление курса каждые 10 секунд
setInterval(updateRate, 10000);

// Конвертация Рон-баксов в доллары
window.convert = function convert() {
  const ronbucks = document.getElementById('ronbucks').value;
  if (ronbucks && currentRate) {
    const dollars = ronbucks * currentRate;
    document.getElementById('result').innerText = `${ronbucks} Рон-баксов = ${dollars.toLocaleString()} долларов`;
  } else {
    document.getElementById('result').innerText = 'Введите количество Рон-баксов!';
  }
};
