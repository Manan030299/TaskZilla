import React, {useEffect, useState} from 'react';
import {AppBar} from '@mui/material';
import {Grid} from '@mui/material';
import {Container} from '@mui/material';
import {Toolbar} from '@mui/material';
import {Avatar} from '@mui/material';
import {Typography} from '@mui/material';
import {Card} from '@mui/material';
import {Box} from '@mui/material';
import {IconButton} from '@mui/material';
import {Menu} from '@mui/material';
import {MenuItem} from '@mui/material';
import {Button} from '@mui/material';
import {Tooltip} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ClearIcon from '@mui/icons-material/Clear';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {useNavigate} from 'react-router-dom';
import {database} from '../Firebase';
import {onValue, ref, remove} from 'firebase/database';
import {toast} from 'react-hot-toast';

const pages = ['Dashboard', 'Kanban Board'];
const settings = ['Settings', 'Dashboard', 'Logout'];

const ResponsiveAppBar = () => {
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationHovered, setIsNotificationHovered] = useState(false);
  const [isHoveredIndex, setIsHoveredIndex] = useState(-1);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const uid = sessionStorage.getItem('uid') ||
    localStorage.getItem('uid');
    if (uid !== undefined) {
      onValue(ref(database, 'users/' + uid), (snapshot) => {
        const data = snapshot.val() || {};
        setUserProfile(data);
      });
    }
  }, []);

  useEffect(() => {
    if (userProfile && userProfile.projectId) {
      onValue(ref(database, 'users/' +userProfile.uid +
      '/notifications/' + userProfile.projectId + '/data/'), (snapshot) => {
        const data = snapshot.val();
        setNotifications(data);
      });
    }
  }, [userProfile]);

  const handleMouseEnter = (index) => {
    setIsNotificationHovered(true);
    setIsHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setIsNotificationHovered(false);
    setIsHoveredIndex(-1);
  };

  const deleteNotification = (index) => {
    remove(ref(database, 'users/' + userProfile.uid +
    '/notifications/' + userProfile.projectId + '/data/' + index));
  };

  const clearAllNotification = () => {
    remove(ref(database, 'users/' + userProfile.uid +
    '/notifications/' + userProfile.projectId + '/data/'));
    toast.success('All notifications have been cleared');
  };

  const handleSetting = (setting) => {
    if (setting === 'Settings') {
      navigate('/Settings');
    }
    if (setting === 'Dashboard') {
      navigate('/dashboard');
    }
    if (setting === 'Logout') {
      localStorage.clear()||sessionStorage.clear();
      navigate('/Login');
    }
  };

  const handlePages = (page) => {
    if (page === 'Dashboard') {
      navigate('/dashboard');
    }
    if (page === 'Kanban Board') {
      navigate('/kanban-board');
    }
  };

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  return (
    <AppBar sx={{padding: '0',
      zIndex: (theme) => theme.zIndex.drawer + 1}} position='fixed'>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Avatar sx={{display: {xs: 'none', md: 'flex'}, mr: 1,
            height: '35px',
            width: '35px',
            cursor: 'pointer'}}>
            T</Avatar>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: {xs: 'none', md: 'flex'},
              fontWeight: 700,
              letterSpacing: '.3rem',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            TaskZilla
          </Typography>

          <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: {xs: 'block', md: 'none'},
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick= {()=>{
                  handlePages(page);
                }}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Avatar sx={{display: {xs: 'flex', md: 'none'}, mr: 1,
            cursor: 'pointer'}}>
            T</Avatar>
          <Typography
            variant="h5"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: {xs: 'flex', md: 'none'},
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '.3rem',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            TaskZilla
          </Typography>
          <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
            {pages.map((page) => (
              <Button
                variant='text'
                key={page}
                onClick= {()=>{
                  handlePages(page);
                }}
                sx={{'my': 2,
                  'fontSize': '1.2rem',
                  'lineHeight': '2px',
                  'boxShadow': 'none',
                  'color': 'info.contrastText',
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box>
            <Tooltip title={`Notifications`}>
              <NotificationsIcon onClick={handleClick}
                sx={{
                  'marginRight': '40px',
                  '&:hover': {
                    cursor: 'pointer'}}} />
            </Tooltip>
            <Menu
              sx={{'& .MuiMenu-list': {
                padding: '5px',
              },
              '& .MuiMenu-paper': {
                width: '380px',
                borderRadius: '10px',
              },
              'mt': '0px'}}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}>
              <Box
                sx={{
                  position: 'sticky',
                  top: '0px',
                  marginBottom: '5px',
                  padding: '5px 10px',
                  // boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
                }}>
                <Grid container>
                  <Grid item xs={10}>
                    <Typography variant='h6' fontWeight={600}>
                      Notifications
                    </Typography>
                  </Grid>
                  {notifications && (<Grid item xs={2}>
                    <Typography variant='body1'
                      onClick={clearAllNotification}
                      sx={{
                        'marginTop': '5px',
                        'width': 'max-content',
                        '&:hover': {
                          cursor: 'pointer',
                        }}}>
                      Clear all
                    </Typography>
                  </Grid>)}
                </Grid>
              </Box>
              {notifications?
              (notifications?.map((userDetails, index) => (
                <MenuItem key={`userDetails_${index}`}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  sx={{
                    maxWidth: '400px',
                    padding: '0px',
                    marginBottom: '5px'}}>
                  <Card
                    sx={{width: '100%',
                      padding: '10px',
                      borderRadius: '0px',
                      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)'}}>
                    <Grid container>
                      <Grid item xs={2}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'left'}}>
                        <Avatar>
                          {userDetails[0]}
                        </Avatar>
                      </Grid>
                      <Grid item xs={9}>
                        <Typography variant='body1'
                          sx={{whiteSpace: 'normal'}}>
                          {userDetails}
                        </Typography>
                      </Grid>
                      {isNotificationHovered && index === isHoveredIndex &&
                      (<Grid item xs={1}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'}}>
                        <ClearIcon
                          onClick={() => deleteNotification(index)}
                          sx={{
                            fontWeight: '600',
                          }} />
                      </Grid>)}
                    </Grid>
                  </Card>
                </MenuItem>
              ))) :
              (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px 0',
                  }}>
                  <NotificationsIcon
                    sx={{
                      marginBottom: '10px',
                      fontSize: '2rem',
                    }} />
                  <Typography variant='body1' fontWeight='600'>
                    No Notifications Yet
                  </Typography>
                </Box>
              )}
            </Menu>
          </Box>
          <Box sx={{flexGrow: 0}}>
            <Tooltip title={userProfile.firstName + ' ' + userProfile.lastName}>
              <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                <Avatar
                  sx={{
                    backgroundColor: userProfile.avatarColor,
                  }}
                >
                  {userProfile.firstName && userProfile.firstName[0]}{userProfile.lastName && userProfile.lastName[0]}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{mt: '45px'}}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography onClick= {()=>{
                    handleSetting(setting);
                  }} width='100%' textAlign="left">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
