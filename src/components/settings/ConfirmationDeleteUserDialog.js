import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';

export const ConfirmationDeleteUserDialog = (props) => {
  const {openConfirmDeleteDialog, closeConfirmDeleteDialog, deleteUserBtn} = props;

  return (
    <Dialog open={openConfirmDeleteDialog} maxWidth='md'
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
          Are you sure you want to remove ?
        </Typography>
        <Grid container columnGap={2}
          sx={{
            marginTop: '20px',
            justifyContent: 'flex-end'}}>
          <Grid>
            <Button
              variant='text'
              onClick={closeConfirmDeleteDialog}
              sx={{
                borderRadius: '10px'}}>
              Cancel
            </Button>
          </Grid>
          <Grid>
            <Button
              variant='contained'
              onClick={deleteUserBtn}
              sx={{
                borderRadius: '10px',
                backgroundColor: 'error.main'}}>
              Delete
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
};

ConfirmationDeleteUserDialog.propTypes = {
  openConfirmDeleteDialog: PropTypes.any.isRequired,
  closeConfirmDeleteDialog: PropTypes.any.isRequired,
  deleteUserBtn: PropTypes.any.isRequired,
};
