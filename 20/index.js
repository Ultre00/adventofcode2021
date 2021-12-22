const { getInput } = require("../shared");
const raw = getInput("20/input.txt");

let [algorithm, data] = raw.split("\r\n\r\n");
algorithm = algorithm.replace(/#/g, "1").replace(/\./g, "0");
const input = data
  .split("\r\n")
  .map((m) => m.replace(/#/g, "1").replace(/\./g, "0"));

const printImage = (image) => {
  console.log("Image: ");
  console.log(
    image.map((m) => m.replace(/1/g, "#").replace(/0/g, ".")).join("\r\n")
  );
  console.log("");
};

const getEnhancedPixel = (x, y, image, infiniteFilled) => {
  const toAdd = infiniteFilled ? "1" : "0";
  let bitString = "";
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      bitString += image[y + i]
        ? image[y + i][x + j]
          ? image[y + i][x + j]
          : toAdd
        : toAdd;
    }
  }
  const number = parseInt(bitString, 2);
  let enhanced = algorithm[number];
  return enhanced;
};

const addBorderToImage = (image, infiniteFilled) => {
  const toAdd = infiniteFilled ? "1" : "0";
  let enhanced = new Array(image.length + 2)
    .fill()
    .map((m) => new Array(image[0].length + 2).fill(toAdd));

  for (let y = 0; y < image.length; y++) {
    for (let x = 0; x < image[y].length; x++) {
      enhanced[y + 1][x + 1] = image[y][x];
    }
  }

  enhanced = enhanced.map((m) => m.join(""));
  return enhanced;
};

const enhanceImage = (image, infiniteFilled) => {
  const largerImage = addBorderToImage(image, infiniteFilled);
  const enhanced = JSON.parse(JSON.stringify(largerImage));

  for (let y = 0; y < largerImage.length; y++) {
    for (let x = 0; x < largerImage[y].length; x++) {
      enhanced[y] =
        enhanced[y].substr(0, x) +
        getEnhancedPixel(x, y, largerImage, infiniteFilled) +
        enhanced[y].substr(x + largerImage[y].length);
    }
  }
  return enhanced;
};

const enhance = (image, amount) => {
  let enhanced = JSON.parse(JSON.stringify(image));
  for (let i = 1; i <= amount; i++) {
    enhanced = enhanceImage(enhanced, algorithm[0] === "1" && i % 2 === 0);
  }
  return enhanced;
};

const calculateNumberOfLitPixels = (image) =>
  image.reduce(
    (total, row) =>
      total + row.split("").reduce((sum, cur) => sum + parseInt(cur, 10), 0),
    0
  );

// part1
const part1 = enhance(input, 2);
console.log("part 1:", calculateNumberOfLitPixels(part1));

// part2
const part2 = enhance(input, 50);
console.log("part 2:", calculateNumberOfLitPixels(part2));
