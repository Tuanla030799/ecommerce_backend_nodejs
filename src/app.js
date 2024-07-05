const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { checkOverLoad } = require("./helper/check.connect");
const compression = require("compression");

const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init db
require("./dbs/init.db");
// checkOverLoad();
// init routers
app.use("/", require("./routers"));
// handling errors

module.exports = app;
