const { getInput } = require("../shared");
const raw = getInput("22/input.txt");

const data = raw.split("\r\n").map((m) =>
  m.split(" ").map((n, i) => {
    if (i == 1) {
      return n.split(",").map((o) => o.substring(2).split("..").map(Number));
    }
    return n;
  })
);

const notIntersecting = ([x, y, z], [xx, yy, zz]) => {
  return (
    Math.max(x[0], xx[0]) > Math.min(x[1], xx[1]) ||
    Math.max(y[0], yy[0]) > Math.min(y[1], yy[1]) ||
    Math.max(z[0], zz[0]) > Math.min(z[1], zz[1])
  );
};

const getSurface = ([x, y, z]) =>
  (Math.abs(x[1] - x[0]) + 1) *
  (Math.abs(y[1] - y[0]) + 1) *
  (Math.abs(z[1] - z[0]) + 1);

const split = ([x, y, z], [xx, yy, zz]) => {
  const cubes = [];

  if (x[0] < xx[0]) {
    cubes.push([[x[0], xx[0] - 1], [...y], [...z]]);
    x[0] = xx[0];
  }
  if (x[1] > xx[1]) {
    cubes.push([[xx[1] + 1, x[1]], [...y], [...z]]);
    x[1] = xx[1];
  }

  if (y[0] < yy[0]) {
    cubes.push([[...x], [y[0], yy[0] - 1], [...z]]);
    y[0] = yy[0];
  }
  if (y[1] > yy[1]) {
    cubes.push([[...x], [yy[1] + 1, y[1]], [...z]]);
    y[1] = yy[1];
  }

  if (z[0] < zz[0]) {
    cubes.push([[...x], [...y], [z[0], zz[0] - 1]]);
  }
  if (z[1] > zz[1]) {
    cubes.push([[...x], [...y], [zz[1] + 1, z[1]]]);
  }

  return cubes;
};

const calculateNumberOfTurnedOnCubes = (map) =>
  map.reduce((sum, cube) => sum + getSurface(cube), 0);

const part1 = () => {
  let cubes = [];

  for (let [type, current] of data) {
    let newCubes = [];

    if (type === "on") {
      newCubes.push(current);
    }

    for (const cube of cubes) {
      if (notIntersecting(cube, current)) {
        newCubes.push(cube);
      } else {
        newCubes.push(...split(cube, current));
      }
    }

    cubes = newCubes;
  }
  console.log(calculateNumberOfTurnedOnCubes(cubes));
};

part1();
