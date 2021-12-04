const { getInput } = require("../shared");
const raw = getInput("4/input.txt");

const [numbersRaw, ...boardsRaw] = raw.split("\r\n\r\n");
const numbers = numbersRaw.split(",").map((m) => parseInt(m, 10));

const boards = boardsRaw.map((m) =>
  m.split("\r\n").map((n) =>
    n
      .split(" ")
      .filter((n) => n != "")
      .reduce(
        (res, cur) => [...res, { number: parseInt(cur, 10), checked: false }],
        []
      )
  )
);

const updateBoardsWithNumber = (number) => {
  for (let board of boards.filter((m) => !m.winningIndex)) {
    board = board.map((m) => {
      const match = m.find((n) => n.number == number);
      if (match) {
        match.checked = true;
      }
    });
  }
};

const hasHorizontalBingo = (board) => {
  for (let i = 0; i < board.length; i++) {
    if (Object.values(board[i]).every((m) => m.checked)) {
      return true;
    }
  }

  return false;
};

const hasVerticalBingo = (board) => {
  for (let i = 0; i < board.length; i++) {
    if (board.every((m) => m[i].checked)) {
      return true;
    }
  }

  return false;
};

const checkBoards = (number) => {
  for (let board of boards.filter((m) => !m.winningIndex)) {
    if (hasHorizontalBingo(board) || hasVerticalBingo(board)) {
      board.winningNumber = number;
      board.winningIndex =
        Math.max(...boards.map((m) => m.winningIndex || 0)) + 1;
    }
  }
};

const getWinningBoardResultCalculation = (board) => {
  const unmarked = board.reduce(
    (res, cur) => [
      ...res,
      ...cur
        .filter((m) => m.checked == false)
        .map((m) => parseInt(m.number, 10)),
    ],
    []
  );
  const unmarkedSum = unmarked.reduce((res, cur) => res + cur, 0);
  const result = unmarkedSum * board.winningNumber;
  return result;
};

for (const number of numbers) {
  updateBoardsWithNumber(number);
  checkBoards(number);
}

// part 1
const firstResult = getWinningBoardResultCalculation(
  boards.find((m) => m.winningIndex == 1)
);
console.log(firstResult);

// part 2
const lastBoard = boards.find(
  (m) => m.winningIndex == Math.max(...boards.map((n) => n.winningIndex || 0))
);
const lastResult = getWinningBoardResultCalculation(lastBoard);
console.log(lastResult);
