/**
 * Created by prasanna_d on 7/12/2017.
 */
const passport = require("passport");
const passportJWT = require("passport-jwt");

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const config = require('../../../config/config');
const models = require('../../database/models');

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = config.secret;

const strategy = new JwtStrategy(jwtOptions, async function(jwt_payload, next) {
    console.log('Request Received', JSON.stringify(jwt_payload));
    try {
        let user = await models.users.findOne({
            where: {
                email: jwt_payload.user.email
            }
        });
        if(user){next(null,user);}
        else{next(null,false)}
    }catch (err){
        console.log('Error occured: ', err);
    }
});

passport.use(strategy);
module.exports = passport;