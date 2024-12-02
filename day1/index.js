import { list1, list2 } from "./data.js";

const sorted1 = list1.sort();
const sorted2 = list2.sort();

const solvePart1 = () => {
  const differences = [];

  sorted1.forEach((id, ind) => {
    differences.push(Math.abs(id - sorted2[ind]));
  });

  const answer = differences.reduce((acc, cur) => acc + cur, 0);
  console.log(answer);
};

const solvePart2 = () => {
  const freq = list2.reduce((acc, cur) => {
    if (cur in acc) return { ...acc, [cur]: acc[cur] + 1 };
    return { ...acc, [cur]: 1 };
  }, {});

  const answer = list1
    .map((id) => {
      return id in freq ? id * freq[id] : 0;
    })
    .reduce((acc, cur) => acc + cur, 0);

  console.log(answer);
};

solvePart2();
