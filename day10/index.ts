import { testData } from './data';

const sleep = () => new Promise((res) => setImmediate(res));
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

const addLoc = (startKey: string, loc: number[]) => {
  if (trailHeads.has(startKey)) {
    const old = trailHeads.get(startKey)!;
    const newOld = old.filter(([x, y]) => x !== loc[0] && y !== loc[1]);
    trailHeads.set(startKey, [...newOld, loc]);
    return;
  }
  trailHeads.set(startKey, [loc]);
  return;
};

const walk = async (startKey: string, oldX: number, oldY: number, x: number, y: number, first?: boolean) => {
  await sleep();
  const explore = () => {
    Object.values(directions).forEach(([vx, vy]) => {
      const [nextX, nextY] = [x + vx, y + vy];
      walk(startKey, x, y, nextX, nextY, false);
    });
  };
  if (first) {
    explore();
    return;
  }
  if (!isInBounds(x, y)) return;
  if (x === oldX && y === oldY) return;
  const oldHeight = data[oldY][oldX];
  const currentHeight = data[y][x];

  if (currentHeight !== oldHeight + 1) return;

  if (currentHeight === 9) {
    addLoc(startKey, [x, y]);
    return;
  }
  explore();
};

// total of all scores for testData = 36
potentialTrailHeads.forEach(([x, y]) => {
  void walk(`${x},${y}`, 0, 0, x, y, true);
});

setTimeout(() => {
  console.log(trailHeads);
  const total = [...trailHeads.values()].reduce((acc, cur) => {
    return acc + cur.length;
  }, 0);
  console.log(total);
}, 10000);
