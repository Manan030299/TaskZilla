import React, {useContext, useEffect, useState} from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import AvatarGroup from '@mui/material/AvatarGroup';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import SearchIcon from '@mui/icons-material/Search';
import {toast} from 'react-hot-toast';
import {database} from '../../Firebase';
import {child, get, onValue, push, ref, update} from 'firebase/database';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {ThemeContext} from '../../App';
import ResponsiveAppBar from '../../common/AppBar';
import {SearchIconWrapper} from './SearchBar';
import {CreateIssueDialog} from './CreateIssueDialog';
import {UpdateIssue} from './UpdateIssue';
import {Issuecard} from './Issuecard';
import {Search} from './SearchBar';
import {FilterBy} from './FilterBy';
import {StyledInputBase} from './SearchBar';
import {InviteMembersDialog} from './InviteMembersDialog';

export const KanbanBoard = () => {
  const [projectDetail, setProjectDetail] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [activeUsersData, setActiveUsersData] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [createIssueInput, setCreateIssueInput] = useState({
    project: '',
    issueType: '',
    status: '',
    summary: '',
    description: '',
    assigneeId: '',
    reporterId: '',
    priority: '',
    createdOn: '',
  });
  const [inviteDialog, setInviteDialog] = useState(false);
  const [handleModified, setHandleModified] = useState(true);
  const [switchCheck, setSwitchCheck] = useState(false);
  const [openUpdateIssue, setOpenUpdateIssue] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState('');
  const [handleCreateBtn, setHandleCreateBtn] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterByValue, setFilterByValue] = useState('');
  const [filteredValue, setFilteredValue] = useState([]);
  const [issues, setIssue] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  useEffect(() => {
    const uid = sessionStorage.getItem('uid') || localStorage.getItem('uid');
    if (uid) {
      onValue(ref(database, 'users/' + uid), (snapshot) => {
        const user = snapshot.val();
        onValue(ref(database, 'permissions/' + user.role), (snapshot) => {
          const permission = snapshot.val();
          setUserPermissions(permission);
        });
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

  useEffect(() =>{
    onValue(ref(database, 'projectList/' + projectDetail.projectId +
        '/issues/'), (snapshot) => {
      const data = Object.values(snapshot.val() || {});
      setIssue(data);
    });
  }, [projectDetail]);

  useEffect(() => {
    if (isFilterApplied) {
      let results = [...filteredValue];
      if (results) {
        const searchQueryLowerCase = searchQuery.toLowerCase();
        results = results.filter((data) => {
          for (const prop in data) {
            if (data[prop].toLowerCase().includes(searchQueryLowerCase)) {
              return true;
            }
          }
          return false;
        });
      }
      setFilteredValue(results);
    } else {
      let results = [...issues];
      if (results) {
        const searchQueryLowerCase = searchQuery.toLowerCase();
        results = results.filter((data) => {
          for (const prop in data) {
            if (data[prop].toLowerCase().includes(searchQueryLowerCase)) {
              return true;
            }
          }
          return false;
        });
      }
      setFilteredValue(results);
    }
  }, [issues, searchQuery, isFilterApplied]);

  const filteredByAvatar = (assigneeId) => {
    let filteredData = [...issues];
    if (assigneeId === selectedAvatar) {
      setSelectedAvatar(null);
      setFilteredValue(filteredData);
    } else {
      setSelectedAvatar(assigneeId);
      filteredData = filteredData.filter((data) => {
        return data.assigneeId === assigneeId;
      });
      setFilteredValue(filteredData);
    }
  };

  const onHandleChange = (e) => {
    const {name, value} = e.target;
    setCreateIssueInput({...createIssueInput, [name]: value});
    if (value.length > 3) {
      setHandleCreateBtn(false);
    } else {
      setHandleCreateBtn(true);
    }
  };

  const onHandleDescriptionChange = (name, value) => {
    setCreateIssueInput({...createIssueInput, [name]: value});
  };

  const handleIssueChange = (e) => {
    const {name, value} = e.target;
    setSelectedIssue({...selectedIssue, [name]: value});
    if (value.length > 3) {
      setHandleModified(false);
    } else {
      setHandleModified(true);
    }
  };

  const handleDescriptionIssueChange = (name, value) => {
    setSelectedIssue({...selectedIssue, [name]: value});
    if (value.length > 3) {
      setHandleModified(false);
    } else {
      setHandleModified(true);
    }
  };

  const handleUpdate = async () => {
    const updatesIssue = {};
    updatesIssue['projectList/' + projectDetail.projectId +
    '/issues/' + selectedIssue.id] = selectedIssue;
    selectedIssue.modifiedOn = new Date();
    handleCloseUpdate();
    return update(ref(database), updatesIssue);
  };

  const writeUserData = async () => {
    let isError = false;
    const errorMessage = 'Please fill all the fields';

    if (!createIssueInput.summary) {
      toast.error('Please add summary');
      isError = true;
    }

    if (isError) {
      toast.error(errorMessage);
    }
    if (!isError) {
      const createNewIssue = createIssueInput;
      const newPostKey = push(child(ref(database), 'issue')).key;
      createNewIssue.id = newPostKey;
      const updates = {};
      createIssueInput.createdOn = new Date();
      updates['projectList/' + projectDetail.projectId +
       '/issues/' + createNewIssue.id] = createNewIssue;
      toast.success('Issue created successfully');
      const message = `${createNewIssue.reporterId} has assigned ${createNewIssue.summary} to ${createNewIssue.assigneeId}`;
      activeUsersData.forEach(async (user) => {
        const uid = user.uid;
        const createIssueNotificRef = ref(database, 'users/' + uid + '/notifications/' + projectDetail.projectId);
        const createIssueNotificSnapshot = await get(createIssueNotificRef);
        const createIssueNotificVal = createIssueNotificSnapshot.val();
        const createIssueNotific = createIssueNotificVal ? createIssueNotificVal.data || [] : [];
        createIssueNotific.push(message);
        update(createIssueNotificRef, {data: createIssueNotific});
      });

      setCreateIssueInput({
        project: '',
        issueType: '',
        status: '',
        summary: '',
        description: '',
        assigneeId: '',
        reporterId: '',
        priority: '',
        createdOn: '',
      });
      if (switchCheck === true) {
        setOpenCreate(true);
      } else {
        handleClose();
      }
      return update(ref(database), updates);
    }
  };

  const handleOpen = () => {
    setOpenCreate(true);
  };

  const handleClose = () => {
    setOpenCreate(false);
    setCreateIssueInput({
      project: '',
      issueType: '',
      status: '',
      summary: '',
      description: '',
      assigneeId: '',
      reporterId: '',
      priority: '',
      createdOn: '',
    });
    setSwitchCheck(false);
    setHandleCreateBtn(true);
  };

  const handleOpenUpdate = (issue) => {
    setOpenUpdateIssue(true);
    setSelectedIssue(issue);
  };

  const handleCloseUpdate = () => {
    setOpenUpdateIssue(false);
    setHandleModified(true);
  };

  const handleInviteDialogOpen = () => {
    setInviteDialog(true);
  };

  const handleSwitchChange = (event) => {
    setSwitchCheck(event.target.checked);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const mode = useContext(ThemeContext);

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh'}}>
      <ResponsiveAppBar />
      <Box component="main" sx={{flexGrow: 1, p: 3}}>
        <Toolbar />
        <Box>
          <Typography variant='h5'>
            { `${projectDetail.projectName} Board`}
          </Typography>
        </Box>

        <Grid container
          sx={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
          <Grid item
            sx={{
              display: 'flex',
            }}>
            <Box sx={{flexGrow: 1}}>
              <Search
                sx={{
                  backgroundColor: 'background.paper',
                  borderRadius: '10px',
                }}>
                <SearchIconWrapper>
                  <SearchIcon
                  />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search this board"
                  inputProps={{'aria-label': 'search'}}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e)}
                />
              </Search>
            </Box>
            <Box display='inline-flex' marginLeft='10px' marginTop='-2px'>
              <AvatarGroup max={4}>
                {activeUsersData.map((user, index) => (
                  <Tooltip
                    key={index}
                    title={`${user.firstName} ${user.lastName}`}
                  >
                    <Avatar
                      onClick={() => filteredByAvatar(user.uid)}
                      sx={{'backgroundColor': user.avatarColor,
                        '&:hover': {
                          transition: 'transform 0.3s ease-out',
                          transform: 'translateY(-5px)',
                          zIndex: '2',
                        }}}>
                      {`${user.firstName[0]}${user.lastName[0]}`}
                    </Avatar>
                  </Tooltip>
                ))}
                <Tooltip
                  title={'Unassigned'}>
                  <Avatar
                    onClick={() => filteredByAvatar('123456789')}
                    sx={{'&:hover': {
                      transition: 'transform 0.3s ease-out',
                      transform: 'translateY(-5px)',
                      zIndex: '2',
                    }}}>
                  </Avatar>
                </Tooltip>
              </AvatarGroup>
              {userPermissions.manageUsers ? (
                <Tooltip title={'Invite User'}>
                  <Avatar sx={{marginTop: '2px',
                    marginLeft: '5px',
                    cursor: 'pointer'}}
                  onClick={handleInviteDialogOpen}>
                    <PersonAddAlt1Icon />
                  </Avatar>
                </Tooltip>) : ('')}
            </Box>
          </Grid>
          <Grid item display='flex' columnGap={3}>
            <FilterBy
              issues={issues}
              activeUsersData={activeUsersData}
              setIsFilterApplied={setIsFilterApplied}
              filterByValue={filterByValue}
              setFilterByValue={setFilterByValue}
              setFilteredValue={setFilteredValue} />
            {userPermissions.createTickets ? (
              <Tooltip title={'Create Issue'}>
                <Button variant='contained'
                  onClick={handleOpen}
                  sx={{
                    borderRadius: '10px',
                    minWidth: 'max-content',
                    padding: '10px 20px',
                    height: '38px',
                    fontWeight: '500',
                  }}>Create
                </Button>
              </Tooltip>
            ) : (
              ''
            )}
          </Grid>
        </Grid>
        <Issuecard
          userPermissions={userPermissions}
          projectDetail={projectDetail}
          handleOpenUpdate={handleOpenUpdate}
          filteredValue={filteredValue}
          mode={mode} />
        <UpdateIssue
          projectDetail={projectDetail}
          handleUpdateOpen={openUpdateIssue}
          handleUpdateClose={handleCloseUpdate}
          selectedIssue={selectedIssue}
          handleIssueChange={handleIssueChange}
          handleUpdate={handleUpdate}
          activeUsersData={activeUsersData}
          handleModified={handleModified}
          handleDescriptionIssueChange={handleDescriptionIssueChange} />
        <Box margin='10px'>
          <CreateIssueDialog
            openCreate={openCreate}
            handleClose={handleClose}
            onHandleChange={onHandleChange}
            handleCreateBtn = {handleCreateBtn}
            createIssueInput={createIssueInput}
            activeUsersData={activeUsersData}
            writeUserData={writeUserData}
            handleSwitchChange={handleSwitchChange}
            switchCheck={switchCheck}
            onHandleDescriptionChange={onHandleDescriptionChange}
            projectDetail = {projectDetail} />
        </Box>
        <Box>
          <InviteMembersDialog
            inviteDialog={inviteDialog}
            setInviteDialog={ setInviteDialog}
            projectDetail={projectDetail}
          />
        </Box>
      </Box>
    </Box>
  );
};

