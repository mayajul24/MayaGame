require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (you might want to change this in production)
  },
});

app.use(cors());
app.get("/", (req, res) => {
  res.send("Game Server is Running!");
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

let rooms = {}; // Store game rooms and players
let gameTimers = {}; // Store active timers for each room
let playerAnswers = {}; // Store player answers for each room

// Handle socket connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

// Handle player joining a room
// Handle player joining a room
socket.on("joinRoom", ({ playerName, roomId }) => {
  if (!rooms[roomId]) {
    rooms[roomId] = []; // Create a new room if it doesn't exist
    playerAnswers[roomId] = {}; // Initialize answers object for this room
  }

  // Add player object with playerName, socketId, and empty answers array
  rooms[roomId].push({ playerName, socketId: socket.id, answers: [] });
  socket.join(roomId);
  console.log(`${playerName} joined room ${roomId}`);

  // First emit a notification to others in the room
  socket.to(roomId).emit("playerJoined", `${playerName} has joined the room!`);
  
  // Then emit the updated list of players to everyone (including the new player)
  io.to(roomId).emit("roomPlayers", rooms[roomId]);
});
  
  // Handle game start
  socket.on("startGame", (roomId) => {
    console.log(`Game started in room: ${roomId}`);
    io.to(roomId).emit("gameStarted");
    let timerDuration = 10; // 60 seconds for the timer (use seconds instead of ms)
    gameTimers[roomId] = setInterval(() => {
      if (timerDuration <= 0) {
        clearInterval(gameTimers[roomId]); // Stop the timer once it's done
        io.to(roomId).emit("gameOver", playerAnswers[roomId]); // Emit all answers to all players
        playerAnswers[roomId] = {}; // Reset answers after the game ends
      } else {
        timerDuration--;
        io.to(roomId).emit("timerUpdate", timerDuration); // Emit the remaining time
         // Decrease the timer by 1 second
      }
    }, 1000); // Update every second

    // Notify players that the game is starting
    
  });
  socket.on("sendAnswers", ({ roomId, playerName, answers }) => {
    console.log(`Received answers from ${playerName} in room ${roomId}:`, answers);
  
    // Ensure room exists in the answers object
    if (!playerAnswers[roomId]) {
      playerAnswers[roomId] = {};
    }
  
    // Store player's answers
    playerAnswers[roomId][playerName] = answers;
  
    // Optionally, broadcast updated answers to the room
    io.to(roomId).emit("updateAnswers", playerAnswers[roomId]);
  });
  // When a player disconnects
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  
    // Remove the player from rooms and notify others
    for (let roomId in rooms) {
      const playerIndex = rooms[roomId].findIndex(player => player.socketId === socket.id);
      
      if (playerIndex !== -1) {
        // Get the player name before removing them
        const playerName = rooms[roomId][playerIndex].playerName;
        
        // Remove player from the room
        rooms[roomId].splice(playerIndex, 1);
        
        // Notify others with the player's name
        socket.to(roomId).emit("playerLeft", `${playerName} left the room.`);
        
        // Update the player list for everyone in the room
        io.to(roomId).emit("roomPlayers", rooms[roomId]);
        
        // If room is empty, clean up associated data
        if (rooms[roomId].length === 0) {
          delete rooms[roomId];
          delete playerAnswers[roomId];
          if (gameTimers[roomId]) {
            clearInterval(gameTimers[roomId]);
            delete gameTimers[roomId];
          }
        }
      }
    }
  });
});