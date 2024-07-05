"use strict";

const { findById } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error key",
      });
    }

    //check objKey
    const objKey = await findById(key);

    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error obj key",
      });
    }

    req.objKey = objKey;

    return next();
  } catch (error) {
    console.log("first error", error);
  }
};

const permission = (permission) => {
  // using closure
  // closure is function returns a function that func have use variables at father function
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "permission denied",
      });
    }

    const validPermission = req.objKey.permissions.includes(permission);

    if (!validPermission) {
      return res.status(403).json({
        message: "permission denied validPermission",
      });
    }

    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
