import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import {Button} from '@mui/material';
import {Dialog} from '@mui/material';
import {FormControl} from '@mui/material';
import {Grid} from '@mui/material';
import {InputLabel} from '@mui/material';
import {MenuItem} from '@mui/material';
import {Select} from '@mui/material';
import {TextField} from '@mui/material';
import {Typography} from '@mui/material';
import {child, onValue, push, ref, update} from 'firebase/database';
import {emailValidRegExp} from '../../constant/config';
import {database} from '../../Firebase';
import emailjs from 'emailjs-com';
import {toast} from 'react-hot-toast';

export const InviteMembersDialog = (props) => {
  const {inviteDialog, setInviteDialog, projectDetail} = props;

  const [inviteNewUser, setInviteNewUser] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    uid: '',
    projectId: '',
    role: '',
    referenceId: '',
    status: '',
  });

  const [errorMessages, setErrorMessages] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    role: '',
  });

  const [handleInviteButton, setHandleInviteButton] = useState(true);
  const [inviteUserRole, setInviteUserRole] = useState([]);
  const [activeUsersData, setActiveUsersData] = useState([]);
  const [invitedUserData, setInvitedUserData] = useState([]);

  useEffect(() => {
    onValue(ref(database, 'permissions/'), (snapshot) => {
      const data = Object.keys(snapshot.val());
      setInviteUserRole(data);
    });
  }, []);

  useEffect(() => {
    onValue(ref(database, 'users/'), (snapshot) => {
      const data = Object.values(snapshot.val() || {});
      setActiveUsersData(data);
    });
  }, []);

  useEffect(() => {
    onValue(ref(database, 'inviteUser/'), (snapshot) => {
      const data = Object.values(snapshot.val() || {});
      setInvitedUserData(data);
    });
  }, []);

  const handleInviteDialogClose = () => {
    setInviteNewUser({
      firstName: '',
      lastName: '',
      emailId: '',
      uid: '',
      projectId: '',
      role: '',
      referenceId: '',
      status: '',
    });
    setInviteDialog(false);
  };

  const handleInput = (e) => {
    const {name, value} = e.target;
    setInviteNewUser({...inviteNewUser, [name]: value});
    if (inviteNewUser.firstName.length < 0 &&
      inviteNewUser.firstName.length < 0 &&
      inviteNewUser.emailId.length < 0 ) {
      setHandleInviteButton(true);
    } else {
      setHandleInviteButton(false);
    }
  };

  const generateReferenceId = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }

    return result;
  };

  const inviteUserBtn = async () => {
    let isError = false;
    const validationMessages = {
      firstName: '',
      lastName: '',
      emailId: '',
    };
    if (!inviteNewUser.firstName) {
      validationMessages.firstName = 'Please enter first name';
      isError = true;
    }

    if (!inviteNewUser.lastName) {
      validationMessages.lastName = 'Please enter last name';
      isError = true;
    }

    if (!emailValidRegExp.test(inviteNewUser.emailId)) {
      validationMessages.emailId = 'Please enter a valid email address';
      isError = true;
    }

    activeUsersData.forEach((data) => {
      if (inviteNewUser.emailId === data.emailId) {
        validationMessages.emailId = 'User Already Exists';
        isError = true;
      }
    });

    invitedUserData.forEach((data) => {
      if (inviteNewUser.emailId === data.emailId && data.status === 'PENDING') {
        validationMessages.emailId = 'Cannot invite user. Email address pending confirmation.';
        isError = true;
      }
    });

    if (isError) {
      setErrorMessages(validationMessages);
    }
    if (!isError) {
      const inviteUser = inviteNewUser;
      let isUserExist = false;
      const referenceId = generateReferenceId(56);
      invitedUserData.forEach((data) => {
        if (inviteUser.emailId === data.emailId && data.status === 'CANCELLED' || data.status === 'REJECTED') {
          isUserExist = true;
          inviteUser.uid = data.uid;
        }
      });
      if (!isUserExist) {
        const inviteUserId = push(child(ref(database), 'inviteUser')).key;
        inviteUser.uid = inviteUserId;
      }
      inviteUser.referenceId = referenceId;
      inviteUser.projectId = projectDetail.projectId;
      inviteUser.status = 'PENDING';

      const inviteUserList = {};
      inviteUserList['inviteUser/' + inviteUser.uid] = inviteUser;
      setInviteNewUser({
        firstName: '',
        lastName: '',
        emailId: '',
        uid: '',
        projectId: '',
        role: '',
        referenceId: '',
        status: '',
      });

      setInviteDialog(false);

      // send email invite
      const emailParams = {
        to_email: inviteUser.emailId,
        to_name: `${inviteUser.firstName} ${inviteUser.lastName}`,
        from_email: 'your-email@your-domain.com',
        from_name: 'Your Name',
        subject:
        `${inviteUser.firstName} ${inviteUser.lastName} You have been invited to join the team!`,
        message: `Hello ${inviteUser.firstName},\n\nYou have been invited to join our Project.\nPlease click the following link to join: http://localhost:3000/invite-user/${inviteUser.uid}/${inviteUser.referenceId}\n\nThanks,\nTaskZilla`,
      };
      emailjs.send('gmail', 'task_management', emailParams, 'hxjIvmq2GLpA8spm4')
          .then((result) => {
            toast.success(`An invitation has been successfully 
            sent to ${inviteUser.firstName} ${inviteUser.lastName}`);
          }, (error) => {
            toast.error(error.text);
          });

      return update(ref(database), inviteUserList);
    }
  };

  return (
    <Box>
      <Dialog
        open={inviteDialog}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '10px',
          }}}>
        <Box
          display='flex'
          flexDirection='column'
          justifyContent='center'
          alignItems='center'
          sx={{padding: '30px'}} >
          <Typography
            variant='h4'
          >
            Invite Members
          </Typography>
          <Grid container gap={2}>
            <Grid item>
              <TextField
                sx={{
                  marginTop: '20px',
                  width: '100%',
                }}
                variant="outlined"
                type='text'
                name='firstName'
                value={inviteNewUser.firstName}
                onChange={handleInput}
                label='First name'
                helperText={errorMessages.firstName}
                required
              />
            </Grid>
            <Grid item>
              <TextField
                sx={{
                  marginTop: '20px',
                  width: '100%',
                }}
                variant="outlined"
                type='text'
                name='lastName'
                value={inviteNewUser.lastName}
                onChange={handleInput}
                label='Last name'
                helperText={errorMessages.lastName}
                required
              />
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={12}>
              <TextField
                sx={{
                  marginTop: '20px',
                  width: '100%'}}
                variant="outlined"
                type='text'
                name='emailId'
                value={inviteNewUser.emailId.toLowerCase()}
                onChange={handleInput}
                label='Email id'
                helperText={errorMessages.emailId}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl
                sx={{
                  marginTop: '20px',
                  width: '100%',
                }}
                fullWidth>
                <InputLabel
                  id="role-select-label"
                >Role
                </InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  name='role'
                  value={inviteNewUser.role}
                  label='Role'
                  onChange={handleInput}>
                  {inviteUserRole.map((role, index) => (
                    (role !== 'admin' &&(
                      <MenuItem
                        key={`role_${index}`}
                        value={role}>
                        {role[0].toUpperCase() + role.slice(1).toLowerCase()}
                      </MenuItem>
                    ))
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Grid gap={2} container
            sx={{
              marginTop: '40px',
              display: 'flex',
              justifyContent: 'right'}}>
            <Grid item xs={3}>
              <Button
                onClick={handleInviteDialogClose}
                variant='text'
                sx={{
                  minWidth: '100%',
                  borderRadius: '10px',
                }}>
                  Back
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                disabled={handleInviteButton}
                onClick={inviteUserBtn}
                type='submit'
                variant='contained'
                sx={{
                  minWidth: '100%',
                  borderRadius: '10px',
                }}
              >
                Invite
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </Box>
  );
};

InviteMembersDialog.propTypes = {
  inviteDialog: PropTypes.any.isRequired,
  setInviteDialog: PropTypes.any.isRequired,
  projectDetail: PropTypes.any.isRequired,
};
