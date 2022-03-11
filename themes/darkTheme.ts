import { DefaultTheme } from 'styled-components';
import { white, black } from './theme';

export const darkTheme: DefaultTheme = {
  typography: {
    text: {
      normal: white,
      contrast: black,
      disabled: '#323232',
    },
    accent: {
      normal: '#726A95',
      contrast: white,
      disabled: '#726A9580',
    },
    background: {
      normal: black,
      contrast: white,
      disabled: '#DCDCDC',
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
      contrast: white,
      disabled: '#FF5D0080',
    },
    playerB: {
      normal: '#00478F',
      contrast: white,
      disabled: '#00478F80',
    },
    forest: {
      normal: '#59981A',
      contrast: white,
      disabled: '#3D550C80',
    },
    mountain: {
      normal: '#D41E00',
      contrast: white,
      disabled: '#481D0180',
    },
    swamp: {
      normal: '#695E93',
      contrast: white,
      disabled: '#281C2D80',
    },
  },
};
