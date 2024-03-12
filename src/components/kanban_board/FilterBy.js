import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Box, Divider} from '@mui/material';
import {Grid} from '@mui/material';
import {Typography} from '@mui/material';
import {Button} from '@mui/material';
import {Menu} from '@mui/material';
import {FormControl} from '@mui/material';
import {InputLabel} from '@mui/material';
import {MenuItem} from '@mui/material';
import {Select} from '@mui/material';
import {RadioGroup} from '@mui/material';
import {Radio} from '@mui/material';
import {FormControlLabel} from '@mui/material';
import {Checkbox} from '@mui/material';
import {Card} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
// import FilterAltIcon from '@mui/icons-material/FilterAlt';

export const FilterBy = (props) => {
  const {issues, activeUsersData, filterByValue, setFilterByValue, setFilteredValue, setIsFilterApplied} = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const [filteredBy, setFilteredBy] = useState({
    assigneeId: [],
    modifiedOn: '',
    createdOn: '',
  });
  const [assignee, setAssignee] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [enableApplyBtn, setEnableApplyBtn] = useState(true);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const groupByList = ['Assignee', 'Modified On', 'Created On'];

  const handleGroupBy = (e) => {
    const groupBy = e.target.value;
    setFilterByValue(groupBy);

    const assigneeInfo = issues.reduce((acc, issue) => {
      const {assigneeId} = issue;
      const assignee = activeUsersData.find((a) => a.uid === assigneeId);
      if (assignee) {
        const {firstName, lastName} = assignee;
        const existingEntry = acc.find((e) => e.assigneeId === assigneeId);
        if (!existingEntry) {
          acc.push({assigneeId, firstName, lastName});
        }
      }
      return acc;
    }, []);
    setAssignee(assigneeInfo);
  };

  useEffect(() => {
    let data = [...issues];
    let isDataValid = true;
    data.forEach((value) => {
      if (value === undefined) {
        isDataValid = false;
      }
    });
    if (isDataValid) {
      if (filteredBy.assigneeId.length) {
        data = data.filter((issue) => {
          const index = filteredBy.assigneeId.indexOf(issue.assigneeId);
          return index !== -1;
        });
      }
      if (filteredBy.modifiedOn) {
        if (filteredBy.modifiedOn === 'Oldest') {
          data = data.sort((a, b) => new Date(a.modifiedOn) - new Date(b.modifiedOn));
        } else {
          data = data.sort((a, b) => new Date(b.modifiedOn) - new Date(a.modifiedOn));
        }
      }
      if (filteredBy.createdOn) {
        if (filteredBy.createdOn === 'Oldest') {
          data = data.sort((a, b) => new Date(a.createdOn) - new Date(b.createdOn));
        } else {
          data = data.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn));
        }
      }
    }
    setFilteredData(data);
  }, [filteredBy, issues]);

  const handleFilterBy = (e) => {
    const {name, value, checked} = e.target;
    if (name === 'assigneeId') {
      let updatedAssigneeId;
      if (checked) {
        updatedAssigneeId = Array.from(new Set(filteredBy.assigneeId.concat(value)));
      } else {
        updatedAssigneeId = filteredBy.assigneeId.filter((id) => id !== value);
      }
      setFilteredBy({...filteredBy, assigneeId: updatedAssigneeId});
    } else {
      setFilteredBy({...filteredBy, [name]: value});
    }
    setEnableApplyBtn(false);
  };

  const applyFilter = () => {
    setFilteredValue([...filteredData]);
    setIsFilterApplied(true);
    setAnchorEl(null);
    setEnableApplyBtn(true);
  };

  const clearAllFilter = () => {
    setIsFilterApplied(false);
    setFilteredBy({
      assigneeId: [],
      modifiedOn: '',
      createdOn: '',
    });
    setFilteredValue(issues);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        onClick={handleClick}
        sx={{
          'marginRight': '40px',
          '&:hover': {
            cursor: 'pointer',
          }}}>
        FILTER <FilterListIcon />
      </Button>
      <Menu
        sx={{'& .MuiMenu-list': {
          padding: '5px',
        },
        '& .MuiMenu-paper': {
          width: '380px',
          borderRadius: '10px',
        },
        'mt': '0px'}}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
        <Box
          sx={{
            position: 'sticky',
            top: '0px',
            marginBottom: '5px',
            padding: '5px 10px',
            // boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)',
          }}>
          <Grid container gap={3}>
            <Grid item xs={8}>
              <Typography variant='body1' fontWeight={600}>
                FILTER
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button
                sx={{width: 'max-content',
                  padding: '0px'}}
                variant='text'
                onClick={clearAllFilter}
              >
                Clear All
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <FormControl fullWidth
                  sx={{
                    marginTop: '-7px',
                  }}>
                  <InputLabel id="SortBy-select-label"
                    sx={{
                      marginTop: '0px',
                    }}>
                        Sort By
                  </InputLabel>
                  <Select
                    sx={{
                      minWidth: '150px',
                      width: 'max-content',
                      borderRadius: '5px',
                      padding: '0px',
                    }}
                    size='medium'
                    labelId="groupBy-select-label"
                    id="groupBy-select"
                    name='groupBy'
                    value={filterByValue}
                    onChange={(e) => handleGroupBy(e)}
                    label='Sort By'>
                    {groupByList.map((groupBy, index) => (
                      <MenuItem
                        key={`groupBy_${index}`}
                        value={groupBy}>
                        {groupBy}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              {filterByValue === 'Assignee' &&
              <Box
                sx={{
                  marginTop: '20px',
                }}>
                <Divider
                  sx={{
                    marginBottom: '10px',
                  }} />
                <Typography variant='button' fontWeight={600}>
                  {`Assignee`}
                </Typography>
                {assignee.length > 0 ?
               (<Box>
                 {assignee.map((userData, index) => (
                   <Card
                     key={`userData_${index}`}
                     sx={{
                       padding: '5px 10px',
                       borderRadius: '5px',
                       marginTop: '5px',
                       marginBottom: '5px',
                       boxShadow: 5,
                     }}>
                     <Grid container
                       sx={{
                         display: 'flex',
                         justifyContent: 'flex-start',
                         alignItems: 'center'}}>
                       <Grid item xs={2}>
                         <FormControlLabel
                           control={<Checkbox color="primary"
                             name='assigneeId'
                             value={userData.assigneeId}
                             checked={filteredBy.assigneeId.includes(userData.assigneeId)? true : false}
                             onChange={handleFilterBy} />}
                         />
                       </Grid>
                       <Grid item xs={8}>
                         {`${userData.firstName} ${userData.lastName}`}
                       </Grid>
                     </Grid>
                   </Card>
                 ))}
               </Box>):
                (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: '20px',
                    }}>
                    <Typography
                      variant= 'body1'>
                    No assignee
                    </Typography>
                  </Box>
                )
                }
              </Box>}
              {filterByValue === 'Modified On' &&
              <Box
                sx={{
                  marginTop: '20px',
                }}>
                <Divider
                  sx={{
                    marginBottom: '10px',
                  }} />
                <Typography variant='button' fontWeight={600}>
                  {`Modified On`}
                </Typography>
                <Box>
                  <Box
                    sx={{
                      padding: '5px 10px',
                      marginTop: '5px',
                      marginBottom: '5px',
                    }}>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="modifiedOn"
                      value={filteredBy.modifiedOn}
                      onChange={handleFilterBy}>
                      <FormControlLabel value="Oldest" control={<Radio />} label="Oldest" />
                      <FormControlLabel value="Latest" control={<Radio />} label="Latest" />
                    </RadioGroup>
                  </Box>
                </Box>
              </Box>}
              {filterByValue === 'Created On' && (
                <Box sx={{marginTop: '20px'}}>
                  <Divider
                    sx={{
                      marginBottom: '10px',
                    }} />
                  <Typography variant='button' fontWeight={600}>
                    Created On
                  </Typography>
                  <Box>
                    <Box
                      sx={{
                        padding: '5px 10px',
                        marginTop: '5px',
                        marginBottom: '5px',
                      }}>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="createdOn"
                        value={filteredBy.createdOn}
                        onChange={handleFilterBy}>
                        <FormControlLabel value="Oldest" control={<Radio />} label="Oldest" />
                        <FormControlLabel value="Latest" control={<Radio />} label="Latest" />
                      </RadioGroup>
                    </Box>
                  </Box>
                </Box>
              )}
            </Grid>
            <Grid item xs={12}
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}>
              <Button
                disabled={enableApplyBtn}
                sx={{
                  borderRadius: '10px',
                }}
                variant='contained'
                onClick={applyFilter}>
                Apply
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Menu>
    </Box>
  );
};

FilterBy.propTypes = {
  issues: PropTypes.any.isRequired,
  activeUsersData: PropTypes.any.isRequired,
  filterByValue: PropTypes.any.isRequired,
  setFilterByValue: PropTypes.any.isRequired,
  setFilteredValue: PropTypes.any.isRequired,
  setIsFilterApplied: PropTypes.any.isRequired,
};

