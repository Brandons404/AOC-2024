import { data } from "./data";

interface BlockAndSpace {
  blocks: number;
  spaces: number;
}

function buildRealDisplayString(list: Map<number, BlockAndSpace>): string {
  let totalString = "";

  for (let key = 0; key < list.size; key++) {
    const { blocks, spaces } = list.get(key)!;

    for (let i = 0; i < blocks; i++) {
      totalString += key;
    }

    let i = spaces;
    while (i > 0) {
      const lastIndex = list.size - 1;
      const lastKey = list.get(lastIndex);
      if (!lastKey) break;

      let { blocks: lastBlocks, spaces: lastSpaces } = lastKey;

      if (lastBlocks > 0) {
        totalString += lastIndex;
        lastBlocks--;
        i--;
      } else {
        list.delete(lastIndex);
        continue;
      }
      list.set(lastIndex, {
        blocks: lastBlocks,
        spaces: lastSpaces,
      });
    }
  }

  return totalString;
}

function buildInputString(list: Map<number, BlockAndSpace>): string {
  let totalString = "";

  list.forEach(({ blocks, spaces }, key) => {
    for (let i = 0; i < blocks; i++) {
      totalString += key;
    }

    for (let i = 0; i < spaces; i++) {
      totalString += ".";
    }
  });

  return totalString;
}

function createIds(line: string) {
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

    // end
    id++;
  });

  console.log(list);
  const input = buildInputString(list);
  console.log(input);
  console.log("yours:" + buildRealDisplayString(list));
  console.log("right:" + "0099811188827773336446555566");
}

createIds(data[1]);
