import { data } from "./data";

const sleep = () => new Promise((res) => setImmediate(res));

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

const addLoc = (startKey: string, loc: number[]) => {
  if (trailHeads.has(startKey)) {
    const old = trailHeads.get(startKey)!;
    const newOld = old.filter(([x, y]) => !(x === loc[0] && y === loc[1]));
    trailHeads.set(startKey, [...newOld, loc]);
    return;
  }
  trailHeads.set(startKey, [loc]);
  return;
};

const walk = async (
  startKey: string,
  oldX: number,
  oldY: number,
  x: number,
  y: number,
  first?: boolean
) => {
  const explore = async () => {
    await sleep();
    const promises = [];
    for (const [vx, vy] of Object.values(directions)) {
      const [nextX, nextY] = [x + vx, y + vy];
      promises.push(walk(startKey, x, y, nextX, nextY, false));
    }
    await Promise.all(promises);
  };

  if (first) {
    await explore();
    return;
  }
  if (!isInBounds(x, y)) return;
  if (x === oldX && y === oldY) return;
  const [sx, sy] = startKey.split(",").map((s) => Number(s));
  if (sx === x && sy === y) return;
  const oldHeight = data[oldY][oldX];
  const currentHeight = data[y][x];

  if (currentHeight !== oldHeight + 1) return;

  if (currentHeight === 9) {
    addLoc(startKey, [x, y]);
    return;
  }
  await explore();
};

const trailPaths = new Map<string, Set<string>>();

const walk2 = async (
  startKey: string,
  oldX: number,
  oldY: number,
  x: number,
  y: number,
  first: boolean,
  path: string[]
) => {
  const explore = async (first: boolean = false) => {
    await sleep();
    const promises = [];
    for (const [vx, vy] of Object.values(directions)) {
      const [nextX, nextY] = [x + vx, y + vy];
      promises.push(
        walk2(startKey, x, y, nextX, nextY, false, [
          ...path,
          `${nextX},${nextY}`,
        ])
      );
    }
    await Promise.all(promises);
  };

  if (first) {
    await explore(first);
    return;
  }
  if (!isInBounds(x, y)) return;

  const oldHeight = data[oldY][oldX];
  const currentHeight = data[y][x];

  if (currentHeight !== oldHeight + 1) return;
  if (currentHeight === 9) {
    const pathString = path.join("|");
    if (!trailPaths.has(startKey)) {
      trailPaths.set(startKey, new Set());
    }
    trailPaths.get(startKey)!.add(pathString);
    return;
  }

  await explore();
};

const start = async () => {
  const promises = [];
  for (let i = 0; i < potentialTrailHeads.length; i++) {
    const [x, y] = potentialTrailHeads[i];
    promises.push(walk2(`${x},${y}`, 0, 0, x, y, true, [`${x},${y}`]));
  }

  await Promise.all(promises);
  console.log(
    [...trailPaths.values()].reduce((acc, cur) => {
      return acc + cur.size;
    }, 0)
  );
};

start();
