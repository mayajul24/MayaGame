import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Divider,
} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import WaitingRoom from './components/WaitingRoom';
import GameRoom from './GameRoom';
import JoinRoom from './components/JoinRoom';
const socket = io("http://localhost:3000"); // Change to your server URL

const theme = createTheme({
  palette: {
    primary: {
      main: '#6200ea',
    },
    secondary: {
      main: '#03dac6',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
    },
  },
});

function App() {
  const [roomId, setRoomId] = useState("");          // Room the player joins
  const [playerName, setPlayerName] = useState("");  // Player's name

  console.log(`Rendering App:`);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          py: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
              <SportsEsportsIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h4" component="h1" color="primary">
                Maya's Game
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

           <JoinRoom
              roomId={roomId}
              setRoomId={setRoomId}
              playerName={playerName}
              setPlayerName={setPlayerName}
              socket={socket}  // Pass socket as a prop
           />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;