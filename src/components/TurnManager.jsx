import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  ButtonGroup,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Link,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import ClientScreenButtonNew from './ClientScreenButtonNew';

const TurnManager = () => {
  const [turns, setTurns] = useState([]);
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dni, setDni] = useState('');
  const [currentTurn, setCurrentTurn] = useState(null);
  const [calledHistory, setCalledHistory] = useState([]);
  const [selectedBox, setSelectedBox] = useState('1');
  const [boxes, setBoxes] = useState([]);
  const [configOpen, setConfigOpen] = useState(false);
  const [numBoxes, setNumBoxes] = useState(3);

  // Load data from localStorage when component mounts
  useEffect(() => {
    const savedBoxes = JSON.parse(localStorage.getItem('boxes') || '[]');
    const savedNumBoxes = parseInt(localStorage.getItem('numBoxes') || '3');
    const savedTurns = JSON.parse(localStorage.getItem('turns') || '[]');
    const savedHistory = JSON.parse(localStorage.getItem('calledHistory') || '[]');
    const savedCurrentTurn = JSON.parse(localStorage.getItem('currentTurn') || 'null');
    
    // Initialize boxes based on saved or default number
    const initialBoxes = Array.from({ length: savedNumBoxes }, (_, i) => ({
      id: (i + 1).toString(),
      name: `Box ${i + 1}`,
      active: true
    }));
    
    setBoxes(savedBoxes.length > 0 ? savedBoxes : initialBoxes);
    setNumBoxes(savedNumBoxes);
    setTurns(savedTurns);
    setCalledHistory(savedHistory);
    setCurrentTurn(savedCurrentTurn);
  }, []);

  // Save data to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('boxes', JSON.stringify(boxes));
    localStorage.setItem('numBoxes', numBoxes.toString());
    localStorage.setItem('turns', JSON.stringify(turns));
    localStorage.setItem('calledHistory', JSON.stringify(calledHistory));
    localStorage.setItem('currentTurn', JSON.stringify(currentTurn));
  }, [boxes, numBoxes, turns, calledHistory, currentTurn]);

  const handleNumBoxesChange = (event) => {
    const newNum = parseInt(event.target.value);
    setNumBoxes(newNum);
    
    // Update boxes array when number changes
    const newBoxes = Array.from({ length: newNum }, (_, i) => ({
      id: (i + 1).toString(),
      name: `Box ${i + 1}`,
      active: true
    }));
    
    // Preserve active state of existing boxes
    newBoxes.forEach((newBox) => {
      const existingBox = boxes.find(b => b.id === newBox.id);
      if (existingBox) {
        newBox.active = existingBox.active;
      }
    });
    
    setBoxes(newBoxes);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !lastName || !dni) return;

    const newTurn = {
      id: Date.now(),
      name,
      lastName,
      dni,
    };

    setTurns([...turns, newTurn]);
    setName('');
    setLastName('');
    setDni('');
  };

  const formatDni = (dni) => {
    return dni.slice(-3);
  };

  const toggleBox = (boxId) => {
    setBoxes(boxes.map(box => 
      box.id === boxId ? { ...box, active: !box.active } : box
    ));
  };

  const handleBoxSelect = (boxId) => {
    if (boxes.find(box => box.id === boxId)?.active) {
      setSelectedBox(boxId);
    }
  };

  const handleCallNext = () => {
    if (turns.length > 0) {
      const nextTurn = turns[turns.length - 1];
      setCurrentTurn(nextTurn);
      
      // Add to history (only keep last 5 entries)
      const newHistory = [
        {
          id: nextTurn.id,
          lastName: nextTurn.lastName,
          dni: nextTurn.dni,
          box: selectedBox,
          timestamp: new Date().toISOString()
        },
        ...calledHistory
      ].slice(0, 5);
      
      setCalledHistory(newHistory);
      setTurns(turns.slice(0, -1));
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, bgcolor: 'background.default', minHeight: '100vh', p: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h1" component="h1" gutterBottom sx={{ color: 'primary.main' }}>
          Sistema de Turnos
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Sistema de gestión de turnos para adultos
        </Typography>
        
        <Paper
          sx={{
            p: 4,
            bgcolor: 'background.paper',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            borderRadius: 2,
          }}
        >
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                label="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
                sx={{ flex: 1 }}
              />
              <TextField
                label="Apellido"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                fullWidth
                sx={{ flex: 1 }}
              />
              <TextField
                label="DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                required
                fullWidth
                sx={{ flex: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ flex: 1 }}
              >
                Registrar Turno
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Tooltip title={`Cajas: ${numBoxes}`}>
          <IconButton onClick={() => setConfigOpen(true)}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <ClientScreenButtonNew />
      </Box>

      <Dialog open={configOpen} onClose={() => setConfigOpen(false)}>
        <DialogTitle>Configuración de Boxes</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Número de Boxes</InputLabel>
            <Select
              value={numBoxes}
              onChange={handleNumBoxesChange}
              label="Número de Boxes"
            >
              <MenuItem value={1}>1 Box</MenuItem>
              <MenuItem value={2}>2 Boxes</MenuItem>
              <MenuItem value={3}>3 Boxes</MenuItem>
              <MenuItem value={4}>4 Boxes</MenuItem>
              <MenuItem value={5}>5 Boxes</MenuItem>
              <MenuItem value={6}>6 Boxes</MenuItem>
              <MenuItem value={7}>7 Boxes</MenuItem>
              <MenuItem value={8}>8 Boxes</MenuItem>
              <MenuItem value={9}>9 Boxes</MenuItem>
              <MenuItem value={10}>10 Boxes</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Sistema de Turnos
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ flex: 1 }}
            >
              Registrar Turno
            </Button>
                  <Button
                    onClick={() => handleBoxSelect(box.id)}
                    variant="outlined"
                    size="large"
                    sx={{
                      bgcolor: selectedBox === box.id ? 'primary.main' : 'background.paper',
                      color: selectedBox === box.id ? 'white' : 'primary.main',
                      '&:hover': {
                        bgcolor: selectedBox === box.id ? 'primary.dark' : 'primary.light',
                      },
                    }}
                    disabled={!box.active}
                  >
                    {box.name}
                  </Button>
                  <IconButton
                    onClick={() => toggleBox(box.id)}
                    size="small"
                    sx={{
                      bgcolor: box.active ? 'success.main' : 'error.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: box.active ? 'success.dark' : 'error.dark',
                      },
                    }}
                  >
                    {box.active ? <CheckIcon /> : <CloseIcon />}
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>

          <Button
            variant="contained"
            color="secondary"
            onClick={handleCallNext}
            size="large"
            sx={{ mb: 4, px: 4, py: 2 }}
          >
            Llamar Siguiente
          </Button>

          {currentTurn && (
            <Paper
              elevation={4}
              sx={{
                p: 6,
                textAlign: 'center',
                minHeight: '300px',
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
                    color: '#1e8449', // Using the darker green directly
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
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
        </Box>

        <Box sx={{ mt: 4 }}>
          <Paper 
            sx={{ 
              p: 3,
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Últimos 5 llamados:
            </Typography>
            <List sx={{ bgcolor: 'background.paper' }}>
              {calledHistory.map((historyItem) => (
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
                      color: 'primary.main',
                    }}
                    primary={`${historyItem.lastName} ${formatDni(historyItem.dni)}`}
                    secondaryTypographyProps={{ color: 'text.secondary' }}
                    secondary={`Box ${historyItem.box} - ${new Date(historyItem.timestamp).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
        <Paper 
          sx={{ 
            p: 3,
            flex: 1,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
            Turnos en espera:
          </Typography>
          <List sx={{ bgcolor: 'background.paper' }}>
            {turns.map((turn, index) => (
              <ListItem 
                key={turn.id}
                sx={{
                  '&:hover': {
                    bgcolor: 'primary.light',
                  },
                }}
              >
                <ListItemText
                  primaryTypographyProps={{ 
                    fontWeight: 500,
                    color: 'primary.main',
                  }}
                  primary={`${turn.lastName} ${formatDni(turn.dni)}`}
                  secondaryTypographyProps={{ color: 'text.secondary' }}
                  secondary={`Posición: ${turns.length - index}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
};

export default TurnManager;
