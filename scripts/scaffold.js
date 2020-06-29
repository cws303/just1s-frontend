const path = require("path");
const fs = require("fs");

const bootstrap = async () => {
  const params = process.argv.splice(2);
  if (params.length === 0) {
    console.log("usage : npm run scaffold -- <model name>");
    return;
  }
  const SCAFFOLD_PATH = "../../just1s-backend/src/scaffold";
  const filePath = path.join(SCAFFOLD_PATH, params[0] + ".json");
  try {
    const jsonFile = await fs.readFileSync(path.resolve(__dirname, filePath));
    const input = JSON.parse(jsonFile);
    parseInput(input);
  } catch (e) {
    console.log(e);
  }
};
bootstrap();

const parseInput = input => {
  console.dir(input, { depth: null });
};
