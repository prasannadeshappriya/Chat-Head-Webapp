/**
 * Created by prasanna_d on 10/2/2017.
 */
//Import model files
const userModel = require('../model/user.model');

//Node modules
const passwordHash = require('password-hash');
const jwt = require('jsonwebtoken');
const jwt_config = require('../../../config/config');

//Export functions
module.exports = {
    createUser:async function(user, callback){
        //Hash the user password
        user.password = passwordHash.generate(user.password);
        try {
            let result = await userModel.userFindOrCreate(user);
            if (result) {
                if (result[1]) {return callback(201, {message: result[0].dataValues});}
                else {return callback(409, {message: 'user already exist'});}
            } else {
                return callback(500, {message: 'internal server error'});
            }
        }catch (err){
            return callback(500, {message: 'internal server error', data: err.RangeError});
        }
    },

    userLogin:async function(user, callback){
        try {
            let user_model = await userModel.userFindOne(user);
            if (user_model) {
                if (passwordHash.verify(user.password, user_model.dataValues.password)) {
                    //Create the login token
                    let token = jwt.sign({user: user_model.dataValues}, jwt_config.secret, {
                        expiresIn: 60 * 60 * 24   //Token expire in 24 Hours
                    });
                    return callback(200, {token: token, user: user_model.dataValues});
                } else {
                    return callback(401, {message: 'invalid user credentials'})
                }
            } else {
                return callback(400, {message: 'email is not belongs to any account'})
            }
        }catch (err){
            return callback(500, {message: 'internal server error', data: err.RangeError});
        }
    }
};