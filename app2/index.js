const socket = io("http://localhost:5050", {
  path: "/real-time",
});

const selectPlayer1Btn = document.getElementById("select-player1");
const selectPlayer2Btn = document.getElementById("select-player2");
const currentPlayerNameEl = document.getElementById("current-player-name");
const playerStatusEl = document.getElementById("player-status");
const choiceButtons = document.querySelectorAll(".choice-btn");
const currentRoundEl = document.getElementById("current-round");
const player1ScoreEl = document.getElementById("player1-score");
const player2ScoreEl = document.getElementById("player2-score");
const connectionIndicatorEl = document.getElementById("connection-indicator");

let currentPlayer = "player1";
let gameState = null;
let hasMadeChoice = false;

function updateUI(state) {
  gameState = state;
  
  currentRoundEl.textContent = state.round;
  
  player1ScoreEl.textContent = state.scores.player1;
  player2ScoreEl.textContent = state.scores.player2;
  
  const playerData = state.players[currentPlayer];
  if (playerData) {
    if (playerData.ready) {
      playerStatusEl.innerHTML = `<p>✅ Has elegido: <strong>${getChoiceText(playerData.choice)}</strong></p>`;
      hasMadeChoice = true;
      disableChoiceButtons();
    } else {
      playerStatusEl.innerHTML = `<p>Esperando tu elección...</p>`;
      hasMadeChoice = false;
      enableChoiceButtons();
    }
  }
  
  if (state.gameStatus === "finished") {
    if (state.lastRound) {
      const { player1Choice, player2Choice, winner } = state.lastRound;
      const playerChoice = currentPlayer === "player1" ? player1Choice : player2Choice;
      const opponentChoice = currentPlayer === "player1" ? player2Choice : player1Choice;
      
      let resultText = "";
      if (winner === "tie") {
        resultText = "¡Empate!";
      } else if (winner === currentPlayer) {
        resultText = "¡Ganaste!";
      } else {
        resultText = "¡Perdiste!";
      }
      
      playerStatusEl.innerHTML = `
        <p>${resultText}</p>
        <p>Tu elección: <strong>${getChoiceText(playerChoice)}</strong></p>
        <p>Oponente: <strong>${getChoiceText(opponentChoice)}</strong></p>
      `;
    }
  }
}

function getChoiceText(choice) {
  const choiceTexts = {
    rock: "Piedra 🪨",
    paper: "Papel 📄",
    scissors: "Tijera ✂️"
  };
  return choiceTexts[choice] || choice;
}

function enableChoiceButtons() {
  choiceButtons.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("disabled");
  });
}

function disableChoiceButtons() {
  choiceButtons.forEach(btn => {
    btn.disabled = true;
    btn.classList.add("disabled");
  });
}

function updateConnectionStatus(connected) {
  const indicator = connectionIndicatorEl;
  const text = indicator.querySelector("span:last-child");
  
  if (connected) {
    indicator.className = "indicator connected";
    text.textContent = "Conectado";
  } else {
    indicator.className = "indicator disconnected";
    text.textContent = "Desconectado";
  }
}

function makeChoice(choice) {
  if (hasMadeChoice) return;
  
  fetch("http://localhost:5050/make-choice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      player: currentPlayer,
      choice: choice
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log("Elección enviada:", data);
    if (data.success) {
      updateUI(data.gameState);
    }
  })
  .catch(error => {
    console.error("Error al enviar elección:", error);
  });
}

selectPlayer1Btn.addEventListener("click", () => {
  currentPlayer = "player1";
  currentPlayerNameEl.textContent = "Jugador 1";
  selectPlayer1Btn.classList.add("active");
  selectPlayer2Btn.classList.remove("active");
  
  if (gameState) {
    updateUI(gameState);
  }
});

selectPlayer2Btn.addEventListener("click", () => {
  currentPlayer = "player2";
  currentPlayerNameEl.textContent = "Jugador 2";
  selectPlayer2Btn.classList.add("active");
  selectPlayer1Btn.classList.remove("active");
  
  if (gameState) {
    updateUI(gameState);
  }
});

choiceButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const choice = btn.dataset.choice;
    makeChoice(choice);
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
  hasMadeChoice = false;
  updateUI(state);
});

socket.on("game-reset", (state) => {
  console.log("Juego reiniciado:", state);
  hasMadeChoice = false;
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