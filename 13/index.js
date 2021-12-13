const { getInput } = require("../shared");
const raw = getInput("13/input.txt");

const data = raw.split("\r\n\r\n").map((m) => m.split("\r\n"));
const pointData = data[0].map((m) => m.split(",").map((n) => parseInt(n, 10)));
const foldData = data[1].map((m) =>
  m
    .substring(11)
    .split("=")
    .map((n, i) => (i === 1 ? parseInt(n, 10) : n))
);

console.log(foldData);

const { width, height } = pointData.reduce(
  ({ width, height }, point) => {
    return {
      width: point[0] + 1 > width ? point[0] + 1 : width,
      height: point[1] + 1 > height ? point[1] + 1 : height,
    };
  },
  {
    width: 1,
    height: 1,
  }
);

let origami = new Array(height).fill().map((m) => new Array(width).fill("."));
for ([x, y] of pointData) {
  origami[y][x] = "#";
}

let part1 = 0;
for (const [axis, value] of foldData) {
  if (axis === "y") {
    const reverse = [...origami].reverse();
    for (let i = 0; i < value; i++) {
      origami[i] = origami[i].map((m, j) => (reverse[i][j] === "#" ? "#" : m));
    }
    origami.splice(value, origami.length);
  } else {
    for (let i = 0; i < origami.length; i++) {
      const reverse = [...origami[i]].reverse();
      for (let j = 0; j < value; j++) {
        origami[i][j] = reverse[j] === "#" ? "#" : origami[i][j];
      }
      origami[i].splice(value, origami[i].length);
    }
  }
  if (part1 === 0) {
    part1 = origami.reduce(
      (res, cur) => res + cur.filter((m) => m === "#").length,
      0
    );
  }
}

console.log(part1);
console.log(origami.map((m) => m.join("")).join("\r\n"));
