import { Dispatch, SetStateAction } from 'react';
import { defaultTheme } from '../themes/defaultTheme';
import { invertedTheme } from '../themes/invertedTheme';
import { Button } from './Button';

export const themes = { defaultTheme, invertedTheme };
export type ThemeName = keyof typeof themes;

export interface ThemeSwitcherProps {
  themeName: ThemeName,
  setThemeName: Dispatch<SetStateAction<ThemeName>>
}

export const ThemeSwitcher = (props: ThemeSwitcherProps) => {
  const { themeName, setThemeName } = props;
  const switchTheme = () => setThemeName(
    themeName === 'defaultTheme'
      ? 'invertedTheme'
      : 'defaultTheme',
  );
  return (
    <Button
      onClick={switchTheme}
      style={{ position: 'absolute', top: '1em', right: '1em' }}
    >
      Theme:
      {' '}
      {themeName.replace('Theme', '')}
    </Button>
  );
};
