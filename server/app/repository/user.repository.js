/**
 * Created by prasanna_d on 10/2/2017.
 */
//Import model files
const userModel = require('../model/user.model');

//Node modules
const passwordHash = require('password-hash');

//Export functions
module.exports = {
    createUser:async function(user, callback){
        //Hash the user password
        user.password = passwordHash.generate(user.password);
        try {
            let result = await userModel.userFindOrCreate(user);
            if (result) {
                if (result[1]) {return callback([201, {message: result[0].dataValues}]);}
                else {return callback(409, {message: 'user already exist'});}
            } else {
                return callback(500, {message: 'internal server error'});
            }
        }catch (err){
            return callback(500, {message: 'internal server error', data: err});
        }
    }
};