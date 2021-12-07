const { getInput } = require("../shared");
const raw = getInput("7/input.txt");

const data = raw.split(",").map((m) => parseInt(m, 10));

const triangulateNumber = (number) => {
  return (number * number + number) / 2;
};

// part 1
const calculatetotalFuel = (triangulate = false) => {
  let fuel = null;
  for (const number of data) {
    const calculation = data.reduce(
      (res, cur) =>
        res +
        (triangulate
          ? triangulateNumber(Math.abs(cur - number))
          : Math.abs(cur - number)),
      0
    );
    if (fuel === null || calculation < fuel) {
      fuel = calculation;
    }
  }
  return fuel;
};

console.log("part1: ", calculatetotalFuel());
console.log("part2: ", calculatetotalFuel(true));
