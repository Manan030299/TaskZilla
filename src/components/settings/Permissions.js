import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import {database} from '../../Firebase';
import {onValue, ref, update} from 'firebase/database';

export const Permissions = () => {
  const [create, setCreate] = useState({
    role: '',
  });

  const [permissions, setPermissions] = useState({
    createTickets: false,
    manageUsers: false,
    modifyTickets: false,
    removeTickets: false,
  });

  const [errorMessage, setErrorMessage] = useState({
    role: '',
  });

  const [allPermissions, setAllPermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [createPermission, setCreatePermission] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isHoveredIndex, setIsHoveredIndex] = useState(-1);
  const [disabledPermissionField, setDisabledPermissionField] = useState('');
  const [modifyPermissionBtn, setModifyPermissionBtn] = useState(true);
  const [disabledModifyBtn, setDisabledModifyBtn] = useState(true);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPermission, setSelectedPermission] = useState({});

  useEffect(() =>{
    onValue(ref(database, 'permissions/'), (snapshot) => {
      const data = snapshot.val();
      setAllPermissions(data);
      setRoles(Object.keys(snapshot.val()));
    });
  }, []);

  const handlePermissions = (e) => {
    const {name, checked} = e.target;
    setPermissions({...permissions, [name]: checked});
  };

  const handleCreate = (e) => {
    const {name, value} = e.target;
    setCreate({...create, [name]: value});
  };

  const editPermissionsBtn = (selectedRole) => {
    setDisabledPermissionField(selectedRole);
    setModifyPermissionBtn(false);
    setSelectedRole(selectedRole);
    setSelectedPermission({...allPermissions[selectedRole]});
  };

  const cancelEditPermission = (role, index) => {
    const prevRole = [...roles];
    prevRole[index] = selectedRole;
    setRoles(prevRole);
    const modifyPermissions = {...allPermissions};
    modifyPermissions[selectedRole] = {...selectedPermission};
    setAllPermissions(modifyPermissions);
    setDisabledPermissionField('');
    setModifyPermissionBtn(true);
    setDisabledModifyBtn(true);
    setSelectedRole('');
    setSelectedPermission({});
  };

  const handleMouseEnter = (index) => {
    setIsCardHovered(true);
    setIsHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setIsCardHovered(false);
    setIsHoveredIndex(-1);
  };

  const openCreatePermissions = () => {
    setCreatePermission(true);
  };

  const closeCreatePermissions = () => {
    setCreatePermission(false);
    setCreate({
      role: '',
    });
    setPermissions({
      createTickets: false,
      manageUsers: false,
      modifyTickets: false,
      removeTickets: false,
    });
    setErrorMessage({
      role: '',
    });
  };

  const createRole = () => {
    const validationMessage = {
      role: '',
    };

    let isError = false;

    if (!create.role) {
      validationMessage.role='Please enter role';
      isError = true;
    }

    if (create.role === 'admin' || create.role === 'Admin') {
      validationMessage.role='Already in use';
      isError = true;
    }

    if (isError) {
      setErrorMessage(validationMessage);
    }
    if (!isError) {
      const createUserRole = create;
      const AddPermissions = permissions;
      const userRole = {};
      userRole['permissions/'+ createUserRole.role.toLowerCase()] = AddPermissions;
      update(ref(database), userRole);
      setCreatePermission(false);
      setCreate({
        role: '',
      });
      setPermissions({
        createTickets: false,
        manageUsers: false,
        modifyTickets: false,
        removeTickets: false,
      });
      setErrorMessage({
        role: '',
      });
    }
  };

  const updateCurrentRole = (e, index) => {
    const updateRole = [...roles];
    updateRole[index] = e.target.value;
    setRoles(updateRole);
    setDisabledPermissionField(e.target.value);
    if (e.target.value.length > 0) {
      setDisabledModifyBtn(false);
    } else {
      setDisabledModifyBtn(true);
    }
  };

  const handlePermissionsChange = (index, e) => {
    const keys = Object.keys(allPermissions);
    const modifyPermissions = {...allPermissions};
    modifyPermissions[keys[index]][e.target.name] = e.target.checked;
    setAllPermissions({...modifyPermissions});
    setDisabledModifyBtn(false);
  };

  const modifyRole = (role) => {
    const modifyPermissions = {...allPermissions};
    if (role !== selectedRole) {
      modifyPermissions[role] = modifyPermissions[selectedRole];
      delete modifyPermissions[selectedRole];
    }
    const updatePermissions = {};
    updatePermissions['permissions/'] = modifyPermissions;
    update(ref(database), updatePermissions);
    setDisabledPermissionField('');
    setModifyPermissionBtn(true);
    setDisabledModifyBtn(true);
    setSelectedRole('');
  };

  return (
    <Box sx={{
      flexGrow: 1,
      padding: '10px',
    }}>
      <Toolbar />
      <Box>
        <Typography marginBottom='10px' variant='h4'>
          Permissions
        </Typography>
        <Box
          sx={{display: 'flex',
            justifyContent: 'flex-end'}}>
          <Button
            variant='contained'
            onClick={openCreatePermissions}
            sx={{
              borderRadius: '10px',
              minWidth: 'max-content',
              padding: '10px',
              height: '37px',
              fontWeight: '500'}}>
            Add Role
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
          {createPermission && (
            <Card
              sx={{
                'boxShadow': 1,
                'borderRadius': '10px',
                'padding': '10px',
                'paddingLeft': '20px',
                '&:hover': {
                  boxShadow: 4,
                }}}>
              <Grid container columnGap={2}
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center'}}>
                <Grid item>
                  <TextField
                    sx={{width: '150px'}}
                    variant='outlined'
                    label='Create Role'
                    name= 'role'
                    value={create.role && create.role.toLowerCase()}
                    onChange={handleCreate}
                    helperText={errorMessage.role}
                    size='small' />
                </Grid>
                <Grid>
                  <FormControlLabel
                    control={<Checkbox color="primary"
                      checked={permissions.createTickets} />}
                    label="Create Tickets"
                    labelPlacement="top"
                    onChange={handlePermissions}
                    name='createTickets'
                  />
                </Grid>
                <Grid>
                  <FormControlLabel
                    control={<Checkbox color="primary"
                      checked={permissions.manageUsers} />}
                    label="Manage Users"
                    labelPlacement="top"
                    onChange={handlePermissions}
                    name='manageUsers'
                  />
                </Grid>
                <Grid>
                  <FormControlLabel
                    control={<Checkbox color="primary"
                      checked={permissions.modifyTickets}/>}
                    label="Modify Tickets"
                    labelPlacement="top"
                    onChange={handlePermissions}
                    name='modifyTickets'
                  />
                </Grid>
                <Grid>
                  <FormControlLabel
                    control={<Checkbox color="primary"
                      checked={permissions.removeTickets} />}
                    label="Remove Tickets"
                    labelPlacement="top"
                    onChange={handlePermissions}
                    name='removeTickets'
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant='outlined'
                    onClick={closeCreatePermissions}
                    sx={{
                      borderRadius: '10px',
                      width: 'max-content',
                      padding: '5px',
                      height: '35px',
                      minWidth: '0px',
                    }}>
                    <ClearIcon />
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant='contained'
                    onClick={createRole}
                    sx={{
                      borderRadius: '10px',
                      width: 'max-content',
                      padding: '5px',
                      height: '32px',
                      minWidth: '0px',
                    }}>
                    <DoneIcon />
                  </Button>
                </Grid>
              </Grid>
            </Card>)}
          {Object.values(allPermissions).map((permission, index) => (
            (roles[index] !== 'admin' &&(
              <Card
                key={`permission_${index}`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                sx={{
                  'boxShadow': 1,
                  'borderRadius': '10px',
                  'padding': '10px',
                  'paddingLeft': '20px',
                  'margin': '10px 0px',
                  '&:hover': {
                    boxShadow: 4,
                  }}}>
                <Grid container columnGap={2}
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center'}}>
                  <Grid item
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
                    <TextField
                      sx={{width: '150px'}}
                      disabled={disabledPermissionField === roles[index]?
                        false : true}
                      variant='outlined'
                      value={roles[index] && roles[index].toLowerCase()}
                      name={roles[index]}
                      onChange={(e) => updateCurrentRole(e, index)}
                      size='small'/>
                  </Grid>
                  <Grid>
                    <FormControlLabel
                      control={<Checkbox color="primary"
                        checked={permission.createTickets}/>}
                      disabled={disabledPermissionField === roles[index]?
                          false : true}
                      label="Create Tickets"
                      name='createTickets'
                      labelPlacement="top"
                      onChange={(e) => handlePermissionsChange(index, e)}
                    />
                  </Grid>
                  <Grid>
                    <FormControlLabel
                      control={<Checkbox color="primary"
                        checked={permission.manageUsers} />}
                      disabled={disabledPermissionField === roles[index]?
                          false : true}
                      label="Manage Users"
                      name='manageUsers'
                      labelPlacement="top"
                      onChange={(e) => handlePermissionsChange(index, e)}
                    />
                  </Grid>
                  <Grid>
                    <FormControlLabel
                      control={<Checkbox color="primary"
                        checked={permission.modifyTickets} />}
                      disabled={disabledPermissionField === roles[index]?
                          false : true}
                      label="Modify Tickets"
                      name="modifyTickets"
                      labelPlacement="top"
                      onChange={(e) => handlePermissionsChange(index, e)}
                    />
                  </Grid>
                  <Grid>
                    <FormControlLabel
                      control={<Checkbox color="primary"
                        checked={permission.removeTickets} />}
                      disabled={disabledPermissionField === roles[index]?
                          false : true}
                      label="Remove Tickets"
                      name="removeTickets"
                      labelPlacement="top"
                      onChange={(e) => handlePermissionsChange(index, e)}
                    />
                  </Grid>
                  {isCardHovered && modifyPermissionBtn &&
                  index === isHoveredIndex &&
                    <Grid>
                      <Button
                        variant='outlined'
                        onClick={() => editPermissionsBtn(roles[index])}
                        sx={{
                          borderRadius: '10px',
                          minWidth: 'max-content',
                          padding: '10px 5px',
                          height: '37px',
                        }}>
                        <EditIcon />
                      </Button>
                    </Grid>}
                  {disabledPermissionField === roles[index] &&
                  <>
                    <Grid>
                      <Button
                        variant='outlined'
                        onClick={(e) => cancelEditPermission(roles[index], index)}
                        sx={{
                          borderRadius: '10px',
                          minWidth: 'max-content',
                          padding: '10px 5px',
                          height: '35px',
                        }}>
                        <ClearIcon />
                      </Button>
                    </Grid>
                    <Grid>
                      <Button
                        variant='contained'
                        disabled={disabledModifyBtn}
                        onClick={() => modifyRole(roles[index])}
                        sx={{
                          borderRadius: '10px',
                          minWidth: 'max-content',
                          padding: '10px 5px',
                          height: '35px',
                        }}>
                        <DoneIcon />
                      </Button>
                    </Grid>
                  </>
                  }
                </Grid>
              </Card>))
          ))}
        </Box>
      </Box>
    </Box>
  );
};
