import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import {toast} from 'react-hot-toast';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {database} from '../../Firebase';
import {onValue, ref, remove, update} from 'firebase/database';
import {AssignToDialog} from './AssignToDialog';
import {ConfirmationDeleteUserDialog} from './ConfirmationDeleteUserDialog';

export const ManageUsers = () => {
  const [projectDetail, setProjectDetail] = useState([]);
  const [activeUsersData, setActiveUsersData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [changeInUids, setChangeInUids] = useState([]);
  const [disableSaveBtn, setDisableSaveBtn] = useState(true);
  // const [usersUid, setUsersUid] = useState([]);
  // const [disableDeleteBtn, setDisableDeleteBtn] = useState(true);
  // const [confirmationDeleteDialog, setConfirmationDeleteDialog] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isHoveredIndex, setIsHoveredIndex] = useState(-1);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  const [issueData, setIssueData] = useState([]);
  const [selectedUserIssueData, setSelectedUserIssueData] = useState([]);
  const [issueAssigneeDialog, setIssueAssigneeDialog] = useState(false);
  const [deletingUserDetails, setDeletingUserDetails] = useState([]);

  useEffect(() => {
    const uid = sessionStorage.getItem('uid') || localStorage.getItem('uid');
    if (uid) {
      onValue(ref(database, 'users/' + uid), (snapshot) => {
        const user = snapshot.val();
        onValue(ref(
            database, 'projectList/' + user.projectId), (snapshot) => {
          const projectList = snapshot.val();
          setProjectDetail(projectList);
        });
      });
    }
  }, []);

  useEffect(() => {
    if (projectDetail.activeUsers !== undefined) {
      let promises = [];
      try {
        promises = projectDetail.activeUsers.map((id) => {
          return new Promise((resolve, reject) => {
            onValue(ref(database, 'users/' + id), (snapshot) => {
              resolve(snapshot.val());
            });
          });
        });
      } catch (error) {
        reject(error);
      }

      Promise.all(promises).then((userData)=> {
        setActiveUsersData(userData);
      })
          .catch((error)=> {
            toast.error(error);
          });
    }
  }, [projectDetail]);

  useEffect(() => {
    onValue(ref(database, 'projectList/' + projectDetail.projectId +
        '/issues/'), (snapshot) => {
      const issues = Object.values(snapshot.val() || {});
      setIssueData(issues);
    });
  }, [projectDetail]);

  useEffect(() => {
    onValue(ref(database, 'permissions/'), (snapshot) => {
      const data = Object.keys(snapshot.val());
      setRoles(data);
    });
  }, [activeUsersData]);

  const handleUpdateRole = (e, index) => {
    const userData = [...activeUsersData];
    userData[index].role = e.target.value;
    setActiveUsersData(userData);
    setChangeInUids(
        [...new Set([...changeInUids, activeUsersData[index].uid])]);
    setDisableSaveBtn(false);
  };

  const handleSaveBtn = () => {
    changeInUids.forEach((uid) => {
      const user = activeUsersData.find((data) => data.uid === uid);
      if (user) {
        update(ref(database, 'users/' + user.uid), {role: user.role});
      }
    });
    setDisableSaveBtn(true);
  };

  // const selectUsers = (e, index) => {
  //   if (e.target.checked && activeUsersData[index].uid && usersUid !== []) {
  //     setUsersUid([...new Set([...usersUid, activeUsersData[index].uid])]);
  //     setDisableDeleteBtn(false);
  //   } else {
  //     setUsersUid(usersUid.filter((uid) =>
  //       uid !== activeUsersData[index].uid));
  //     if (usersUid.length === 1) {
  //       setDisableDeleteBtn(true);
  //     }
  //   }
  // };

  // const handleDeleteDialog = () => {
  //   setConfirmationDeleteDialog(true);
  // };

  // const handleCancelBtn = () => {
  //   setUsersUid([]);
  //   setConfirmationDeleteDialog(false);
  //   setDisableDeleteBtn(true);
  // };

  // const handleDeleteBtn = (index) => {
  //   const activeUsersUids = [...projectDetail.activeUsers];
  //   usersUid.forEach((uid) => {
  //     if (index > -1) {
  //       activeUsersUids.splice(index, 1);
  //       update(ref(database, 'users/' + uid),
  //           {projectId: null})
  //           .then(() => {
  //             update(ref(database, 'projectList/' + projectDetail.projectId),
  //                 {activeUsers: activeUsersUids});
  //             setConfirmationDeleteDialog(false);
  //             setDisableDeleteBtn(true);
  //             toast.success('Users Deleted Successfully');
  //           })
  //           .catch((error) => {
  //             toast.error(error);
  //           });
  //     }
  //   });
  // };

  const deleteUserIconBtn = (userData) => {
    let data = [...issueData];
    data = data.filter((issue) => {
      return userData.uid === issue.assigneeId;
    });
    setDeletingUserDetails(userData);
    if (data.length > 0) {
      setIssueAssigneeDialog(true);
    } else {
      setOpenConfirmDeleteDialog(true);
    }
    setSelectedUserIssueData(data);
  };

  const handleMouseEnter = (index) => {
    setIsCardHovered(true);
    setIsHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setIsCardHovered(false);
    setIsHoveredIndex(-1);
  };

  const closeConfirmDeleteDialog = () => {
    setIssueAssigneeDialog(false);
    setOpenConfirmDeleteDialog(false);
    setDeletingUserDetails([]);
    setSelectedUserIssueData([]);
  };

  const deleteUserBtn = () => {
    const activeUsersUids = [...projectDetail.activeUsers];
    const index = activeUsersUids.indexOf(deletingUserDetails.uid);
    activeUsersUids.splice(index, 1);
    if (index > -1) {
      remove(ref(database, 'users/' + deletingUserDetails.uid))
          .then(() => {
            update(ref(database, 'projectList/' + projectDetail.projectId),
                {activeUsers: activeUsersUids});
            toast.success('Users Deleted Successfully');
          })
          .catch((error) => {
            toast.error(error);
          });
    }
    setDeletingUserDetails([]);
    setSelectedUserIssueData([]);
    setOpenConfirmDeleteDialog(false);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: '10px',
      }}>
      <Toolbar />
      <Box>
        <Typography marginBottom='0px' variant='h4'>
            Manage Users
        </Typography>
        <Box
          columnGap={2}
          sx={{display: 'flex',
            justifyContent: 'flex-end'}}>
          {/* <Button
            variant='contained'
            onClick={handleDeleteDialog}
            disabled={disableDeleteBtn}
            sx={{
              borderRadius: '10px',
              backgroundColor: 'error.main',
              minWidth: 'max-content',
              padding: '10px',
              height: '37px',
              fontWeight: '500'}}>
            Delete
          </Button> */}
          <Button
            variant='contained'
            disabled={disableSaveBtn}
            onClick={handleSaveBtn}
            sx={{
              borderRadius: '10px',
              minWidth: 'max-content',
              padding: '10px',
              height: '37px',
              fontWeight: '500'}}>
            Save
          </Button>
        </Box>
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
          {activeUsersData.map((userData, index) => (
            (userData.role !== 'admin' &&(
              <Card
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                key={`userData_${index}`}
                sx={{
                  'boxShadow': 1,
                  'borderRadius': '10px',
                  'padding': '15px 20px',
                  'margin': '10px 0px',
                  '&:hover': {
                    boxShadow: 4,
                  }}}>
                <Grid container
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center'}}>
                  {/* <Grid item xs={1}>
                    <FormControlLabel
                      control={<Checkbox color="primary" />}
                      onChange={(e) => selectUsers(e, index)}
                    />
                  </Grid> */}
                  <Grid item xs={8}>
                    <Typography variant='h6'>
                      {`${userData.firstName} ${userData.lastName}`}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <FormControl fullWidth>
                      <InputLabel id="select-role-label">Role</InputLabel>
                      <Select
                        size='small'
                        labelId="select-role-label"
                        id="role-label"
                        label='Role'
                        name='role'
                        value={roles.includes(userData.role) ?
                          userData.role : ''}
                        onChange={(e) =>
                          handleUpdateRole(e, index)}
                        sx={{width: '150px'}}>
                        {roles?.map((role, index) => (
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
                  {isCardHovered && index === isHoveredIndex &&
                  <Grid item xs={1}>
                    <Button
                      sx={{minWidth: 'max-content'}}
                      variant='text'
                      onClick={() => deleteUserIconBtn(userData)}>
                      <DeleteForeverIcon
                        sx={{
                          color: 'error.main'}} />
                    </Button>
                  </Grid>
                  }
                  <ConfirmationDeleteUserDialog
                    openConfirmDeleteDialog={openConfirmDeleteDialog}
                    closeConfirmDeleteDialog={closeConfirmDeleteDialog}
                    deleteUserBtn={deleteUserBtn}
                  />
                  <AssignToDialog
                    projectDetail={projectDetail}
                    issueAssigneeDialog={issueAssigneeDialog}
                    setIssueAssigneeDialog={setIssueAssigneeDialog}
                    activeUsersData={activeUsersData}
                    deletingUserDetails={deletingUserDetails}
                    setDeletingUserDetails={setDeletingUserDetails}
                    selectedUserIssueData={selectedUserIssueData}
                    setSelectedUserIssueData={setSelectedUserIssueData}
                  />
                </Grid>
                {/* <Dialog open={confirmationDeleteDialog} maxWidth='md'
                  sx={{'& .MuiDialog-paper': {
                    borderRadius: '10px',
                  }}}>
                  <Box
                    display='flex'
                    flexDirection='column'
                    justifyContent='center'
                    alignItems='center'
                    sx={{padding: '30px'}}>
                    <Typography variant='h6'>
                      Are you sure you want to delete users ?
                    </Typography>
                    <Grid container columnGap={2}
                      sx={{
                        marginTop: '20px',
                        justifyContent: 'flex-end'}}>
                      <Grid item>
                        <Button
                          variant='text'
                          onClick={(e) => handleCancelBtn(e, index)}
                          sx={{
                            borderRadius: '10px'}}>
                              Cancel
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant='contained'
                          onClick={() => handleDeleteBtn(index)}
                          sx={{
                            borderRadius: '10px',
                            backgroundColor: 'error.main'}}>
                              Delete
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Dialog> */}
              </Card>
            ))
          ))}
        </Box>
      </Box>
    </Box>
  );
};
