const { getInput } = require("../shared");
const raw = getInput("18/input.txt");

let data = raw.split("\r\n").map((row) => JSON.parse(row));

let itterator = data.shift();

const print = (action) => {
  console.log(action, JSON.stringify(itterator));
};

const handleAddition = () => {
  if (data.length) {
    let right = data.shift();
    itterator = [itterator, right];
    return true;
  }

  return false;
};

const handleExplode = () => {
  const bubble = (part, depth) => {
    if (depth >= 5 && !Array.isArray(part[0]) && !Array.isArray(part[1])) {
      return { left: part[0], right: part[1], exploded: true };
    }

    let result = null;
    for (let i = 0; i < part.length; i++) {
      if (Array.isArray(part[i])) {
        result = result ?? bubble(part[i], depth + 1);
        if (result?.exploded) {
          part[i] = result.exploded ? "*" : part[i];
          delete result.exploded;
          return result;
        }
      }
    }

    return result;
  };

  const result = bubble(itterator, 1);

  if (result) {
    let json = JSON.stringify(itterator);
    const explodeIndex = json.indexOf("*");
    if (explodeIndex > -1) {
      var matches = Array.from(json.matchAll(/\d+/g));
      const left = matches.reduce(
        (res, cur) =>
          cur.index > (res?.index ?? -1) && cur.index < explodeIndex
            ? cur
            : res,
        null
      );
      const right = matches.reduce(
        (res, cur) =>
          cur.index < (res?.index ?? Number.MAX_SAFE_INTEGER) &&
          cur.index > explodeIndex
            ? cur
            : res,
        null
      );

      let resultJson = json;
      if (left) {
        const newLeft = (parseInt(left[0], 10) + result.left).toString();
        resultJson =
          resultJson.slice(0, left.index) +
          newLeft +
          resultJson.slice(left.index + left[0].length);
      }

      if (right) {
        const grownAmount = resultJson.length - json.length;
        const rightIndex = grownAmount + right.index;
        const newRight = (parseInt(right[0], 10) + result.right).toString();
        resultJson =
          resultJson.slice(0, rightIndex) +
          newRight +
          resultJson.slice(rightIndex + right[0].length);
      }
      resultJson = resultJson.replace('"*"', "0");
      itterator = JSON.parse(resultJson);
    }
  }

  return !!result;
};

const handleSplit = () => {
  const bubble = (part) => {
    let result = false;
    for (let i = 0; i < part.length; i++) {
      if (!result && !Array.isArray(part[i]) && part[i] >= 10) {
        const left = Math.floor(part[i] / 2);
        const right = Math.ceil(part[i] / 2);
        part[i] = [left, right];
        result = true;
      } else {
        result = result || bubble(part[i]);
      }
    }

    return result;
  };

  const result = bubble(itterator);
  return !!result;
};

const cycleEvents = (debug) => {
  while (handleAddition()) {
    if (debug) {
      print("add");
    }
    let changes = true;
    while (changes) {
      let newChanges = false;
      while (handleExplode()) {
        if (debug) {
          print("explode");
        }
        newChanges = true;
      }
      if (handleSplit()) {
        if (debug) {
          print("split");
        }
        newChanges = true;
      }
      changes = newChanges;
    }
  }
};

const calculateMagnitude = () => {
  const bubble = (part) => {
    return (
      3 * (Array.isArray(part[0]) ? bubble(part[0]) : part[0]) +
      2 * (Array.isArray(part[1]) ? bubble(part[1]) : part[1])
    );
  };

  return bubble(itterator);
};

// part 1
// cycleEvents();
// console.log(calculateMagnitude());

//part 2
let max = 0;
part2Data = raw.split("\r\n").map((row) => JSON.parse(row));
for (let i = 0; i < part2Data.length; i++) {
  for (let j = 0; j < part2Data.length; j++) {
    if (i === j) {
      continue;
    }
    itterator = JSON.parse(JSON.stringify(part2Data[i]));
    data = [JSON.parse(JSON.stringify(part2Data[j]))];
    cycleEvents();
    const res = calculateMagnitude();
    max = res > max ? res : max;
  }
}
console.log(max);
