const app = require("./src/app");
const { port } = require("./src/configs/config.mongo");

const server = app.listen(port, () => {
  console.log(`WSV eCommerce start with port ${port}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log(`Exit server express`));
});
