import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';

const ClientDisplay = () => {
  const [currentTurn, setCurrentTurn] = useState(null);
  const [calledHistory, setCalledHistory] = useState([]);
  const [selectedBox, setSelectedBox] = useState('1');

  // Load data from localStorage
  useEffect(() => {
    const savedCurrentTurn = JSON.parse(localStorage.getItem('currentTurn') || 'null');
    const savedCalledHistory = JSON.parse(localStorage.getItem('calledHistory') || '[]');
    const savedSelectedBox = localStorage.getItem('selectedBox') || '1';
    
    setCurrentTurn(savedCurrentTurn);
    setCalledHistory(savedCalledHistory);
    setSelectedBox(savedSelectedBox);
  }, []);

  // Update when localStorage changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const savedCurrentTurn = JSON.parse(localStorage.getItem('currentTurn') || 'null');
      const savedCalledHistory = JSON.parse(localStorage.getItem('calledHistory') || '[]');
      const savedSelectedBox = localStorage.getItem('selectedBox') || '1';
      
      setCurrentTurn(savedCurrentTurn);
      setCalledHistory(savedCalledHistory);
      setSelectedBox(savedSelectedBox);
    });

    observer.observe(document, { subtree: true, childList: true });
    return () => observer.disconnect();
  }, []);

  return (
    <Container maxWidth="md" sx={{ mt: 4, bgcolor: 'background.default', minHeight: '100vh', p: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        {/* Current Turn Display */}
        {currentTurn && (
          <Paper
            elevation={4}
            sx={{
              p: 8,
              textAlign: 'center',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.light',
              borderRadius: 3,
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 600,
                  color: '#1e8449',
                  fontSize: '4rem',
                  lineHeight: 1.2,
                }}
              >
                {currentTurn.lastName} {currentTurn.dni.slice(-3)}
              </Typography>
              <Typography 
                variant="h2" 
                component="h2" 
                sx={{ 
                  color: 'secondary.main',
                  fontWeight: 600,
                  fontSize: '3rem',
                  lineHeight: 1.2,
                }}
              >
                Box {selectedBox}
              </Typography>
            </Box>
          </Paper>
        )}

        {/* History Display */}
        <Paper 
          sx={{ 
            p: 3,
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: '#1e8449', fontWeight: 600 }}>
            Últimos 5 llamados
          </Typography>
          <List sx={{ bgcolor: 'background.paper' }}>
            {calledHistory.map((historyItem, index) => (
              <ListItem 
                key={historyItem.id}
                sx={{
                  '&:hover': {
                    bgcolor: 'primary.light',
                  },
                }}
              >
                <ListItemText
                  primaryTypographyProps={{ 
                    fontWeight: 500,
                    color: '#1e8449',
                  }}
                  primary={`${historyItem.lastName} ${historyItem.dni.slice(-3)}`}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                  secondary={`Box ${historyItem.box} - ${new Date(historyItem.timestamp).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default ClientDisplay;
