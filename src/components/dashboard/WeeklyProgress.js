import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Box, Tooltip, Typography} from '@mui/material';
import {buildStyles, CircularProgressbar} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export const WeeklyProgress = ({usersIssue}) => {
  const [weeklyData, setWeeklyData] = useState({});

  useEffect(() => {
    const months =
          ['January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(); // current date of week
    const todayDate = new Date(date.setHours(0, 0, 0));
    const currentWeekDay = todayDate.getDay();
    const lessDays = currentWeekDay === 0 ? 6 : currentWeekDay - 1;
    const wkStart = new Date(
        new Date(todayDate).setDate(todayDate.getDate() - lessDays));
    const wkEndDate = new Date(
        new Date(wkStart).setDate(wkStart.getDate() + 6));
    const wkEnd = new Date(wkEndDate.setHours(23, 59, 59));
    const weekStart = months[wkStart.getMonth()] + ' ' + wkStart.getDate();
    const weekEnd = months[wkEnd.getMonth()] + ' ' + wkEnd.getDate();
    const year = todayDate.getFullYear();
    const issueList = usersIssue;
    let completed = 0;
    let pending = 0;
    let total = 0;
    let completedPercentage = 0;
    let pendingPercentage = 0;
    issueList.forEach((issue) => {
      const issueModifiedOn = new Date(issue.modifiedOn);
      const issueCreatedOn = new Date(issue.createdOn);
      if ((issueModifiedOn <= wkEnd && issueModifiedOn >= wkStart) ||
      (issueCreatedOn <= wkEnd && issueCreatedOn >= wkStart)) {
        completed += (issue.completed);
        pending += issue.todo + issue.inprogress;
        total += issue.todo + issue.inprogress + issue.completed;
        completedPercentage = Math.round((completed * 100) / total);
        pendingPercentage = Math.round((pending * 100) / total);
      } else {
        completed = 0;
        pending = 0;
        total = 0;
        completedPercentage = 0;
        pendingPercentage = 0;
      }
    });

    setWeeklyData({weekStart, weekEnd, year,
      pendingPercentage, completedPercentage});
  }, [usersIssue]);

  return (<>
    <Typography variant="subtitle" fontWeight='600'>Weekly Progress</Typography>
    <Typography variant='body2'
      sx={{marginTop: '3px'}} color='#abacb7'>
        Start from {weeklyData.weekStart} - {weeklyData.weekEnd},
      {weeklyData.year} </Typography>
    <Tooltip arrow
      title={`Completed: ${weeklyData.completedPercentage}%,  
    Pending: ${weeklyData.pendingPercentage}%`}>
      <Box height='160px' width='auto'
        display='flex' flexDirection='column'
        justifyContent='center' marginTop='20px'>
        <CircularProgressbar value={weeklyData.completedPercentage}
          text={`${weeklyData.completedPercentage}%`}
          strokeWidth={6}
          styles={buildStyles({rotation: 0.50, pathColor: `rgba(0, 150, 0,
         ${weeklyData.completedPercentage})`, textColor: '#f88',
          trailColor: '#d6d6d6', backgroundColor: '#3e98c7'})} />
      </Box></Tooltip>
  </>
  );
};

WeeklyProgress.propTypes = {
  usersIssue: PropTypes.any.isRequired,
};
