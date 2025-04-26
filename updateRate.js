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

let currentRate = 1488; // Начальный курс, если в базе данных пусто

// Получаем текущий курс из Firebase
const rateRef = ref(db, 'rate');

// Проверка, если курс уже установлен в базе данных
get(rateRef).then((snapshot) => {
  if (snapshot.exists()) {
    currentRate = snapshot.val(); // Берем курс из базы данных
    console.log(`Курс загружен: 1 Рон-бакс = ${currentRate} долларов`);
  } else {
    // Если курс отсутствует в базе, установим начальный курс
    set(rateRef, currentRate);
    console.log(`Курс установлен на начальный: 1 Рон-бакс = ${currentRate} долларов`);
  }
});

// Функция для плавного изменения курса
function updateRate() {
  const change = Math.floor(Math.random() * 200) - 100; // от -100 до +100
  currentRate += change;

  if (currentRate < 100) currentRate = 100;
  if (currentRate > 100000) currentRate = 100000;

  const rateRef = ref(db, 'rate');
  set(rateRef, currentRate); // Сохраняем новый курс в Firebase

  console.log(`Новый курс установлен: ${currentRate}`);
}

// Обновляем курс каждые 60 секунд (1 минута)
setInterval(updateRate, 60000); // 60000 мс = 1 минута
