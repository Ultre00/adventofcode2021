const { getInput } = require("../shared");
const raw = getInput("8/input.txt");

const orderValue = (value) => value.split("").sort().join("");

const data = raw
  .split("\r\n")
  .map((row) => row.split(" | ").map((m) => m.split(" ").map(orderValue)));

const allOff = (value, toCompare) => {
  return amountOff(value, toCompare, toCompare.length);
};

const amountOff = (value, toCompare, amount) => {
  return (
    value.split("").filter((m) => toCompare.split("").includes(m)).length ===
    amount
  );
};

const generateMap = (signal) => {
  let map = {};
  let remainder = [...signal];

  const apply = (filter, value) => {
    const match = remainder.find(filter);
    remainder = remainder.filter((m) => m !== match);
    map[match] = value;
    return match;
  };

  const one = apply((m) => m.length === 2, 1);
  const four = apply((m) => m.length === 4, 4);
  const seven = apply((m) => m.length === 3, 7);
  const eight = apply((m) => m.length === 7, 8);
  const three = apply((m) => m.length === 5 && allOff(m, one), 3);
  const nine = apply((m) => m.length === 6 && allOff(m, three), 9);
  const zero = apply((m) => m.length === 6 && allOff(m, seven), 0);
  const six = apply((m) => m.length === 6, 6);
  const five = apply((m) => amountOff(m, six, 5), 5);
  const two = apply((m) => m, 2);

  return map;
};

// part 1
let result = 0;
for (const row of data) {
  const map = generateMap(row[0]);
  for (const value of row[1]) {
    result += [1, 4, 7, 8].includes(map[value]) ? 1 : 0;
  }
}
console.log(result);

// part 2
result = data.reduce((sum, row) => {
  const map = generateMap(row[0]);
  const value = row[1].reduce((res, cur) => res + map[cur], "");
  return sum + parseInt(value, 10);
}, 0);
console.log(result);
