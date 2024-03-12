import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Box, Tooltip} from '@mui/material';
import {Typography} from '@mui/material';
import {Grid} from '@mui/material';
import {Avatar} from '@mui/material';
import {FormGroup} from '@mui/material';
import {FormControlLabel} from '@mui/material';
import {Checkbox} from '@mui/material';
import {Card} from '@mui/material';
import {TextField} from '@mui/material';
import {Button} from '@mui/material';
import {child, onValue, push, ref, remove, update} from 'firebase/database';
import {database} from '../../Firebase';
import {toast} from 'react-hot-toast';
import ClearIcon from '@mui/icons-material/Clear';

export const TodaysTask = (props) => {
  const {projectDetail, teamMembers} = props;

  const [taskDetails, setTaskDetails] = useState([]);
  const [handleCreateBtn, setHandleCreateBtn] = useState(true);
  const [create, setCreate] = useState({
    title: '',
  });
  const [errorMessages, setErrorMessages] = useState({
    title: '',
  });
  const [isNotificationHovered, setIsNotificationHovered] = useState(false);
  const [isHoveredIndex, setIsHoveredIndex] = useState(-1);

  useEffect(() => {
    if (projectDetail?.projectId) {
      onValue(
          ref(database, 'projectList/' + projectDetail.projectId +
          '/todoList/'),
          (snapshot) => {
            const data = Object.values(snapshot.val() || {});
            const modifiedData = data.map((taskData) => {
              const assignee = teamMembers.find((member) =>
                member.uid === taskData.assigneeId);
              if (assignee) {
                return {
                  assigneeId: taskData.assigneeId,
                  title: taskData.title,
                  isCompleted: taskData.isCompleted,
                  firstName: assignee.firstName,
                  lastName: assignee.lastName,
                  id: taskData.id,
                  avatarColor: assignee.avatarColor,
                };
              }
            });
            setTaskDetails(modifiedData);
          },
      );
    }
  }, [projectDetail, teamMembers]);

  const handleCreate = (e) => {
    const {name, value} = e.target;
    setCreate({...create, [name]: value});
    if (value.length >= 3) {
      setHandleCreateBtn(false);
    } else {
      setHandleCreateBtn(true);
    }
  };

  const createTask = () => {
    let isError = false;
    const validationMessages = {
      title: '',
    };

    if (!create.title) {
      validationMessages.title = 'Please enter title';
      isError = true;
    }

    if (isError) {
      setErrorMessages(validationMessages);
    }
    if (!isError) {
      const uid = sessionStorage.getItem('uid') ||
      localStorage.getItem('uid');
      const createNewTask = create;
      const newPostKey = push(child(ref(database), 'todoList')).key;
      createNewTask.id = newPostKey;
      createNewTask.assigneeId = uid;
      createNewTask.isCompleted = false;
      const updateCreateTask = {};
      updateCreateTask['projectList/' +projectDetail.projectId +
       '/todoList/' + createNewTask.id] = createNewTask;
      setHandleCreateBtn(true);
      toast.success(`${createNewTask.title} created successfully`);
      setCreate({
        title: '',
      });
      return update(ref(database), updateCreateTask);
    }
  };

  const handleComplete = (id) => {
    const updatedTaskDetails = taskDetails.map((taskData) => {
      if (taskData.id === id) {
        taskData.isCompleted = !taskData.isCompleted;
        if (!taskData.isCompleted) {
          update(ref(database, 'projectList/' + projectDetail.projectId +
           '/todoList/' + id), {isCompleted: false});
        } else {
          update(ref(database, 'projectList/' + projectDetail.projectId +
           '/todoList/' + id), {isCompleted: true});
        }
      }
      return taskData;
    });
    return updatedTaskDetails;
  };

  const handleMouseEnter = (index) => {
    setIsNotificationHovered(true);
    setIsHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setIsNotificationHovered(false);
    setIsHoveredIndex(-1);
  };

  const deleteTask = (index, title) => {
    remove(ref(database, 'projectList/' + projectDetail.projectId + '/todoList/' + index));
    toast.success(`${title} is successfully deleted`);
  };

  return (
    <Box marginTop="10px">
      <Box
        sx={{'maxHeight': '250px',
          'overflowY': 'auto',
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
        {taskDetails.map((taskData, index) => (
          <Card
            key={`taskData_${index}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            sx={{padding: '15px',
              borderRadius: '10px',
              boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
              margin: '10px',
              marginBottom: '10px'}}>
            <Grid container >
              <Grid item xs={9}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox
                      checked={taskData?.isCompleted || false}
                      onChange={() =>handleComplete(taskData?.id)} />}
                    label={taskData?.title} />
                </FormGroup>
                <Typography>{''}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Tooltip title={`${taskData?.firstName} ${taskData?.lastName}`}>
                  <Avatar
                    sx={{
                      backgroundColor: taskData?.avatarColor,
                      marginRight: '10px',
                      marginTop: '1px',
                      height: '40px',
                      width: '40px'}}>
                    {taskData?.firstName[0]}
                  </Avatar>
                </Tooltip>
              </Grid>
              {isNotificationHovered && index === isHoveredIndex &&
              <Grid item xs={1}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'}}>
                <Button
                  onClick={(e) => deleteTask(taskData.id, taskData.title)}
                  variant='text'>
                  <ClearIcon
                    sx={{
                      fontWeight: '600',
                    }} />
                </Button>
              </Grid>}
            </Grid>
          </Card>
        ))}
      </Box>
      {/* {userPermissions.createTickets ? ( */}
      <Box
        sx={{marginTop: '20px'}}>
        <TextField
          label='Create Task'
          sx={{width: '100%'}}
          name='title'
          value={create.title}
          onChange={handleCreate}
          helperText={errorMessages.title}/>
        <Button variant='contained'
          sx={{width: '100%',
            marginTop: '20px',
            fontSize: '1rem',
            borderRadius: '10px'}}
          onClick={createTask}
          disabled={handleCreateBtn}>
          Create Task
        </Button>
      </Box>
      {/* ) : ('')} */}
    </Box>
  );
};

TodaysTask.propTypes = {
  projectDetail: PropTypes.any.isRequired,
  // userPermissions: PropTypes.any.isRequired,
  teamMembers: PropTypes.any.isRequired,
};
