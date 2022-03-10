import type { NextPage } from 'next';
import React, { MouseEventHandler, useContext, useMemo, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { Button } from '../components/Button';
import { useArray } from '../hooks';
import { ThemeColor } from '../themes/theme';
import { AxialCoordinate } from '../utils/AxialCoordinate';
import { Vector2 } from '../utils/Vector2';

const PixelSizeContext = React.createContext(40);

const Tile = (props: { biome: 'forest' | 'mountain' | 'swamp'}) => {
  const theme = useContext(ThemeContext);
  const pixelSize = useContext(PixelSizeContext);
  const { biome } = props;
  const corners = useMemo(
    () => AxialCoordinate.Directions.map((_, index) => Vector2.fromDegrees(index * 60).mutliply(pixelSize - 1)),
    [pixelSize],
  );
  return (
    <>
      <polygon
        points={corners.map(corner => `${corner.x},${corner.y}`).join(' ')}
        fill={theme.game[biome].disabled}
        fillOpacity={0.1}
        stroke={theme.game[biome].normal}
        strokeWidth={0.5}
      />
    </>
  );
};

const Crown = (props: { controller: Controller }) => {
  const pixelSize = useContext(PixelSizeContext);
  const { controller } = props;
  const width = pixelSize * 0.2;
  const height = pixelSize * 0.34;
  return (
    <polygon
      points={`${-width},0 ${width},0 ${width},${-height} ${0},${-height * 0.7} ${-width},${-height}`}
      fill={controller.color.normal}
      stroke={controller.color.contrast}
      strokeWidth="0.5"
    />
  );
};

interface Controller {
  color: ThemeColor;
}

const Creature = (props: {
  controller: Controller,
  isKing: boolean,
  power: number,
  health: number,
  energy: number,
}) => {
  const { controller, isKing, power, health, energy } = props;
  const theme = useContext(ThemeContext);
  const pixelSize = useContext(PixelSizeContext);
  const numbers = useMemo(() => [
    { degrees: 30, color: theme.game.mountain.normal, value: health },
    { degrees: 150, color: theme.game.swamp.normal, value: power },
    { degrees: 270, color: theme.game.forest.normal, value: energy },
  ], [health, power, energy]);
  return (
    <>
      <circle
        cx={0}
        cy={0}
        r={pixelSize * 0.7}
        fill={theme.typography.background.normal}
        stroke={controller.color.normal}
        strokeWidth={1}
      />
      {numbers.map(number => (
        <g
          key={number.degrees}
          transform={`translate(${Vector2.fromDegrees(number.degrees).mutliply(pixelSize / 4).toSvgString()})`}
        >
          <text
            fill={number.color}
            alignmentBaseline='middle'
            textAnchor='middle'
            fontSize={pixelSize / 3}
          >
            {number.value}
          </text>
        </g>
      ))}
      {isKing && (
        <g transform={`translate(0,-${pixelSize * 0.65})`}>
          <Crown controller={controller} />
        </g>
      )}
    </>
  );
};

const ButtonRow = styled.div`
  padding-bottom: 0.25em;

  button {
    margin-right: 0.25em;
  }

  button:last-child {
    margin-right: 0;
  }
`;

const Landing: NextPage = () => {
  const theme = useContext(ThemeContext);
  const [mode, setMode] = useState<'tile' | 'creature'>('tile');
  const [tiles,, tilesAddons] = useArray(AxialCoordinate.circle(new AxialCoordinate(5, 1), 4));
  const [creatures,, creaturesAddons] = useArray<AxialCoordinate>([]);
  const [pixelSize, setPixelSize] = useState(40);
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
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <>
      <h1>Elemental Arena</h1>
      <ButtonRow style={{ float: 'right' }}>
        <Button disabled={pixelSize <= 32} onClick={() => setPixelSize(pixelSize - 1)}>
          -
        </Button>
        <Button disabled={pixelSize == 40} onClick={() => setPixelSize(40)}>
          {pixelSize}
        </Button>
        <Button disabled={pixelSize >= 48} onClick={() => setPixelSize(pixelSize + 1)}>
          +
        </Button>
      </ButtonRow>
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
      <PixelSizeContext.Provider value={pixelSize}>
        <svg
          style={{
            border: `1px solid ${theme.typography.background.contrast}`,
            backgroundColor: theme.typography.background.normal,
            width: (7 * 2 + 1) * pixelSize,
            height: 7 * Math.sqrt(3) * pixelSize,
          }}
          onClick={onClick}
        >
          {tiles.map((tile, i) => (
            <g
              key={tile.toString()}
              transform={`translate(${tile.toPixel(pixelSize).x} ${tile.toPixel(pixelSize).y})`}
            >
              <Tile
                biome={(['forest', 'mountain', 'swamp'] as ('forest' | 'mountain' | 'swamp')[])[i % 3]}
              />
            </g>
          ))}
          {creatures.map((creature, i) => (
            <g
              key={creature.toString()}
              transform={`translate(${creature.toPixel(pixelSize).x} ${creature.toPixel(pixelSize).y})`}
            >
              <Creature
                isKing={i < 2}
                health={i * 2}
                power={Math.round(2 + i / 3)}
                energy={2}
                controller={{ color: i % 2 == 0 ? theme.game.playerA : theme.game.playerB }}
              />
            </g>
          ))}
        </svg>
      </PixelSizeContext.Provider>
    </>
  );
};

export default Landing;
