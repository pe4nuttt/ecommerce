'use strict';

const JWT = require('jsonwebtoken');

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // 1. create accessToken & refreshToken via privateKey
    const accessToken = await JWT.sign(payload, publicKey, {
      // algorithm: 'RS256',
      expiresIn: '2 days',
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: 'RS256',
      expiresIn: '7 days',
    });

    // Test
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log('Error verify:', err);
      } else {
        console.log('Decode verify:', decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (err) {}
};

module.exports = {
  createTokenPair,
};
