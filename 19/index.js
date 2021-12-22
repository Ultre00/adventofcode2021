const { getInput } = require("../shared");
const raw = getInput("19/input.txt");

let data = raw.split("\r\n\r\n").map((m, i) => [
  i,
  m
    .split("\r\n")
    .slice(1)
    .map((n) => n.split(",").map((o) => parseInt(o, 10))),
]);

const radians = (angle) => (Math.PI / 180) * angle;

const rotateX = (scanner, degrees) => {
  return scanner.map(([x, y, z]) => {
    const yy = y * Math.cos(radians(degrees)) - z * Math.sin(radians(degrees));
    const zz = z * Math.cos(radians(degrees)) + y * Math.sin(radians(degrees));
    return [x, Math.round(yy), Math.round(zz)];
  });
};

const rotateY = (scanner, degrees) => {
  return scanner.map(([x, y, z]) => {
    const xx = x * Math.cos(radians(degrees)) + z * Math.sin(radians(degrees));
    const zz = z * Math.cos(radians(degrees)) - x * Math.sin(radians(degrees));
    return [Math.round(xx), y, Math.round(zz)];
  });
};

const rotateZ = (scanner, degrees) => {
  return scanner.map(([x, y, z]) => {
    const xx = x * Math.cos(radians(degrees)) - y * Math.sin(radians(degrees));
    const yy = y * Math.cos(radians(degrees)) + x * Math.sin(radians(degrees));
    return [Math.round(xx), Math.round(yy), z];
  });
};

const rotate = (scanner, [x, y, z]) =>
  rotateX(rotateY(rotateZ(scanner, z), y), x);

const distance = ([x1, y1, z1], [x2, y2, z2]) =>
  Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));

const getAllDistancesForCoord = (coord, collectionToCheck) =>
  collectionToCheck.map((m) => distance(m, coord));

const findMatchingBeacons = (index) => {
  const distanceMap = distanceMaps.get(index);

  let map = [];

  for (let k = 0; k < distanceMap.size; k++) {
    for (let l = 0; l < totalDistanceMap.size; l++) {
      const matches = Array.from(distanceMap.get(k).values()).filter((m) =>
        Array.from(totalDistanceMap.get(l).values()).includes(m)
      );
      if (matches.length >= 11) {
        map.push([beacons[l], data.find((m) => m[0] === index)[1][k]]);
      }
    }
  }

  if (map.length >= 12) {
    return map;
  }
};

const findRelativeCoordinate = (a, b) => {
  const result = a.map(([x, y, z], i) => {
    [x2, y2, z2] = b[i];
    return [x2 - x, y2 - y, z2 - z];
  });

  if (result.every((m) => JSON.stringify(m) === JSON.stringify(result[0]))) {
    return result[0];
  }
  return null;
};

const findRotationAndRelativeCoordinate = (matchingsBeacons) => {
  let rotation = [0, 0, 0];
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      for (let z = 0; z < 4; z++) {
        rotation = [x * 90, y * 90, z * 90];
        const rotated = rotate(
          matchingsBeacons.map((m) => m[1]),
          rotation
        );
        const relativeCoordinate = findRelativeCoordinate(
          rotated,
          matchingsBeacons.map((m) => m[0])
        );
        if (relativeCoordinate) {
          return [rotation, relativeCoordinate];
        }
      }
    }
  }
};

const manhattan = ([x, y, z], [x2, y2, z2]) =>
  Math.abs(x - x2) + Math.abs(y - y2) + Math.abs(z - z2);

const distanceMaps = data.reduce((map, [i, scanner]) => {
  map.set(
    i,
    scanner.reduce((map, coord, j) => {
      map.set(
        j,
        getAllDistancesForCoord(
          coord,
          data[i][1].filter((m) => m !== coord)
        )
      );
      return map;
    }, new Map())
  );
  return map;
}, new Map());

let totalDistanceMap = distanceMaps.get(0);
const beacons = [...data.splice(0, 1)[0][1]];
const scanners = [[0, 0, 0]];

while (data.length) {
  for (let i = 0; i < data.length; i++) {
    const reader = data[i];
    const matchingsBeacons = findMatchingBeacons(reader[0]);
    if (matchingsBeacons) {
      const [rotation, [x, y, z]] =
        findRotationAndRelativeCoordinate(matchingsBeacons);
      const translated = rotate(reader[1], rotation).map(([xx, yy, zz]) => [
        x + xx,
        y + yy,
        z + zz,
      ]);

      const distinct = translated.filter(
        (m) => !beacons.find((n) => JSON.stringify(n) === JSON.stringify(m))
      );

      beacons.push(...distinct);
      scanners.push([x, y, z]);
      totalDistanceMap = beacons.reduce((map, coord, j) => {
        map.set(
          j,
          getAllDistancesForCoord(
            coord,
            beacons.filter((m) => JSON.stringify(m) !== JSON.stringify(coord))
          )
        );
        return map;
      }, new Map());
      data.splice(i, 1);
    }
  }
}

console.log("part1:", beacons.length);
console.log(
  "part2:",
  scanners.reduce((max, cur, i) => {
    let m = 0;
    for (let j = 0; j < scanners.length; j++) {
      if (i !== j) {
        const _m = manhattan(cur, scanners[j]);
        m = m > _m ? m : _m;
      }
    }
    return max > m ? max : m;
  }, 0)
);
