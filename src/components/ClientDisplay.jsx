import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const ClientDisplay = () => {
  const theme = useTheme();
  const [currentTurn, setCurrentTurn] = useState(null);
  const [calledHistory, setCalledHistory] = useState([]);
  const [_refreshInterval, setRefreshInterval] = useState(null);

  // Load data from localStorage
  const loadData = () => {
    const savedCalledHistory = JSON.parse(localStorage.getItem('calledHistory') || '[]');
    const savedCurrentTurn = JSON.parse(localStorage.getItem('currentTurn') || 'null');
    
    // Get the current turn
    setCurrentTurn(savedCurrentTurn);
    
    // Get called history (last 5 entries)
    const history = savedCalledHistory
      .slice(0, 5); // Already sorted by date in TurnManager
    setCalledHistory(history);
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    loadData(); // Initial load
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    setRefreshInterval(interval);
    return () => clearInterval(interval);
  }, []);

  // Update when localStorage changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      loadData();
    });

    observer.observe(document, { subtree: true, childList: true });
    return () => observer.disconnect();
  }, []);

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    >
      {/* Black border with 1cm margin */}
      <Box
        sx={{
          width: 'calc(100% - 2cm)',
          height: 'calc(100% - 2cm)',
          bgcolor: 'black',
          position: 'absolute',
          top: '1cm',
          left: '1cm',
          zIndex: 2,
        }}
      />
      {/* Green background with content */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: theme.palette.primary.light,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{
            color: 'black',
            fontSize: '3rem',
            fontWeight: 600,
            mb: 2,
            textAlign: 'center',
          }}
        >
          Turno de:
        </Typography>
        {currentTurn && (
          <Typography
            variant="h2"
            component="h2"
            sx={{
              color: 'black',
              fontSize: '5rem',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            {currentTurn && currentTurn.name} {currentTurn && currentTurn.lastName}
            <br />
            {currentTurn && currentTurn.dni.slice(-3)}
            <br />
            Box: {currentTurn && currentTurn.box}
          </Typography>
        )}
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mb: 4,
            textAlign: 'center',
          }}
        >
          Último turno llamado: {currentTurn ? `${currentTurn.name} - ${currentTurn.dni}` : 'Ninguno'}
        </Typography>
        <Typography
          variant="h3"
          component="h3"
          sx={{
            color: 'black',
            fontSize: '2rem',
            fontWeight: 600,
            mb: 2,
            textAlign: 'center',
          }}
        >
          Últimos 5 turnos llamados:
        </Typography>
        <Box sx={{ width: '80%', maxWidth: '600px' }}>
          <List>
            {calledHistory.map((turn, index) => (
              <ListItem key={index} sx={{ mb: 1 }}>
                <ListItemText
                  primary={`${turn.name} ${turn.lastName} - ${turn.dni.slice(-3)}`}
                  secondary={`Box: ${turn.box} - ${new Date(turn.calledAt).toLocaleString()}`}
                  sx={{ color: 'black' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientDisplay;
