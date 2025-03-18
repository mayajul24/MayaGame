import React, { useState, useEffect } from "react";
import { Stack, Typography, TextField,DialogActions,DialogTitle,Dialog,DialogContent,DialogContentText,Button } from "@mui/material";

function GameRoom({ roomId, playerName, isGameStarted, setIsGameStarted,socket }) {
  const [timer, setTimer] = useState(10); 
  const [category, setCategory] = useState(""); 
  const [playerInput, setPlayerInput] = useState("");
  const [message, setMessage] = useState(""); 
  const [answers,setAnswers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [results,setResults] = useState([]);
  console.log(`Rendering GameRoom:`);

  const categories = ["Animals", "Fruits", "Countries", "Movies"];

  useEffect(() => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    setCategory(randomCategory);
    setMessage(`Count all the ${randomCategory} you remember in one minute! Ready... Set... Go!`);
    const handleGameOver = () => {
      console.log("in handle game over");
      console.log("Current timer:", timer); 
  
      if (timer <= 0) {
        let splitted = playerInput.split("\n");
        const filteredAnswers = splitted.filter((word) => word.trim().length > 0);
        console.log("answers: "+filteredAnswers)
        setAnswers(filteredAnswers);
        setOpenDialog(true);
        socket.emit("sendAnswers", {
          roomId,
          playerName,
          answers: filteredAnswers
        });
        
      }
    };
    const handleTimerUpdate = (timerDuration) =>
      {
        setTimer(timerDuration)
      }
    const handleUpdateAnswers = (updatedAnswers) => {
      console.log("Updated answers received:", updatedAnswers);
      setResults(updatedAnswers)
    };
    
    socket.on("updateAnswers", handleUpdateAnswers);
    socket.on("gameOver", handleGameOver);
    socket.on("timerUpdate",handleTimerUpdate)

    return () => {
      socket.off("timerUpdate", handleTimerUpdate);
      socket.off("gameOver", handleGameOver);
      socket.off("updateAnswers", handleUpdateAnswers);
    };
  }, [socket,timer]);
  

 
  
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const announceWinner = () =>
  {
    let winning_message=""
    let maxWords = 0
    let winner=""

    for(let playerName in results )
    {
      if (results[playerName].length > maxWords)
      {
        maxWords = results[playerName].length
        winner = playerName
      }
    }
    if (winner===playerName)
    {
      winning_message = " You won the game!"
    }
    else 
    {
      winning_message = " The winner is "+winner+"!"
    }
    return winning_message
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
        <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="game-over-dialog-title"
        aria-describedby="game-over-dialog-description"
      >
        <DialogTitle id="game-over-dialog-title">
          Game Over!
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="game-over-dialog-description">
            Time's up! 
            {announceWinner()}
          </DialogContentText>
          <Stack spacing={1} mt={2}>
            <Typography variant="subtitle1">Your answers:</Typography>
            {answers.map((answer, index) => (
              answer.trim() && (
                <Typography key={index} variant="body2">
                  {index + 1}. {answer}
                </Typography>
              )
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>  
  );
}

export default GameRoom;