import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProfileSettings from '../../components/settings/ProfileSettings';
import PasswordSettings from '../../components/settings/PasswordSettings';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Settings = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div style={{ marginTop: '20%', marginLeft: '-10%' }}>
      <section className='mt-6'>
        <Box sx={{ width: '80%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label='basic tabs example'
            >
              <Tab
                label='Profile Settings'
                {...a11yProps(0)}
                sx={{
                  color: '#333',
                  fontSize: '1rem',
                }}
              />
              <Tab
                label='Password Settings'
                {...a11yProps(1)}
                sx={{
                  color: '#333',
                  fontSize: '1rem',
                  marginLeft: '3rem',
                }}
              />
              <Tab
                label='Account Settings'
                {...a11yProps(1)}
                sx={{
                  color: '#333',
                  fontSize: '1rem',
                  marginLeft: '3rem',
                }}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <ProfileSettings />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <PasswordSettings />
          </TabPanel>
        </Box>
      </section>
    </div>
  );
};

export default Settings;
