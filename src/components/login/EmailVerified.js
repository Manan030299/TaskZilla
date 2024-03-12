import React, {useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {Link, useLocation} from 'react-router-dom';
import {applyActionCode, getAuth} from 'firebase/auth';
import {app} from '../../Firebase';

export const EmailVerified = () => {
  const auth = getAuth(app);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const oobCode = searchParams.get('oobCode');

  useEffect(() => {
    applyActionCode(auth, oobCode)
        .then((res) => {
          console.log(res);
          return res.json();
        })
        .then((data) => {
          console.log(data);
          // return data;
        })
        .catch((error) => {
          console.log('Error applying action code:', error.message);
        });
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Typography variant="h3" gutterBottom>
      Email Verified Successfully
      </Typography>
      <Typography variant="body1" gutterBottom>
      Your email has been successfully verified.
      You can now sign in to your account.
      </Typography>
      <Button variant="contained" component={Link} to="/login" mt={4}>
      Sign In
      </Button>
    </Box>
  );
};
