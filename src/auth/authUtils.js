"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    // verify

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`Error verify::`, err);
      } else {
        console.log(`Decode verify::`, decode);
      }
    });

    //

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(`Error createTokenPair`, error);
  }
};

module.exports = {
  createTokenPair,
};
