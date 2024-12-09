import { data } from "./data";

const formatted = data.map((line) => line.split(""));
const MAX_HEIGHT = formatted.length - 1;
const MAX_WIDTH = formatted[0].length - 1;

const fmap: Map<string, number[][]> = new Map();

formatted.forEach((line, y) => {
  line.forEach((char, x) => {
    if (char === ".") return;
    const existing = fmap.get(char);
    if (existing) {
      fmap.set(char, [...existing, [x, y]]);
      return;
    }
    fmap.set(char, [[x, y]]);
  });
});

const printMap = (map: typeof formatted) => {
  console.log(map.map((k) => k.join("")).join("\n"));
};

const inBounds = (x: number, y: number) => {
  return x >= 0 && x <= MAX_WIDTH && y >= 0 && y <= MAX_HEIGHT;
};

const uniqueLocations = new Set();

const paintNodesPart1 = (char: string) => {
  const locations = fmap.get(char);
  if (locations?.length === 1) return;
  const done: number[][] = [];
  locations?.forEach((loc1, i1) => {
    locations.forEach((loc2, i2) => {
      if (loc1 === loc2) return;
      if (done.some((i) => i.includes(i1) && i.includes(i2))) return;
      const [x1, y1] = loc1;
      const [x2, y2] = loc2;
      const vector = [x2 - x1, y2 - y1];
      const anti1 = [x1 - vector[0], y1 - vector[1]];
      const anti2 = [x2 + vector[0], y2 + vector[1]];
      if (inBounds(anti1[0], anti1[1]))
        uniqueLocations.add(`${anti1[0]},${anti1[1]}`);
      if (inBounds(anti2[0], anti2[1]))
        uniqueLocations.add(`${anti2[0]},${anti2[1]}`);
    });
  });
};

const paintNodesPart2 = (char: string) => {
  const locations = fmap.get(char);
  if (locations?.length === 1) return;
  const done: number[][] = [];

  const drawAntiNodes = (x: number, y: number, vector: number[]) => {
    if (!inBounds(x, y)) return;
    uniqueLocations.add(`${x},${y}`);
    drawAntiNodes(x + vector[0], y + vector[1], vector);
    return;
  };

  locations?.forEach((loc1, i1) => {
    locations.forEach((loc2, i2) => {
      if (loc1 === loc2) return;
      if (done.some((i) => i.includes(i1) && i.includes(i2))) return;
      const [x1, y1] = loc1;
      const [x2, y2] = loc2;
      const vector1 = [x1 - x2, y1 - y2];
      const vector2 = [x2 - x1, y2 - y1];
      drawAntiNodes(x1, y1, vector1);
      drawAntiNodes(x2, y2, vector2);
    });
  });
};

fmap.forEach((_locations, freq) => {
  paintNodesPart2(freq); // paintNodesPart1(freq) <-- for part 1
});

console.log(uniqueLocations.size);
