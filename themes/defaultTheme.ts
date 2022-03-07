import { DefaultTheme } from 'styled-components';
import { white, black } from './theme';

export const defaultTheme: DefaultTheme = {
  text: {
    foreground: {
      normal: black,
      disabled: black,
    },
    background: {
      normal: white,
      disabled: white,
    },
  },
  primary: {
    foreground: {
      normal: white,
      disabled: white,
    },
    background: {
      normal: '#726A95',
      disabled: '#726A9580',
    },
  },
  secondary: {
    foreground: {
      normal: white,
      disabled: white,
    },
    background: {
      normal: '#709FB0',
      disabled: '#709FB080',
    },
  },
  error: {
    foreground: {
      normal: white,
      disabled: white,
    },
    background: {
      normal: '#B00020',
      disabled: '#B0002080',
    },
  },
};
