"use strict";

const { default: mongoose } = require("mongoose");
const os = require("node:os");
const process = require("node:process");
const _SECONDS = 5000;

//count connect
const countConnect = () => {
  return mongoose.connections.length;
};

// check over load
const checkOverLoad = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // example maximum number of connections based on number of cores
    const maxConnections = 5 * numCores;

    console.log(`Active connections: ${numConnections}`);
    console.log(`Memory used: ${memoryUsage}`);

    if (numConnections > maxConnections) {
      console.log(`Connection overload detected`);
    }
  }, _SECONDS);
};

module.exports = {
  countConnect,
  checkOverLoad,
};
