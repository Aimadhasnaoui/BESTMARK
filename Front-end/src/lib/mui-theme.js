import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB', // Matching the blue used in buttons
    },
  },
  typography: {
    fontFamily: '"Geist Variable", sans-serif',
  },
  shape: {
    borderRadius: 10, // 0.625rem = 10px
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          '& fieldset': {
            borderColor: 'var(--input)',
          },
          '&:hover fieldset': {
            borderColor: '#2563EB',
          },
          '&.Mui-focused fieldset': {
            borderWidth: '1px',
            borderColor: '#2563EB',
          },
        },
        input: {
          padding: '8px 12px', // Consistent padding for standard inputs
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiAutocomplete: {
      defaultProps: {
        size: 'small',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            padding: '2px 9px !important', // Tighten padding to match TextField height
            minHeight: '40px', // Match standard input height
          },
        },
        input: {
          padding: '0 !important', // Fix internal input padding for Autocomplete
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '10px',
        },
      },
    },
  },
});

export default theme;
