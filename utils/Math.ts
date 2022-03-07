import { Vector2 } from './Vector2';

export function approximatelyEqual(a: number, b: number, epsilon = 0.001): boolean {
  return Math.abs(a - b) < epsilon;
}

export function hexCorner(size: number, i: number, pointy: boolean = false): Vector2 {
  var degrees = 60 * i - (pointy ? 30 : 0);
  var radians = Math.PI / 180 * degrees;
  return new Vector2(
    size * Math.cos(radians),
    size * Math.sin(radians),
  );
};
