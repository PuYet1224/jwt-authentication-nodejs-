'use strict';
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { createTokenPair } = require('../auth/authUtils');
const { users, keyTokens } = require('../dto/data');

class AccessService {
  // Đăng ký
  static async signUp({ name, email, password }) {
    // Kiểm tra nếu user đã tồn tại
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already registered');
    }
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);
    // Tạo user mới
    const newUser = {
      id: crypto.randomBytes(4).toString('hex'),
      name,
      email,
      password: hashedPassword
    };
    users.push(newUser);

    // Tạo key pair cho user
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    // Tạo token pair
    const tokens = await createTokenPair({ userId: newUser.id, email }, publicKey, privateKey);

    // Lưu thông tin key token vào dto
    keyTokens.push({
      userId: newUser.id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
      refreshTokensUsed: []
    });

    return {
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
      tokens
    };
  }

  // Đăng nhập
  static async login({ email, password }) {
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new Error('Invalid credentials');
    }

    // Tạo key pair mới cho phiên đăng nhập
    const privateKey = crypto.randomBytes(64).toString('hex');
    const publicKey = crypto.randomBytes(64).toString('hex');

    // Tạo token pair mới
    const tokens = await createTokenPair({ userId: user.id, email }, publicKey, privateKey);

    // Cập nhật hoặc thêm mới key token cho user
    const existingKeyToken = keyTokens.find(kt => kt.userId === user.id);
    if (existingKeyToken) {
      existingKeyToken.publicKey = publicKey;
      existingKeyToken.privateKey = privateKey;
      existingKeyToken.refreshToken = tokens.refreshToken;
    } else {
      keyTokens.push({
        userId: user.id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
        refreshTokensUsed: []
      });
    }
    return {
      user: { id: user.id, name: user.name, email: user.email },
      tokens
    };
  }

  // Logout: xoá key token của user
  static async logout({ userId }) {
    const index = keyTokens.findIndex(kt => kt.userId === userId);
    if (index !== -1) {
      keyTokens.splice(index, 1);
      return { message: 'Logged out successfully' };
    }
    throw new Error('User not logged in');
  }

  // Refresh token
  static async handleRefreshToken({ userId, refreshToken }) {
    const keyToken = keyTokens.find(kt => kt.userId === userId);
    if (!keyToken) {
      throw new Error('Key token not found for user');
    }
    if (keyToken.refreshToken !== refreshToken) {
      throw new Error('Invalid refresh token');
    }
    if (keyToken.refreshTokensUsed.includes(refreshToken)) {
      // Nếu refresh token đã được sử dụng, thu hồi phiên
      const index = keyTokens.findIndex(kt => kt.userId === userId);
      if (index !== -1) keyTokens.splice(index, 1);
      throw new Error('Refresh token has been used. Please login again.');
    }
    // Tạo token pair mới với key hiện có
    const tokens = await createTokenPair({ userId, email: '' }, keyToken.publicKey, keyToken.privateKey);
    keyToken.refreshTokensUsed.push(refreshToken);
    keyToken.refreshToken = tokens.refreshToken;
    return { tokens };
  }
}

module.exports = AccessService;
