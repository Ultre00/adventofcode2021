const { getInput } = require("../shared");
const raw = getInput("15/input.txt");

let data = raw
  .split("\r\n")
  .map((m) => m.split("").map((n) => parseInt(n, 10)));

let map = new Map([
  [
    `${data.length - 1}.${data.length - 1}`,
    {
      x: data.length - 1,
      y: data.length - 1,
      risk: data[data.length - 1][data.length - 1],
    },
  ],
]);

const tryAddCoordinate = (x, y, coords) => {
  if (
    x > data.length - 1 ||
    x < 0 ||
    y > data.length - 1 ||
    y < 0 ||
    map.has(`${x}.${y}`) ||
    coords.includes((m) => m.x === x && m.y === y)
  ) {
    return;
  }

  coords.push({ x, y });
};

const riskValue = ({ x, y }) => {
  const self = x === 0 && y === 0 ? 0 : data[y][x];
  const toCheck = [];
  if (map.has(`${x + 1}.${y}`)) {
    toCheck.push(map.get(`${x + 1}.${y}`).risk);
  }
  if (map.has(`${x - 1}.${y}`)) {
    toCheck.push(map.get(`${x - 1}.${y}`).risk);
  }
  if (map.has(`${x}.${y + 1}`)) {
    toCheck.push(map.get(`${x}.${y + 1}`).risk);
  }
  if (map.has(`${x}.${y - 1}`)) {
    toCheck.push(map.get(`${x}.${y - 1}`).risk);
  }
  const risk = Math.min(...toCheck);
  return self + risk;
};

const getEligibleCoords = () => {
  let coords = [];
  map.forEach(({ x, y }) => {
    tryAddCoordinate(x + 1, y, coords);
    tryAddCoordinate(x + -1, y, coords);
    tryAddCoordinate(x, y + 1, coords);
    tryAddCoordinate(x, y - 1, coords);
  });
  return coords;
};

const fillNextShortestRoute = () => {
  console.log(map.size);

  let scores = [];
  for (const coord of getEligibleCoords()) {
    scores.push({ ...coord, risk: riskValue(coord) });
  }
  const certainRisk = Math.min(...scores.map((m) => m.risk));
  const toAdd = scores.filter((m) => m.risk === certainRisk);
  for (const score of toAdd) {
    map.set(`${score.x}.${score.y}`, score);
  }
};

// part 1
while (!map.has("0.0")) {
  fillNextShortestRoute();
}
console.log("part1:", map.get("0.0"));

//part 2
let incrementedData = new Array(5).fill().map((m) => new Array(5).fill());

incrementedData[0][0] = data;
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    incrementedData[i][j] = data.map((m) =>
      m.map((n) => ((n + i + j) % 9 === 0 ? 9 : (n + i + j) % 9))
    );
  }
}

const part2Data = new Array(data.length * 5)
  .fill()
  .map(() => new Array(data.length * 5).fill());

for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    for (let k = 0; k < data.length; k++) {
      for (let l = 0; l < data.length; l++) {
        part2Data[data.length * i + k][data.length * j + l] =
          incrementedData[i][j][k][l];
      }
    }
  }
}

data = part2Data;
map = new Map([
  [
    `${data.length - 1}.${data.length - 1}`,
    {
      x: data.length - 1,
      y: data.length - 1,
      risk: data[data.length - 1][data.length - 1],
    },
  ],
]);
while (!map.has("0.0")) {
  fillNextShortestRoute();
}
console.log("part2:", map.get("0.0"));
