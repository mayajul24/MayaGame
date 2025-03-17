import React, { useState, useEffect } from "react";
import { TextField, Button, Stack, Typography, CircularProgress } from "@mui/material";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import WaitingRoom from "./WaitingRoom";

function JoinRoom({ roomId, setRoomId, playerName, setPlayerName, socket }){
    const [isJoining, setIsJoining] = useState(false);
    const [message, setMessage] = useState("");
    const [hasJoinedRoom, setHasJoinedRoom] = useState(false); // Track if player is in a room
    
    console.log(`Rendering joinroom:`);

    const handleJoinRoom = () => {
        if (roomId.trim()) {
            console.log("setIsJoining");
            setIsJoining(true);
            socket.emit("joinRoom", { playerName, roomId });
            setMessage(`You have joined room: ${roomId}`);
            setIsJoining(false);
            console.log("setHasJoinedRoom");
            setHasJoinedRoom(true);
        } else {
          setMessage("Please enter a valid Room ID.");
        }
      };
      
      const handleLeaveRoom = () => {
        setHasJoinedRoom(false);
        setMessage("");
      };
      return ( 
         !hasJoinedRoom ? (
        <Stack spacing={3}>
          <Typography variant="h6">Join a Game Room</Typography>
          <TextField
            label="Player Name"
            variant="outlined"
            fullWidth
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
          />
          <TextField
            label="Room ID"
            variant="outlined"
            fullWidth
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room code"
            helperText="Enter an existing room code or create a new one"
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            onClick={handleJoinRoom}
            disabled={isJoining}
            startIcon={isJoining ? <CircularProgress size={20} color="inherit" /> : <MeetingRoomIcon />}
          >
            {isJoining ? "Joining..." : "Join Room"}
          </Button>
 
          {message && (
            <Typography variant="body2" color="info" sx={{ mt: 2, textAlign: "center" }}>
              {message}
            </Typography>
          )}
          
        </Stack>
      ):(<WaitingRoom
        roomId={roomId}
              setRoomId={setRoomId}
              playerName={playerName}
              setPlayerName={setPlayerName}
              socket={socket} />
            )
        )
}
export default JoinRoom;