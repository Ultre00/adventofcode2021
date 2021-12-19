const { getInput } = require("../shared");
const raw = getInput("17/input.txt");

let data = raw
  .replace("target area: x=", "")
  .split(", y=")
  .map((m) => m.split("..").map((n) => parseInt(n, 10)));

const boxHeight = Math.abs(data[1][1] - data[1][0]);

const intersects = (x, y) =>
  x >= data[0][0] && x <= data[0][1] && y >= data[1][0] && y <= data[1][1];

const updateProbe = (probe) => {
  let { dx, dy, x, y, highestY } = probe;
  probe.steps.push([x, y]);
  probe.x += dx;
  probe.y += dy;
  probe.dx = dx + (dx > 0 ? -1 : dx < 0 ? 1 : 0);
  probe.dy--;
  probe.highestY = probe.y > highestY ? probe.y : highestY;

  if (intersects(probe.x, probe.y)) {
    probe.landed = true;
  } else {
    probe.unreachable = probe.y < data[1][0] && probe.dy <= 0;
  }
};

const findUsableDX = () => {
  const result = [];

  const simulateDX = (dx) => {
    let x = 0;
    let _dx = dx;
    do {
      x += _dx;
      _dx = _dx + (_dx > 0 ? -1 : _dx < 0 ? 1 : 0);

      if (x >= data[0][0] && x <= data[0][1]) {
        result.push(dx);
        return;
      }

      if (x > data[0][1] || _dx === 0) {
        return;
      }
    } while (true);
  };

  for (let dx = 1; dx <= data[0][1]; dx++) {
    simulateDX(dx);
  }

  return result;
};

const launchProbe = (dx, dy) => {
  let probe = {
    dx,
    dy,
    x: 0,
    y: 0,
    highestY: 0,
    steps: [],
  };

  while (!probe.landed && !probe.unreachable) {
    updateProbe(probe);
  }

  return probe;
};

const scanVelocities = () => {
  const map = new Map();
  for (const dx of findUsableDX()) {
    for (let dy = data[1][0]; dy <= -1 * data[1][0]; dy++) {
      const probe = launchProbe(dx, dy);
      if (probe.landed) {
        map.set(`${dx}.${dy}`, probe);
      }
    }
  }
  return map;
};

const map = scanVelocities();
console.log(
  "part1:",
  Math.max(...Array.from(map.values()).map((m) => m.highestY))
);

console.log("part2:", map.size);
