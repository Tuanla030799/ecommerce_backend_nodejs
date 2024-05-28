"use strict";

const { default: mongoose } = require("mongoose");

const connectString = `mongodb://localhost:27017/test`;

mongoose
  .connect(connectString)
  .then((_) => {
    console.log(`Connected mongodb success`);
  })
  .catch((err) => console.log(`Error connect: ${err}`));

//dev

if (1 === 1) {
  mongoose.set("debug", true);
  mongoose.set("debug", { colors: true });
}

module.exports = mongoose;
