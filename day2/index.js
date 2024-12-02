import { data } from "./data.js";

const analyzeRow = (row) => {
  let direction = row[0] > row[1] ? "down" : "up";
  let prevNum = 0;

  for (let i = 0; i < row.length; i++) {
    if (i === 0) {
      prevNum = row[i];
      continue;
    }
    if (row[i] === prevNum) return false;
    if (Math.abs(row[i] - prevNum) > 3) return false;
    if (direction === "down" && prevNum < row[i]) return false;
    if (direction === "up" && prevNum > row[i]) return false;
    prevNum = row[i];
  }
  return true;
};

// part 1
const analyzeData = () => {
  let safeReports = 0;
  data.forEach((row) => (safeReports += analyzeRow(row) ? 1 : 0));
  return safeReports;
};

const part2 = () => {
  const unsafeReports = [];
  data.forEach((row) => {
    if (!analyzeRow(row)) {
      unsafeReports.push(row);
    }
  });

  let salvageable = 0;

  unsafeReports.forEach((r) => {
    const test = r.map((num, ind) => {
      const newRow = r.filter((item, ind2) => ind !== ind2);
      return analyzeRow(newRow);
    });

    if (test.some((val) => val)) {
      salvageable += 1;
    }
  });

  console.log(analyzeData() + salvageable);
};

part2();
