import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import {database} from '../../Firebase';
import {ref, remove, update} from 'firebase/database';
import {toast} from 'react-hot-toast';
import {SelectAssigneeDialog} from './SelectAssigneeDialog';
import {ConfirmationDeleteUserDialog} from './ConfirmationDeleteUserDialog';

export const AssignToDialog = (props) => {
  const {projectDetail, issueAssigneeDialog, setIssueAssigneeDialog, activeUsersData, deletingUserDetails,
    setDeletingUserDetails, selectedUserIssueData, setSelectedUserIssueData} = props;

  const [isAssigneeDialogOpen, setIsAssigneeDialogOpen] = useState(false);
  const [modifiedData, setModifiedData] = useState([]);
  const [selectedIssueIndex, setSelectedIssueIndex] = useState([]);
  const [modifiedIssueData, setModifiedIssueData] = useState([]);
  const [openConfirmDeleteDialog, setOpenConfirmDeleteDialog] = useState(false);
  // const [isAssigneeIdsModified, setIsAssigneeIdsModified] = useState(false);

  useEffect(() => {
    const modData = activeUsersData
        .filter((userData) => deletingUserDetails.uid !== userData.uid)
        .map((userData) => ({
          ...userData,
          label: `${userData.firstName} ${userData.lastName}`,
        }));
    setModifiedData([...modData]);
  }, [activeUsersData, deletingUserDetails]);

  useEffect(() => {
    if (selectedUserIssueData.length != 0) {
      const data = _.cloneDeep(selectedUserIssueData).map((issue) => {
        issue.assigneeId = '';
        return issue;
      });
      setModifiedIssueData(data);
    }
  }, [selectedUserIssueData]);

  // useEffect(() => {
  //   const allAssigneeIdsModified = modifiedIssueData.every(
  //       (issue) => issue.assigneeId !== '',
  //   );
  //   setIsAssigneeIdsModified(allAssigneeIdsModified);
  // }, [modifiedIssueData]);

  const handleSelectIssue = (i) => {
    const index = selectedIssueIndex.indexOf(i);
    if (index != -1) {
      setSelectedIssueIndex([...selectedIssueIndex, i]);
      const modifiedData = [...selectedIssueIndex];
      modifiedData.splice(index, 1);
      setSelectedIssueIndex(modifiedData);
    } else {
      setSelectedIssueIndex([...selectedIssueIndex, i]);
    }
  };

  const handleSelectAllIssues = (e) => {
    if (e.target.checked) {
      const data = [];
      for (let i = 0; i < modifiedIssueData.length; i++) {
        data.push(i);
      }
      setSelectedIssueIndex(data);
    } else {
      setSelectedIssueIndex([]);
    }
  };

  const handleSelectAssignee = (e, index) => {
    const data = [...modifiedIssueData];
    data[index].assigneeId = e.target.value ?? '';
    setModifiedIssueData(data);
  };

  const selectAssignee = (value) => {
    const data = [...modifiedIssueData];
    selectedIssueIndex.forEach((index) => {
      data[index].assigneeId = value.uid;
    });
    setModifiedIssueData(data);
    setSelectedIssueIndex([]);
  };

  const closeIssueAssigneeDialog = () => {
    setDeletingUserDetails([]);
    setSelectedUserIssueData([]);
    setIssueAssigneeDialog(false);
    setModifiedIssueData([]);
  };

  const handleSelectAssigneeBtn = () => {
    setIsAssigneeDialogOpen(true);
  };

  const handleSaveNDeleteBtn = () => {
    setOpenConfirmDeleteDialog(true);

    const data = [...modifiedIssueData];
    data.every((issue) =>{
      if (issue.assigneeId === '') {
        data.map((issue) => {
          issue.assigneeId = '123456789';
          return issue;
        });
      } else {
        return data;
      }
    },
    );
    setModifiedIssueData(data);
  };

  const closeConfirmDeleteDialog = () => {
    setModifiedIssueData([]);
    setIssueAssigneeDialog(false);
    setOpenConfirmDeleteDialog(false);
    setDeletingUserDetails([]);
    setSelectedUserIssueData([]);
  };

  const deleteUserBtn = () => {
    const updateIssues = {};
    modifiedIssueData.forEach((issue) => {
      if (issue) {
        updateIssues['projectList/' + projectDetail.projectId +
           '/issues/' + issue.id] = issue;
      }
    });
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
    setModifiedIssueData([]);
    setIssueAssigneeDialog(false);
    setOpenConfirmDeleteDialog(false);
    setDeletingUserDetails([]);
    setSelectedUserIssueData([]);
    return update(ref(database), updateIssues);
  };

  return (
    <>
      <Dialog
        open={issueAssigneeDialog}
        fullWidth
        maxWidth='md'
        sx={{'& .MuiDialog-paper': {
          borderRadius: '10px',
        }}}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: '30px',
            boxShadow: 2,
            zIndex: 2,
          }}>
          <Typography
            variant='h5'>
              Assign To
          </Typography>
          <Button
            disabled={selectedIssueIndex.length != 0? false: true}
            onClick={handleSelectAssigneeBtn}
            sx={{
              padding: '8px 10px',
              borderRadius: '10px',
              minWidth: 'max-content',
              fontWeight: '500'}}
            variant='contained'>
              Select Assignee
          </Button>
          <SelectAssigneeDialog
            modifiedData={modifiedData}
            selectAssignee={selectAssignee}
            isAssigneeDialogOpen={isAssigneeDialogOpen}
            setIsAssigneeDialogOpen={setIsAssigneeDialogOpen}
          />
        </Box>
        <Box
          sx={{
            'zIndex': 1,
            'minHeight': '300px',
            'maxHeight': '300px',
            'padding': '10px',
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
          <Card
            sx={{
              'boxShadow': 0,
              'borderRadius': '10px',
              'padding': '0px 20px',
              'margin': '10px 0px',
            }}>
            <Grid container
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center'}}>
              <Grid item xs={1}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedIssueIndex.length === modifiedIssueData.length? true : false}
                      onChange={(e) => handleSelectAllIssues(e)}
                      color="primary" />}
                />
              </Grid>
              <Grid item xs={8}>
                <Typography variant='h6'>
                  All
                </Typography>
              </Grid>
            </Grid>
          </Card>
          {selectedUserIssueData.map((issue, index) => (
            <Card
              key={`issue_${index}`}
              sx={{
                'boxShadow': 4,
                'borderRadius': '10px',
                'padding': '20px',
                'margin': '10px 0px',
                '&:hover': {
                  boxShadow: 6,
                }}}>
              <Grid container
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center'}}>
                <Grid item xs={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedIssueIndex.indexOf(index) != -1? true : false}
                        onChange={() => handleSelectIssue(index)}
                        color="primary" />}
                  />
                </Grid>
                <Grid item xs={8}>
                  <Typography variant='h6'>
                    {issue.summary}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Box>
                    <FormControl fullWidth
                      sx={{
                        marginTop: '-7px',
                      }}>
                      <InputLabel id="selectAssignee-select-label"
                        sx={{
                          marginTop: '0px',
                        }}>
                       Select Assignee
                      </InputLabel>
                      <Select
                        sx={{
                          borderRadius: '5px',
                          padding: '0px',
                        }}
                        size='medium'
                        labelId="selectAssignee-select-label"
                        id="selectAssignee-select"
                        name='selectAssignee'
                        disabled={selectedIssueIndex.includes(index)? true : false}
                        value={modifiedIssueData[index]?.assigneeId ?? ''}
                        onChange={(e) => handleSelectAssignee(e, index)}
                        label='Select Assignee'>
                        {activeUsersData.map((usersData, index) => (
                          deletingUserDetails.uid !== usersData.uid &&
                          <MenuItem
                            key={`usersData_${index}`}
                            value={usersData.uid}>
                            {usersData.firstName} {usersData.lastName}
                          </MenuItem>
                        ))}
                        <MenuItem
                          value={`123456789`}>
                          {`Unassigned`}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Box>
        <Box
          sx={{
            padding: '30px',
            borderTop: '2px solid #00000040',
          }}>
          <Grid container columnGap={2}
            sx={{
              justifyContent: 'flex-end',
            }}>
            <Grid>
              <Button
                variant='text'
                onClick={closeIssueAssigneeDialog}
                sx={{
                  padding: '8px 10px',
                  minWidth: 'max-content',
                  borderRadius: '10px'}}>
                  Cancel
              </Button>
            </Grid>
            <Grid>
              <Button
                variant='contained'
                // disabled={!isAssigneeIdsModified}
                onClick={handleSaveNDeleteBtn}
                sx={{
                  padding: '8px 10px',
                  minWidth: 'max-content',
                  borderRadius: '10px',
                  fontWeight: '500'}}>
                  Save & Delete
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
      <ConfirmationDeleteUserDialog
        openConfirmDeleteDialog={openConfirmDeleteDialog}
        closeConfirmDeleteDialog={closeConfirmDeleteDialog}
        deleteUserBtn={deleteUserBtn}
      />
    </>
  );
};

AssignToDialog.propTypes = {
  projectDetail: PropTypes.any.isRequired,
  issueAssigneeDialog: PropTypes.any.isRequired,
  setIssueAssigneeDialog: PropTypes.any.isRequired,
  activeUsersData: PropTypes.any.isRequired,
  deletingUserDetails: PropTypes.any.isRequired,
  setDeletingUserDetails: PropTypes.any.isRequired,
  selectedUserIssueData: PropTypes.any.isRequired,
  setSelectedUserIssueData: PropTypes.any.isRequired,
};
