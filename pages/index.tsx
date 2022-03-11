import type { NextPage } from 'next';
import React, { MouseEventHandler, useContext, useEffect, useMemo, useState } from 'react';
import styled, { DefaultTheme, ThemeContext } from 'styled-components';
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
    <polygon
      points={corners.map(corner => `${corner.x},${corner.y}`).join(' ')}
      fill={theme.game[biome].normal}
      fillOpacity={0.1}
      stroke={theme.typography.text.normal}
      strokeWidth={0.3}
    />
  );
};

const Creature = (props: {
  name: string,
  color: ThemeColor,
  power: number,
  health: number,
  baseEnergy: number,
  energy: number,
  showIcons: boolean,
  icons: {
    enabled: boolean,
    tooltip: string,
    color: ThemeColor,
    icon: string,
    action: () => void
  }[],
}) => {
  const { name, color, power, health, baseEnergy, energy, showIcons, icons } = props;
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
        fontWeight='700'
      >
        {name.substring(0, 7)}
      </text>
      {Array.from({ length: baseEnergy }, (_, i) => {
        const enabled = i < energy;
        const width = (pixelSize / 4.5) * (baseEnergy - 1);
        const x = baseEnergy < 2 ? 0 : (-width / 2) + (width / (baseEnergy - 1)) * i;
        return (
          <circle
            key={i}
            fill={enabled ? theme.game.forest.normal : theme.game.forest.disabled}
            fillOpacity={enabled ? 1 : 0.3}
            cx={x}
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
      {showIcons && icons.map((icon, i) => (
        <g
          key={icon.icon}
          transform={`translate(${Vector2.fromDegrees(0 + i * 45).mutliply(pixelSize * 0.65).toSvgString()})`}
          onClick={icon.action}
        >
          <circle
            cx={0}
            cy={0}
            r={pixelSize / 5}
            fill={icon.color.normal}
            fillOpacity={icon.enabled ? 1 : 0.5}
            stroke={icon.enabled ? theme.typography.text.normal : theme.typography.text.contrast}
            strokeOpacity={icon.enabled ? 1 : 0.5}
            strokeWidth={1}
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

interface SelectionProps {
  height: number;
}

const Selection = styled.div<SelectionProps>`
  float: none;
  overflow: hidden;
  border: 1px solid ${props => props.theme.typography.accent.normal};
  border-radius: 0.5em;
  height: ${props => props.height}px;

  p {
    margin: 0.5em;
  }
`;

const generateCreature = (i: number, theme: DefaultTheme) => {
  const controller: 'playerA' | 'playerB' = i % 2 == 0 ? 'playerA' : 'playerB';
  return {
    name: i < 2 ? 'King' : (['Archer', 'Warrior', 'Wizard', 'Gatherer'][i % 4]),
    health: 20 - (Math.min(i, 15)),
    power: Math.round(2 + i / 3),
    energy: i % 4,
    baseEnergy: i % 5 + 1,
    controller,
    icons: [
      ...(i < 2 ? [
        {
          enabled: true,
          interactable: false,
          color: controller,
          icon: '👑',
          tooltip: 'King',
        },
        {
          enabled: true,
          interactable: false,
          color: 'forest',
          icon: '📍',
          tooltip: 'Spawner',
        },
        {
          enabled: true,
          interactable: false,
          color: 'forest',
          icon: '📦',
          tooltip: 'Collector',
        },
      ] : []),
      ...(i % 3 == 2 ? [{
        enabled: true,
        interactable: true,
        color: 'mountain',
        icon: '🔥',
        tooltip: 'Fireball 2',
      }] : []),
      ...(i % 4 == 3 ? [{
        enabled: true,
        interactable: true,
        color: 'forest',
        icon: '🏹',
        tooltip: 'Arrowshot 2-3',
      }] : []),
      {
        enabled: (Math.floor(i / 2) % 2) === 0,
        interactable: true,
        color: 'swamp',
        icon: '🪄',
        tooltip: 'Heal 2',
      },
    ] as { interactable: boolean, enabled: boolean, color: keyof typeof theme.game, icon: string, tooltip: string }[],
  };
};

const Landing: NextPage = () => {
  const theme = useContext(ThemeContext);
  const [mode, setMode] = useState<'selection' | 'tile' | 'creature'>('selection');
  const [tiles,, tilesAddons] = useArray(AxialCoordinate.circle(new AxialCoordinate(5, 1), 4));
  const [creatureCoords,, creaturesAddons] = useArray<AxialCoordinate>([]);
  const [pixelSize, setPixelSize] = useState(40);
  const [selection, setSelection] = useState<undefined | { location: AxialCoordinate, creature: ReturnType<typeof generateCreature>}>(undefined);
  const [information, setInformation] = useState('');
  useEffect(() => {
    if (mode === 'selection') {
      return;
    }
    setSelection(undefined);
    setInformation('');
  }, [mode]);
  const corners = useMemo(
    () => AxialCoordinate.Directions.map((_, index) => Vector2.fromDegrees(index * 60).mutliply(pixelSize)),
    [pixelSize],
  );
  const onClick: MouseEventHandler = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pixel = new Vector2(e.clientX - rect.x, e.clientY - rect.y);
    const coord = AxialCoordinate.fromPixel(pixel, pixelSize).rounded();
    const tileIndex = tiles.findIndex(tile => AxialCoordinate.approximatelyEqual(coord, tile));
    const creatureIndex = creatureCoords.findIndex(creature => AxialCoordinate.approximatelyEqual(coord, creature));
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
    if (mode === 'selection') {
      if (creatureIndex === -1) {
        setSelection(undefined);
      } else {
        // TODO: what if create is delete / index changes?
        setSelection({
          location: coord,
          creature: generateCreature(creatureIndex, theme),
        });
      }
    }
    e.preventDefault();
    e.stopPropagation();
  };
  const [hoverCoord, setHoverCoord] = useState(new AxialCoordinate(0, 0));
  const onMove: MouseEventHandler = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pixel = new Vector2(e.clientX - rect.x, e.clientY - rect.y);
    const coord = AxialCoordinate.fromPixel(pixel, pixelSize).rounded();
    setHoverCoord(coord);
  };
  const svgSize = useMemo(
    () => new Vector2((7 * 2 + 1), 7 * Math.sqrt(3)).mutliply(pixelSize),
    [pixelSize],
  );
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
        <Button primary={mode == 'selection'} onClick={() => setMode('selection')}>
          Selection
        </Button>
        <Button primary={mode == 'tile'} onClick={() => setMode('tile')}>
          Tile
          {` (x${tiles.length})`}
        </Button>
        <Button primary={mode == 'creature'} onClick={() => setMode('creature')}>
          Creature
          {` (x${creatureCoords.length})`}
        </Button>
      </ButtonRow>
      <div style={{ height: svgSize.y, width: '100%' }}>
        <PixelSizeContext.Provider value={pixelSize}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            style={{
              border: `1px solid ${theme.typography.accent.normal}`,
              borderRadius: '0.5em',
              backgroundColor: theme.typography.background.normal,
              width: svgSize.x,
              height: svgSize.y,
              float: 'left',
              marginRight: '0.25em',
            }}
            onClick={onClick}
            onMouseMove={onMove}
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
            {creatureCoords.map((creatureCoord, i) => {
              const pixel = creatureCoord.toPixel(pixelSize);
              const creature = generateCreature(i, theme);
              return (
                <g
                  key={creatureCoord.toString()}
                  transform={`translate(${pixel.x} ${pixel.y})`}
                >
                  <Creature
                    name={creature.name}
                    color={theme.game[creature.controller]}
                    health={creature.health}
                    power={creature.power}
                    baseEnergy={creature.baseEnergy}
                    energy={creature.energy}
                    icons={creature.icons.filter(icon => icon.interactable).map(icon => ({
                      ...icon,
                      color: theme.game[icon.color],
                      action: () => setInformation(`Clicked on ${icon.icon} (${icon.tooltip}) of ${creature.name}`),
                    }))}
                    showIcons={mode === 'selection' && creatureCoord.approximatelyEqual(hoverCoord)}
                  />
                </g>
              );
            })}
            {selection && (
              <g
                transform={`translate(${selection.location.toPixel(pixelSize).x} ${selection.location.toPixel(pixelSize).y})`}
              >
                <polygon
                  style={{ pointerEvents: 'none' }}
                  points={corners.map(corner => `${corner.x},${corner.y}`).join(' ')}
                  fill={theme.typography.text.normal}
                  fillOpacity={0.15}
                  stroke={theme.typography.accent.normal}
                  strokeWidth={3}
                  strokeOpacity={0.15}
                >
                  <animate
                    begin='0s'
                    attributeName='opacity'
                    values='1;0;0;1'
                    dur='2.2s'
                    repeatCount='indefinite'
                  />
                </polygon>
              </g>
            )}
          </svg>
        </PixelSizeContext.Provider>
        {selection !== undefined && (
          <Selection height={svgSize.y}>
            <p>
              <b>
                <u>
                  {selection.creature.name}
                </u>
              </b>
              {` (of ${selection.creature.controller})`}
            </p>
            <hr style={{ borderWidth: 5, borderColor: theme.game[selection.creature.controller].normal }} />
            <p>
              <p>
                power:
                {' '}
                <b>
                  {selection.creature.power}
                </b>
                <br/>
                health:
                {' '}
                <b>
                  {selection.creature.health}
                </b>
                <br/>
                engergy:
                {' '}
                <b>
                  {selection.creature.energy}
                </b>
                {' / '}
                {selection.creature.baseEnergy}
              </p>
              <hr style={{ borderWidth: 2, borderColor: theme.game[selection.creature.controller].normal }} />
              {selection.creature.icons.map(icon => {
                return (<p style={{ marginBottom: '0.25em' }} key={icon.icon}>
                  {icon.interactable &&
                    <Button
                      disabled={!icon.enabled}
                      primary={icon.enabled}
                      accent={icon.enabled ? theme.game[icon.color] : theme.typography.accent}
                      onClick={() => setInformation(`Clicked on ${icon.icon} (${icon.tooltip}) of ${selection.creature.name}`)}
                    >
                      {icon.icon}
                      &nbsp;&nbsp;
                      {icon.tooltip}
                    </Button>
                  }
                  {!icon.interactable && (icon.icon + ' ' + icon.tooltip)}
                </p>
                );
              })}
            </p>
          </Selection>
        )}
      </div>
      <p>
        {information}
      </p>
    </>
  );
};

export default Landing;
