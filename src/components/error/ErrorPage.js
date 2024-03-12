import React from 'react';
import {Box, Grid, Typography} from '@mui/material';
import error from '../../assets/Images/error.png';

export const ErrorPage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        textAlign: 'center',
      }}>
      <Grid container>
        <Grid item xs={7}>
          <Typography variant='h1'
            sx={{
              marginTop: '100px',
              fontSize: '12rem',
              fontWeight: '600',
            }}>
            404
          </Typography>
          <Typography
            variant='h3'
            sx={{
              fontWeight: '600',
            }}>
            Oops! Page not found
          </Typography>
          <Typography
            variant='h5'
            sx={{
              marginTop: '20px',
              fontWeight: '600',
            }}>
            Sorry, the page you&apos;re looking for doesn&apos;t exist.
          </Typography>
        </Grid>
        <Grid item xs={5}
          sx={{
            minHeight: '100vh',
          }}>
          <img
            style={{
              marginTop: '150px',
            }}
            src={error} alt='error'
          />
        </Grid>
      </Grid>
    </Box>
  );
};
