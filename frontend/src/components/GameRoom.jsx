import React, { useState } from "react";
import { io } from "socket.io-client";
import { TextField, Button, Container, Typography, Box, Paper, Divider, Stack, CircularProgress } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import GameScreen from "./GameScreen"; // Import new GameScreen component

const socket = io("http://localhost:3000"); // Adjust for production

const theme = createTheme({
  palette: {
    primary: { main: '#6200ea' },
    secondary: { main: '#03dac6' },
    background: { default: '#f5f5f5' },
  },
});

function App() {
  const [roomId, setRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      setIsJoining(true);
      setTimeout(() => {
        socket.emit("joinRoom", roomId);
        setIsJoining(false);
        setHasJoined(true);
      }, 1000);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
            <SportsEsportsIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h4" component="h1" color="primary">Maya's Game</Typography>
          </Box>
          <Divider sx={{ mb: 4 }} />

          {!hasJoined ? (
            <Stack spacing={3}>
              <TextField label="Player Name" variant="outlined" fullWidth value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
              <TextField label="Room ID" variant="outlined" fullWidth value={roomId} onChange={(e) => setRoomId(e.target.value)} />
              <Button variant="contained" color="primary" fullWidth onClick={handleJoinRoom} disabled={isJoining} startIcon={isJoining ? <CircularProgress size={20} color="inherit" /> : <MeetingRoomIcon />}>
                {isJoining ? "Joining..." : "Join Room"}
              </Button>
            </Stack>
          ) : (
            <GameScreen playerName={playerName} roomId={roomId} socket={socket} /> // Pass data to GameScreen
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
