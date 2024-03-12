import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import {Typography} from '@mui/material';

export const WorkCompleted14Days = ({usersIssue}) => {
  const [taskCompleted, setTaskCompleted] = useState({});

  useEffect(() => {
    const issueList = usersIssue;
    let completed = 0;
    issueList.forEach((issue) => {
      const todayDate = new Date();
      const modifiedDate = new Date(issue.modifiedOn);
      const days = (todayDate - modifiedDate)/(24*60*60*1000);
      if (days <= 14) {
        completed += issue.completed;
      } else {
        completed = '';
      }
    });

    setTaskCompleted({completed});
  }, [usersIssue]);

  return (<>
    <Box marginBottom='20px'>
      <Typography
        variant="subtitle"
        fontWeight='600'>
            No. of Tasks {Object.keys(taskCompleted)} in the last 14 days
      </Typography>
    </Box>
    <Box>
      <Typography
        textAlign='center'
        variant="h3"
        fontWeight='600'>
        {Object.values(taskCompleted)}
      </Typography>
    </Box>
  </>
  );
};

WorkCompleted14Days.propTypes = {
  usersIssue: PropTypes.any.isRequired,
};
