const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { checkOverLoad } = require("./helper/check.connect");

const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());

// init db
require("./dbs/init.db");
// checkOverLoad();
// init routers
app.get("/", (req, res, next) => {
  return res.status(200).json({ message: "Okay" });
});
// handling errors

module.exports = app;
