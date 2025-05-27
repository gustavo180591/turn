import React, { useEffect, useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
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
    const history = savedCalledHistory.slice(0, 5); // Already sorted by date in TurnManager
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
        backgroundColor: '#f5f5f5',
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
          borderRadius: '10px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        }}
      />
      {/* Main content container */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 3,
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* Left side - Current Turn */}
        <Box
          sx={{
            flex: 1,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.palette.primary.light,
            borderRight: '2px solid rgba(0,0,0,0.1)',
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{
              color: 'black',
              fontSize: '2.5rem',
              fontWeight: 700,
              mb: 4,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            Turno Actual
          </Typography>
          
          {currentTurn ? (
            <Box
              sx={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '2rem',
                width: '80%',
                maxWidth: '600px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                textAlign: 'center',
                border: '3px solid #2e7d32',
              }}
            >
              <Typography
                variant="h1"
                component="div"
                sx={{
                  color: '#2e7d32',
                  fontSize: '4rem',
                  fontWeight: 800,
                  mb: 2,
                  lineHeight: 1.2,
                }}
              >
                {currentTurn.lastName}
              </Typography>
              
              <Typography
                variant="h2"
                component="div"
                sx={{
                  color: '#333',
                  fontSize: '3rem',
                  fontWeight: 600,
                  mb: 3,
                  backgroundColor: '#f0f0f0',
                  display: 'inline-block',
                  px: 3,
                  py: 1,
                  borderRadius: '5px',
                }}
              >
               DNI: {currentTurn.dni ? currentTurn.dni.slice(-3) : '---'}
              </Typography>
              
              <Box
                sx={{
                  backgroundColor: '#2e7d32',
                  color: 'white',
                  display: 'inline-flex',
                  alignItems: 'center',
                  px: 4,
                  py: 2,
                  borderRadius: '30px',
                  mt: 2,
                }}
              >
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                  }}
                >
                  Box: {currentTurn?.box || 'N/A'}
                </Typography>
              </Box>
            </Box>
          ) : (
            <Box
              sx={{
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderRadius: '10px',
                padding: '3rem',
                width: '80%',
                maxWidth: '600px',
                textAlign: 'center',
                border: '2px dashed #aaa',
              }}
            >
              <Typography
                variant="h4"
                component="div"
                sx={{
                  color: '#666',
                  fontWeight: 500,
                }}
              >
                No hay nadie siendo atendido actualmente
              </Typography>
            </Box>
          )}
        </Box>

        {/* Vertical Divider */}
        <Divider orientation="vertical" flexItem />

        {/* Right side - Called History */}
        <Box
          sx={{
            flex: 1,
            padding: '2rem',
            backgroundColor: '#f9f9f9',
            overflowY: 'auto',
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{
              color: '#333',
              fontSize: '2rem',
              fontWeight: 600,
              mb: 3,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              position: 'sticky',
              top: 0,
              backgroundColor: '#f9f9f9',
              py: 2,
              zIndex: 1,
              borderBottom: '2px solid #eee',
            }}
          >
            Historial de Llamados
          </Typography>
          
          <List sx={{ width: '100%', maxWidth: '800px', margin: '0 auto', py: 2 }}>
            {calledHistory.length > 0 ? (
              calledHistory.map((turn, index) => (
                <React.Fragment key={index}>
                  <ListItem 
                    sx={{
                      backgroundColor: 'white',
                      mb: 3,
                      borderRadius: '10px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      p: 0,
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                      },
                    }}
                  >
                    <Box sx={{ width: '100%', p: 3 }}>
                      <Box 
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          justifyContent: 'space-between',
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          mb: 2,
                          gap: 2,
                        }}
                      >
                        <Typography
                          variant="h4"
                          component="div"
                          sx={{
                            fontWeight: 700,
                            color: '#2e7d32',
                            fontSize: { xs: '1.8rem', sm: '2.2rem' },
                            lineHeight: 1.2,
                          }}
                        >
                          {turn.lastName}
                        </Typography>
                        
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                          }}
                        >
                          <Box
                            sx={{
                              backgroundColor: '#2e7d32',
                              color: 'white',
                              px: 3,
                              py: 1.5,
                              borderRadius: '25px',
                              fontWeight: 700,
                              fontSize: '1.4rem',
                              minWidth: '120px',
                              textAlign: 'center',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            }}
                          >
                            Box: {turn.box || 'N/A'}
                          </Box>
                          
                          {turn.timestamp && (
                            <Box
                              sx={{
                                backgroundColor: '#e8f5e9',
                                color: '#2e7d32',
                                px: 2.5,
                                py: 1,
                                borderRadius: '20px',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                minWidth: '100px',
                                textAlign: 'center',
                              }}
                            >
                              {new Date(turn.timestamp).toLocaleTimeString()}
                            </Box>
                          )}
                        </Box>
                      </Box>
                      
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 2,
                          pt: 2,
                          borderTop: '1px solid #eee',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              fontSize: '1.5rem',
                              fontWeight: 700,
                              color: '#333',
                            }}
                          >
                            DNI: 
                          </Typography>
                          <Typography
                            variant="h5"
                            sx={{
                              fontSize: '1.8rem',
                              fontWeight: 800,
                              color: '#2e7d32',
                              letterSpacing: '1px',
                            }}
                          >
                            {turn.dni ? turn.dni.slice(-3) : '---'}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            backgroundColor: '#e3f2fd',
                            color: '#1565c0',
                            px: 2,
                            py: 0.5,
                            borderRadius: '4px',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                        >
                          <Box
                            sx={{
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: '#1565c0',
                              mr: 1,
                            }}
                          />
                          Box: {turn.box}
                        </Box>
                      </Box>
                    </Box>
                  </ListItem>
                  {index < calledHistory.length - 1 && (
                    <Divider variant="middle" component="li" sx={{ my: 1 }} />
                  )}
                </React.Fragment>
              ))
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 4,
                  color: '#777',
                }}
              >
                <Typography variant="h6">
                  No hay historial de turnos llamados
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Los turnos llamados aparecerán aquí
                </Typography>
              </Box>
            )}
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default ClientDisplay;
