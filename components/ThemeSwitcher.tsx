import { Dispatch, SetStateAction } from 'react';
import { defaultTheme } from '../themes/defaultTheme';
import { darkTheme } from '../themes/darkTheme';
import { Button } from './Button';

export const themes = { defaultTheme, darkTheme };
export type ThemeName = keyof typeof themes;

export const ThemeSwitcher = (props: {
  themeName: ThemeName,
  themeNames: ThemeName[],
  setThemeName: Dispatch<SetStateAction<ThemeName>>
}) => {
  const { themeName, themeNames, setThemeName } = props;
  const switchTheme = () => {
    const themeIndex = themeNames.findIndex(name => name === themeName);
    const nextTheme = (themeIndex + 1) % themeNames.length;
    setThemeName(themeNames[nextTheme]);
  };
  return (
    <Button
      onClick={switchTheme}
      style={{ position: 'absolute', top: '1em', right: '1em' }}
      primary
    >
      Theme:
      {' '}
      {themeName.replace('Theme', '')}
    </Button>
  );
};
