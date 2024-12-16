import fs from 'fs';
import GardenRoomba from './GardenRoomba';

let data: string | string[][] = fs.readFileSync('./day12/data.txt', 'utf-8');

data = data.split('\n').map((row) => row.trim().split(''));

const gerald = new GardenRoomba('Gerald');
gerald.sendTo(data);

for (let y = 0; y < data.length; y++) {
  const row = data[y];
  for (let x = 0; x < row.length; x++) {
    await gerald.scan(x, y);
  }
}

gerald.calculatePlotBoundaries().calculatePrice();
