const { getInput } = require("../shared");
const raw = getInput("2/input.txt");
const data = raw.split("\r\n").map((m) => {
  const parts = m.split(" ");
  return {
    dir: parts[0],
    amount: parseInt(parts[1], 10),
  };
});

// part 1
let result = data.reduce(
  (res, cur) => {
    switch (cur.dir) {
      case "forward":
        return { ...res, horizontal: res.horizontal + cur.amount };
      case "down":
        return { ...res, depth: res.depth + cur.amount };
      case "up":
        return { ...res, depth: res.depth - cur.amount };
      default:
        break;
    }
  },
  { horizontal: 0, depth: 0 }
);

console.log(result.horizontal * result.depth);

//part 2
result = data.reduce(
  (res, cur) => {
    switch (cur.dir) {
      case "forward":
        return {
          ...res,
          horizontal: res.horizontal + cur.amount,
          depth: res.depth + res.aim * cur.amount,
        };
      case "down":
        return { ...res, aim: res.aim + cur.amount };
      case "up":
        return { ...res, aim: res.aim - cur.amount };
      default:
        break;
    }
  },
  { horizontal: 0, depth: 0, aim: 0 }
);

console.log(result.horizontal * result.depth);
