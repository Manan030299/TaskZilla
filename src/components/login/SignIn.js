import React from 'react';
import {useState, useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import LightWave from '../../assets/Images/lightModeWave.png';
import DarkWave from '../../assets/Images/darkModeWave.png';
import {ThemeContext} from '../../App';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {app, database} from '../../Firebase';
import {toast} from 'react-hot-toast';
import {get, onValue, ref, update} from 'firebase/database';

export const SignIn = () => {
  const [signinInput, setSigninInput] = useState({
    email: '',
    password: '',
  });
  const [errorMessages, setErrorMessages] = useState({
    email: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const mode = useContext(ThemeContext);
  const auth = getAuth(app);

  const handleCheck = () => {
    setRememberMe(!rememberMe);
  };

  const onHandleChange = (e) => {
    const {name, value} = e.target;
    setSigninInput({...signinInput, [name]: value});
  };

  const handleValidation = () => {
    setLoading(true);
    let isError = false;
    const validationMessages = {
      email: '',
      password: '',
    };
    if (!signinInput.email) {
      validationMessages.email = 'Please enter email address';
      isError = true;
    }
    if (!signinInput.password) {
      validationMessages.password = 'Please enter password';
      isError = true;
    }

    if (isError) {
      setErrorMessages(validationMessages);
      setLoading(false);
    }
    if (!isError) {
      signInWithEmailAndPassword(auth, signinInput.email, signinInput.password)
          .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            if (user.emailVerified) {
              onValue(ref(database, 'users/' + user.uid), (snapshot) => {
                const userData = snapshot.val();
                if (userData && userData.projectId && userData.projectId.length > 0) {
                  onValue(ref(database, 'projectList/' + userData.projectId[0]), (data) => {
                    const projectData = data.val();
                    const isUserIdPresent = projectData.activeUsers.includes(user.uid);
                    if (!isUserIdPresent) {
                      const activeMemRef = ref(database, 'projectList/' + userData.projectId);
                      const activeUserList = projectData.activeUsers || [];
                      const message = `${userData.firstName} ${userData.lastName} 
                      has accepted the request to join the team.`;

                      activeUserList.forEach(async (uid) => {
                        const notificationRef = ref(database, 'users/' + uid +
                        '/notifications/' + userData.projectId);
                        const notificationSnapshot = await get(notificationRef);
                        const notificationVal = notificationSnapshot.val();
                        const notification = notificationVal ?
                        notificationVal.data || [] : [];
                        notification.push(message);
                        update(notificationRef, {data: notification});
                      });

                      activeUserList.push(user.uid);
                      update(activeMemRef, {activeUsers: activeUserList});
                    }
                  });
                } else {
                  if (userData.role === 'admin' && !userData.projectId) {
                    navigate('/create-project');
                  }
                  if (userData.role !== 'admin' && !userData.projectId) {
                    navigate('/access-denied');
                  }
                }
              });
              if (rememberMe) {
                localStorage.setItem('uid', user.uid);
              }
              if (!rememberMe) {
                sessionStorage.setItem('uid', user.uid);
              }
              toast.success('User Logged Successfully');
              navigate('/dashboard');
            } else {
              toast.error('Please verify your email first');
            }
            // ...
            setLoading(false);
          })
          .catch((error) => {
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
    }
  };

  const goToSignUp = () => {
    navigate('/signup');
  };

  return (
    <>
      <Box
        sx={{
          fontFamily: 'Arial',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          height: '100vh',
        }}>
        <FormControl
          sx={{
            zIndex: '2',
          }}>
          <Typography
            variant="h3"
            marginBottom='10px'>
            TaskZilla
          </Typography>
          <Typography
            variant="subtitle1"
            marginBottom='20px'
          >
            Sign in and start managing your candidates!
          </Typography>
          <TextField
            sx={{
              margin: '0px 0px 10px 0px',
            }}
            variant="outlined"
            type='email'
            name='email'
            value={signinInput.email.toLowerCase()}
            onChange={onHandleChange}
            label="Email Address"
            helperText={errorMessages.email}
            error={errorMessages.email? true : false}
          />
          <TextField
            sx={{
              margin: '10px 0px 0px 0px',
            }}
            variant="outlined"
            type='password'
            name='password'
            value={signinInput.password}
            onChange={onHandleChange}
            label="Password"
            helperText={errorMessages.password}
            error={errorMessages.password? true : false}
          />
          <Box >
            <FormControlLabel
              sx={{marginRight: '45px'}}
              control={
                <Checkbox name='rememberMe'
                  checked={rememberMe}
                  onChange={handleCheck}
                />} label="Remember me" />
            <Link
              underline='none'
              href=''>
              Forgot password?
            </Link>
          </Box>
          <Button
            onClick={handleValidation}
            disabled={loading}
            type='submit'
            variant="contained"
            sx={{
              padding: '10px',
              fontSize: '1rem',
              margin: '10px 0',
              fontWeight: '400',
              borderRadius: '10px',
              boxShadow: '0px 4px 4px 0px #0000004D',
              marginBottom: '20px'}}>
            {loading ? 'Loading...' : 'Login'}
          </Button>
          <Typography
            variant="subtitle1"
            marginBottom='100px'>
              Don&apos;t have an account?&nbsp;
            <Link
              fontWeight='600'
              underline='none'
              onClick={goToSignUp}
              sx={{
                cursor: 'pointer',
              }}>
                Sign up
            </Link>
          </Typography>
        </FormControl>
      </Box>

      {mode === 'light'?
      <img
        style={{
          width: '100vw',
          position: 'absolute',
          bottom: '0',
          zIndex: '0'}}
        src={LightWave} alt='Wave' /> :
      <img
        style={{
          width: '100vw',
          position: 'absolute',
          bottom: '0',
          zIndex: '0'}}
        src={DarkWave} alt='Wave' />}
    </>
  );
};
