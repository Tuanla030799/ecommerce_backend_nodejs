"use strict";

require("dotenv").config();

const nodeEnv = process.env.NODE_ENV || "dev";

const port = process.env.PORT || 3000;

const dbDev = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 27017,
  name: process.env.DB_NAME || "db_dev",
};

const dbPro = {
  host: process.env.PRO_DB_HOST || "localhost",
  port: process.env.PRO_DB_PORT || 27017,
  name: process.env.PRO_DB_NAME || "db_pro",
};

const db = nodeEnv === "dev" ? dbDev : dbPro;

const config = { port, db };

module.exports = config;
