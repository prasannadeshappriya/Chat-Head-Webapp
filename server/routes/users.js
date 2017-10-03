const express = require('express');
const router = express.Router();

//Import controller classes
const userController = require('../app/controller/user.controller');

//User auth (register/login) routes
router.post('/register',userController.register);
router.post('/login', userController.login);

module.exports = router;
