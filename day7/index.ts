import { data } from './data';

type convertedMap = Map<'test', number> & Map<'values', number[]>;

const ACTIONS = {
  add: (a: number, b: number) => a + b,
  mul: (a: number, b: number) => a * b,
  concat: (a: number, b: number) => Number(`${a}${b}`),
} as const;

type actionTypes = keyof typeof ACTIONS;

const convertToMap = (line: string): convertedMap => {
  const [test, ...values] = line.split(' ');
  const map = new Map();
  map.set('test', Number(test.replace(':', '')));
  map.set(
    'values',
    values.map((v) => Number(v))
  );
  return map;
};

const testLine = (line: convertedMap) => {
  const test = line.get('test');
  const values = line.get('values') as number[];
  const max = values!.length - 1;

  let pass = false;

  const testValues = (acc: number, currentIndex: number, opperation: actionTypes) => {
    const indexedValue = values[currentIndex];
    const newAcc = ACTIONS[opperation](acc, indexedValue);

    if (currentIndex === max) {
      if (newAcc === test) {
        pass = true;
      }
      return;
    }
    testValues(newAcc, currentIndex + 1, 'add');
    testValues(newAcc, currentIndex + 1, 'mul');
    testValues(newAcc, currentIndex + 1, 'concat'); // remove for part 1
  };

  testValues(0, 0, 'add');
  testValues(0, 0, 'mul');
  testValues(0, 0, 'concat'); // remove for part 1

  return pass;
};

const solve = () => {
  const converted = data.map((line) => convertToMap(line));
  console.log(
    converted.reduce((acc, cur) => {
      const test = cur.get('test') as number;
      return testLine(cur) ? acc + test : acc;
    }, 0)
  );
};

solve();
