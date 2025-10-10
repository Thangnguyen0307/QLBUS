const fs = require("fs");
const path = require("path");

const docsDir = path.join(__dirname);
let swaggerDocs = "";

fs.readdirSync(docsDir).forEach((file) => {
  if (file.endsWith(".swagger.js")) {
    const content = fs.readFileSync(path.join(docsDir, file), "utf8");
    swaggerDocs += "\n" + content;
  }
});

module.exports = swaggerDocs;
