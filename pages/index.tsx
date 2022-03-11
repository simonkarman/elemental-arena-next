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
        strokeWidth={0.3}
      />
    </>
  );
};

const Creature = (props: {
  name: string,
  color: ThemeColor,
  power: number,
  health: number,
  baseEnergy: number,
  energy: number,
  icons: { enabled: boolean, tooltip: string, color: ThemeColor, icon: string, action: () => void }[],
}) => {
  const { name, color, power, health, baseEnergy, energy, icons } = props;
  const theme = useContext(ThemeContext);
  const pixelSize = useContext(PixelSizeContext);
  const powerAndHealth = useMemo(() => [
    { fontSize: pixelSize / 3.5, degrees: 40, color: theme.game.mountain.normal, value: `${health}` },
    { fontSize: pixelSize / 3.5, degrees: 140, color: theme.game.swamp.normal, value: `${power}` },
  ], [pixelSize, health, power]);
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
      <rect
        x={-pixelSize / 2}
        width={pixelSize}
        y={-pixelSize * 0.72}
        height={pixelSize * 0.24}
        fill={theme.typography.background.normal}
        stroke={color.normal}
        strokeWidth={1.75}
      />
      <text
        fill={theme.typography.text.normal}
        fontSize={pixelSize / 5}
        alignmentBaseline='central'
        textAnchor='middle'
        y={-pixelSize * 0.6}
        fontWeight="700"
      >
        {name.substring(0, 7)}
      </text>
      {Array.from({ length: baseEnergy }, (_, i) => {
        const enabled = i < energy;
        const width = (pixelSize / 4.5) * (baseEnergy - 1);
        return (
          <circle
            fill={enabled ? theme.game.forest.normal : theme.game.forest.disabled}
            fillOpacity={enabled ? 1 : 0.3}
            cx={(-width / 2) + (width / (baseEnergy - 1)) * i}
            cy={-pixelSize * 0.25}
            r={pixelSize / 10}
            stroke={theme.game.forest.normal}
            strokeWidth={0.5}
          />
        );
      })}
      {powerAndHealth.map(number => (
        <g
          key={number.degrees}
          transform={`translate(${Vector2
            .fromDegrees(number.degrees)
            .mutliply(pixelSize / 4)
            .toSvgString()})`}
        >
          <text
            fill={number.color}
            alignmentBaseline='middle'
            textAnchor='middle'
            fontSize={number.fontSize}
            fontWeight='900'
          >
            {number.value}
          </text>
        </g>
      ))}
      {icons.map((icon, i) => (
        <g
          key={icon.icon}
          transform={`translate(${Vector2.fromDegrees(0 + i * 45).mutliply(pixelSize * 0.65).toSvgString()})`}
        >
          <circle
            cx={0}
            cy={0}
            r={pixelSize / 5}
            fill={icon.enabled ? icon.color.normal : icon.color.disabled}
            fillOpacity={icon.enabled ? 0.9 : 0.5}
            stroke={icon.color.normal}
            strokeOpacity={icon.enabled ? 1 : 0.7}
            strokeWidth={0.5}
            onClick={icon.action}
          />
          <text
            alignmentBaseline='middle'
            textAnchor='middle'
            fontSize={pixelSize / 5}
            fillOpacity={icon.enabled ? 1 : 0.4}
          >
            <title>
              {icon.tooltip}
            </title>
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
                name={i < 2 ? 'King' : (['Archer', 'Warrior', 'Wizard', 'Long Name Is Very Long'][i % 4])}
                health={i * 2}
                power={Math.round(2 + i / 3)}
                energy={i % 4}
                baseEnergy={i % 5 + 1}
                color={i % 2 == 0 ? theme.game.playerA : theme.game.playerB}
                icons={[
                  ...(i < 2 ? [
                    {
                      enabled: true,
                      color: i % 2 == 0 ? theme.game.playerA : theme.game.playerB,
                      icon: '👑',
                      tooltip: 'King',
                      action: () => console.info('King of', i),
                    },
                    {
                      enabled: true,
                      color: theme.game.forest,
                      icon: '📍',
                      tooltip: 'Spawner',
                      action: () => console.info('Spawner of', i),
                    },
                    {
                      enabled: true,
                      color: theme.game.forest,
                      icon: '📦',
                      tooltip: 'Collector',
                      action: () => console.info('Collector of', i),
                    },
                  ] : []),
                  ...(i % 3 == 2 ? [{
                    enabled: true,
                    color: theme.game.mountain,
                    icon: '🔥',
                    tooltip: 'Fireball',
                    action: () => console.info('Fireball of', i),
                  }] : []),
                  ...(i % 4 == 3 ? [{
                    enabled: true,
                    color: theme.game.forest,
                    icon: '🏹',
                    tooltip: 'Arrowshot',
                    action: () => console.info('Bow of', i),
                  }] : []),
                  {
                    enabled: (Math.floor(i / 2) % 2) === 0,
                    color: theme.game.swamp,
                    icon: '🪄',
                    tooltip: 'Heal',
                    action: () => console.info('Wand of', i),
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
