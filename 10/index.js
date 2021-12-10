const { getInput } = require("../shared");
const raw = getInput("10/input.txt");

const data = raw.split("\r\n");

const pairs = [
  ["(", ")"],
  ["[", "]"],
  ["{", "}"],
  ["<", ">"],
];

const findPair = (char) => pairs.find((m) => m[0] === char || m[1] === char);

const findIncompleteStack = (row) => {
  const stack = [];

  for (const char of row.split("")) {
    const pair = findPair(char);
    if (pair[0] === char) {
      stack.push(char);
    } else if (stack.pop() !== pair[0]) {
      return char;
    }
  }

  return stack;
};

const part1Map = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137,
};

const part2Map = {
  ")": 1,
  "]": 2,
  "}": 3,
  ">": 4,
};

let part1 = 0;
let part2 = [];

for (const row of data) {
  const stack = findIncompleteStack(row);
  if (Array.isArray(stack)) {
    part2.push(
      stack
        .reverse()
        .reduce((sum, char) => sum * 5 + part2Map[findPair(char)[1]], 0)
    );
  } else {
    part1 += part1Map[stack];
  }
}
console.log("part1: ", part1);
console.log(
  "part2: ",
  part2.sort((a, b) => (a > b ? 1 : a === b ? 0 : -1))[
    Math.floor(part2.length / 2)
  ]
);
