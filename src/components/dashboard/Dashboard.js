import React, {useEffect, useState} from 'react';
// import {ThemeContext} from '../../App';
import ResponsiveAppBar from '../../common/AppBar';
import {TodaysTask} from './TodaysTask';
import {PendingTask} from './PendingTask';
import {LinearBarProgress} from './LinearBarProgress';
import {ProgressChart} from './ProgressChart';
import {WorkCompleted14Days} from './WorkCompleted14Days';
import {WeeklyProgress} from './WeeklyProgress';
import {database} from '../../Firebase';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import {Masonry} from '@mui/lab';
import {InviteMembersDialog} from './InviteMembersDialog';
import {onValue, ref} from 'firebase/database';

export const DashBoard = () => {
  const [projectDetail, setProjectDetail] = useState({});
  const [teamMembers, setTeamMembers] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [usersIssue, setUsersIssue] = useState([]);
  const [inviteDialog, setInviteDialog] = useState(false);

  useEffect(() => {
    onValue(ref(database, 'projectList/' +
     projectDetail.projectId + '/issues/'), (snapshot) => {
      const issues = snapshot.val();
      if (issues) {
        const data = Object.values(issues);
        const issueList = [];
        data.forEach((issue) => {
          if (issue && issue.status) {
            const index = issueList.findIndex((issue1) => {
              return issue1.assigneeId === issue.assigneeId;
            });
            const assignee = teamMembers.filter((user) => {
              return user.uid === issue.assigneeId;
            });
            assignee.forEach((user) => {
              if (index !== -1) {
                issueList[index][issue.status.toLowerCase().replaceAll(' ', '')] += 1;
              } else {
                const issueObj = {
                  assigneeId: issue.assigneeId,
                  assignee: user.firstName + ' ' + user.lastName,
                  todo: 0,
                  inprogress: 0,
                  completed: 0,
                  createdOn: issue.createdOn,
                  modifiedOn: issue.modifiedOn,
                };
                issueObj[issue.status.toLowerCase().replaceAll(' ', '')] = 1;
                issueList.push(issueObj);
                setUsersIssue(issueList);
              }
            });
          }
        });
      }
    });
  }, [projectDetail, teamMembers]);

  useEffect(() => {
    onValue(ref(database, 'users/'), (snapshot) => {
      const data = snapshot.val();
      const userData = [];
      if (projectDetail.activeUsers !== undefined) {
        projectDetail.activeUsers.forEach((id) => {
          userData.push(data[id]);
        });
        setTeamMembers(userData);
      }
    });
  }, [projectDetail]);

  useEffect(() => {
    const uid = sessionStorage.getItem('uid') || localStorage.getItem('uid');
    if (uid) {
      onValue(ref(database, 'users/' + uid), (snapshot) => {
        const user = snapshot.val();
        onValue(ref(database, 'permissions/' + user.role), (snapshot) => {
          const permission = snapshot.val();
          setUserPermissions(permission);
        });
        if (user) {
          onValue(ref(database, 'projectList/' + user.projectId), (snapshot) => {
            const projectList = snapshot.val();
            setProjectDetail(projectList);
          });
        }
      });
    }
  }, []);

  const handleInviteDialogOpen = () => {
    setInviteDialog(true);
  };

  // const mode = useContext(ThemeContext);

  return (
    <Box
      sx={{
        // 'width': '100%',
        'minHeight': '100vh',
        // 'overflow': 'hidden',
      }}
    >
      <ResponsiveAppBar />
      <Toolbar />
      <Masonry
        columns={{lg: 3, md: 1}}
        spacing={2}
        sx={{
          marginTop: '10px',
          paddingTop: '5px',
          paddingLeft: '20px',
          minHeight: '100vh',
        }}
      >
        <Card sx={{
          // height: '150px',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: 3}}>
          <Typography variant="subtitle" fontWeight="600">
            Task
          </Typography>
          <TodaysTask
            userPermissions={userPermissions}
            teamMembers={teamMembers}
            projectDetail={projectDetail} />
        </Card>
        <Card sx={{
          padding: '20px',
          borderRadius: '8px',
          boxShadow: 3}}>
          <Typography variant="subtitle" fontWeight="600">
            Task Progress
          </Typography>
          {usersIssue.map((issue, index) => (
            <Box key={`issue_${index}`} marginTop="20px">
              <Typography variant="subtitle2">{issue.assignee}</Typography>
              <LinearBarProgress
                todo={issue.todo}
                inProgress={issue.inprogress}
                completed={issue.completed}
                sx={{
                  height: '6px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                }}
                variant="determinate"
              />
            </Box>
          ))}
        </Card>
        <Card sx={{
          padding: '20px',
          borderRadius: '8px',
          boxShadow: 3}}>
          <WeeklyProgress usersIssue={usersIssue} />
        </Card>
        <Card sx={{
          padding: '20px',
          borderRadius: '8px',
          boxShadow: 3}}>
          <Box marginBottom="10px">
            <Typography variant="subtitle" fontWeight="600">
              Maximun no. of pending Tasks
            </Typography>
          </Box>
          <Box height="225px" display="flex" justifyContent="center">
            <PendingTask usersIssue={usersIssue} />
          </Box>
        </Card>
        <Card sx={{
          padding: '20px',
          borderRadius: '8px',
          boxShadow: 3}}>
          <Box marginBottom="10px">
            <Typography variant="subtitle" fontWeight="600">
              Progress
            </Typography>
          </Box>
          <Box height="225px" display="flex" justifyContent="center">
            <ProgressChart usersIssue={usersIssue} />
          </Box>
        </Card>
        <Card sx={{
          padding: '20px',
          borderRadius: '8px',
          boxShadow: 3}}>
          <Box>
            <WorkCompleted14Days usersIssue={usersIssue} />
          </Box>
        </Card>
        <Card sx={{
          padding: '20px',
          borderRadius: '8px',
          boxShadow: 3}}>
          <Grid container
            sx={{
              marginBottom: '15px',
            }}>
            <Grid item xs={10.5}>
              <Typography variant="subtitle" fontWeight="600">
              Team Members
              </Typography>
            </Grid>
            <Grid item xs={1.5}
              sx={{
                marginTop: '-8px',
              }}>
              {userPermissions.manageUsers ? (
                 <Tooltip title={'Invite User'}>
                   <Button
                     variant='text'
                     onClick={handleInviteDialogOpen}>
                     <PersonAddAlt1Icon />
                   </Button>
                 </Tooltip>
            ) : (
              ''
            )}
            </Grid>
          </Grid>
          <Box marginTop="10px">
            {teamMembers.map((user, index) => (
              <Grid
                key={`user_${index}`}
                sx={{cursor: 'pointer'}}
                container
                marginBottom="20px"
              >
                <Grid item xs={1.5}>
                  <Tooltip title={`${user.firstName} ${user.lastName}`}>
                    <Avatar
                      sx={{
                        backgroundColor: user.avatarColor,
                      }}>
                      {user.firstName[0]}{user.lastName[0]}
                    </Avatar>
                  </Tooltip>
                </Grid>
                <Grid item xs={10.5}>
                  <Typography marginTop="8px" marginLeft="10px">
                    {user.firstName + ' ' + user.lastName}
                  </Typography>
                </Grid>
              </Grid>
            ))}
            <InviteMembersDialog
              inviteDialog={inviteDialog}
              setInviteDialog={setInviteDialog}
              projectDetail={projectDetail}
            />
          </Box>
        </Card>
      </Masonry>
    </Box>
  );
};
