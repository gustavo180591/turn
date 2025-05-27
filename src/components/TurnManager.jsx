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
  const [boxes, setBoxes] = useState([]);
  const [numBoxes, setNumBoxes] = useState(1);
  const [selectedBox, setSelectedBox] = useState(null);
  const [currentTurn, setCurrentTurn] = useState(null);
  const [calledHistory, setCalledHistory] = useState([]);
  const [CONFIG_OPEN, setCONFIG_OPEN] = useState(false);

  useEffect(() => {
    const savedNumBoxes = localStorage.getItem('numBoxes');
    if (savedNumBoxes) {
      const initialBoxes = Array.from({ length: savedNumBoxes }, (_, i) => ({
        id: i + 1,
        name: `Box ${i + 1}`,
        active: true,
      }));
      setBoxes(initialBoxes);
      setNumBoxes(savedNumBoxes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('numBoxes', numBoxes.toString());
    localStorage.setItem('boxes', JSON.stringify(boxes));
    localStorage.setItem('turns', JSON.stringify(turns));
    localStorage.setItem('calledHistory', JSON.stringify(calledHistory));
    localStorage.setItem('currentTurn', JSON.stringify(currentTurn));
  }, [numBoxes, boxes, turns, calledHistory, currentTurn]);

  const _handleNumBoxesChange = (event) => {
    const newNum = parseInt(event.target.value);
    const newBoxes = Array.from({ length: newNum }, (_, i) => ({
      id: i + 1,
      name: `Box ${i + 1}`,
      active: true,
    }));
    setBoxes(newBoxes);
    setNumBoxes(newNum);
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


  const handleBoxSelect = (boxId) => {
    setSelectedBox(boxId);
  };

  const handleCallNext = () => {
    if (!selectedBox || !boxes[selectedBox - 1].active) return;

    const nextTurn = turns[0];
    if (!nextTurn) return;

    const newHistoryItem = {
      id: Date.now(),
      name: nextTurn.name,
      lastName: nextTurn.lastName,
      dni: nextTurn.dni,
      box: boxes[selectedBox - 1].name,
      timestamp: new Date().toISOString()
    };

    setCalledHistory([newHistoryItem, ...calledHistory].slice(0, 5));
    setCurrentTurn({
      ...newHistoryItem,
      name: `${nextTurn.name} ${nextTurn.lastName}`,
      box: boxes[selectedBox - 1].name
    });
    setTurns(turns.slice(1));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ mt: 4, bgcolor: 'background.default', minHeight: '100vh', p: 4 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Sistema de Turnos
          </Typography>
        </Box>
      );;
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Último turno llamado: {currentTurn ? `${currentTurn.name} - ${currentTurn.dni}` : 'Ninguno'}
        </Typography>
      </Container>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <TextField
            variant="outlined"
            label="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            sx={{ flex: 1 }}
          />
          <TextField
            variant="outlined"
            label="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            fullWidth
            sx={{ flex: 1 }}
          />
          <TextField
            variant="outlined"
            label="DNI"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            required
            fullWidth
            sx={{ flex: 1 }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ flex: 1 }}
          >
            Tomar Turno
          </Button>
        </Box>
      </form>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Tooltip title={`Cajas: ${numBoxes}`}>
          <IconButton onClick={() => setCONFIG_OPEN(true)}>
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <TextField
          label="Número de Cajas"
          type="number"
          value={numBoxes}
          onChange={_handleNumBoxesChange}
          sx={{ width: '100px' }}
        />
        <ButtonGroup variant="outlined">
          {boxes.map((box) => (
            <Button
              key={box.id}
              onClick={() => handleBoxSelect(box.id)}
              sx={{
                bgcolor: selectedBox === box.id ? 'primary.main' : 'transparent',
                color: selectedBox === box.id ? 'white' : 'inherit',
                '&:hover': { bgcolor: 'primary.light' },
              }}
            >
              {box.name}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCallNext}
        disabled={!selectedBox || !boxes[selectedBox - 1].active}
        sx={{ mb: 2 }}
      >
        Llamar Siguiente
      </Button>

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

      <Box
        sx={{
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
          p: 3,
          bgcolor: 'background.paper',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
          Turnos en espera:
        </Typography>
        <List sx={{ bgcolor: 'background.paper' }}>
          {turns.map(turn => (
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
                secondary={`Box ${turn.box}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      </Box>
    );
};

export default TurnManager;
