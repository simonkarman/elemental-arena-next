import { DefaultTheme } from 'styled-components';
import { white, black } from './theme';

export const defaultTheme: DefaultTheme = {
  typography: {
    text: {
      normal: black,
      contrast: white,
      disabled: '#DCDCDC',
    },
    accent: {
      normal: '#726A95',
      contrast: white,
      disabled: '#726A9580',
    },
    background: {
      normal: white,
      contrast: black,
      disabled: '#434343',
    },
    error: {
      normal: '#B00020',
      contrast: white,
      disabled: '#B0002080',
    },
  },
  game: {
    king: {
      normal: '#D4AF37',
      contrast: black,
      disabled: '#9D8022',
    },
  },
};
