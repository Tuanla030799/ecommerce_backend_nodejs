"use strict";

const { default: mongoose } = require("mongoose");
const { countConnect } = require("../helper/check.connect");
const { db } = require("../configs/config.mongo");

const connectString = `mongodb://${db.host}:${db.port}/${db.name}`;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (type === "mongodb") {
      mongoose
        .connect(connectString)
        .then((_) => {
          console.log(`Connected ${connectString} success:`, countConnect());
        })
        .catch((err) => console.log(`Error connect: ${err}`));

      if (1 === 1) {
        mongoose.set("debug", true);
        mongoose.set("debug", { colors: true });
      }
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongoDb = Database.getInstance();

module.exports = mongoose;

//dev

module.exports = mongoose;
