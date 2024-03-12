import React, {useEffect, useState} from 'react';
import ResponsiveAppBar from '../../common/AppBar';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import {onValue, ref} from 'firebase/database';
import {database} from '../../Firebase';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import {ProfileSetting} from './ProfileSetting';
import {Permissions} from './Permissions';
import {ManageUsers} from '../settings/ManageUsers';
import {InvitedUserList} from './InvitedUserList';

export const Settings = () => {
  const [userProfile, setUserProfile] = useState('');
  const [profileInput, setProfileInput] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [value, setValue] = useState('Account');

  const settings = ['Account', 'Permissions', 'Manage Users', 'Invited Users'];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const isAdmin = userProfile.role === 'admin';

  useEffect(() => {
    const uid = sessionStorage.getItem('uid') ||
    localStorage.getItem('uid');
    if (uid !== undefined) {
      onValue(ref(database, 'users/' + uid), (snapshot) => {
        const data = snapshot.val() || {};
        setUserProfile(data);
        setProfileInput(data);
      });
    }
  }, []);

  return (
    <TabContext value={value}>
      <Box sx={{display: 'flex', height: '100vh'}}>
        <ResponsiveAppBar />
        {userProfile && (<Drawer
          variant="permanent"
          sx={{
            width: 320,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {width: 320}, boxSizing: 'border-box',
          }}
        >
          <Toolbar />
          <Box marginTop='50px'>
            <Box display='flex' justifyContent='center' >
              <Avatar
                sx={{
                  scale: '2',
                  backgroundColor: userProfile.avatarColor,
                }}>
                {userProfile.firstName && userProfile.firstName[0]}{userProfile.lastName && userProfile.lastName[0]}
              </Avatar>
            </Box>
            <Box display='flex' justifyContent='center' marginTop='40px'
              marginBottom='10px'>
              <Typography variant='h5' fontWeight='600'>
                {`${userProfile.firstName} ${userProfile.lastName}`}
              </Typography>
            </Box>
            <Divider />
            <TabList orientation='vertical'
              onChange={handleChange} aria-label="lab API tabs example">
              {settings.map((setting) => {
                if ((setting === 'Permissions' || setting === 'Manage Users'|| setting === 'Invited Users') && !isAdmin) {
                  return null;
                }
                return <Tab key={setting} label={setting} value={setting} />;
              })}
            </TabList>
            <Divider />
          </Box>
        </Drawer>)}
        <TabPanel value="Account"
          sx={{width: '100%'}}>
          <ProfileSetting
            userProfile={userProfile}
            profileInput={profileInput}
            setProfileInput={setProfileInput} />
        </TabPanel>
        <TabPanel value="Permissions"
          sx={{width: '100%'}}>
          <Permissions />
        </TabPanel>
        <TabPanel value="Manage Users"
          sx={{width: '100%'}}>
          <ManageUsers />
        </TabPanel>
        <TabPanel value="Invited Users"
          sx={{width: '100%'}}>
          <InvitedUserList />
        </TabPanel>
      </Box>
    </TabContext>
  );
};
