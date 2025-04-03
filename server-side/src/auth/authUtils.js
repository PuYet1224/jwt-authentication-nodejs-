'use strict';
const JWT = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Tạo cặp token: Access Token (JWT) và Refresh Token (opaque token)
 * Access Token được tạo bằng publicKey, còn Refresh Token là chuỗi ngẫu nhiên.
 */
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: '2d'
    });
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenExpiresIn = 7 * 24 * 60 * 60 * 1000; 
    const refreshTokenExpiresAt = Date.now() + refreshTokenExpiresIn;
    
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);
    // in hạn RT
    // console.log("Refresh Token expires at:", new Date(refreshTokenExpiresAt).toISOString());
    
    // in hạn AT và giải mã decode đc tạo
    // const decodedAccessToken = JWT.decode(accessToken);
    // const accessTokenExpiresAt = new Date(decodedAccessToken.exp * 1000);
    // console.log("Access Token expires at:", accessTokenExpiresAt.toISOString());

    return { accessToken, refreshToken, refreshTokenExpiresAt };
  } catch (error) {
    throw error;
  }
};

const verifyJWT = async (token, key) => {
  return JWT.verify(token, key);
};

module.exports = { createTokenPair, verifyJWT };
