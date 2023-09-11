'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const shopModel = require('../models/shop.model');
const KeyTokenService = require('../services/keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils');
const { BadRequestError, AuthFailureError } = require('../core/error.response');
const { findByEmail } = require('./shop.service');
const catchAsync = require('../utils/catchAsync');

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

const createPrivatePublicKeys = () => {
  const privateKey = crypto.randomBytes(64).toString('hex');
  const publicKey = crypto.randomBytes(64).toString('hex');

  return { privateKey, publicKey };
};

class AccessService {
  static login = async ({ email, password, refreshToken = null }) => {
    // 1. Check if email and password exist

    if (!email || !password) {
      throw new BadRequestError('Please provide email and password');
    }

    // 2. Check if user exist and password correct
    const shop = await findByEmail({ email });
    if (!shop) {
      throw new BadRequestError('Shop is not registered');
    }

    const isPwdMatch = bcrypt.compare(password, shop.password);
    if (!isPwdMatch) {
      throw new AuthFailureError();
    }

    // 3. Create privateKey, publicKey,
    const { privateKey, publicKey } = createPrivatePublicKeys();

    // 4. Generate token, save and send
    const { _id: userId } = shop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey,
    );

    await KeyTokenService.createKeyToken({
      userId: userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    // 5.Get data and return
    return {
      shop: getInfoData({ fields: ['id', 'name', 'email'], object: shop }),
      tokens,
    };
  };

  static signup = async ({ name, email, password }) => {
    // Step 1: Check email existed or not
    const shop = await shopModel.findOne({ email }).lean();
    if (shop) {
      throw new BadRequestError('Error: Shop already registed!');
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // Solution 1: create privateKey, publicKey with rsa
      // create privateKey, publicKey
      // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      // });

      // Solution 2 (easy): create privateKey, publicKey with rsa
      const { privateKey, publicKey } = createPrivatePublicKeys();

      console.log({ privateKey, publicKey });

      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey,
      );
      console.log('Created tokens successfully:', tokens);

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });

      if (!keyStore) {
        return {
          code: 'xxxx',
          message: 'publicKeyString error',
        };
      }
      // const publicKeyObject = crypto.createPublicKey(publicKeyString);

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
  };

  static logout = async keyStore => {
    const delKey = KeyTokenService.removeKeyById(keyStore._id);
    console.log('Log out and delete key:', delKey);
    return delKey;
  };
}

module.exports = AccessService;
