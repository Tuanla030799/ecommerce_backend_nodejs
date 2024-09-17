"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createKeyToken } = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData, getKeyTokenPair } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "000", // SHOP
  WRITER: "001", // WRITER
  EDITOR: "010", // EDITOR
  ADMIN: "011", // ADMIN
};

class AccessService {
  /**
   * 1 - check email in dbs
   * 2 - match password
   * 3 - create AT vs RT and save
   * 4 - generate tokens
   * 5 - get data and return login
   */
  static login = async ({ email, password, refreshToken = null }) => {
    //1.
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("shop not registered");
    //2.
    const match = bcrypt.compare(foundShop.password, password);
    if (!match) throw new AuthFailureError("Authentication error");
    //3.
    const { privateKey, publicKey } = getKeyTokenPair();
    //4.
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );

    await createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // step1: check email exists ??
    const holderShop = await shopModel.findOne({ email }).lean();

    if (holderShop) {
      throw new BadRequestError("Shop already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // created privateKey, publicKey

      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      const { privateKey, publicKey } = getKeyTokenPair();

      // public key crypt graph standard
      const keyStores = await createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStores) {
        return {
          code: "xxx",
          message: "keyStores Errors",
        };
      }

      // created token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "email", "name"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
  };
}

module.exports = AccessService;
