import React, { useState, useEffect } from "react";
import { List,ListItemText,Divider,ListItem, Button, Stack, Typography, CircularProgress } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import GameRoom from "../GameRoom";

function WaitingRoom({ roomId, setRoomId, playerName, setPlayerName, socket }) {
  const [isJoining, setIsJoining] = useState(false);
  const [message, setMessage] = useState("");
  const [playersInRoom, setPlayersInRoom] = useState([]);
  const [isGameStarted,setIsGameStarted] = useState(false);
  console.log(`Rendering WaitingRoom: isJoining=${isJoining}`);

  useEffect(() => {
    console.log("Setting up socket listeners");
    
    // Handle connection
    const handleConnect = () => {
      console.log("Connected to server with ID:", socket.id);
    };
    
    // Handle room players update
    const handleRoomPlayers = (players) => {
      console.log("Updated player list:", players);
      setPlayersInRoom(players); // Direct assignment, no spread needed
    };
    const handleGameStart = (players) => {
      console.log("Game starts");
      setIsGameStarted(true); // Direct assignment, no spread needed
    };
    
    // Handle player left notification
    const handlePlayerLeft = (message) => {
      console.log(message);
      setMessage(message);
      // Server will send updated player list separately
    };

    // Set up event listeners
    socket.on("connect", handleConnect);
    socket.on("roomPlayers", handleRoomPlayers);
    socket.on("playerLeft", handlePlayerLeft);
    socket.on("gameStarted",handleGameStart)

    // Clean up event listeners on component unmount
    return () => {
      console.log("Disconnecting socket listeners");
      socket.off("connect", handleConnect);
      socket.off("roomPlayers", handleRoomPlayers);
      socket.off("playerLeft", handlePlayerLeft);
      socket.off("gameStarted",handleGameStart);
      
    };
  }, [socket]); // Only depend on socket
  const handleStartGame = ()=>{
    console.log("button start clicked")
    socket.emit("startGame",roomId);
  }
  return ( !isGameStarted ?
    <Stack spacing={3} alignItems="center">
      <Typography variant="h5" color="primary">
        Waiting Room: {roomId}
      </Typography>

      <Typography variant="h6">Players in Room:</Typography>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {playersInRoom.map((player) => (
          <React.Fragment key={player.socketId}>
            <ListItem>
              <ListItemText primary={player.playerName} /> 
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      {message && (
        <Typography variant="body2" color="error">
          {message}
        </Typography>
      )}

      <Button
        variant="contained"
        color="secondary"
        fullWidth
        startIcon={<MeetingRoomIcon />}
        disabled={playersInRoom.length < 2} 
        onClick={handleStartGame}
      >
        Start Game
      </Button>
    </Stack> 
    : <GameRoom 
        roomId={roomId}
        setRoomId={setRoomId}
        playerName={playerName}
        setPlayerName={setPlayerName}
        socket={socket} />
  );
}

export default WaitingRoom;