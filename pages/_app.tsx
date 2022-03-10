import 'normalize.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { useState } from 'react';
import { ThemeSwitcher, ThemeName, themes } from '../components/ThemeSwitcher';

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
    pointer-events: none;
  }
`;

const Container = styled.div`
  width: 700px;
  margin: auto;
  padding: 1em;
`;

function MyApp({ Component, pageProps }: AppProps) {
  const [themeName, setThemeName] = useState<ThemeName>('defaultTheme');
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
