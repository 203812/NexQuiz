// 🔥 FIREBASE CONFIG (replace with yours)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "XXXX",
  appId: "XXXX"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let username = "";
let room = "";

// Example Question
const quizData = {
  question: "What is the capital of France?",
  answers: ["Paris", "Berlin", "Madrid", "Rome"],
  correct: "Paris"
};

function joinRoom() {
  username = document.getElementById("username").value;
  room = document.getElementById("room").value;

  if (!username || !room) return alert("Fill in all fields!");

  document.getElementById("join-screen").classList.add("hidden");
  document.getElementById("quiz-screen").classList.remove("hidden");
  document.getElementById("leaderboard").classList.remove("hidden");

  db.ref("rooms/" + room + "/players/" + username).set({
    score: 0
  });

  loadQuestion();
  listenLeaderboard();
}

function loadQuestion() {
  document.getElementById("question").innerText = quizData.question;

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  quizData.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.innerText = answer;
    btn.onclick = () => submitAnswer(answer);
    answersDiv.appendChild(btn);
  });
}

function submitAnswer(answer) {
  if (answer === quizData.correct) {
    db.ref("rooms/" + room + "/players/" + username + "/score")
      .transaction(score => (score || 0) + 10);
  }
}

function listenLeaderboard() {
  db.ref("rooms/" + room + "/players").on("value", snapshot => {
    const players = snapshot.val();
    const list = document.getElementById("players");
    list.innerHTML = "";

    for (let player in players) {
      const li = document.createElement("li");
      li.innerText = player + " - " + players[player].score;
      list.appendChild(li);
    }
  });
}
