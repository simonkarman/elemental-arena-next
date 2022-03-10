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
    () => AxialCoordinate.Directions.map((_, index) => Vector2.fromDegrees(index * 60).mutliply(pixelSize)),
    [pixelSize],
  );
  return (
    <>
      <polygon
        points={corners.map(corner => `${corner.x},${corner.y}`).join(' ')}
        fill={theme.game[biome].normal}
        fillOpacity={0.1}
        stroke={theme.typography.text.normal}
        strokeWidth={0.5}
        strokeOpacity={0.3}
      />
    </>
  );
};

const Creature = (props: {
  color: ThemeColor,
  power: number,
  health: number,
  baseEnergy: number,
  energy: number,
  icons: { color: ThemeColor, icon: string, action: () => void }[],
}) => {
  const { color, power, health, baseEnergy, energy, icons } = props;
  const theme = useContext(ThemeContext);
  const pixelSize = useContext(PixelSizeContext);
  const numbers = useMemo(() => [
    { fontSize: pixelSize / 3, degrees: 40, color: theme.game.mountain.normal, value: health.toString() },
    { fontSize: pixelSize / 3, degrees: 140, color: theme.game.swamp.normal, value: power.toString() },
    { fontSize: pixelSize / 3, degrees: 250, color: theme.game.forest.normal, value: energy.toString() },
    { fontSize: pixelSize / 4, degrees: 300, color: theme.game.forest.disabled, value: `/${baseEnergy}` },
  ], [health, power, energy]);
  const iconOffset = icons.length === 0 || icons[0].icon === '👑' ? 0 : 50;
  return (
    <>
      <circle
        cx={0}
        cy={0}
        r={pixelSize * 0.7}
        fill={theme.typography.background.normal}
        stroke={color.normal}
        strokeWidth={1.75}
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
            fontSize={number.fontSize}
          >
            {number.value}
          </text>
        </g>
      ))}
      {icons.map((icon, i) => (
        <g
          key={icon.icon}
          transform={`translate(${Vector2.fromDegrees(270 + iconOffset + i * 50).mutliply(pixelSize * 0.7).toSvgString()})`}
        >
          <circle
            cx={0}
            cy={0}
            r={pixelSize / 4}
            fill={icon.color.normal}
            stroke={icon.color.contrast}
            strokeWidth={0.5}
            onClick={icon.action}
          />
          <text
            alignmentBaseline='middle'
            textAnchor='middle'
            fontSize={pixelSize / 4}
          >
            {icon.icon}
          </text>
        </g>
      ))}
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
  const [mode, setMode] = useState<'none' | 'tile' | 'creature'>('none');
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
        <Button primary={mode == 'none'} onClick={() => setMode('none')}>
          None
        </Button>
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
            border: `1px solid ${theme.typography.accent.normal}`,
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
                health={i * 2}
                power={Math.round(2 + i / 3)}
                energy={2}
                baseEnergy={3}
                color={i % 2 == 0 ? theme.game.playerA : theme.game.playerB}
                icons={[
                  ...(i < 2 ? [{
                    color: i % 2 == 0 ? theme.game.playerA : theme.game.playerB,
                    icon: '👑',
                    action: () => console.info('King of', i),
                  }] : []),
                  ...(i % 3 == 2 ? [{
                    color: theme.game.forest,
                    icon: '🔥',
                    action: () => console.info('Fireball of', i),
                  }] : []),
                  ...(i % 4 == 3 ? [{
                    color: theme.game.swamp,
                    icon: '🌲',
                    action: () => console.info('Tree of', i),
                  }] : []),
                  {
                    color: theme.typography.background,
                    icon: '🥑',
                    action: () => console.info('Avocado of', i),
                  },
                ]}
              />
            </g>
          ))}
        </svg>
      </PixelSizeContext.Provider>
    </>
  );
};

export default Landing;
