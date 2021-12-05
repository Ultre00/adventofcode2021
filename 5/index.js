const { getInput } = require("../shared");
const raw = getInput("5/input.txt");

const data = raw
  .split("\r\n")
  .map((m) => m.match(/\d+/g).map((n) => parseInt(n, 10)))
  .map((m) => ({ from: { x: m[0], y: m[1] }, to: { x: m[2], y: m[3] } }));

let board = new Array(1000).fill().map((m) => new Array(1000).fill(0));

const drawOnBoard = ({ from, to }) => {
  const top = Math.min(from.y, to.y);
  const bot = Math.max(from.y, to.y);
  const left = Math.min(from.x, to.x);
  const right = Math.max(from.x, to.x);

  if (from.x == to.x) {
    for (let y = top; y <= bot; y++) {
      board[y][from.x]++;
    }
  } else if (from.y == to.y) {
    for (let x = left; x <= right; x++) {
      board[from.y][x]++;
    }
    // disable this for part 1
  } else if (bot - top == right - left) {
    for (let i = 0; i <= bot - top; i++) {
      const x = from.x <= to.x ? from.x + i : from.x - i;
      const y = from.y <= to.y ? from.y + i : from.y - i;
      board[y][x]++;
    }
  }
};

for (const row of data) {
  drawOnBoard(row);
}
const amount = board.reduce(
  (rowTotal, row) =>
    rowTotal + row.reduce((colTotal, col) => colTotal + (col > 1 ? 1 : 0), 0),
  0
);
console.log(amount);
