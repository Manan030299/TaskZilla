import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import {ref, update} from 'firebase/database';
import {toast} from 'react-hot-toast';
import {app, database} from '../../Firebase';
import {getAuth, EmailAuthProvider, reauthenticateWithCredential,
  updatePassword} from 'firebase/auth';
import {digitsRegExp, lowercaseRegExp, minLengthRegExp,
  specialCharRegExp, uppercaseRegExp} from '../../constant/config';

export const ProfileSetting = (props) => {
  const {userProfile, profileInput, setProfileInput} = props;

  const auth = getAuth(app);

  const user = auth.currentUser;

  const [modiftyBtn, setModifyBtn] = useState(true);
  const [changePassBtn, setChangePassBtn] = useState(true);
  const [errorMessages, setErrorMessages] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [openPass, setOpenPass] = useState(false);

  const onHandleChange = (e) => {
    const {name, value} = e.target;
    setProfileInput({...profileInput, [name]: value});
    if (name === 'firstName' || name === 'lastName') {
      setModifyBtn(false);
    }
    if (value.length > 8) {
      setChangePassBtn(false);
    } else {
      setChangePassBtn(true);
    }
  };

  const handleClickOpen = () => {
    setOpenPass(true);
  };

  const handleClose = () => {
    setOpenPass(false);
    setChangePassBtn(true);
    setProfileInput({
      ...profileInput,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  };

  const handleModify = () => {
    const validationMessages = {
      firstName: '',
      lastName: '',
    };

    let isError = false;

    if (!profileInput.firstName) {
      validationMessages.firstName = 'Please enter first name';
      isError = true;
    }

    if (!profileInput.lastName) {
      validationMessages.lastName = 'Please enter last name';
      isError = true;
    }

    setErrorMessages(validationMessages);

    if (isError) {
      setErrorMessages(validationMessages);
    }
    if (!isError) {
      const userProfileData = profileInput;
      const updateUserProfile = {};
      updateUserProfile['users/' + userProfileData.uid] = userProfileData;
      setModifyBtn(true);
      toast.success('Profile Successfully Updated');
      return update(ref(database), updateUserProfile);
    }
  };

  const handleChangePassword = () => {
    const validationMessages = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    };

    let isError = false;
    let message = '';

    if (!profileInput.currentPassword) {
      validationMessages.currentPassword =
     'Please enter current password';
      isError = true;
    }

    if (!minLengthRegExp.test(profileInput.newPassword)) {
      message = message + 'one 8 characters, ';
      isError = true;
    }

    if (!uppercaseRegExp.test(profileInput.newPassword)) {
      message = message + 'one upper case, ';
      isError = true;
    }

    if (!lowercaseRegExp.test(profileInput.newPassword)) {
      message = message + 'one lower case, ';
      isError = true;
    }

    if (!specialCharRegExp.test(profileInput.newPassword)) {
      message = message + 'one special Character, ';
      isError = true;
    }

    if (!digitsRegExp.test(profileInput.newPassword)) {
      message = message + 'one  number ';
      isError = true;
    }

    if (profileInput.confirmNewPassword === profileInput.newPassword) {
      validationMessages.confirmNewPassword = '';
    } else {
      validationMessages.confirmNewPassword = 'Passwords do not match';
      isError = true;
    }

    validationMessages.newPassword = message?
    'Password should contain atleast ' + message : '';

    if (isError) {
      setErrorMessages(validationMessages);
    }
    if (!isError && user) {
      const currentPassword = profileInput.currentPassword;
      const credential = EmailAuthProvider.credential(
          user.email, currentPassword);
      reauthenticateWithCredential(user, credential).then(() => {
        const newPassword = profileInput.confirmNewPassword;
        updatePassword(user, newPassword).then(() => {
          setProfileInput({...profileInput,
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''});
          setOpenPass(false);
          setErrorMessages('');
          toast.success('Password Successfully Updated');
        }).catch(() => {
        });
      }).catch(() => {
        toast.error('Current Password does not match');
      });
    }
  };

  return (
    <Box>
      {userProfile && (
        <Box
          sx={{
            flexGrow: 1,
            p: 1,
          }}>
          <Toolbar />
          <Box
            margin='10px'>
            <FormControl>
              <Typography
                marginBottom='20px'
                variant='h4'>
                Account Settings
              </Typography>
              <Box marginBottom='35px'>
                <TextField
                  sx={{
                    margin: '0px 10px 0px 0px',
                    width: '280px',
                  }}
                  variant='outlined'
                  onChange={onHandleChange}
                  name='firstName'
                  value={profileInput.firstName}
                  label='First name'
                  helperText={errorMessages.firstName}
                  error={errorMessages.firstName? true : false}
                />
                <TextField
                  sx={{
                    margin: '0px 0px 0px 5px',
                    width: '280px',
                  }}
                  variant='outlined'
                  onChange={onHandleChange}
                  name='lastName'
                  value={profileInput.lastName}
                  label='Last name'
                  helperText={errorMessages.lastName}
                  error={errorMessages.lastName? true : false}
                />
              </Box>
              <TextField
                sx={{
                  margin: '0px 0px 25px 0px',
                  width: '575px',
                }}
                variant='outlined'
                onChange={onHandleChange}
                type='email'
                name='email'
                value={profileInput.email}
                label='Email address'
                disabled
              />
              <Link
                style={{
                  cursor: 'pointer',
                }}
                onClick={handleClickOpen}
                sx={{
                  marginBottom: '30px',
                  width: 'max-content',
                }}>
                  Change password
              </Link>
              <Dialog
                open={openPass}
                sx={{
                  '& .MuiDialog-paper': {
                    borderRadius: '10px',
                  }}}
              >
                <Box
                  sx={{padding: '30px',
                    display: 'flex',
                    flexDirection: 'column'}}>
                  <Typography
                    variant='h5'
                    marginBottom='10px'
                  >
                    Change password
                  </Typography>
                  <TextField
                    sx={{
                      margin: '0px 0px 20px 0px',
                      width: '375px',
                    }}
                    variant='outlined'
                    onChange={onHandleChange}
                    type='password'
                    name='currentPassword'
                    value={profileInput.currentPassword || ''}
                    label='Current Password'
                    helperText={errorMessages.currentPassword}
                    error={errorMessages.currentPassword? true : false}
                  />
                  <TextField
                    sx={{
                      margin: '0px 0px 20px 0px',
                      width: '375px'}}
                    variant='outlined'
                    onChange={onHandleChange}
                    type='password'
                    name='newPassword' value={profileInput.newPassword || ''}
                    label='New Password'
                    helperText={errorMessages.newPassword}
                    error={errorMessages.newPassword? true : false}
                  />
                  <TextField
                    sx={{
                      margin: '0px 0px 20px 0px',
                      width: '375px',
                    }}
                    variant='outlined'
                    onChange={onHandleChange}
                    type='password'
                    name='confirmNewPassword' label='Confirm New password'
                    value={profileInput.confirmNewPassword || ''}
                    helperText={errorMessages.confirmNewPassword}
                    error={errorMessages.confirmNewPassword? true : false}
                  />
                  <Box
                    sx={{display: 'flex',
                      justifyContent: 'right',
                      marginTop: '5px'}}>
                    <Button
                      type='button'
                      onClick={handleClose}
                      variant="text"
                      sx={{padding: '10px',
                        fontSize: '1rem',
                        fontWeight: '400',
                        borderRadius: '10px',
                        width: 'max-content',
                        margin: '0px 10px 0px 0px'}}>
                          Cancel
                    </Button>
                    <Button
                      type='submit'
                      onClick={handleChangePassword}
                      disabled={changePassBtn}
                      variant="contained"
                      sx={{padding: '10px',
                        fontSize: '1rem',
                        fontWeight: '400',
                        borderRadius: '10px',
                        boxShadow: '0px 4px 4px 0px #0000004D',
                        width: 'max-content',
                        margin: '0px 0px 0px 10px'}}>
                          Update Password
                    </Button>
                  </Box>
                </Box>
              </Dialog>
              <Button
                onClick={handleModify}
                type='submit'
                variant="contained"
                sx={{padding: '10px',
                  fontSize: '1rem',
                  fontWeight: '400',
                  borderRadius: '10px',
                  boxShadow: '0px 4px 4px 0px #0000004D',
                  marginBottom: '20px',
                  width: '280px'}}
                disabled={modiftyBtn}
              >
                Modify
              </Button>
            </FormControl>
          </Box>
        </Box>)}
    </Box>
  );
};

ProfileSetting.propTypes = {
  userProfile: PropTypes.any.isRequired,
  profileInput: PropTypes.any.isRequired,
  setProfileInput: PropTypes.any.isRequired,
};
