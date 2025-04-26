import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, set, onValue, get } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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

let currentRate = 1488; // Начальный курс
let rateLoaded = false; // Флаг что курс загружен

const rateRef = ref(db, 'rate');

// Загружаем текущий курс из базы
get(rateRef).then((snapshot) => {
  if (snapshot.exists()) {
    currentRate = snapshot.val();
    console.log(`Курс загружен: ${currentRate}`);
  } else {
    set(rateRef, currentRate);
    console.log(`Установлен начальный курс: ${currentRate}`);
  }
  rateLoaded = true; // Теперь можно менять курс
});

// Функция обновления курса
function updateRate() {
  if (!rateLoaded) {
    console.log('Курс ещё не загружен. Пропуск обновления.');
    return;
  }

  const increaseChance = Math.random();
  const maxChange = currentRate * 0.15;
  const changeAmount = Math.floor(Math.random() * maxChange);

  if (increaseChance < 0.7) {
    currentRate += changeAmount;
  } else {
    currentRate -= changeAmount;
  }

  if (currentRate < 100) currentRate = 100;
  if (currentRate > 100000) currentRate = 100000;

  set(rateRef, currentRate);

  console.log(`Новый курс установлен: ${currentRate}`);
}

// Стартуем обновление курса только после загрузки
setTimeout(() => {
  if (rateLoaded) {
    updateRate();
    setInterval(updateRate, 60000); // Каждую минуту
  } else {
    console.log('Курс ещё не загружен. Ждём.');
  }
}, 60000);
