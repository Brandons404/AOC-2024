import { realMap } from "./data";

const sleep = (ms?: number) =>
  new Promise((res) => {
    return ms ? setTimeout(res, ms) : setImmediate(res);
  });

type MapData = string[][];
type Direction = "up" | "down" | "left" | "right";

const moves = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

const turn: Record<Direction, Direction> = {
  up: "right",
  down: "left",
  left: "up",
  right: "down",
};

const getGuard = (mapData: MapData) => {
  let coords: number[] = [];
  mapData.find((row, y) => {
    if (row.includes("^")) {
      row.find((char, x) => {
        if (char === "^") {
          coords = [x, y];
          return true;
        }
        return false;
      });
      return true;
    }
    return false;
  });
  return coords;
};

const getIsInBounds = (map: MapData, x: number, y: number) => {
  return !!map.at(y) && !!map?.[y]?.at(x);
};

const getIsObsticle = (map: MapData, x: number, y: number) => {
  return map?.[y]?.[x] === "#";
};

const paintNext = async (
  map: MapData,
  x: number,
  y: number,
  dir: Direction
) => {
  await sleep();
  const [moveX, moveY] = moves[dir];
  const next = [moveX + x, moveY + y];
  if (getIsInBounds(map, next[0], next[1])) {
    if (getIsObsticle(map, next[0], next[1])) {
      return paintNext(map, x, y, turn[dir]);
    }
    let newMap = map.map((row) => [...row]);
    newMap[next[1]][next[0]] = "X";
    return paintNext(newMap, next[0], next[1], dir);
  }

  return map;
};

const countX = (map: MapData) => {
  let count = 0;
  map.forEach((row) => {
    row.forEach((char) => {
      if (["X", "^"].includes(char)) count++;
    });
  });
  return count;
};

const part1 = async () => {
  const formatted = realMap.map((row) => [...row]);
  const [startX, startY] = getGuard(formatted);

  const travelPlan = await paintNext(formatted, startX, startY, "up");
  console.log(countX(travelPlan));
};

const isLoop = async (
  map: MapData,
  x: number,
  y: number,
  dir: Direction,
  history: Map<string, Direction[]>
) => {
  const key = `${x},${y}`;

  if (history.has(key)) {
    if (history.get(key)?.includes(dir)) {
      return true;
    }
    history.set(key, [...(history.get(key) ?? [dir]), dir]);
  } else {
    history.set(key, [dir]);
  }
  await sleep();
  const [moveX, moveY] = moves[dir];
  const next = [moveX + x, moveY + y];
  if (getIsInBounds(map, next[0], next[1])) {
    if (getIsObsticle(map, next[0], next[1])) {
      return isLoop(map, x, y, turn[dir], history);
    }
    return isLoop(map, next[0], next[1], dir, history);
  }

  return false;
};

const getPathsWalked = async (map: MapData, x: number, y: number) => {
  const paths: Set<Record<"x" | "y", number>> = new Set();
  const simulatedMap = await paintNext(map, x, y, "up");
  simulatedMap.forEach((row, y) => {
    row.forEach((char, x) => {
      if (char === "X") {
        paths.add({ x, y });
      }
    });
  });
  return paths;
};

const part2 = async () => {
  let total = 0;
  let loops = 0;
  const formatted = realMap.map((row) => [...row]);
  const [startX, startY] = getGuard(formatted);
  const paths = await getPathsWalked(formatted, startX, startY);
  const totalPaths = paths.size;
  for (const [_key, { x, y }] of paths.entries()) {
    if ((y === startY && x === startX) || formatted[y][x] === "#") continue;
    let temp = formatted.map((row) => [...row]);
    temp[y][x] = "#";

    const createsLoop = await isLoop(temp, startX, startY, "up", new Map());
    if (createsLoop) total++;

    loops++;
    process.stdout.write(
      `Simulated ${loops} of ${totalPaths} potential loops (${Number(
        (loops / totalPaths) * 100
      ).toFixed(0)}%)\r`
    );
  }
  console.log(`\nTotal: ${total}`);
};

part2();
