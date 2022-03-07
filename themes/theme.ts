import 'styled-components';

export const white = '#FFF';
export const gray = '#787878';
export const black = '#222831';

export interface Palette {
  color: string;
  contrast: string;
  disabled: string;
}

declare module 'styled-components' {
  export interface DefaultTheme {
    palette: {
      common: {
        black: string;
        gray: string;
        white: string;
      }
      primary: Palette;
      secondary: Palette;
      error: Palette;
    }
  }
}
