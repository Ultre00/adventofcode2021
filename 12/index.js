const { getInput } = require("../shared");
const raw = getInput("12/input.txt");

const data = raw.split("\r\n").map((m) => m.split("-"));
const nodeMap = {};

const getOrCreateNode = (code) => {
  if (!nodeMap.hasOwnProperty(code)) {
    nodeMap[code] = {
      code,
      type: code === code.toLowerCase() ? "small" : "big",
      nodes: [],
    };
  }
  return nodeMap[code];
};

const calculatePossiblePathsTo = (
  from,
  to,
  skipList = [],
  twiceCode = null
) => {
  const skipListCopy = [...skipList];
  const { type, nodes } = nodeMap[from];

  if (type === "small") {
    skipListCopy.push(from);
  }

  let paths = 0;

  nodes
    .filter(
      (m) =>
        skipListCopy.filter((n) => n === m.code).length <
        (twiceCode === m.code ? 2 : 1)
    )
    .forEach(({ code }) => {
      if (code === to) {
        paths++;
      } else {
        paths += calculatePossiblePathsTo(code, to, skipListCopy, twiceCode);
      }
    });
  return paths;
};

for (const row of data) {
  const from = getOrCreateNode(row[0]);
  const to = getOrCreateNode(row[1]);
  from.nodes.push(to);
  to.nodes.push(from);
}

const part1 = calculatePossiblePathsTo("start", "end");
console.log("part 1: ", part1);

const eligibleTwiceNodes = Object.keys(nodeMap).filter(
  (m) => !["start", "end"].find((n) => n === m) && nodeMap[m].type === "small"
);
const part2 = eligibleTwiceNodes.reduce((sum, code) => {
  const paths = calculatePossiblePathsTo("start", "end", [], code);
  return sum + paths - part1;
}, part1);

console.log("part 2: ", part2);
