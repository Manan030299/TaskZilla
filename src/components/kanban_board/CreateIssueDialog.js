import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {TextField} from '@mui/material';
import {Typography} from '@mui/material';
import {Box} from '@mui/material';
import {Divider} from '@mui/material';
import {Dialog} from '@mui/material';
import {FormControl} from '@mui/material';
import {InputLabel} from '@mui/material';
import {Select} from '@mui/material';
import {Link} from '@mui/material';
import {Switch} from '@mui/material';
import {styled} from '@mui/material';
import {MenuItem} from '@mui/material';
import {Grid} from '@mui/material';
import {Button} from '@mui/material';
import {FormControlLabel} from '@mui/material';
import {Avatar} from '@mui/material';
import {FormHelperText} from '@mui/material';
import KeyboardDoubleArrowUpIcon
  from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardDoubleArrowDownIcon
  from '@mui/icons-material/KeyboardDoubleArrowDown';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BoltIcon from '@mui/icons-material/Bolt';
import DoneIcon from '@mui/icons-material/Done';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {Editor} from 'react-draft-wysiwyg';
import {EditorState, convertToRaw} from 'draft-js';

export const CreateIssueDialog = (props) => {
  const {openCreate, handleClose, onHandleChange, handleCreateBtn,
    createIssueInput, projectDetail, writeUserData, activeUsersData,
    handleSwitchChange, switchCheck, onHandleDescriptionChange} = props;

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (value) => {
    setEditorState(value);
    const descriptionValue = convertToRaw(value.getCurrentContent());
    onHandleDescriptionChange('description', descriptionValue.blocks[0].text);
  };

  const Android12Switch = styled(Switch)(({theme}) => ({
    'padding': 8,
    '& .MuiSwitch-track': {
      'borderRadius': 22 / 2,
      '&:before, &:after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 16,
        height: 16,
      },
      '&:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
            theme.palette.getContrastText(theme.palette.primary.main),
        )}" 
        d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      '&:after': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
            theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: 16,
      height: 16,
      margin: 2,
    },
  }));

  const createIssue = () => {
    setEditorState(EditorState.createEmpty());
    writeUserData();
  };

  return (
    <>
      <Dialog
        open={openCreate}
        maxWidth='md'
        sx={{'& .MuiDialog-paper': {
          borderRadius: '10px',
          maxHeight: '580px',
        }}}>
        <Box padding='30px 20px' boxShadow="0px 4px 4px 0px #00000040">
          <Typography variant='h5' fontWeight='600'>Create issue</Typography>
        </Box>
        <Box padding='20px'
          sx={{'overflowY': 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#888',
              borderRadius: '0px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#555',
            }}}>
          <Box marginBottom='20px'>
            <FormControl fullWidth>
              <InputLabel id="select-project-label">Project</InputLabel>
              <Select
                labelId="select-project-label"
                id="project-label"
                label='Project'
                onChange={onHandleChange} name="project"
                value={createIssueInput.project}
                sx={{
                  marginBottom: '20px',
                  width: '350px',
                }}>
                <MenuItem
                  key={`project_${projectDetail.projectId}`}
                  value={projectDetail.projectName}
                >
                  {projectDetail.projectName}
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="select-issuetype-label">Issue type</InputLabel>
              <Select
                labelId="select-issuetype-label"
                id="issuetype-label"
                label='Issue type'
                onChange={onHandleChange}
                name="issueType"
                value={createIssueInput.issueType}
                sx={{
                  marginBottom: '20px',
                  width: '350px',
                  [`& .MuiSelect-select`]:
                  {
                    display: 'inline-flex',
                    alignItems: 'initial',
                  },
                }}>
                <MenuItem
                  value='STORY'>
                  <BookmarkIcon
                    sx={{
                      bgcolor: '#30ca3b',
                      color: '#FFF',
                      padding: '2px',
                      borderRadius: '5px',
                      fontSize: '16px',
                      marginRight: '10px',
                    }}
                  />
                  Story
                </MenuItem>
                <MenuItem
                  value='TASK'
                >
                  <DoneIcon
                    sx={{
                      bgcolor: '#3e9fdf',
                      color: '#FFF',
                      padding: '2px',
                      borderRadius: '5px',
                      fontSize: '16px',
                      marginRight: '10px',
                    }}
                  />
                    Task
                </MenuItem>
                <MenuItem
                  value='BUG'
                >
                  <FiberManualRecordIcon
                    sx={{
                      bgcolor: '#fc3324',
                      color: '#FFF',
                      padding: '2px',
                      borderRadius: '5px',
                      fontSize: '16px',
                      marginRight: '10px',
                    }}
                  />
                    Bug
                </MenuItem>
                <MenuItem
                  value='EPIC'
                >
                  <BoltIcon
                    sx={{
                      bgcolor: '#aa08e5',
                      color: '#FFF',
                      padding: '2px',
                      borderRadius: '5px',
                      fontSize: '16px',
                      marginRight: '10px',
                    }}
                  />
                    Epic
                </MenuItem>
              </Select>
              <Link>
              Learn more
              </Link>
            </FormControl>
          </Box>
          <Divider />
          <Box marginTop='20px'>
            <FormControl fullWidth>
              <InputLabel
                id="select-status-label"
              >
                Status
              </InputLabel>
              <Select
                labelId="select-status-label"
                id="status-label"
                label='Status'
                onChange={onHandleChange}
                name="status"
                value={createIssueInput.status}
                sx={{
                  marginBottom: '20px',
                  width: '200px',
                }}>
                {projectDetail.status?.map((statusName, index) =>(
                  <MenuItem
                    key={`statusName_${index}`}
                    value={statusName}
                  >
                    {statusName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              sx={{
                marginBottom: '20px',
              }}
              fullWidth
            >
              <TextField
                onChange={onHandleChange}
                variant='outlined'
                label='Summary'
                name="summary"
                value={createIssueInput.summary}
              />
              <FormHelperText>
                This is the issue&apos;s initial status upon creation
              </FormHelperText>
            </FormControl>
            <Box
              sx={{
                marginBottom: '20px',
              }}>
              <Typography
                variant='subtitle1'
              >
                Description
              </Typography>
              <Box
                border='1px solid #00000040'
                borderRadius='10px'
                padding='10px'>
                <Editor
                  editorState={editorState}
                  wrapperClassName="demo-wrapper"
                  editorClassName="demo-editor"
                  onEditorStateChange={onEditorStateChange} />
              </Box>
            </Box>
            <FormControl
              sx={{
                marginBottom: '20px',
              }}
              fullWidth
            >
              <InputLabel
                id="select-assignee-label">
                Assignee
              </InputLabel>
              <Select
                labelId="select-assignee-label"
                id="assignee-label"
                label='Assignee'
                onChange={onHandleChange}
                name="assigneeId"
                value={createIssueInput.assigneeId}
                sx={{
                  marginBottom: '10px',
                  width: '350px',
                  [`& .MuiSelect-select`]:
                  {
                    display: 'inline-flex',
                    alignItems: 'baseline',
                  },
                }}>
                {activeUsersData.map((assignee, index) => (
                  <MenuItem
                    key={`issueDialog_${index}`}
                    value={assignee.uid}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: assignee.avatarColor,
                        marginRight: '10px',
                        height: '35px',
                        width: '35px'}}>
                      {assignee.firstName[0]}
                    </Avatar>
                    {assignee.firstName + ' ' + assignee.lastName}
                  </MenuItem>
                ))}
                <MenuItem
                  value={`123456789`}>
                  <Avatar
                    sx={{
                      marginRight: '10px',
                      height: '35px',
                      width: '35px',
                    }}>
                  </Avatar>
                  {`Unassigned`}
                </MenuItem>
              </Select>
              <Link>Assign to me</Link>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel
                id="select-reporter-label">
                Reporter
              </InputLabel>
              <Select
                labelId="select-reporter-label"
                id="reporter-label"
                label='Reporter'
                onChange={onHandleChange}
                name="reporterId"
                value={createIssueInput.reporterId}
                sx={{
                  marginBottom: '20px',
                  width: '350px',
                  [`& .MuiSelect-select`]:
                  {
                    display: 'inline-flex',
                    alignItems: 'baseline',
                  },
                }}>
                {activeUsersData.map((reporter, index) => (
                  <MenuItem
                    key={`inite2_${index}`}
                    value={reporter.uid}>
                    <Avatar
                      sx={{
                        backgroundColor: reporter.avatarColor,
                        marginRight: '10px',
                        height: '35px',
                        width: '35px',
                      }}>{reporter.firstName[0]}
                    </Avatar>
                    {reporter.firstName + ' ' + reporter.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel
                id="select-priority-label"
              >
                Priority
              </InputLabel>
              <Select
                labelId="select-priority-label"
                id="priority-label"
                label='Priority'
                onChange={onHandleChange}
                name="priority"
                value={createIssueInput.priority}
                sx={{
                  marginBottom: '20px',
                  width: '350px',
                  [`& .MuiSelect-select`]:
                  {
                    display: 'inline-flex',
                    alignItems: 'flex-end',
                  }}}>
                <MenuItem
                  value='HIGHEST'
                >
                  <KeyboardDoubleArrowUpIcon
                    sx={{
                      color: '#30ca3b',
                      marginRight: '5px',
                    }} />
                    Highest
                </MenuItem>
                <MenuItem
                  value='HIGH'
                >
                  <KeyboardArrowUpIcon
                    sx={{
                      color: '#fc3324',
                      marginRight: '5px',
                    }}/>
                    High
                </MenuItem>
                <MenuItem
                  value='MEDIUM'
                >
                  <DragHandleIcon
                    sx={{
                      color: '#cc8c0b',
                      marginRight: '5px',
                    }} />
                    Medium
                </MenuItem>
                <MenuItem
                  value='LOW'
                >
                  <KeyboardArrowDownIcon
                    sx={{
                      color: '#aa08e5',
                      marginRight: '5px',
                    }} />
                    Low
                </MenuItem>
                <MenuItem
                  value='LOWEST'
                >
                  <KeyboardDoubleArrowDownIcon
                    sx={{
                      color: '#3e9fdf',
                      marginRight: '5px',
                    }} />
                    Lowest
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box
          padding='30px 50px'
          borderTop='3px solid #00000040'>
          <Grid container >
            <Grid item xs={9}>
              <FormControlLabel
                control={
                  <Android12Switch
                    checked={switchCheck}
                    onChange={handleSwitchChange}
                  />
                }
                label="Copy to next issue"
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                variant = 'text'
                onClick={handleClose}>
                Cancel
              </Button>
            </Grid>
            <Grid item xs={1}>
              <Button
                variant='contained'
                onClick={createIssue}
                disabled={handleCreateBtn}
                sx={{
                  borderRadius: '10px',
                }}
              >
                Create
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Dialog>
    </>
  );
};

CreateIssueDialog.propTypes = {
  openCreate: PropTypes.any.isRequired,
  handleClose: PropTypes.any.isRequired,
  onHandleChange: PropTypes.any.isRequired,
  handleCreateBtn: PropTypes.any.isRequired,
  createIssueInput: PropTypes.any.isRequired,
  projectDetail: PropTypes.any.isRequired,
  activeUsersData: PropTypes.any.isRequired,
  writeUserData: PropTypes.any.isRequired,
  handleSwitchChange: PropTypes.any.isRequired,
  switchCheck: PropTypes.any.isRequired,
  onHandleDescriptionChange: PropTypes.any.isRequired,
};
