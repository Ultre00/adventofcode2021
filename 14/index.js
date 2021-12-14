const { getInput } = require("../shared");
const raw = getInput("14/input.txt");

let [polymerTemplate, pairInsertions] = raw
  .split("\r\n\r\n")
  .map((m, i) => (i === 0 ? m : m.split("\r\n").map((n) => n.split(" -> "))));

const incMapKey = (map, key, v = 1) => map.set(key, (map.get(key) ?? 0) + v);

const getResult = (pairs) => {
  const cnt = new Map();
  pairs.forEach((v, k) => [0, 1].forEach((j) => incMapKey(cnt, k[j], v)));
  const min = Math.ceil(Math.min(...cnt.values()) / 2);
  const max = Math.ceil(Math.max(...cnt.values()) / 2);
  return max - min;
};

let pairs = new Map();
for (let i = 0; i < polymerTemplate.length - 1; i++) {
  incMapKey(pairs, polymerTemplate[i] + polymerTemplate[i + 1]);
}

for (let i = 0; i < 40; i++) {
  const newPairs = new Map();

  pairs.forEach((v, k) => {
    const c1 = k[0];
    const c2 = k[1];

    const match = pairInsertions.find((m) => m[0] === k);
    if (match) {
      incMapKey(newPairs, `${c1}${match[1]}`, v);
      incMapKey(newPairs, `${match[1]}${c2}`, v);
    } else {
      incMapKey(newPairs, `${c1}${c2}`, v);
    }
  });

  pairs = newPairs;

  if (i === 9) {
    console.log("part1: ", getResult(pairs));
  }
  if (i === 39) {
    console.log("part2: ", getResult(pairs));
  }
}
