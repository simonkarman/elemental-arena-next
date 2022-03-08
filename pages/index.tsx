import type { NextPage } from 'next';
import { MouseEventHandler, useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Button } from '../components/Button';
import { useArray } from '../hooks';
import { ThemeColor } from '../themes/theme';
import { AxialCoordinate } from '../utils/AxialCoordinate';
import { HexDirection } from '../utils/HexDirection';
import { hexCorner } from '../utils/Math';
import { Vector2 } from '../utils/Vector2';

const Tile = (props: {
  pixelSize: number,
  coord: AxialCoordinate,
  stroke: ThemeColor,
}) => {
  const { pixelSize, coord, stroke } = props;
  return (
    <g transform={`translate(${coord.toPixel(pixelSize).x} ${coord.toPixel(pixelSize).y})`}>
      <circle
        cx={0}
        cy={0}
        r={pixelSize / 1.3}
        fill="#FFFFFF00"
      />
      {AxialCoordinate.Directions.map((_, index) => {
        const from = hexCorner(pixelSize, index);
        const to = hexCorner(pixelSize, (index + 1) % 6);
        return (
          <line
            key={index}
            x1={from.x} y1={from.y}
            x2={to.x} y2={to.y}
            stroke={stroke.normal}
          />
        );
      })}
    </g>
  );
};

const Creature = (props: {
  pixelSize: number,
  coord: AxialCoordinate,
}) => {
  const { pixelSize, coord } = props;
  const theme = useContext(ThemeContext);
  return (
    <g transform={`translate(${coord.toPixel(pixelSize).x} ${coord.toPixel(pixelSize).y})`}>
      <circle
        cx={0}
        cy={0}
        r={pixelSize * 0.7}
        fill="none"
        stroke={theme.typography.accent.normal}
        strokeWidth={1}
      />
    </g>
  );
};

const ButtonRow = styled.div`
  padding-bottom: 0.25em;

  button:first-child {
    margin-right: 0.25em;
  }
`;

const Landing: NextPage = () => {
  const theme = useContext(ThemeContext);
  const [mode, setMode] = useState<'tile' | 'creature'>('tile');
  const [tiles,, tilesAddons] = useArray([
    ...AxialCoordinate.circle(new AxialCoordinate(14, -2), 3),
    ...AxialCoordinate.rectangle(new AxialCoordinate(5, 2), HexDirection.RightDown, 5, 2),
  ]);
  const [creatures,, creaturesAddons] = useArray<AxialCoordinate>([
    new AxialCoordinate(14, -2),
  ]);
  const onClick: MouseEventHandler = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pixel = new Vector2(e.clientX - rect.x, e.clientY - rect.y);
    const coord = AxialCoordinate.fromPixel(pixel, 27).rounded();
    const tileExists = tiles.find(tile => AxialCoordinate.approximatelyEqual(coord, tile));
    if (mode == 'tile') {
      if (tileExists) {
      } else {
        tilesAddons.push(coord);
      }
    }
    if (mode == 'creature') {
      if (tileExists) {
        const creatureExists = creatures.find(creature => AxialCoordinate.approximatelyEqual(coord, creature));
        if (!creatureExists) {
          creaturesAddons.push(coord);
        }
      }
    }
  };
  return (
    <>
      <h1>Elemental Arena</h1>
      <ButtonRow>
        <Button primary={mode == 'tile'} onClick={() => setMode('tile')}>
          Tile
        </Button>
        <Button primary={mode == 'creature'} onClick={() => setMode('creature')}>
          Creature
        </Button>
      </ButtonRow>
      <svg
        style={{
          border: `1px solid ${theme.typography.background.contrast}`,
          backgroundColor: theme.typography.background.normal,
          width: '100%',
          height: '400px',
        }}
        onClick={onClick}
      >
        {tiles.map(tile => <Tile
          key={tile.toString()}
          pixelSize={27}
          coord={tile}
          stroke={theme.typography.text}
        />)}
        {creatures.map(creature => <Creature
          key={creature.toString()}
          pixelSize={27}
          coord={creature}
        />)}
      </svg>
    </>
  );
};

export default Landing;
