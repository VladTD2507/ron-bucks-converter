// 1. Подключаем Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// 2. Твои настройки Firebase
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

// 3. Инициализация Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 4. Получить текущий курс из базы
async function getCurrentRate() {
  const rateRef = ref(db, 'rate');
  const snapshot = await get(rateRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return 500; // если вдруг курса нет — стартовый
  }
}

// 5. Установить новый курс в базу
async function updateRate(newRate) {
  const rateRef = ref(db, 'rate');
  await set(rateRef, newRate);
  console.log(`✅ Курс обновлен: ${newRate}`);
}

// 6. Генерация нового курса
function getNewRate(oldRate) {
  const minChange = 0.95; // максимум уменьшение на 5%
  const maxChange = 1.05; // максимум увеличение на 5%
  const randomMultiplier = Math.random() * (maxChange - minChange) + minChange;
  let newRate = oldRate * randomMultiplier;
  newRate = Math.max(100, Math.min(newRate, 100000)); // курс не выходит за пределы
  return Math.round(newRate); // округляем до целого числа
}

// 7. Основная функция: обновление каждую минуту
async function main() {
  console.log("⏳ Запуск автообновления курса...");
  setInterval(async () => {
    const currentRate = await getCurrentRate();
    const updatedRate = getNewRate(currentRate);
    await updateRate(updatedRate);
  }, 60000); // каждые 60 секунд
}

// 8. Запуск
main();