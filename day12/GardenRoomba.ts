const isInBounds = (data: string[][], x: number, y: number) => {
  return x >= 0 && x < data[0].length && y >= 0 && y < data.length;
};

const sleep = () => new Promise((res) => setImmediate(res));

const vectors = [
  [0, -1], // up
  [0, 1], // down
  [-1, 0], // left
  [1, 0], // right
];

export default class GardenRoomba {
  private name = '';
  private garden: string[][] = [];
  private visited: Set<string> = new Set();
  private currentPlot: string = '';
  private scannedPlotMap = new Map<string, Set<string>>();
  private boundaries = new Map<string, number>();

  constructor(name: string) {
    this.name = name;
    console.log(`${this.name} the Garden roomba was initialized.`);
  }

  private walk = async (startKey: string, oldX: number, oldY: number, x: number, y: number, first?: boolean) => {
    const explore = async () => {
      await sleep();
      const promises = [];
      for (const [vx, vy] of vectors) {
        const [nextX, nextY] = [x + vx, y + vy];
        promises.push(this.walk(startKey, x, y, nextX, nextY, false));
      }
      await Promise.all(promises);
    };

    if (first) {
      this.currentPlot = this.garden[y][x];
      if (!this.scannedPlotMap.has(`${this.currentPlot}|${startKey}`)) {
        const plotMap = new Set<string>();
        plotMap.add(startKey);
        this.scannedPlotMap.set(`${this.currentPlot}|${startKey}`, plotMap);
      }
      await explore();
      return;
    }
    if (!isInBounds(this.garden, x, y)) return;
    if (x === oldX && y === oldY) return;
    const [sx, sy] = startKey.split(',').map((s) => Number(s));
    if (sx === x && sy === y) return;
    if (this.hasVisited(x, y)) return;
    const maybe = this.garden[y][x];
    if (maybe !== this.currentPlot) return;

    this.scannedPlotMap.get(`${this.currentPlot}|${startKey}`)!.add(`${x},${y}`);
    this.addToVisited(x, y);
    await explore();
  };

  getFenceLength(x: number, y: number, letter: string) {
    let totalOutsideEdges = 0;

    vectors.forEach(([vx, vy]) => {
      const [nx, ny] = [vx + x, vy + y];
      if (!isInBounds(this.garden, nx, ny)) {
        totalOutsideEdges++;
        return;
      }
      const neighbor = this.garden[y + vy][x + vx];
      if (neighbor !== letter) totalOutsideEdges++;
      return;
    });

    return totalOutsideEdges;
  }

  sendTo(data: string[][]) {
    this.garden = data;
    return this;
  }

  status() {
    console.log(`garden :\n${this.garden?.map((r) => r.join('')).join('')}\n\nCurrent Plot scanning: ${this.currentPlot}`);
  }

  async scan(x: number, y: number) {
    if (!this.garden.length) throw new Error(`${this.name} is not in a garden to scan`);
    if (this.hasVisited(x, y)) return;
    await this.walk(`${x},${y}`, 0, 0, x, y, true);
    this.currentPlot = '';
    return this;
  }

  private addToVisited(x: number, y: number) {
    this.visited.add(`${x},${y}`);
  }

  hasVisited(x: number, y: number) {
    return this.visited.has(`${x},${y}`);
  }

  showMap() {
    console.log(this.scannedPlotMap);
    return this;
  }
  showVisited() {
    console.log(this.visited);
    return this;
  }

  calculatePlotBoundaries() {
    this.scannedPlotMap.forEach((plotTiles, plotName) => {
      plotTiles.forEach((xy) => {
        const [x, y] = xy.split(',').map((s) => Number(s));
        const plotLetter = plotName.split('|')[0];
        const fence = this.getFenceLength(x, y, plotLetter);
        const old = this.boundaries.get(plotName) ?? 0;
        this.boundaries.set(plotName, old + fence);
        return;
      });
    });
    return this;
  }

  calculatePrice() {
    let grandTotal = 0;
    this.boundaries.forEach((fence, plotName) => {
      grandTotal += this.scannedPlotMap.get(plotName)!.size * fence;
    });
    console.log(grandTotal);
  }
}
