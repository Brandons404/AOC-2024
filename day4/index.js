import fs from "fs";

const _data = fs.readFileSync("./day4/data.txt", "utf-8");

const data = _data.split("\n");

const WORD = "XMAS";
const WORD_ARR = WORD.split("");
const HEIGHT = data.length - 1;
const WIDTH = data[1].length - 1;

const directions = {
  l: [-1, 0],
  r: [1, 0],
  u: [0, -1],
  d: [0, 1],
  ul: [-1, -1],
  ur: [1, -1],
  dl: [-1, 1],
  dr: [1, 1],
};

const traverse = (rowIndex, columnIndex, direction) => {
  let accumulator = "";
  const [x, y] = directions[direction];

  let minDistanceNeeded = WORD.length - 1;

  if (
    minDistanceNeeded * y + rowIndex > HEIGHT ||
    minDistanceNeeded * y + rowIndex < 0
  )
    return false;
  if (
    minDistanceNeeded * x + columnIndex > WIDTH ||
    minDistanceNeeded * x + columnIndex < 0
  )
    return false;

  for (let i = 0; i <= minDistanceNeeded; i++) {
    const nextChar = data[rowIndex + y * i][columnIndex + x * i];
    if (!WORD_ARR.includes(nextChar)) return false;
    accumulator += nextChar;
  }

  return accumulator === WORD;
};

const getTotalMatches = (rowIndex, columnIndex) => {
  const directionsArr = Object.keys(directions);

  let total = 0;

  directionsArr.forEach((direction) => {
    total += traverse(rowIndex, columnIndex, direction) ? 1 : 0;
  });

  return total;
};

let bigTotal = 0;

data.forEach((_row, y) => {
  const row = _row.trim().split("");
  row.forEach((char, x) => {
    if (char !== WORD[0]) return;
    bigTotal += getTotalMatches(y, x);
  });
});

let part2Total = 0;

const getIsXmas = (x, y) => {
  let string =
    data[y - 1][x + 1] +
    data[y + 1][x + 1] +
    data[y + 1][x - 1] +
    data[y - 1][x - 1];
  return ["MMSS", "SMMS", "SSMM", "MSSM"].includes(string);
};

data.forEach((_row, y) => {
  if (y === 0 || y === HEIGHT) return;
  const row = _row.trim().split("");
  row.forEach((char, x) => {
    if (x === 0 || x === WIDTH) return;
    if (char === "A" && getIsXmas(x, y)) {
      part2Total++;
    }
  });
});

console.log(bigTotal);
