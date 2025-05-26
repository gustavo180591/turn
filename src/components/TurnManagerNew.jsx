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
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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

  useEffect(() => {
    const savedBoxes = JSON.parse(localStorage.getItem('boxes') || '[]');
    const savedNumBoxes = parseInt(localStorage.getItem('numBoxes') || '3');
    const savedTurns = JSON.parse(localStorage.getItem('turns') || '[]');
    const savedHistory = JSON.parse(localStorage.getItem('calledHistory') || '[]');
    const savedCurrentTurn = JSON.parse(localStorage.getItem('currentTurn') || 'null');
    
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
    
    const newBoxes = Array.from({ length: newNum }, (_, i) => ({
      id: (i + 1).toString(),
      name: `Box ${i + 1}`,
      active: true
    }));
    
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

  const _toggleBox = (boxId) => {
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
    <Container maxWidth="md">
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Sistema de Turnos
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Tooltip title={`Cajas: ${numBoxes}`}>
            <IconButton onClick={() => setConfigOpen(true)}>
              <SettingsIcon />
            </IconButton>
          </Tooltip>
          <IconButton 
            onClick={() => window.open('/client', '_blank')}
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            <OpenInNewIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Paper 
          sx={{ 
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Registrar Turno
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              sx={{ mt: 2 }}
            >
              Registrar Turno
            </Button>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Paper 
          sx={{ 
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Seleccionar Box
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {boxes.map((box) => (
              <Button
                key={box.id}
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
            ))}
          </Box>
        </Paper>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Paper 
          sx={{ 
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Llamar Turno
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleCallNext}
            disabled={turns.length === 0 || !selectedBox}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            Llamar Siguiente
          </Button>
        </Paper>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Paper 
          sx={{ 
            p: 3,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography variant="h5" gutterBottom>
            Últimos 5 llamados
          </Typography>
          <List>
            {calledHistory.map((historyItem) => (
              <ListItem key={historyItem.id}>
                <ListItemText
                  primary={`${historyItem.lastName} ${formatDni(historyItem.dni)}`}
                  secondary={`Box ${historyItem.box} - ${new Date(historyItem.timestamp).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      <Dialog open={configOpen} onClose={() => setConfigOpen(false)}>
        <DialogTitle>Configuración</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Número de Cajas</InputLabel>
            <Select
              value={numBoxes}
              onChange={handleNumBoxesChange}
              label="Número de Cajas"
            >
              {[...Array(10)].map((_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {i + 1} Caja(s)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TurnManager;
