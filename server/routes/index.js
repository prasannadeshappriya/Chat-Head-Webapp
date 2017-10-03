const express = require('express');
const router = express.Router();
const passport = require('../app/middleware/passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html');
});

//Check server status with the message
router.get('/admin/verify', function(req, res, next) {
    let server_status = 200;
    let server_status_message = {
        server_status: "Server is working on http://localhost:4000/"
    };
    return res.status(server_status).json(server_status_message);
});

//Verify user token and server status
router.get(
    "/admin/verify/user",
    passport.authenticate('jwt', {session :false}),
    function (req,res) {
        let server_status = 200;
        let server_status_message = {
          server_status: "Server is working on http://localhost:4000/",
          user_details: {
              first_name: req.user.dataValues.first_name,
              last_name: req.user.dataValues.last_name,
              email: req.user.dataValues.email,
          }
        };
        return res.status(server_status).json(server_status_message);
    }
);

module.exports = router;
