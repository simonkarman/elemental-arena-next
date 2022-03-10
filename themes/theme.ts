import 'styled-components';

export const white = '#f2f2f2';
export const black = '#222831';

export interface ThemeColor {
  normal: string;
  disabled: string;
  contrast: string;
}

declare module 'styled-components' {
  export interface DefaultTheme {
    typography: {
      text: ThemeColor;
      background: ThemeColor;
      accent: ThemeColor;
      error: ThemeColor;
    }
    game: {
      king: ThemeColor,
    }
  }
}
