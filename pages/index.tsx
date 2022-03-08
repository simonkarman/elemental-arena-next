import type { NextPage } from 'next';
import { MouseEventHandler, useContext, useState } from 'react';
import { ThemeContext } from 'styled-components';
import { useArray } from '../hooks';
import { Palette } from '../themes/theme';
import { AxialCoordinate } from '../utils/AxialCoordinate';
import { HexDirection } from '../utils/HexDirection';
import { hexCorner } from '../utils/Math';
import { Vector2 } from '../utils/Vector2';

interface HexagonProps {
  pixelSize: number,
  coord: AxialCoordinate,
  stroke: Palette,
}

const Hexagon = (props: HexagonProps) => {
  const { pixelSize, coord, stroke } = props;
  const [isClicked, setIsClicked] = useState(false);
  return (
    <g transform={`translate(${coord.toPixel(pixelSize).x} ${coord.toPixel(pixelSize).y})`}>
      <circle
        cx={0}
        cy={0}
        r={pixelSize / 1.3}
        fill={isClicked ? props.stroke.background.disabled : '#FFFFFF00'}
        stroke={stroke.background.disabled}
        onClick={() => setIsClicked(!isClicked)}
      />
      {AxialCoordinate.Directions.map((_, index) => {
        const from = hexCorner(pixelSize, index);
        const to = hexCorner(pixelSize, (index + 1) % 6);
        return (
          <line
            key={index}
            x1={from.x} y1={from.y}
            x2={to.x} y2={to.y}
            stroke={stroke.foreground.normal}
          />
        );
      })}
    </g>
  );
};

const Landing: NextPage = () => {
  const theme = useContext(ThemeContext);
  const [coordinates,, coordinatesAddons] = useArray([
    ...AxialCoordinate.circle(new AxialCoordinate(14, -2), 3),
    ...AxialCoordinate.rectangle(new AxialCoordinate(5, 2), HexDirection.RightDown, 5, 2),
  ]);
  const onClick: MouseEventHandler = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pixel = new Vector2(e.clientX - rect.x, e.clientY - rect.y);
    const coord = AxialCoordinate.fromPixel(pixel, 27).rounded();
    if (!coordinates.find(otherCoord => AxialCoordinate.approximatelyEqual(coord, otherCoord))) {
      coordinatesAddons.push(coord);
    }
  };
  return (
    <>
      <h1>Elemental Arena</h1>
      <svg
        style={{
          border: `1px solid ${theme.primary.background.normal}`,
          backgroundColor: theme.primary.background.disabled,
          width: '100%',
          height: '400px',
        }}
        onClick={onClick}
      >
        {coordinates.map(coordinate => <Hexagon
          key={coordinate.toString()}
          pixelSize={27}
          coord={coordinate}
          stroke={theme.primary}
        />)}
      </svg>
    </>
  );
};

export default Landing;
