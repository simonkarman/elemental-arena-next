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
    playerA: {
      normal: '#FF5D00',
      contrast: black,
      disabled: '#FF5D0080',
    },
    playerB: {
      normal: '#00478F',
      contrast: black,
      disabled: '#00478F80',
    },
    forest: {
      normal: '#59981A',
      contrast: black,
      disabled: '#3D550C',
    },
    mountain: {
      normal: '#D41E00',
      contrast: black,
      disabled: '#481D01',
    },
    swamp: {
      normal: '#695E93',
      contrast: black,
      disabled: '#281C2D',
    },
  },
};
