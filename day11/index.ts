import { data } from "./data";

const sleep = () => new Promise((res) => setImmediate(res));

const cutNumber = (num: number) => {
  const midpoint = Math.floor(num.toString().length / 2);
  const left = num.toString().substring(0, midpoint);
  let right = num.toString().substring(midpoint);
  return [Number(left), Number(right)];
};

const blink = async (map: Map<number, number>, timesLeft: number) => {
  await sleep();
  const newMap = new Map<number, number>();

  for (const [num, count] of map) {
    if (num === 0) {
      const current = newMap.get(1) ?? 0;
      newMap.set(1, current + count);
      continue;
    }

    if (num.toString().length % 2 === 0) {
      const [left, right] = cutNumber(num);
      if (left === right) {
        const currentCount = newMap.get(left) ?? 0;
        const newCount = count * 2;

        newMap.set(left, currentCount + newCount);
        continue;
      }
      const currentLeft = newMap.get(left) ?? 0;
      const currentRight = newMap.get(right) ?? 0;

      newMap.set(left, currentLeft + count);
      newMap.set(right, currentRight + count);
      continue;
    }

    const newNum = num * 2024;
    const currentCount = newMap.get(newNum) ?? 0;
    newMap.set(newNum, currentCount + count);
  }
  if (timesLeft > 1) return await blink(newMap, timesLeft - 1);
  return newMap;
};

const initial = new Map<number, number>(); // Map<stone, count>

data.forEach((num) => {
  initial.set(num, 1);
});

const start = performance.now();
const stonesLine = await blink(initial, 25);
const end = performance.now();

const total = [...stonesLine.values()].reduce((acc, cur) => {
  return acc + cur;
}, 0);

console.log(
  `Number of stones: ${total}\nTime to execute: ${Math.abs(end - start).toFixed(
    2
  )}ms`
);
