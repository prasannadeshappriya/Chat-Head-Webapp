const express = require('express');
const router = express.Router();

//Import controller classes
const userController = require('../app/controller/user.controller');

//User auth (register/login) routes
router.get('/register', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/login', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports = router;
