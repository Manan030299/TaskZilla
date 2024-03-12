import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import {useParams, useNavigate} from 'react-router-dom';
import {app, database} from '../../Firebase';
import {getAuth, createUserWithEmailAndPassword,
  sendEmailVerification, updateProfile} from 'firebase/auth';
import {onValue, ref, remove, set, update} from 'firebase/database';
import {digitsRegExp, lowercaseRegExp, minLengthRegExp,
  specialCharRegExp, uppercaseRegExp} from '../../constant/config';
import {toast} from 'react-hot-toast';
import JoinTeam from '../../assets/Images/jointeam.png';

export const InviteUser = () => {
  const [inviteUserData, setInviteUserData] = useState({});
  const [activeStep, setActiveStep] = useState(0);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  const [errorMessages, setErrorMessages] = useState({
    password: '',
    confirmPassword: '',
  });

  const [userInput, setUserInput] = useState({
    password: '',
    confirmPassword: '',
  });

  const params = useParams();
  const userId = params.uid;
  const refId = params.referenceId;

  useEffect(() => {
    onValue(ref(database, 'inviteUser/' + userId), (snapshot) => {
      const data = snapshot.val() || 0;
      setInviteUserData(data);
      if (data.status === 'REJECTED') {
        navigate('/reject');
      }
      if (data.status === 'CANCELLED') {
        navigate('*');
      }
    });
  }, [refId, userId]);

  const navigate = useNavigate();
  const auth = getAuth(app);

  const steps = ['Join TaskZilla Team', 'Create Password'];

  const handleAccept = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReject = () => {
    update(ref(database, 'inviteUser/' + userId), {
      ...inviteUserData,
      status: 'REJECTED',
    });
    setOpenConfirmationDialog(false);
  };

  const handleInput = (e) => {
    const {name, value} = e.target;
    setUserInput({...userInput, [name]: value});
  };

  const inviteUserSignUp = () => {
    const validationMessages = {
      password: '',
      confirmPassword: '',
    };
    let isError = false;
    let message = '';

    if (!minLengthRegExp.test(userInput.password)) {
      message = message + 'one 8 characters, ';
      isError = true;
    }

    if (!uppercaseRegExp.test(userInput.password)) {
      message = message + 'one upper case, ';
      isError = true;
    }

    if (!lowercaseRegExp.test(userInput.password)) {
      message = message + 'one lower case, ';
      isError = true;
    }

    if (!specialCharRegExp.test(userInput.password)) {
      message = message + 'one special Character, ';
      isError = true;
    }

    if (!digitsRegExp.test(userInput.password)) {
      message = message + 'one  number ';
      isError = true;
    }

    if (userInput.confirmPassword === userInput.password) {
      validationMessages.confirmPassword = '';
    } else {
      validationMessages.confirmPassword = 'Passwords do not match';
      isError = true;
    }

    validationMessages.password = message ?
    'Password should contain atleast ' + message : '';
    setErrorMessages(validationMessages);

    if (isError) {
      setErrorMessages(validationMessages);
    }
    if (!isError) {
      const projId = [];
      projId.push(inviteUserData.projectId);
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      const a = 1;
      createUserWithEmailAndPassword(
          auth, inviteUserData.emailId, userInput.password)
          .then((userCredential) => {
          // Signed in
            const user = userCredential.user;
            set(ref(database, 'users/' + user.uid), {
              firstName: inviteUserData.firstName,
              lastName: inviteUserData.lastName,
              email: inviteUserData.emailId,
              role: inviteUserData.role,
              uid: user.uid,
              projectId: projId,
              avatarColor: `rgba(${r}, ${g}, ${b}, ${a})`,
            })
                .then(async () => {
                  updateProfile(auth.currentUser, {
                    displayName: `${inviteUserData.firstName}`,
                  }).then(() => {
                    // Profile updated!
                    // ...
                    sendEmailVerification(auth.currentUser)
                        .then(() => {
                          toast.success('Verification email sent');
                        })
                        .catch((error) => {
                          toast.error(error);
                        });
                  }).catch((error) => {
                    // An error occurred
                    // ...
                  });

                  remove(ref(database, `inviteUser/${userId}`));
                  toast.success('User join Successfully!');
                  navigate('/login');
                });
          })
          .catch((error) => {
            const errorMessage = error.message;
            toast.error(errorMessage);
          // ..
          });
    }
  };

  return (
    <Box minHeight="100vh">
      <Grid container>
        <Grid item xs={6}
          sx={{padding: '40px'}}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              return (
                <Step key={`label_${index}`}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          <Box
            sx={{marginTop: '20px',
              display: 'flex',
              justifyContent: 'center'}}>
            {activeStep === 0 && (
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    marginBottom: '10px',
                  }}>
                  Hello, {inviteUserData.firstName} {inviteUserData.lastName}
                </Typography>
                <Typography variant="h6">
                  Manan Sharma has invited you to join their team on TaskZilla.
                </Typography>
                <Typography variant="h6">
                  Are you sure you want to join this project?
                </Typography>
                <Grid
                  gap={3}
                  container
                  sx={{
                    marginTop: '20px',
                    display: 'flex',
                    justifyContent: 'right',
                  }}
                >
                  <Grid item>
                    <Button
                      variant="text"
                      onClick={() => setOpenConfirmationDialog(true)}
                      sx={{
                        borderRadius: '10px',
                        minWidth: 'max-content',
                        padding: '10px',
                        height: '32px',
                      }}
                    >
                      Reject
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={handleAccept}
                      sx={{
                        borderRadius: '10px',
                        minWidth: 'max-content',
                        padding: '10px',
                        height: '32px',
                      }}>
                      Accept
                    </Button>
                  </Grid>
                </Grid>
                <Dialog open={openConfirmationDialog}
                  maxWidth='md'
                  sx={{'& .MuiDialog-paper': {
                    borderRadius: '10px',
                    maxWidth: '500px',
                  }}}>
                  <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                    sx={{padding: '30px'}}>
                    <Typography variant='h6'>
                      Are you sure you want to reject the request to join this project ?
                    </Typography>
                    <Grid container columnGap={2}
                      sx={{
                        marginTop: '20px',
                        justifyContent: 'flex-end'}}>
                      <Grid>
                        <Button
                          variant='text'
                          onClick={() => setOpenConfirmationDialog(false)}
                          sx={{
                            borderRadius: '10px'}}>
                          No
                        </Button>
                      </Grid>
                      <Grid>
                        <Button
                          variant='contained'
                          onClick={handleReject}
                          sx={{
                            borderRadius: '10px',
                            backgroundColor: 'error.main'}}>
                          Yes
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Dialog>
              </Box>
            )}{activeStep === 1 && (
              <Box>
                <FormControl>
                  <Typography variant='h5'>
                    Set Password
                  </Typography>
                  <Grid
                    container
                    gridRow={2}
                    columnSpacing={2}
                    sx={{
                      marginTop: '20px',
                    }}>
                    <Grid item xs={6}>
                      <TextField
                        sx={{width: '100%'}}
                        variant="outlined"
                        type='password'
                        label='Password'
                        name='password'
                        value={userInput.password}
                        helperText={errorMessages.password}
                        onChange={handleInput}
                        required />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        sx={{width: '100%'}}
                        variant="outlined"
                        type='password'
                        label='Confirm password'
                        name='confirmPassword'
                        value={userInput.confirmPassword}
                        helperText={errorMessages.confirmPassword}
                        onChange={handleInput}
                        required />
                    </Grid>
                    <Box
                      sx={{display: 'flex',
                        justifyContent: 'right',
                        marginTop: '20px',
                        width: '100%'}}>
                      <Button
                        variant="contained"
                        onClick={inviteUserSignUp}
                        sx={{borderRadius: '8px',
                        }}>
                      Set password
                      </Button>
                    </Box>
                  </Grid>
                </FormControl>
              </Box>
            )}{activeStep === steps.length && (
              <Box></Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={6}
          sx={{padding: '20px'}}>
          <Box
            sx={{
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
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '50px',
              marginLeft: '40px',
            }}>
            <img src={JoinTeam} alt='JoinTeam' />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
