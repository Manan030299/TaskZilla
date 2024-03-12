import React from 'react';
import {Box, Button} from '@mui/material';
import {Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import error from '../../assets/Images/error.png';

export const NoAccess = () => {
  const navigate = useNavigate();
  const goToLoginPage = () => {
    localStorage.clear()||sessionStorage.clear();
    navigate('/login');
  };
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}>
        <img
          style={{
            height: '300px',
            width: '500px',
          }}
          src={error} alt='error'
        />
        <Typography
          variant="h4"
          sx={{
          }}>
            Sorry, You don&rsquo;t have access for the project.
        </Typography>
        <Button
          variant='contained'
          onClick={goToLoginPage}
          sx={{
            marginTop: '20px',
            height: '36px',
            borderRadius: '10px',
            padding: '10px',
          }}
        >
            Go back to login page
        </Button>
      </Box>
    </Box>
  );
};
