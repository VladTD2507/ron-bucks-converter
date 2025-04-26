import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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

let currentRate = 1488; // Начальный курс

// Функция для плавного изменения курса
function updateRate() {
  const change = Math.floor(Math.random() * 200) - 100; // от -100 до +100
  currentRate += change;

  if (currentRate < 100) currentRate = 100;
  if (currentRate > 100000) currentRate = 100000;

  const rateRef = ref(db, 'rate');
  set(rateRef, currentRate);

  console.log(`Новый курс установлен: ${currentRate}`);
}

// Сразу обновляем и потом каждую минуту
updateRate();
setInterval(updateRate, 60000); // 60000 мс = 1 минута
