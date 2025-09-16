const socket = io("http://localhost:5050", {
  path: "/real-time",
});

const currentRoundEl = document.getElementById("current-round");
const player1ScoreEl = document.getElementById("player1-score");
const player2ScoreEl = document.getElementById("player2-score");
const waitingStatusEl = document.getElementById("waiting-status");
const playingStatusEl = document.getElementById("playing-status");
const finishedStatusEl = document.getElementById("finished-status");
const player1ChoiceIconEl = document.getElementById("player1-choice-icon");
const player2ChoiceIconEl = document.getElementById("player2-choice-icon");
const winnerTextEl = document.getElementById("winner-text");
const newRoundBtnEl = document.getElementById("new-round-btn");
const resetGameBtnEl = document.getElementById("reset-game-btn");
const connectionIndicatorEl = document.getElementById("connection-indicator");

const choiceIcons = {
  rock: "🪨",
  paper: "📄",
  scissors: "✂️"
};

let gameState = null;

function updateUI(state) {
  gameState = state;
  
  currentRoundEl.textContent = state.round;
  
  player1ScoreEl.textContent = state.scores.player1;
  player2ScoreEl.textContent = state.scores.player2;
  
  waitingStatusEl.classList.toggle("hidden", state.gameStatus !== "waiting");
  playingStatusEl.classList.toggle("hidden", state.gameStatus !== "playing");
  finishedStatusEl.classList.toggle("hidden", state.gameStatus !== "finished");
  
  if (state.gameStatus === "finished" && state.lastRound) {
    const { player1Choice, player2Choice, winner } = state.lastRound;
    
    player1ChoiceIconEl.textContent = choiceIcons[player1Choice] || "❓";
    player2ChoiceIconEl.textContent = choiceIcons[player2Choice] || "❓";
    
    if (winner === "tie") {
      winnerTextEl.textContent = "¡Empate!";
      winnerTextEl.className = "tie";
    } else if (winner === "player1") {
      winnerTextEl.textContent = "¡Jugador 1 Gana!";
      winnerTextEl.className = "winner player1";
    } else {
      winnerTextEl.textContent = "¡Jugador 2 Gana!";
      winnerTextEl.className = "winner player2";
    }
  }
}

function updateConnectionStatus(connected) {
  const indicator = connectionIndicatorEl;
  const dot = indicator.querySelector(".dot");
  const text = indicator.querySelector("span:last-child");
  
  if (connected) {
    indicator.className = "indicator connected";
    text.textContent = "Conectado";
  } else {
    indicator.className = "indicator disconnected";
    text.textContent = "Desconectado";
  }
}

newRoundBtnEl.addEventListener("click", () => {
  fetch("http://localhost:5050/new-round", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log("Nueva ronda iniciada:", data);
  })
  .catch(error => {
    console.error("Error al iniciar nueva ronda:", error);
  });
});

resetGameBtnEl.addEventListener("click", () => {
  fetch("http://localhost:5050/reset-game", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log("Juego reiniciado:", data);
  })
  .catch(error => {
    console.error("Error al reiniciar juego:", error);
  });
});

socket.on("connect", () => {
  console.log("Conectado al servidor");
  updateConnectionStatus(true);
});

socket.on("disconnect", () => {
  console.log("Desconectado del servidor");
  updateConnectionStatus(false);
});

socket.on("game-state", (state) => {
  console.log("Estado del juego recibido:", state);
  updateUI(state);
});

socket.on("game-update", (state) => {
  console.log("Actualización del juego:", state);
  updateUI(state);
});

socket.on("game-result", (state) => {
  console.log("Resultado del juego:", state);
  updateUI(state);
});

socket.on("new-round", (state) => {
  console.log("Nueva ronda:", state);
  updateUI(state);
});

socket.on("game-reset", (state) => {
  console.log("Juego reiniciado:", state);
  updateUI(state);
});

fetch("http://localhost:5050/game-state")
  .then(response => response.json())
  .then(data => {
    console.log("Estado inicial del juego:", data);
    updateUI(data);
  })
  .catch(error => {
    console.error("Error al cargar estado del juego:", error);
  });