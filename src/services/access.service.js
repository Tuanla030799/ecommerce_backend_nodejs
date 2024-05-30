"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { createKeyToken } = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");

const RoleShop = {
  SHOP: "000", // SHOP
  WRITER: "001", // WRITER
  EDITOR: "010", // EDITOR
  ADMIN: "011", // ADMIN
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step1: check email exists ??

      const holderShop = await shopModel.findOne({ email }).lean();

      if (holderShop) {
        return {
          code: "xxxx",
          message: "Shop already registered",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      console.log("newShop", newShop);

      if (newShop) {
        // created privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        // public key crypt graph standard
        const publicKeyString = await createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxx",
            message: "publicKeyString Errors",
          };
        }

        const publicKeyObject = crypto.createPublicKey(publicKeyString);

        console.log(`publicKeyObject`, publicKeyObject);

        // created token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyString,
          privateKey
        );

        console.log(`Created token success::`, tokens);

        return {
          code: 201,
          metadata: {
            shop: newShop,
            tokens,
          },
        };
      }
    } catch (error) {
      return {
        code: "xxxx",
        message: error.message,
      };
    }
  };
}

module.exports = AccessService;
