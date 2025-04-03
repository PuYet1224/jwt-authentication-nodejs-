'use strict';
const AccessService = require('../services/access.service');

class AccessController {
  async signUp(req, res, next) {
    try {
      const result = await AccessService.signUp(req.body);
      return res.status(201).json({
        message: 'Registered OK!',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await AccessService.login(req.body);
      return res.status(200).json({
        message: 'Login OK!',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const result = await AccessService.logout(req.body);
      return res.status(200).json({
        message: 'Logout OK!',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async handleRefreshToken(req, res, next) {
    try {
      const result = await AccessService.handleRefreshToken(req.body);
      return res.status(200).json({
        message: 'Token refreshed!',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AccessController();
