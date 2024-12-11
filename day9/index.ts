// I'm not proud of any of this

import fs from "fs";

const _data = fs.readFileSync("./day9/data.txt", "utf-8");
const data = _data
  .split("")
  .filter((c) => c !== "\n")
  .join("");

const sleep = () => new Promise((res) => setImmediate(res));

interface BlockAndSpace {
  blocks: number;
  spaces: number;
}

async function buildRealDisplayString(
  list: Map<number, BlockAndSpace>
): Promise<number[]> {
  const next = async (
    stringArr: number[],
    currentIndex: number,
    map: Map<number, BlockAndSpace>
  ) => {
    await sleep();
    let newStringArr = stringArr;
    let { blocks, spaces } = map.get(currentIndex)!;
    const lastIndex = map.size - 1;
    let { blocks: lastBlocks, spaces: lastSpaces } = map.get(lastIndex)!;

    while (blocks) {
      newStringArr.push(currentIndex);
      blocks--;
    }

    if (currentIndex === lastIndex) {
      return newStringArr;
    }

    if (spaces && lastBlocks) {
      newStringArr.push(lastIndex);
      lastBlocks--;
      spaces--;
    }
    if (!lastBlocks) {
      map.delete(lastIndex);
    } else {
      map.set(lastIndex, { blocks: lastBlocks, spaces: lastSpaces });
    }

    map.set(currentIndex, { blocks, spaces });

    if (spaces) return next(newStringArr, currentIndex, map);

    if (map.has(currentIndex + 1)) {
      return next(newStringArr, currentIndex + 1, map);
    }
    return newStringArr;
  };
  return await next([], 0, list);
}

async function createIdsMap(line: string) {
  const list = new Map<number, BlockAndSpace>();
  let id = 0;
  line.split("").forEach((element, i) => {
    if (i % 2 === 1) {
      // empty spaces
      return;
    } else {
      // blocks
      list.set(id, {
        blocks: Number(element),
        spaces: i + 1 >= line.length ? 0 : Number(line.at(i + 1)),
      });
    }
    id++;
  });

  return list;
}

const getChecksum = async (list: Map<number, BlockAndSpace>) => {
  const displayStringArr = await buildRealDisplayString(list);
  return displayStringArr.reduce((acc, cur, i) => {
    return acc + Number(cur) * i;
  }, 0);
};

const part2 = async (list: Map<number, BlockAndSpace>) => {
  let newArr: Array<Array<string | number>> = [];

  list.forEach(({ blocks, spaces }, id) => {
    const tempBlocks = Array(blocks).fill(id);
    list.set(id, { blocks, spaces });
    newArr.push(tempBlocks);
    if (spaces) {
      const tempSpaces = Array(spaces).fill(".");
      newArr.push(tempSpaces);
    }
  });

  const reversedList = new Map();
  [...list.entries()].reverse().forEach(([fileId, bAnds]) => {
    reversedList.set(fileId, bAnds);
  });

  reversedList.forEach(({ blocks, spaces }, fileId) => {
    let foundSpaceIndex: number | null = null;

    for (let i = 0; i < newArr.length; i++) {
      const element = newArr[i];
      if (element.includes(".") && element.length >= blocks) {
        foundSpaceIndex = i;
        break;
      }
    }
    if (!foundSpaceIndex) return;

    let currentInd: null | number = null;
    newArr.find((ar, i) => {
      if (ar.every((el) => el === fileId)) {
        currentInd = i;
        return true;
      }
      return false;
    });
    if (currentInd !== null && foundSpaceIndex > currentInd) return;

    // remove current position in drive
    const replacement = Array(blocks).fill(".");
    newArr = newArr.map((el) => {
      if (el.every((i) => i === fileId)) return replacement;
      return el;
    });

    let tempElement = [...newArr[foundSpaceIndex]];

    for (let i = 0; i < blocks; i++) {
      tempElement[i] = fileId;
    }

    if (tempElement.includes(".")) {
      const arr1 = tempElement.filter((char) => char !== ".");
      const arr2 = tempElement.filter((char) => char === ".");
      newArr.splice(foundSpaceIndex, 1, arr1, arr2);
      return;
    }
    newArr[foundSpaceIndex] = tempElement;
  });

  return newArr.flatMap((i) => i);
};

const getChecksum2 = async (list: Map<number, BlockAndSpace>) => {
  const displayStringArr = await part2(list);
  return displayStringArr.reduce((acc, cur, i) => {
    return cur === "." ? acc : (acc as number) + Number(cur) * i;
  }, 0);
};

const dataIdMap = await createIdsMap(data);

// const checksum = await getChecksum(dataIdMap); // part 1
// console.log(checksum);

const checksum2 = await getChecksum2(dataIdMap);
console.log(checksum2); // part 2
