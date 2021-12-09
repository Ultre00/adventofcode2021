const { getInput } = require("../shared");
const raw = getInput("9/input.txt");

const data = raw
  .split("\r\n")
  .map((row) => row.split("").map((m) => parseInt(m, 10)));

const findLowPoints = () => {
  const lowPoints = [];
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      if (
        data[y][x] < (data[y - 1] === undefined ? 10 : data[y - 1][x]) &&
        data[y][x] < (data[y + 1] === undefined ? 10 : data[y + 1][x]) &&
        data[y][x] < (data[y][x - 1] === undefined ? 10 : data[y][x - 1]) &&
        data[y][x] < (data[y][x + 1] === undefined ? 10 : data[y][x + 1])
      ) {
        lowPoints.push({ x, y });
      }
    }
  }
  return lowPoints;
};

const isValidNextPoint = (basin, { x, y }) => {
  return (
    data[y] !== undefined &&
    data[y][x] !== undefined &&
    !basin.find((m) => m.x === x && m.y === y) &&
    data[y][x] !== 9
  );
};

const fillBasin = ({ x, y }, basin = []) => {
  basin.push({ x, y });
  if (isValidNextPoint(basin, { y, x: x - 1 }))
    fillBasin({ y, x: x - 1 }, basin);
  if (isValidNextPoint(basin, { y, x: x + 1 }))
    fillBasin({ y, x: x + 1 }, basin);
  if (isValidNextPoint(basin, { y: y - 1, x }))
    fillBasin({ y: y - 1, x }, basin);
  if (isValidNextPoint(basin, { y: y + 1, x }))
    fillBasin({ y: y + 1, x }, basin);

  return basin;
};

const findBasins = (lowPoints) => {
  const basins = [];
  let remainingLowPoints = [...lowPoints];

  while (remainingLowPoints.length) {
    const { x, y } = remainingLowPoints[0];
    const basin = fillBasin({ x, y });
    remainingLowPoints = remainingLowPoints.filter(
      (m) => !basin.find((n) => n.x === m.x && n.y === m.y)
    );
    basins.push(basin.length);
  }

  return basins;
};

const lowPoints = findLowPoints();

// part 1
console.log(lowPoints.reduce((res, { x, y }) => res + data[y][x] + 1, 0));

// part 2
const basins = findBasins(lowPoints).sort((a, b) =>
  a > b ? -1 : a == b ? 0 : +1
);
console.log(basins[0] * basins[1] * basins[2]);
