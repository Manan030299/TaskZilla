import React from 'react';
import {Box} from '@mui/material';
import {Typography} from '@mui/material';
import unhappy from '../../assets/Images/unhappy.png';

export const InvitationReject = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
      }}>
      <Box
        sx={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'end',
        }}>
        <Typography variant='h3'>
            TaskZilla
        </Typography>
      </Box>
      <Box sx={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        marginTop: '0px',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <img
          style={{
            height: '300px',
            width: '300px',
          }}
          src={unhappy} alt='unhappy'
        />
        <Typography
          variant="h5"
          sx={{
            marginTop: '0px',
            maxWidth: '60vw',
            whiteSpace: 'pre-line',
          }}>
            Thank you for considering the invitation to join the project on TaskZilla.
            We respect your decision to reject the invitation.
        </Typography>
      </Box>
    </Box>
  );
};
