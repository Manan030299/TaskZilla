import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import {database} from '../../Firebase';
import {useNavigate} from 'react-router-dom';
import {onValue, ref, update} from 'firebase/database';
import Prooject from '../../assets/Images/task_management.png';

export const CreateProject = () => {
  const [adminData, setAdminData] = useState([]);
  const [createProject, setCreateProject] = useState({
    adminId: '',
    activeUsers: '',
    projectId: '',
    projectName: '',
  });
  const [errorMessages, setErrorMessages] = useState({
    projectName: '',
  });
  const [handleCreateButton, setHandleCreateButton] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const uid = sessionStorage.getItem('uid') || localStorage.getItem('uid');
    if (uid) {
      onValue(ref(database, 'users/' + uid), (snapshot) => {
        const data = snapshot.val() || {};
        setAdminData(data);
      });
    }
  }, []);

  const handleInput = (e) => {
    const {name, value} = e.target;
    setCreateProject({...createProject, [name]: value});
    if (value.length >= 3) {
      setHandleCreateButton(false);
    } else {
      setHandleCreateButton(true);
    }
  };

  const generateProjectId = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      result += characters.charAt(randomIndex);
    }
    return result;
  };

  const handleBack = () => {
    localStorage.clear()||sessionStorage.clear();
    navigate('/Login');
  };

  const handleValidation = async () => {
    let isError = false;
    const validationMessages = {
      projectName: '',
    };
    if (!createProject.projectName) {
      validationMessages.projectName = 'Please enter project name';
      isError = true;
    }
    if (isError) {
      setErrorMessages(validationMessages);
    }
    if (!isError) {
      const createNewProject = createProject;
      createNewProject.adminId = adminData.uid;
      createNewProject.projectId = generateProjectId(32);
      createNewProject.activeUsers = [adminData.uid];
      const project = {};
      const projId = [];
      projId.push(createNewProject.projectId);
      project['projectList/' + createNewProject.projectId] = createNewProject;
      update(ref(database, 'users/' + adminData.uid), {
        projectId: projId,
      });
      const admin = {
        createTickets: true,
        manageUsers: true,
        modifyTickets: true,
        removeTickets: true,
      };
      const updatePermissions = {};
      updatePermissions['permissions/' + '/admin/'] = admin;
      update(ref(database), updatePermissions);
      navigate('/kanban-board');
      setCreateProject({
        adminId: '',
        activeUsers: '',
        projectId: '',
        projectName: '',
      });
      return update(ref(database), project);
    }
  };

  return (
    <Box minHeight='100vh'>
      <Grid container>
        <Grid item xs={6} padding="50px">
          <FormControl>
            <Typography variant="h4">Create Project</Typography>
            <TextField
              sx={{margin: '40px 0px 10px 0px', width: '500px'}}
              variant="outlined"
              type="text"
              name="projectName"
              value={createProject.projectName}
              label="Project Name"
              helperText={errorMessages.projectName}
              onChange={handleInput}
              required
            />
            <Grid container sx={{marginTop: '20px'}}>
              <Grid item xs={2.8}>
                <Button
                  type="submit"
                  sx={{
                    borderRadius: '10px',
                  }}
                  onClick={handleValidation}
                  disabled={handleCreateButton}
                  variant="contained"
                >
                  Create
                </Button>
              </Grid>
              <Grid item xs={9.2}>
                <Button
                  variant="text"
                  onClick={handleBack}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
          </FormControl>
        </Grid>
        <Grid item xs={6}
          sx={{padding: '20px',
            minHeight: '100vh'}}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'right',
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
              marginTop: '10px',
            }}>
            <img src={Prooject} alt='Prooject' />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
