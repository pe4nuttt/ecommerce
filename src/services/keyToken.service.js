'use strict';

const keyTokenModel = require('../models/keyToken.model');

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    // OLD VERSION
    // const tokens = await keyTokenModel.create({
    //   user: userId,
    //   publicKey,
    //   privateKey,
    // });

    // return tokens ? tokens.publicKey : null;

    // NEW VERSION
    const filter = { user: userId },
      updateObj = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      },
      options = { upsert: true, new: true };

    const tokens = await keyTokenModel.findOneAndUpdate(
      filter,
      updateObj,
      options,
    );

    return tokens ? tokens.publicKey : null;
  };
}

module.exports = KeyTokenService;
