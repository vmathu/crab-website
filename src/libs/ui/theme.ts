import { createTheme } from '@mui/material/styles';
import { colors } from './index';

const theme = createTheme({
  palette: {
    primary: {
      main: colors.green500,
    },
    secondary: {
      main: colors.blue500,
    },
    success: {
      main: colors.success,
    },
    warning: { main: colors.warning },
    error: { main: colors.error },
  },
  typography: {
    fontFamily: '"Be Vietnam Pro", san-serif',
    caption: {
      fontSize: '12px',
    },
    h1: {
      fontSize: '32px',
    },
    h2: {
      fontSize: '28px',
    },
    h3: {
      fontSize: '20px',
    },
  },
  components: {
    MuiButton: {
      variants: [
        {
          props: { variant: 'outlined', color: 'secondary' },
          style: {
            '&:hover': {
              color: colors.green400,
            },
          },
        },
        {
          props: { variant: 'text' },
          style: {
            '&:hover': {
              color: colors.green400,
              background: 'none',
            },
          },
        },
        {
          props: { variant: 'disable' },
          style: {
            background: colors.green800,
            color: colors.black100,
            '&:hover': {
              background: colors.green800,
              color: colors.black50,
            },
          },
        },
        {
          props: { variant: 'contained' },
          style: {
            color: colors.white,
            background: colors.green500,
            '&:hover': {
              background: colors.green400,
            },
          },
        },
      ],
      styleOverrides: {
        root: {
          padding: '12px',
          textTransform: 'inherit',
          '&:focus': {
            outline: 'none',
          },
          '&.Mui-disabled': {
            background: colors.green800,
            color: colors.black100,
          },
        },
      },
    },
    MuiAlert: {
      variants: [
        {
          props: { severity: 'error' },
          style: {
            background: colors.red50,
            color: colors.red500,
            borderLeft: 'solid 3px ' + colors.error,
          },
        },
        {
          props: { severity: 'warning' },
          style: {
            background: colors.orange50,
            color: colors.warning,
            borderLeft: 'solid 3px ' + colors.warning,
          },
        },
        {
          props: { severity: 'success' },
          style: {
            background: colors.green50,
            color: colors.green500,
            borderLeft: 'solid 3px ' + colors.success,
          },
        },
      ],
      styleOverrides: {
        root: {
          fontSize: '16px',
          fontWeight: 600,
          padding: '20px',
        },
        message: {
          padding: 0,
        },
      },
    },
    MuiSvgIcon: {
      variants: [
        {
          props: { color: 'inherit' },
          style: { color: colors.white },
        },
        {
          props: { color: 'disabled' },
          style: { color: colors.black100, '&:hover': { color: colors.white } },
        },
      ],
      styleOverrides: {
        root: {
          color: colors.white,
          '&.MuiSelect-icon': {
            color: colors.white,
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: '"Be Vietnam Pro", san-serif',
          fontSize: '16px',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'rgba(13, 69, 106, 0.4)',
          color: colors.white,
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          gap: '10px',
          padding: '8px',
          margin: '10px',
          '&:hover': {
            background: colors.green800,
            borderRadius: '4px',
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          color: colors.white,
          margin: 0,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: '12px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          fill: 'white',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: '2px solid',
          borderColor: colors.green500,
          boxSizing: 'border-box',
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          background: colors.green800,
          color: 'white',
          fontFamily: '"Be Vietnam Pro", san-serif',
          fontSize: '16px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            background: colors.green700,
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: 'none',
          color: colors.white,
          boxShadow: 'none',
          '&.Mui-expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: '0 1rem',
          '&.Mui-expanded': {
            minHeight: 0,
          },
        },
        content: {
          '&.Mui-expanded': {
            margin: '1rem 0',
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: '.5rem 1rem',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          background: 'none',
          fontWeight: 700,
          color: colors.white,
          '&:before': {
            border: 'none',
          },
          '&:hover:not(.Mui-disabled, .Mui-error):before': {
            border: 'none',
          },
          '&.Mui-focused': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 329.5,
          height: 55,
          background: colors.green800,
          borderRadius: 4,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            width: 160.75,
            height: 47,
            borderRadius: 4,
            transform: 'translateX(4px) translateY(4px)',
            '&.Mui-checked': {
              transform: 'translateX(164.75px) translateY(4px)',
              '& + .MuiSwitch-track': {
                backgroundColor: colors.green800,
              },
            },
          },
          '& .MuiSwitch-thumb': {
            borderRadius: 4,
          },
          '& .MuiSwitch-track': {
            opacity: 1,
            backgroundColor: colors.green800,
            borderRadius: 4,
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '*::-webkit-scrollbar': {
            width: '0.4em !important',
          },
          '*::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.00)',
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,.1)',
            outline: '1px solid slategrey !important',
          },
        },
      },
    },
    MuiLinearProgress: {
      variants: [
        {
          props: { variant: 'determinate' },
          style: {
            width: '100%',
            height: '24px',
            flexShrink: 0,
            backgroundColor: colors.green800,
            '& .MuiLinearProgress-bar': {
              flexShrink: 0,
            },
          },
        },
      ],
    },
  },
});

type CustomTheme = {
  [Key in keyof typeof theme]: (typeof theme)[Key];
};

declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    disable: true;
  }
}

declare module '@mui/material/';

export default theme;
