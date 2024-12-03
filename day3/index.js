import fs from "fs";

const data = fs.readFileSync("./day3/data.txt", "utf-8");

const MUL_PATTERN = /mul\(\d{1,3},\d{1,3}\)/g;
const DO_PATTERN = /do\(\)/g;
const DONT_PATTERN = /don't\(\)/g;

// [instructionString, indexInData][]
const getInstructions = (pattern) => {
  return [...data.matchAll(pattern)].map((m) => [m[0], m.index]);
};

const muls = getInstructions(MUL_PATTERN);
const dos = getInstructions(DO_PATTERN);
const donts = getInstructions(DONT_PATTERN);

// [number, number]
const formatMulString = (mulString) => {
  return mulString
    .split(",")
    .map((s) => Number(s.replace("mul(", "").replace(")", "")));
};

const productSum = muls.reduce((acc, cur) => {
  const split = formatMulString(cur[0]);
  return acc + split[0] * split[1];
}, 0);

// console.log(productSum); // part 1

// sort by index in data
const combined = [...dos, ...donts, ...muls].sort((a, b) => a[1] - b[1]);

// find most recent do or don't instruction
const shouldExecute = (ind) => {
  if (ind <= 0) return true; // default action is do()
  if (combined[ind][0] === "do()") return true;
  if (combined[ind][0] === "don't()") return false;
  if (combined[ind][0].includes("mul(")) return shouldExecute(ind - 1);
};

const instructionsIncluded = combined.reduce((acc, cur, ind) => {
  if (cur[0] === "do()") return acc;
  if (cur[0] === "don't()") return acc;
  if (!shouldExecute(ind)) return acc;

  const [first, second] = formatMulString(cur[0]);
  return acc + first * second;
}, 0);

console.log(instructionsIncluded); // part 2
