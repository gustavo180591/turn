import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const ClientScreenButton = () => {
  return (
    <Tooltip title="Abrir Pantalla Cliente">
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
    </Tooltip>
  );
};

export default ClientScreenButton;
