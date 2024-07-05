"use strict";

const apiKeyModel = require("../models/apikey.model");
const crypto = require("crypto");

const findById = async (key) => {
  const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
  // if (!objKey) {
  //   await apiKeyModel.create({
  //     key: crypto.randomBytes(32).toString("hex"),
  //     permissions: ["0000"],
  //   });
  // }

  return objKey;
};

module.exports = {
  findById,
};
