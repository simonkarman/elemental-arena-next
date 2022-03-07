import 'styled-components';

export const white = '#FFF';
export const black = '#222831';

export interface Color {
  normal: string;
  disabled: string;
}

export interface Palette {
  background: Color;
  foreground: Color;
}

declare module 'styled-components' {
  export interface DefaultTheme {
    text: Palette;
    primary: Palette;
    secondary: Palette;
    error: Palette;
  }
}
