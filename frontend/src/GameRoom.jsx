import React, { useState, useEffect } from "react";
import { Stack, Typography, TextField } from "@mui/material";

function GameRoom({ roomId, playerName, isGameStarted, setIsGameStarted,socket }) {
  const [timer, setTimer] = useState(10); // Set default timer (10 seconds for now)
  const [category, setCategory] = useState(""); // Category for the round
  const [playerInput, setPlayerInput] = useState(""); // Player's input
  const [message, setMessage] = useState(""); // Game messages
  const [answers,setAnswers] = useState([]);
  console.log(`Rendering GameRoom:`);

  const categories = ["Animals", "Fruits", "Countries", "Movies"];

  useEffect(() => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    setCategory(randomCategory);
    setMessage(`Count all the ${randomCategory} you remember in one minute! Ready... Set... Go!`);
    // Set your timer logic here (using setInterval or similar)
    socket.on("timerUpdate",handleTimerUpdate)
    socket.on("gameOver",handleGameOver)
  }, []);
  const handleGameOver = ()=>
  {
    console.log("in handle game over")
    console.log("timer: "+timer)

    if(timer<=0)
      {
        let splitted = playerInput.split('\n');
        setAnswers(splitted);
        console.log(splitted);
      }
  } 

  const handleTimerUpdate = (timerDuration) =>
  {
    setTimer(timerDuration)
  }


  return (
    <Stack spacing={3}>
      <Typography variant="h6">Room: {roomId}</Typography>
      <Typography variant="h6" align="center" color="primary">{message}</Typography>      
        <>
          <Typography variant="h5" align="center" color="secondary">
            Time Left: {timer}s
          </Typography>
          <TextField
            label={`Your ${category} answers`}
            variant="outlined"
            fullWidth
            value={playerInput}
            onChange={(e) =>  setPlayerInput(e.target.value)}
            placeholder={`Type your ${category}...`}
            multiline
            disabled = {timer<=0}
            rows={4}
          />
        </>
    </Stack>
  );
}

export default GameRoom;