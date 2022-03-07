import type { NextPage } from 'next';
import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

const Landing: NextPage = () => {
  const theme = useContext(ThemeContext);
  return (
    <>
      <h1>Elemental Arena</h1>
      <svg style={{
        border: `1px solid ${theme.primary.background.normal}`,
        width: '100%',
      }}
      >
        <g>
          <line x1={10} x2={100} y1={10} y2={40} stroke={theme.text.foreground.normal} />
        </g>
      </svg>
    </>
  );
};

export default Landing;
