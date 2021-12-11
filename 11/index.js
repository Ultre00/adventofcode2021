const { getInput } = require("../shared");
const raw = getInput("11/input.txt");

const data = raw
  .split("\r\n")
  .map((m) => m.split("").map((n) => parseInt(n, 10)));

incrementNumber = (x, y, skip) => {
  if (!skip.find((m) => m.x === x && m.y === y)) {
    if (data[y][x] < 9) {
      data[y][x]++;
    } else {
      skip.push({ x, y });
      data[y][x] = 0;
      for (let yy = -1; yy <= 1; yy++) {
        for (let xx = -1; xx <= 1; xx++) {
          if (
            !(
              (xx === 0 && yy === 0) ||
              data[y + yy] === undefined ||
              data[y + yy][x + xx] === undefined
            )
          ) {
            incrementNumber(x + xx, y + yy, skip);
          }
        }
      }
    }
  }
};

incrementData = () => {
  const skip = [];
  for (let y = 0; y < data.length; y++) {
    for (let x = 0; x < data[y].length; x++) {
      incrementNumber(x, y, skip);
    }
  }
};

let step = 0;
let totalFlashes = 0;
let flashes = 0;
do {
  step++;
  incrementData();
  flashes = data.reduce(
    (rowSum, row) =>
      rowSum + row.reduce((sum, cur) => sum + (cur === 0 ? 1 : 0), 0),
    0
  );
  totalFlashes += flashes;
  if (step === 100) {
    console.log("part 1: ", totalFlashes);
  }
} while (flashes !== 100);

console.log("part 2:", step);
