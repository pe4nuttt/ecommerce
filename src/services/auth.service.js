'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const shopModel = require('../models/shop.model');
const KeyTokenService = require('../services/keyToken.service');
const { createTokenPair } = require('../utils/authUtils');
const { getInfoData } = require('../utils');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // Step 1: Check email existed or not
      const shop = await shopModel.findOne({ email }).lean();
      if (shop) {
        return {
          code: 'xxxx',
          message: 'Shop already existed!',
        };
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // create privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
        });

        console.log({ privateKey, publicKey });

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: 'xxxx',
            message: 'publicKeyString error',
          };
        }

        // const publicKeyObject = crypto.createPublicKey(publicKeyString);

        // create token pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyString,
          // publicKeyObject,
          privateKey,
        );
        console.log('Created tokens successfully:', tokens);

        return {
          code: 201,
          data: {
            shop: getInfoData({
              fields: ['_id', 'name', 'email'],
              object: newShop,
            }),
            tokens,
          },
        };
      }

      return {
        code: 200,
        data: null,
      };
    } catch (err) {
      return {
        code: 'xxx',
        message: err.message,
        status: 'error',
      };
    }
  };
}

module.exports = AccessService;
