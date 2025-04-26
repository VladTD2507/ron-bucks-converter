import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentRate = 1488;
const rateRef = ref(db, 'rate');

get(rateRef).then((snapshot) => {
  if (snapshot.exists()) {
    currentRate = snapshot.val();
    console.log(`[${new Date().toLocaleTimeString()}] Курс загружен: ${currentRate}`);
    updateRateDisplay(currentRate, currentRate);
  } else {
    set(rateRef, currentRate);
    console.log(`[${new Date().toLocaleTimeString()}] Курс установлен стартовый: ${currentRate}`);
  }
});

function updateRateDisplay(newRate, oldRate) {
  const rateElement = document.getElementById('rate');
  rateElement.innerText = `Текущий курс: 1 Рон-бакс = ${newRate} долларов`;

  if (newRate > oldRate) {
    rateElement.style.color = "green";
  } else if (newRate < oldRate) {
    rateElement.style.color = "red";
  } else {
    rateElement.style.color = "black";
  }
}

function updateRate() {
  const chance = Math.random();
  let changeAmount = Math.floor(Math.random() * 20) + 1; // 1-20

  const oldRate = currentRate;

  if (chance < 0.7) {
    currentRate += changeAmount;
    console.log(`[${new Date().toLocaleTimeString()}] Курс увеличился на +${changeAmount} → ${currentRate}`);
  } else {
    currentRate -= changeAmount;
    console.log(`[${new Date().toLocaleTimeString()}] Курс уменьшился на -${changeAmount} → ${currentRate}`);
  }

  if (currentRate < 100) currentRate = 100;
  if (currentRate > 100000) currentRate = 100000;

  set(rateRef, currentRate);
  updateRateDisplay(currentRate, oldRate);
}

setInterval(updateRate, 60000); // обновление раз в 60 сек

window.convert = function() {
  const ronbucks = document.getElementById('ronbucks').value;
  if (ronbucks && currentRate) {
    const dollars = ronbucks * currentRate;
    document.getElementById('result').innerText = `${ronbucks} Рон-баксов = ${dollars.toLocaleString()} долларов`;
  } else {
    document.getElementById('result').innerText = 'Введите количество Рон-баксов!';
  }
};

window.loginAdmin = function() {
  const password = document.getElementById('adminPassword').value;
  if (password === "1234") {
    window.location.href = "admin.html";
  } else {
    alert("Неверный пароль!");
  }
};
