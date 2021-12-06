const { getInput } = require("../shared");
const raw = getInput("6/input.txt");

const data = raw.split(",").map((m) => parseInt(m, 10));

const calculateAmountForPoolSize = (amount, days, depth = 0) => {
  if (days <= 0) return 0;
  if (days <= 7) return amount;

  const generations = Math.ceil(days / 7);
  const newChildren = amount * generations;
  let grandChildren = 0;
  for (let i = 1; i <= generations; i++) {
    if (depth == 0) {
      console.log(`checking generation ${i} of ${generations}`);
    }
    const grandChildrenToAdd = calculateAmountForPoolSize(
      amount,
      days - (i == 1 ? 9 : (i - 1) * 7 + 9),
      depth + 1
    );
    grandChildren += grandChildrenToAdd;
  }

  return (depth > 0 ? 0 : amount) + newChildren + grandChildren;
};

const getAmountOfFishAfter = (days) => {
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    const filtered = data.filter((m) => m === i);
    if (filtered.length) {
      console.log(
        `checking ${filtered.length} fishes with number of days: ${i}`
      );
      sum += calculateAmountForPoolSize(filtered.length, days - i);
    }
  }
  return sum;
};

console.log(getAmountOfFishAfter(256));
