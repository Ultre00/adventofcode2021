const { getInput } = require("../shared");
const raw = getInput("16/input.txt");

let data = raw
  .split("")
  .map((m) => parseInt(m, 16).toString(2).padStart(4, "0"))
  .join("")
  .split("");

processPackage = () => {
  const version = parseInt(data.splice(0, 3).join(""), 2);
  const id = parseInt(data.splice(0, 3).join(""), 2);
  let package = {
    version,
    id,
  };

  if (id === 4) {
    package.value = processLiteral();
  } else {
    package.packages = processOperator();
    switch (id) {
      case 0:
        package.value = package.packages.reduce(
          (sum, { value }) => sum + value,
          0
        );
        break;
      case 1:
        package.value = package.packages.reduce(
          (product, { value }) => product * value,
          1
        );
        break;
      case 2:
        package.value = package.packages.reduce(
          (min, { value }) => (value < min ? value : min),
          Number.MAX_SAFE_INTEGER
        );
        break;
      case 3:
        package.value = package.packages.reduce(
          (max, { value }) => (value > max ? value : max),
          0
        );
        break;
      case 5:
        package.value =
          package.packages[0].value > package.packages[1].value ? 1 : 0;
        break;
      case 6:
        package.value =
          package.packages[0].value < package.packages[1].value ? 1 : 0;
        break;
      case 7:
        package.value =
          package.packages[0].value === package.packages[1].value ? 1 : 0;
        break;
    }
  }

  return package;
};

processLiteral = () => {
  const bytes = [];
  let end = false;

  while (!end) {
    end = data.splice(0, 1)[0] === "0";
    bytes.push(...data.splice(0, 4));
  }

  return parseInt(bytes.join(""), 2);
};

processOperator = () => {
  const type = data.splice(0, 1)[0];
  const packets = [];

  if (type === "0") {
    const length = parseInt(data.splice(0, 15).join(""), 2);
    let dataLengthGoal = data.length - length;

    while (data.length != dataLengthGoal) {
      packets.push(processPackage());
    }
  } else {
    const numberOfPackets = parseInt(data.splice(0, 11).join(""), 2);
    for (let i = 0; i < numberOfPackets; i++) {
      packets.push(processPackage());
    }
  }

  return packets;
};

const flattenPackage = ({ packages, ...package }, map = []) => {
  map.push(package);

  if (packages) {
    packages.forEach((m) => flattenPackage(m, map));
  }

  return map;
};

const package = processPackage();
const flattenedPackage = flattenPackage(package);

console.log(
  "part1:",
  flattenedPackage.reduce((sum, { version }) => sum + version, 0)
);

console.log("part2:", flattenedPackage, package.value);
