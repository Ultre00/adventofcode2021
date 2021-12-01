const { getInput } = require("../shared");
const raw = getInput("1/input.txt");
const data = raw.split("\r\n").map((m) => parseInt(m, 10));

//part 1
let counter = 0;
for (let i = 1; i < data.length; i++) {
  if (data[i] > data[i - 1]) counter++;
}
console.log(counter);

//part2
counter = 0;
let sumData = [];
for (let i = 0; i < data.length - 2; i++) {
  sumData.push(data[i] + data[i + 1] + data[i + 2]);
}
for (let i = 1; i < sumData.length; i++) {
  if (sumData[i] > sumData[i - 1]) counter++;
}
console.log(counter);
