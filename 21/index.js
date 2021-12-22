const part1 = () => {
  let data = [
    [3, 0],
    [4, 0],
  ];
  let dice = 0;
  let rolls = 0;
  let activePlayer = 0;

  const checkEnd = () => data[0][1] >= 1000 || data[1][1] >= 1000;

  const rollDice = () => {
    dice = (dice % 100) + 1;
    rolls++;
    return dice;
  };

  const turn = () => {
    let sum = data[activePlayer][0];
    for (let i = 0; i < 3; i++) {
      sum += rollDice();
    }
    let space = ((sum - 1) % 10) + 1;
    data[activePlayer][0] = space;
    data[activePlayer][1] += space;
    activePlayer = Math.abs(activePlayer - 1);
  };

  while (!checkEnd()) {
    turn();
  }
  console.log("part1:", rolls * Math.min(...data.map((m) => m[1])));
};

const part2 = () => {
  const wins = [0, 0];
  let games = new Map([["3,4|0,0", 1]]);

  while (games.size) {
    for (let turn = 0; turn <= 1; turn++) {
      const nextGames = new Map();
      for (const [key, gameCount] of games) {
        let [spaces, scores] = key
          .split("|")
          .map((m) => m.split(",").map(Number));
        for (let i = 1; i <= 3; i++) {
          for (let j = 1; j <= 3; j++) {
            for (let k = 1; k <= 3; k++) {
              const nextSpaces = [...spaces];
              nextSpaces[turn] = ((spaces[turn] + i + j + k - 1) % 10) + 1;

              const nextScores = [...scores];
              nextScores[turn] += nextSpaces[turn];

              if (nextScores[turn] >= 21) {
                wins[turn] += gameCount;
                continue;
              }

              const nextState = [nextSpaces, nextScores].join("|");
              nextGames.set(
                nextState,
                (nextGames.has(nextState) ? nextGames.get(nextState) : 0) +
                  gameCount
              );
            }
          }
        }
      }
      games = nextGames;
    }
  }

  console.log("part2:", Math.max(...wins));
};

part2();
