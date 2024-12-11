import { testData } from "./data";

const data = testData;

const potentialTrailHeads: number[][] = [];

data.forEach((row, y) => {
  row.forEach((h, x) => {
    if (h === 0) potentialTrailHeads.push([x, y]);
  });
});

const isInBounds = (x: number, y: number) => {
  return x >= 0 && x < data[0].length && y >= 0 && y < data.length;
};

const trailHeads = new Map<string, number[][]>();

const directions = {
  u: [0, -1],
  d: [0, 1],
  l: [-1, 0],
  r: [1, 0],
} as const;

type direction = keyof typeof directions;

const walk = (start: string, x: number, y: number, direction: direction) => {
  if (!isInBounds(x, y)) return;

  const currentHeight = data[y][x];

  const [vecX, vecY] = directions[direction];
  const [nextX, nextY] = [x + vecX, y + vecY];
  if (!isInBounds(nextX, nextY)) return;

  const nextHeight = data[nextY][nextX];

  if (nextHeight <= currentHeight) return;
  if (nextHeight === 9) {
    if (trailHeads.has(start)) {
      const oldTrailHead = trailHeads.get(start)!;
      if (oldTrailHead.some((t) => t[0] === nextX && t[1] === nextY)) return;
      trailHeads.set(start, [...oldTrailHead, [nextX, nextY]]);
      return;
    }
    trailHeads.set(start, [[nextX, nextY]]);
    return;
  }

  switch (direction) {
    case "u":
    case "d":
    case "l":
    case "r":
    default:
      return;
  }
};

potentialTrailHeads.forEach(([x, y]) => {});

// total of all scores for testData = 36
