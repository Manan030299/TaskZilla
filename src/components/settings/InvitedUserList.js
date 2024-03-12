import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import {database} from '../../Firebase';
import {onValue, ref, update} from 'firebase/database';
import emailjs from 'emailjs-com';
import {toast} from 'react-hot-toast';

export const InvitedUserList = () => {
  const [invitedUserData, setInvitedUserData] = useState([]);
  const [index, setIndex] = useState(-1);
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  useEffect(() => {
    onValue(ref(database, 'inviteUser/'), (snapshot) => {
      const data = Object.values(snapshot.val() || {});
      setInvitedUserData(data);
    });
  }, []);

  const handleOpenDialog = (i) => {
    setOpenConfirmationDialog(true);
    setIndex(i);
  };

  const cancelRequest = (index) => {
    const user = invitedUserData[index];
    update(ref(database, 'inviteUser/' + user.uid), {
      ...user,
      status: 'CANCELLED',
    });
    if (user) {
      const emailParams = {
        to_email: user.emailId,
        to_name: `${user.firstName} ${user.lastName}`,
        from_email: 'your-email@your-domain.com',
        from_name: 'Your Name',
        subject:
      `Cancellation of TaskZilla Invitation Request`,
        message: `Hello ${user.firstName},\n\nI hope this email finds you well. I am writing to inform you that the invitation request sent to you by TaskZilla has been cancelled.
      \nDue to unforeseen circumstances, we have decided to make changes to our collaboration process, and as a result, the invitation you previously received is no longer valid. We apologize for any inconvenience this may have caused.
      \nWe appreciate your understanding and apologize for any inconvenience this cancellation may have caused. We hope to have the opportunity to work together in the future.
      \nThank you for your time and consideration.
      \nBest regards,\nTaskZilla`,
      };
      emailjs.send('gmail', 'cancel_request', emailParams, 'hxjIvmq2GLpA8spm4')
          .then((result) => {
            toast.success('Request Canceled', {
              title: 'Invition Request has been Cancelled',
              message: `You have cancel the request to invite ${user.firstName} ${user.lastName}`,
            });
          }, (error) => {
            toast.error(error.text);
          });
    }
    setOpenConfirmationDialog(false);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: '10px',
      }}>
      <Toolbar />
      <Typography marginBottom='0px' variant='h4'>
        Invited Users
      </Typography>
      <Box
        sx={{
          'width': '100%',
          'overflow': 'auto',
          'minHeight': '200px',
          'maxHeight': '60vh',
          'marginTop': '10px',
          'borderRadius': '10px',
          'padding': '10px',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555',
          }}}>
        {invitedUserData.length > 0 ?
        (invitedUserData.map((userData, i) =>
          (<Card
            key={`userData_${i}`}
            sx={{
              'boxShadow': 1,
              'borderRadius': '10px',
              'padding': '15px 20px',
              'margin': '10px 0px',
              '&:hover': {
                boxShadow: 4,
              }}}
          >
            <Grid container
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center'}}>
              <Grid item xs={5}>
                <Typography
                  variant='h6'>
                  {`${userData.firstName} ${userData.lastName}`}
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography
                  variant=''
                >
                  Status: <Typography
                    variant = ''
                    sx={{
                      color:
                    userData.status === 'PENDING'? '#2385ff':
                    userData.status === 'CANCELLED'? 'error.main':
                    userData.status === 'REJECTED'? '#808080':'',
                    }}>
                    {userData.status[0].toUpperCase() + userData.status.slice(1).toLowerCase()}
                  </Typography>
                </Typography>
              </Grid>
              {userData.status === 'PENDING' &&
              <Grid item xs={1}>
                <Button
                  variant='text'
                  onClick={() => handleOpenDialog(i)}
                  sx={{
                    borderRadius: '10px',
                    color: 'error.main',
                    minWidth: 'max-content',
                    padding: '10px',
                    height: '30px',
                    fontWeight: '500'}}
                >
                  Cancel Request
                </Button>
              </Grid>
              }
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
                  Are you sure you want to cancel the request to invite {userData.firstName} {userData.lastName} ?
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
                          close
                    </Button>
                  </Grid>
                  <Grid>
                    <Button
                      variant='contained'
                      onClick={() => cancelRequest(index)}
                      sx={{
                        borderRadius: '10px',
                        backgroundColor: 'error.main'}}>
                          Cancel Request
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Dialog>
          </Card>
          ))
          ) :
          (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}>
              <Typography variant='h5'>
                No Invite Users
              </Typography>
            </Box>
          )}
      </Box>
    </Box>
  );
};
