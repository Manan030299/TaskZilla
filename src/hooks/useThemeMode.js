import {createTheme} from '@mui/material';
import {useState, useMemo} from 'react';

export const useThemeMode = () => {
  const [mode, setMode] = useState('light');

  const toggleColorMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  const theme = useMemo(
      () =>
        createTheme({
          palette: {
            mode,

            ...(mode === 'light' ?
            {
              // palette values for light mode
              primary: {
                main: '#0077c2',
                light: '#7fb5e4',
                dark: '#005296',
              },
              secondary: {
                main: '#e91e63',
                light: '#ff6090',
                dark: '#b0003a',
              },
              error: {
                main: '#f44336',
                light: '#ff7961',
                dark: '#ba000d',
              },
              warning: {
                main: '#ff9800',
                light: '#ffc947',
                dark: '#c66900',
              },
              info: {
                main: '#2196f3',
                light: '#6ec6ff',
                dark: '#0069c0',
                contrastText: '#ffffff',
              },
              success: {
                main: '#4caf50',
                light: '#80e27e',
                dark: '#087f23',
              },
              background: {
                default: '#f0f2f5',
                paper: '#ffffff',
              },
            } :
            {
              // palette values for dark mode
              primary: {
                main: '#90caf9',
                light: '#c3fdff',
                dark: '#5d99c6',
              },
              secondary: {
                main: '#f48fb1',
                light: '#ffc1e3',
                dark: '#bf5f82',
              },
              error: {
                main: '#ef5350',
                light: '#ff867c',
                dark: '#b61827',
              },
              warning: {
                main: '#ffa726',
                light: '#ffd95b',
                dark: '#c77800',
              },
              info: {
                main: '#64b5f6',
                light: '#9be7ff',
                dark: '#2286c3',
                contrastText: '#ffffff',
              },
              success: {
                main: '#81c784',
                light: '#b2fab4',
                dark: '#519657',
              },
              background: {
                default: '#1c1c1e',
                paper: '#2b2b2d',
              },
            }),
          },
          components: {
            MuiOutlinedInput: {
              styleOverrides: {
                root: {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderRadius: '10px',
                    // color: '#FFF',
                  },
                  // '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  //   borderColor: mode === 'light'? '#20DF7F': '#fff',
                  // },
                },
              },
            },
            // MuiInputLabel: {
            //   styleOverrides: {
            //     root: {
            //       '&.Mui-focused': {
            //         color: mode === 'light'? '#20DF7F': '#fff',
            //       },
            //     },
            //   },
            // },
            MuiFormHelperText: {
              styleOverrides: {
                root: {
                  color: '#f44336',
                },
              },
            },
          },
        }),
      [mode],
  );

  return {mode, toggleColorMode, theme};
};
