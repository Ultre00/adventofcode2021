const { getInput } = require("../shared");
const raw = getInput("3/input.txt");
const data = raw
  .split("\r\n")
  .map((m) => m.split("").map((n) => parseInt(n, 10)));

// part 1
const counts = data.reduce((res, cur) => res.map((m, i) => (m += cur[i])));
const result = counts.reduce(
  (res, cur) => ({
    gamma: res.gamma + (cur > data.length / 2 ? "1" : "0"),
    epsilon: res.epsilon + (cur > data.length / 2 ? "0" : "1"),
  }),
  { gamma: "", epsilon: "" }
);
console.log(parseInt(result.gamma, 2) * parseInt(result.epsilon, 2));

//part 2
const findRarting = (input, position, mostCommon) => {
  const counts = input.reduce((res, cur) => res + cur[position], 0);
  const toSelect = mostCommon
    ? counts >= input.length / 2
      ? 1
      : 0
    : counts >= input.length / 2
    ? 0
    : 1;
  const newInput = input.filter((m) => m[position] == toSelect);
  if (newInput.length == 1) {
    return parseInt(
      newInput[0].reduce((res, cur) => res + cur, ""),
      2
    );
  }
  return findRarting(newInput, position + 1, mostCommon);
};

const oxygenGeneratorRating = findRarting(data, 0, true);
const co2Rating = findRarting(data, 0, false);
console.log(oxygenGeneratorRating * co2Rating);
