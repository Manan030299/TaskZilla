import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

export const SelectAssigneeDialog = (props) => {
  const {modifiedData, selectAssignee, isAssigneeDialogOpen, setIsAssigneeDialogOpen} = props;

  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const data = [...modifiedData];
    data.push({
      label: 'Unassigned',
      uid: '123456789',
    });
    setOptions(data);
  }, [modifiedData]);

  const handleClose = () => {
    setIsAssigneeDialogOpen(false);
    setSelectedAssignee('');
  };

  const handleSelect = () => {
    selectAssignee(selectedAssignee);
    setIsAssigneeDialogOpen(false);
    setSelectedAssignee('');
  };

  return (
    <>
      <Dialog
        open={isAssigneeDialogOpen}
        fullWidth
        maxWidth='xs'
        sx={{'& .MuiDialog-paper': {
          borderRadius: '10px',
        }}}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: '20px',
            boxShadow: 2,
            zIndex: 2,
          }}>
          <Typography
            variant='h5'>
                  Select Assignee
          </Typography>
        </Box>
        <Box
          sx={{
            margin: '10px',
          }}>
          <Autocomplete
            value={selectedAssignee}
            options={options}
            onChange={(event, value = modifiedData) => setSelectedAssignee(value)}
            renderInput={(params) => <TextField {...params} label="Select Assignee" />}
          />
        </Box>
        <Box
          sx={{
            padding: '20px',
            borderTop: '2px solid #00000040',
          }}>
          <Grid container columnGap={2}
            sx={{
              justifyContent: 'flex-end',
            }}>
            <Grid>
              <Button
                variant='text'
                onClick={handleClose}
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
                disabled={selectedAssignee != ''? false : true}
                onClick={handleSelect}
                sx={{
                  padding: '8px 10px',
                  minWidth: 'max-content',
                  borderRadius: '10px',
                  fontWeight: '500'}}>
                    Select
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </>
  );
};

SelectAssigneeDialog.propTypes = {
  modifiedData: PropTypes.any.isRequired,
  selectAssignee: PropTypes.any.isRequired,
  isAssigneeDialogOpen: PropTypes.any.isRequired,
  setIsAssigneeDialogOpen: PropTypes.any.isRequired,
};
