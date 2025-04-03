'use strict';
const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/access.controller');

router.post('/shop/signup', accessController.signUp);
router.post('/shop/login', accessController.login);
router.post('/shop/logout', accessController.logout);
router.post('/shop/refresh-token', accessController.handleRefreshToken);

module.exports = router;
