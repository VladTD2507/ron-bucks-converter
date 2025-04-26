import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Твои настройки Firebase
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
let rateLoaded = false; // Флаг загрузки курса

const rateRef = ref(db, 'rate');

// Загружаем текущий курс из базы
get(rateRef).then((snapshot) => {
  if (snapshot.exists()) {
    currentRate = snapshot.val();
    console.log(`[${new Date().toLocaleTimeString()}] Курс загружен: ${currentRate}`);
  } else {
    set(rateRef, currentRate);
    console.log(`[${new Date().toLocaleTimeString()}] Установлен стартовый курс: ${currentRate}`);
  }
  rateLoaded = true;
});

// Функция для обновления курса
function updateRate() {
  if (!rateLoaded) {
    console.log('Курс ещё не загружен. Пропуск обновления.');
    return;
  }

  const increaseChance = Math.random(); // шанс увеличить курс
  const maxChange = currentRate * 0.05; // максимум 5% изменения
  const changeAmount = Math.floor(Math.random() * maxChange);

  if (increaseChance < 0.7) {
    currentRate += changeAmount; // 70% шанс поднятия курса
  } else {
    currentRate -= changeAmount; // 30% шанс понижения курса
  }

  if (currentRate < 100) currentRate = 100;
  if (currentRate > 100000) currentRate = 100000;

  set(rateRef, currentRate);

  console.log(`[${new Date().toLocaleTimeString()}] Новый курс: ${currentRate}`);
}

// Старт обновления курса каждые 10 секунд
setInterval(() => {
  updateRate();
}, 10000); // 10000 мс = 10 секунд
