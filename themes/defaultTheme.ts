import { DefaultTheme } from 'styled-components';
import { white, gray, black } from './theme';

export const defaultTheme: DefaultTheme = {
  palette: {
    common: {
      black,
      gray,
      white,
    },
    primary: {
      color: '#726A95',
      disabled: '#726A9580',
      contrast: white,
    },
    secondary: {
      color: '#709FB0',
      disabled: '#709FB080',
      contrast: white,
    },
    error: {
      color: '#B00020',
      disabled: '#B0002080',
      contrast: white,
    },
  },
};
