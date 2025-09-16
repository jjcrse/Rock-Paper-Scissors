# 🪨 📄 ✂️ Juego de Piedra, Papel o Tijera con Socket.io

Un juego multijugador en tiempo real de piedra, papel o tijera desarrollado con Node.js, Express y Socket.io.

##  Características

- **Dos pantallas separadas**: Una para mostrar resultados y otra para que los jugadores hagan sus elecciones
- **Comunicación en tiempo real** con Socket.io
- **Interfaz moderna y responsiva** con CSS3 y gradientes
- **Sistema de puntuación** por rondas
- **Indicador de conexión** en tiempo real
- **Soporte para múltiples rondas** y reinicio del juego

##  Requisitos

- Node.js (versión 14 o superior)
- npm o yarn

##  Instalación
1.npm install

2.npm start


El servidor se ejecutará en `http://localhost:5050`

##  Cómo jugar

### Pantalla de Resultados (App1)
- **URL**: `http://localhost:5050/app1`
- Muestra el estado actual del juego
- Visualiza las puntuaciones de ambos jugadores
- Muestra los resultados de cada ronda
- Permite iniciar nuevas rondas o reiniciar el juego completo

### Pantalla de Jugadores (App2)
- **URL**: `http://localhost:5050/app2`
- Permite a los jugadores seleccionar su identidad (Jugador 1 o Jugador 2)
- Cada jugador puede elegir entre Piedra 🪨, Papel 📄 o Tijera ✂️
- Muestra el estado actual del jugador seleccionado
- Actualización en tiempo real del estado del juego

##  Reglas del Juego

1. **Piedra** 🪨 vence a **Tijera** ✂️
2. **Papel** 📄 vence a **Piedra** 🪨
3. **Tijera** ✂️ vence a **Papel** 📄
4. Si ambos jugadores eligen lo mismo, es un **empate**

## 🔧 API Endpoints

### GET `/game-state`
Obtiene el estado actual del juego.

### POST `/make-choice`
Envía la elección de un jugador.
```json
{
  "player": "player1" | "player2",
  "choice": "rock" | "paper" | "scissors"
}
```

### POST `/new-round`
Inicia una nueva ronda.

### POST `/reset-game`
Reinicia el juego completo.

##  Eventos de Socket.io

- `game-state`: Estado inicial del juego
- `game-update`: Actualización del estado del juego
- `game-result`: Resultado de una ronda
- `new-round`: Nueva ronda iniciada
- `game-reset`: Juego reiniciado

##  Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **WebSockets**: Socket.io
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Estilos**: CSS Grid, Flexbox, Gradientes, Animaciones


##  Funcionalidades Avanzadas

- **Sincronización en tiempo real** entre ambas pantallas
- **Indicadores visuales** de conexión
- **Feedback visual** inmediato para las acciones del usuario
- **Sistema de estados** robusto para manejar diferentes fases del juego

