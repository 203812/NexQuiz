let playerName = "";
let score = 0;
let currentQuestion = 0;
let timerInterval;
let timeLeft = 10;

const quizData = [
  {
    question: "What is the capital of France?",
    answers: ["Paris", "Berlin", "Madrid", "Rome"],
    correct: "Paris"
  },
  {
    question: "2 + 2 = ?",
    answers: ["3", "4", "5", "6"],
    correct: "4"
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: ["Earth", "Mars", "Jupiter", "Saturn"],
    correct: "Mars"
  }
];

function startGame() {
  playerName = document.getElementById("player-name").value;
  if (!playerName) return alert("Enter your name!");

  document.getElementById("start-screen").classList.add("hidden");
  document.getElementById("quiz-screen").classList.remove("hidden");

  loadQuestion();
}

function loadQuestion() {
  if (currentQuestion >= quizData.length) {
    endGame();
    return;
  }

  const questionObj = quizData[currentQuestion];
  document.getElementById("question").innerText = questionObj.question;

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  questionObj.answers.forEach(answer => {
    const btn = document.createElement("button");
    btn.innerText = answer;
    btn.onclick = () => submitAnswer(answer);
    answersDiv.appendChild(btn);
  });

  startTimer();
}

function submitAnswer(answer) {
  clearInterval(timerInterval);

  if (answer === quizData[currentQuestion].correct) {
    score += timeLeft * 10;
  }

  currentQuestion++;
  loadQuestion();
}

function startTimer() {
  timeLeft = 10;
  document.getElementById("timer").innerText = "Time left: " + timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = "Time left: " + timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      currentQuestion++;
      loadQuestion();
    }
  }, 1000);
}

function endGame() {
  document.getElementById("quiz-screen").classList.add("hidden");
  document.getElementById("end-screen").classList.remove("hidden");
  document.getElementById("final-score").innerText =
    playerName + ", your score: " + score;

  saveScore();
  loadLeaderboard();
}

function restartGame() {
  score = 0;
  currentQuestion = 0;
  document.getElementById("end-screen").classList.add("hidden");
  document.getElementById("start-screen").classList.remove("hidden");
}

function saveScore() {
  let leaderboard = JSON.parse(localStorage.getItem("nexquiz-leaderboard")) || [];
  leaderboard.push({ name: playerName, score: score });

  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 10);

  localStorage.setItem("nexquiz-leaderboard", JSON.stringify(leaderboard));
}

function loadLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("nexquiz-leaderboard")) || [];
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";

  leaderboard.forEach(player => {
    const li = document.createElement("li");
    li.innerText = player.name + " - " + player.score;
    list.appendChild(li);
  });
}

loadLeaderboard();
