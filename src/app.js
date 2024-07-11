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
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;

  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || `Internal Server Error`,
  });
});

module.exports = app;
