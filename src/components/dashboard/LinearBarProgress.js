import React from 'react';
import {Box} from '@mui/material';
import {Tooltip} from '@mui/material';
export const LinearBarProgress = (data) => {
  const {todo, inProgress, completed} = data;

  const total = todo + inProgress + completed;
  const perTodo = (todo/total*100);
  const perInProgress = (inProgress/total*100);
  const perCompleted = (completed/total*100);

  return (
    <>
      <Box
        sx={{height: '6px',
          bgcolor: '#d6d6d6',
          borderRadius: '10px',
          overflow: 'hidden'}}>
        <Box display='flex' >
          <Tooltip arrow
            title={`Todo ${todo}`}>
            <Box sx={{height: '10px',
              width: perTodo*100,
              bgcolor: '#f2d245'}}>
            </Box>
          </Tooltip>
          <Tooltip arrow
            title={`InProgress ${inProgress}`}>
            <Box sx={{height: '10px',
              width: perInProgress*100,
              bgcolor: '#2385ff'}}>
            </Box>
          </Tooltip>
          <Tooltip arrow
            title={`Completed ${completed}`}>
            <Box sx={{height: '10px',
              width: perCompleted*100,
              bgcolor: '#00a253'}}>
            </Box>
          </Tooltip>
        </Box>
      </Box>
    </>
  );
};

