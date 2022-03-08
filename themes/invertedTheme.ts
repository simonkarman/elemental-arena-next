import { DefaultTheme } from 'styled-components';
import { white, black } from './theme';

export const invertedTheme: DefaultTheme = {
  typography: {
    text: {
      normal: white,
      contrast: black,
      disabled: white,
    },
    accent: {
      normal: '#726A95',
      contrast: white,
      disabled: '#726A9580',
    },
    background: {
      normal: black,
      contrast: white,
      disabled: black,
    },
    error: {
      normal: '#B00020',
      contrast: white,
      disabled: '#B0002080',
    },
  },
};
