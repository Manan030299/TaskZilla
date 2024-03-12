import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Avatar, TextField} from '@mui/material';
import {Box} from '@mui/material';
import {Button} from '@mui/material';
import {Card} from '@mui/material';
import {Grid} from '@mui/material';
import {Menu} from '@mui/material';
import {MenuItem} from '@mui/material';
import {Tooltip} from '@mui/material';
import {Typography} from '@mui/material';
import {Select} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BoltIcon from '@mui/icons-material/Bolt';
import DoneIcon from '@mui/icons-material/Done';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import KeyboardDoubleArrowUpIcon
  from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardDoubleArrowDownIcon
  from '@mui/icons-material/KeyboardDoubleArrowDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import {get, ref, onValue, remove, update} from 'firebase/database';
import {database} from '../../Firebase';

export const Issuecard = (props) => {
  const {projectDetail, userPermissions, handleOpenUpdate, filteredValue} = props;

  const [errorMessages, setErrorMessages] = useState('');
  const [addNewStatus, setaddNewStatus] = useState([]);
  const [issueStatus, setIssueStatus] = useState([]);
  const [showIssue, setShowIssue] = useState([]);
  const [isAddStatus, setIsAddStatus] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCardOptions, setSelectedCardOptions] = useState('');
  const [createStatusBtn, setCreateStatusBtn] = useState(true);
  const [modifyStatusBtn, setModifyStatusBtn] = useState(true);
  const [modifySelectedField, setModifySelectedField] = useState(false);

  useEffect(() => {
    onValue(ref(database, 'projectList/' +
    projectDetail.projectId + '/status/'), (snapshot) => {
      if (snapshot && snapshot.val()) {
        const data = snapshot.val();
        setIssueStatus(data);
      }
    });
  }, [projectDetail]);

  useEffect(() => {
    if (projectDetail && projectDetail.projectId) {
      const statusRef = ref(database, 'projectList/' +
      projectDetail.projectId);
      get(statusRef).then((snapshot) => {
        const projectVal = snapshot.val();
        const addStatus = projectVal.status || [];

        // Only set default status values if the addStatus array is empty
        if (addStatus.length === 0) {
          update(ref(database, 'projectList/' + projectDetail.projectId),
              {status: ['TO DO', 'IN PROGRESS', 'COMPLETED']});
        }
      });
    }
  }, [projectDetail]);

  useEffect(() =>{
    const filteredIssues = issueStatus.map((status) => {
      if (filteredValue.length > 0) {
        return filteredValue.filter((issue) =>
          issue && issue.status === status,
        );
      }
    });
    setShowIssue(filteredIssues);
  }, [issueStatus, filteredValue]);

  const open = Boolean(anchorEl);
  const cardMenuList = ['Delete'];

  const handleAddNewStatusBtn = () => {
    setIsAddStatus(true);
  };

  const closeAddNewStatusBtn = () => {
    setIsAddStatus(false);
    setCreateStatusBtn(true);
    setaddNewStatus('');
    setErrorMessages('');
  };

  const handleNewStatus = (e) => {
    setaddNewStatus(e.target.value);
    if (e.target.value.length > 0) {
      setCreateStatusBtn(false);
    } else {
      setCreateStatusBtn(true);
    }
  };

  const updateCurrentStatus = (e, index) => {
    const updatedStatuses = [...issueStatus];
    updatedStatuses[index] = e.target.value;
    setIssueStatus(updatedStatuses);
    setModifySelectedField(true);
    if (e.target.value.length > 3) {
      setModifyStatusBtn(false);
    } else {
      setModifyStatusBtn(true);
    }
  };

  const modifyRecentStatus = () => {
    update(ref(database, 'projectList/' + projectDetail.projectId),
        {status: issueStatus});
    setModifySelectedField(false);
  };

  const createNewStatus = async () => {
    let isError = false;

    let validateAddNewStatus = '';

    if (!addNewStatus) {
      validateAddNewStatus = 'Field should not be empty';
      isError = true;
    }

    if (isError) {
      setErrorMessages(validateAddNewStatus);
    }
    if (!isError) {
      const addNewStatusRef = ref(
          database, 'projectList/' + projectDetail.projectId);
      const addNewStatusSnapshot = await get(addNewStatusRef);
      const addNewStatusVal = addNewStatusSnapshot.val();
      const addStatus = addNewStatusVal.status || [];

      addStatus.push(addNewStatus);
      update(addNewStatusRef, {status: addStatus});
      setaddNewStatus('');
      setIsAddStatus(false);
    }
  };

  const handleCardMenuOpen = (e, issue) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
    setSelectedCardOptions(issue);
  };

  const handleCardMenuClose = (e) => {
    if (e) {
      e.stopPropagation();
    }
    setAnchorEl(null);
  };

  const handleCardOption = (cardOption) => {
    if (cardOption === 'Delete') {
      // Remove the issue from Firebase
      remove(ref(database, 'projectList/' + projectDetail.projectId +
       '/issues/' + selectedCardOptions.id));

      // Remove the issue from the UI by filtering the showStatus array
      const updatedShowStatus = showIssue.map((statusList) =>
        statusList.filter((issue) => issue.id !== selectedCardOptions.id),
      );
      setShowIssue(updatedShowStatus);
    }
    handleCardMenuClose();
    setSelectedCardOptions(null);
  };

  return (
    <Box
      sx={{'display': 'flex',
        'marginTop': '30px',
        'gap': '10px',
        'padding': '0px 10px',
        'overflowX': 'auto',
        'overflowY': 'auto',
        'height': '60vh',
        'width': '93vw',
        '&::-webkit-scrollbar': {
          width: '100%',
          height: '10px',
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
      {issueStatus.map((statusName, index) => (
        <Box
          key={`name_${index}`}>
          <Card
            sx={{textAlign: 'Left',
              borderRadius: '0px',
              backgroundColor: 'background.default',
              boxShadow: 'none',
              padding: '15px 5px',
              height: '40px',
              overflow: 'visible',
              position: 'sticky',
              top: '0px',
              width: '300px',
              zIndex: '2'}}>
            <TextField size='small'
              sx={{
                width: '100%',
                borderRadius: '10px',
                backgroundColor: 'background.paper',
                boxShadow: 1}}
              name='statusName'
              onChange={(e) => updateCurrentStatus(e, index)}
              value={`${statusName} ${showIssue && showIssue[index]?.length || ''}`} />
            {userPermissions.create_tickets ? (
              modifySelectedField &&
                <Grid container columnSpacing={1}
                  justifyContent='right'>
                  <Grid item>
                    <Button variant='contained'
                      sx={{minWidth: '0px',
                        height: '30px',
                        marginTop: '5px',
                        padding: '5px'}}
                      disabled={modifyStatusBtn[index]}
                      onClick={modifyRecentStatus}>
                      <DoneIcon />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant='contained'
                      sx={{minWidth: '0px',
                        height: '30px',
                        marginTop: '5px',
                        padding: '5px'}}>
                      <CloseIcon />
                    </Button>
                  </Grid>
                </Grid>
               ) : ('')}

          </Card>
          {showIssue && showIssue[index]?.length > 0 ?
          (<Box sx={{paddingBottom: '5px'}}>
            <Card
              sx={{textAlign: 'Left',
                borderRadius: '10px',
                padding: '0px 10px',
                width: '280px',
                minHeight: '150px',
                marginTop: '0px',
                marginLeft: '5px'}}>
              {showIssue && showIssue[index]?.map((issue, StatusIndex) => (
                <Card key={`Status_${StatusIndex}`}
                  onClick={() => handleOpenUpdate(issue)}
                  sx={{'padding': '10px',
                    'marginTop': '10px',
                    'marginBottom': '10px',
                    'borderRadius': '10px',
                    'boxShadow': 4,
                    '&:hover': {
                      backgroundColor: 'background.default',
                      boxShadow: 6,
                      cursor: 'crosshair',
                    }}}>
                  <Grid container>
                    <Grid item xs={10}>
                      <Typography variant='h6' fontWeight='500'>
                        {issue.summary}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      {userPermissions.removeTickets ? (
                        <Box>
                          <Button
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={(e) => handleCardMenuOpen(e, issue)}
                          >
                            <MoreVertIcon
                              sx={{transform: 'rotate(90deg)'}} />
                          </Button>
                          <Menu
                            sx={{
                              '& .MuiMenu-paper': {
                                boxShadow: 1,
                              },
                            }}
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleCardMenuClose}
                            MenuListProps={{
                              'aria-labelledby': 'basic-button',
                            }}
                          >
                            {cardMenuList.map((cardOption) => (
                              <MenuItem key={cardOption}
                                onClick={handleCardMenuClose}>
                                <Typography
                                  onClick={() => handleCardOption(cardOption)}
                                  width='100%'
                                  textAlign="left">
                                  {cardOption}
                                </Typography>
                              </MenuItem>
                            ))}
                          </Menu>
                        </Box>) : ('')}
                    </Grid>
                  </Grid>
                  <Grid container marginTop='20px'>
                    <Grid item xs={1}>
                      <Select
                        variant='standard'
                        name="issueType"
                        disabled={true}
                        value={issue.issueType}
                        inputProps={{IconComponent: () => null}}
                        sx={{
                          marginBottom: '20px',
                          width: '20px',
                          [`& .MuiSelect-select`]: {
                            display: 'inline-flex',
                            alignItems: 'initial'}}}>
                        <MenuItem value='STORY'><BookmarkIcon
                          sx={{bgcolor: '#30ca3b', color: '#FFF', padding: '2px',
                            borderRadius: '5px', fontSize: '16px',
                            marginRight: '10px'}} />
                        </MenuItem>
                        <MenuItem value='TASK'><DoneIcon
                          sx={{bgcolor: '#3e9fdf', color: '#FFF', padding: '2px',
                            borderRadius: '5px', fontSize: '16px',
                            marginRight: '10px'}} />
                        </MenuItem>
                        <MenuItem value='BUG'><FiberManualRecordIcon
                          sx={{bgcolor: '#fc3324', color: '#FFF', padding: '2px',
                            borderRadius: '5px', fontSize: '16px',
                            marginRight: '10px'}} />
                        </MenuItem>
                        <MenuItem value='EPIC'><BoltIcon
                          sx={{bgcolor: '#aa08e5', color: '#FFF', padding: '2px',
                            borderRadius: '5px', fontSize: '16px',
                            marginRight: '10px'}} />
                        </MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={4}>
                      <Select
                        variant='standard'
                        disabled={true}
                        name="priority"
                        value={issue.priority}
                        inputProps={{IconComponent: () => null}}
                        sx={{
                          marginBottom: '20px',
                          width: '20px',
                          [`& .MuiSelect-select`]: {
                            display: 'inline-flex',
                            alignItems: 'flex-end',
                          }}}>
                        <MenuItem value='HIGHEST'>
                          <KeyboardDoubleArrowUpIcon
                            sx={{
                              marginTop: '-10px',
                              color: '#30ca3b',
                              fontSize: '1.5rem',
                            }}/>
                        </MenuItem>
                        <MenuItem value='HIGH'>
                          <KeyboardArrowUpIcon
                            sx={{
                              marginTop: '-10px',
                              color: '#fc3324',
                              fontSize: '1.5rem',
                            }}/>
                        </MenuItem>
                        <MenuItem value='MEDIUM'>
                          <DragHandleIcon
                            sx={{
                              marginTop: '-10px',
                              color: '#cc8c0b',
                              fontSize: '1.5rem',
                            }}/>
                        </MenuItem>
                        <MenuItem value='LOW'>
                          <KeyboardArrowDownIcon
                            sx={{
                              marginTop: '-10px',
                              color: '#aa08e5',
                              fontSize: '1.5rem',
                            }}/>
                        </MenuItem>
                        <MenuItem value='LOWEST'><
                          KeyboardDoubleArrowDownIcon
                          sx={{
                            marginTop: '-10px',
                            color: '#3e9fdf',
                            fontSize: '1.5rem',
                          }}/>
                        </MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={5}>
                      <Typography
                        sx={{
                          width: 'max-content',
                          padding: '1px 8px',
                          borderRadius: '5px'}}
                        variant='h6' fontWeight='500'>
                        {issue.project}
                      </Typography>
                    </Grid>
                    {issue.assigneeId === '123456789'?
                    (''):(
                    <Grid item xs={2}>
                      <Tooltip arrow title={`${issue.assigneeId}`}>
                        <Avatar>
                          {issue.assigneeId[0]}
                        </Avatar>
                      </Tooltip>
                    </Grid>
                    )}
                  </Grid>
                </Card>
              ))}
            </Card>
          </Box>):
          ('')}
        </Box>
      ))}
      {userPermissions.createTickets ? (
        isAddStatus? (<Grid item xs={3}>
          <Card
            sx={{textAlign: 'Left',
              borderRadius: '0px',
              boxShadow: 'none',
              backgroundColor: 'background.default',
              padding: '15px 5px',
              height: '40px',
              overflow: 'visible',
              position: 'sticky',
              top: '0px',
              width: '300px',
              zIndex: '2'}}>
            <TextField size='small'
              sx={{
                width: '100%',
                borderRadius: '10px',
                boxShadow: 1,
                backgroundColor: 'background.paper',
              }}
              name='addNewStatus'
              value={addNewStatus}
              onChange= {handleNewStatus}
              helperText={errorMessages.addNewStatus}/>
            <Grid container columnSpacing={1}
              justifyContent='right'>
              <Grid item>
                <Button variant='contained'
                  sx={{minWidth: '0px',
                    height: '30px',
                    marginTop: '5px',
                    padding: '5px'}}
                  disabled={createStatusBtn}
                  onClick={createNewStatus}>
                  <DoneIcon />
                </Button>
              </Grid>
              <Grid item>
                <Button variant='contained'
                  sx={{minWidth: '0px',
                    height: '30px',
                    marginTop: '5px',
                    padding: '5px'}}
                  onClick={closeAddNewStatusBtn}>
                  <CloseIcon />
                </Button>
              </Grid>
            </Grid>
          </Card>
        </Grid>):
       (<Button variant='contained'
         sx={{height: '38px',
           position: 'sticky',
           top: '15px',
           marginLeft: '5px',
           minWidth: '125px',
           marginTop: '15px',
           borderRadius: '10px'}}
         onClick={handleAddNewStatusBtn}>
          Add Status
       </Button>)) : ('')}
    </Box>
  );
};

Issuecard.propTypes = {
  projectDetail: PropTypes.any.isRequired,
  userPermissions: PropTypes.any.isRequired,
  handleOpenUpdate: PropTypes.any.isRequired,
  filteredValue: PropTypes.any.isRequired,
};
