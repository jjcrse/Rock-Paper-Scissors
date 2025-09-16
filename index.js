const express = require("express");
const path = require("path");
const { Server } = require("socket.io");
const { createServer } = require("http");

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  path: "/real-time",
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use("/app1", express.static(path.join(__dirname, "app1")));
app.use("/app2", express.static(path.join(__dirname, "app2")));


let gameState = {
  players: {
    player1: { name: "Jugador 1", choice: null, ready: false },
    player2: { name: "Jugador 2", choice: null, ready: false }
  },
  round: 1,
  scores: { player1: 0, player2: 0 },
  gameStatus: "waiting", 
  winner: null,
  lastRound: null
};


const gameLogic = {
  rock: { beats: "scissors", loses: "paper" },
  paper: { beats: "rock", loses: "scissors" },
  scissors: { beats: "paper", loses: "rock" }
};

function determineWinner(choice1, choice2) {
  if (choice1 === choice2) return "tie";
  if (gameLogic[choice1].beats === choice2) return "player1";
  return "player2";
}

function resetGame() {
  gameState.players.player1.choice = null;
  gameState.players.player1.ready = false;
  gameState.players.player2.choice = null;
  gameState.players.player2.ready = false;
  gameState.gameStatus = "waiting";
  gameState.winner = null;
  gameState.lastRound = null;
}


app.get("/game-state", (req, res) => {
  res.json(gameState);
});

app.post("/make-choice", (req, res) => {
  const { player, choice } = req.body;
  
  if (!gameState.players[player] || !["rock", "paper", "scissors"].includes(choice)) {
    return res.status(400).json({ error: "Invalid player or choice" });
  }

  gameState.players[player].choice = choice;
  gameState.players[player].ready = true;

  
  if (gameState.players.player1.ready && gameState.players.player2.ready) {
    const winner = determineWinner(
      gameState.players.player1.choice,
      gameState.players.player2.choice
    );

    gameState.lastRound = {
      player1Choice: gameState.players.player1.choice,
      player2Choice: gameState.players.player2.choice,
      winner: winner
    };

    if (winner !== "tie") {
      gameState.scores[winner]++;
    }

    gameState.gameStatus = "finished";
    gameState.winner = winner;

    io.emit("game-result", gameState);
  } else {
    
    io.emit("game-update", gameState);
  }

  res.json({ success: true, gameState });
});

app.post("/new-round", (req, res) => {
  gameState.round++;
  resetGame();
  io.emit("new-round", gameState);
  res.json({ success: true, gameState });
});

app.post("/reset-game", (req, res) => {
  gameState.round = 1;
  gameState.scores = { player1: 0, player2: 0 };
  resetGame();
  io.emit("game-reset", gameState);
  res.json({ success: true, gameState });
});


io.on("connection", (socket) => {
  console.log("Cliente conectado:", socket.id);
  
  socket.emit("game-state", gameState);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

httpServer.listen(5050, () =>
  console.log(`Server running at http://localhost:${5050}`)
);
