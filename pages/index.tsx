import type { NextPage } from 'next';
import { MouseEventHandler, useContext, useMemo, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Button } from '../components/Button';
import { useArray } from '../hooks';
import { ThemeColor } from '../themes/theme';
import { AxialCoordinate } from '../utils/AxialCoordinate';
import { hexCorner } from '../utils/Math';
import { Vector2 } from '../utils/Vector2';

const Tile = (props: {
  pixelSize: number,
  coord: AxialCoordinate,
  stroke: ThemeColor,
}) => {
  const { pixelSize, coord, stroke } = props;
  const corners = useMemo(
    () => AxialCoordinate.Directions.map((_, index) => hexCorner(pixelSize, index)),
    [pixelSize],
  );
  return (
    <g transform={`translate(${coord.toPixel(pixelSize).x} ${coord.toPixel(pixelSize).y})`}>
      <circle
        cx={0}
        cy={0}
        r={pixelSize / 1.3}
        fill={stroke.contrast}
      />
      <polygon
        points={corners.map(corner => `${corner.x},${corner.y}`).join(' ')}
        fill={stroke.disabled}
      />
      {corners.map((from, index) => {
        const to = corners[(index + 1) % 6];
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
        fill={theme.typography.accent.disabled}
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
  const [tiles,, tilesAddons] = useArray(AxialCoordinate.circle(new AxialCoordinate(5, 1), 4));
  const [creatures,, creaturesAddons] = useArray<AxialCoordinate>([]);
  const pixelSize = 27;
  const onClick: MouseEventHandler = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pixel = new Vector2(e.clientX - rect.x, e.clientY - rect.y);
    const coord = AxialCoordinate.fromPixel(pixel, pixelSize).rounded();
    const tileIndex = tiles.findIndex(tile => AxialCoordinate.approximatelyEqual(coord, tile));
    const creatureIndex = creatures.findIndex(creature => AxialCoordinate.approximatelyEqual(coord, creature));
    if (mode == 'tile') {
      if (tileIndex === -1) {
        tilesAddons.push(coord);
      } else {
        tilesAddons.removeAt(tileIndex);
        if (creatureIndex !== -1) {
          creaturesAddons.removeAt(creatureIndex);
        }
      }
    }
    if (mode == 'creature') {
      if (tileIndex !== -1) {
        if (creatureIndex === -1) {
          creaturesAddons.push(coord);
        } else {
          creaturesAddons.removeAt(creatureIndex);
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
          {` (x${tiles.length})`}
        </Button>
        <Button primary={mode == 'creature'} onClick={() => setMode('creature')}>
          Creature
          {` (x${creatures.length})`}
        </Button>
      </ButtonRow>
      <svg
        style={{
          border: `1px solid ${theme.typography.background.contrast}`,
          backgroundColor: theme.typography.background.normal,
          width: (7 * 2 + 1) * pixelSize,
          height: 7 * Math.sqrt(3) * pixelSize,
        }}
        onClick={onClick}
      >
        {tiles.map(tile => <Tile
          key={tile.toString()}
          pixelSize={pixelSize}
          coord={tile}
          stroke={theme.typography.text}
        />)}
        {creatures.map(creature => <Creature
          key={creature.toString()}
          pixelSize={pixelSize}
          coord={creature}
        />)}
      </svg>
    </>
  );
};

export default Landing;
