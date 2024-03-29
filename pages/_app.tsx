import 'normalize.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { ThemeSwitcher, ThemeName, themes } from '../components/ThemeSwitcher';
import { useLocalStorage } from '../hooks';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${(props) => props.theme.typography.background.normal};
    color: ${(props) => props.theme.typography.text.normal};
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  a {
    color: ${(props) => props.theme.typography.background.normal};
    text-decoration: none;
  }

  *:focus {
    outline: none;
  }

  svg text {
    cursor: default;
  }
`;

const Container = styled.div`
  width: 900px;
  margin: auto;
  padding: 1em;
`;

function MyApp({ Component, pageProps }: AppProps) {
  // TODO: Apply fix from: https://stackoverflow.com/questions/54819721/next-js-access-localstorage-before-rendering-page
  const [themeName, setThemeName] = useLocalStorage<ThemeName>('theme', 'defaultTheme');

  return (
    <>
      <Head>
        <title>Elemental Arena</title>
        <meta name="description" content="Elemental Arena" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={themes[themeName]}>
        <ThemeSwitcher
          themeName={themeName}
          themeNames={['defaultTheme', 'darkTheme']}
          setThemeName={setThemeName}
        />
        <GlobalStyle />
        <Container>
          <Component {...pageProps} />
        </Container>
      </ThemeProvider>
    </>
  );
}
export default MyApp;
