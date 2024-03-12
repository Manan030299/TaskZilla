import React from 'react';
import {createContext} from 'react';
import {Box} from '@mui/material';
import {IconButton} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import Brightness3Icon from '@mui/icons-material/Brightness3';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import {Toaster} from 'react-hot-toast';
import {Routing} from './Routes/Routes';
import {useThemeMode} from './hooks/useThemeMode';

export const ThemeContext = createContext();

// eslint-disable-next-line require-jsdoc
function App() {
  const {mode, toggleColorMode, theme} = useThemeMode();

  return (
    <>
      <ThemeContext.Provider value={mode}>
        <ThemeProvider theme={theme}>
          <Box
            sx={{bgcolor: 'background.default',
              color: 'text.primary', padding: '0px'}}
            className="App">
            <Routing />
            <Toaster position="top-center" reverseOrder={false} />
            <IconButton
              onClick={toggleColorMode}
              sx={{position: 'fixed',
                bottom: '20px',
                left: '25px', bgcolor: '#FFFFFF',
                padding: '10px', borderRadius: '50%',
                boxShadow: '0px 4px 4px 0px #00000040',
                zIndex: '1300'}}>
              {theme.palette.mode === 'dark' ? <Brightness6Icon
                sx={{color: '#2D2D2D', fontSize: '2rem'}} /> :
                <Brightness3Icon sx={{color: '#2D2D2D',
                  fontSize: '2rem', rotate: '135deg'}} />}</IconButton>
          </Box>
        </ThemeProvider>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
