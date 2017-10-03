/**
 * Created by prasanna_d on 10/2/2017.
 */
//Import repository files
const userRepository = require('../repository/user.repository');

//Export functions
module.exports = {
    register: async function(req,res){
        if(typeof req.body === 'undefined'){
            return res.status(400).json({
                message: 'email, firstname, lastname, gender and password fields are required'
            });
        }
        let user_email = req.body.user_email;
        let user_firstname = req.body.user_firstname;
        let user_lastname = req.body.user_lastname;
        let user_gender = req.body.user_gender;
        let user_password = req.body.user_password;
        if(typeof user_email==='undefined'||
            user_email.replace(/\s+/, "") === ''){
            return res.status(400).json({message: 'user email is required'});}
        if(typeof user_lastname==='undefined'||
            user_lastname.replace(/\s+/, "") === ''){
            return res.status(400).json({message: 'user lastname is required'});}
        if(typeof user_firstname==='undefined'||
            user_firstname.replace(/\s+/, "") === ''){
            return res.status(400).json({message: 'user firstname is required'});}
        if(typeof user_gender==='undefined'||
            user_gender.replace(/\s+/, "") === ''){
            return res.status(400).json({message: 'user gender is required'});}
        if(typeof user_password==='undefined'||
            user_password.replace(/\s+/, "") === ''){
            return res.status(400).json({message: 'user password is required'});}
        let user = {
            email: user_email,
            first_name: user_firstname,
            last_name: user_lastname,
            gender: user_gender,
            password: user_password
        };
        userRepository.createUser(
            user, function(response_code, result){
                return res.status(response_code).json(result);
            });
    },

    login: async function(req,res){
        if(typeof req.body === 'undefined'){
            res.status(400).json({message: 'email, password fields are required'});
        }
        let user_email = req.body.user_email;
        let user_password = req.body.user_password;
        if(typeof user_email==='undefined'||
            user_email.replace(/\s+/, "") === ''){
            return res.status(400).json({message: 'user email is required'});}
        if(typeof user_password==='undefined'||
            user_password.replace(/\s+/, "") === ''){
            return res.status(400).json({message: 'user password is required'});}
        let user = {email: user_email, password: user_password};
        userRepository.userLogin(
            user, function(response_code, result){
                return res.status(response_code).json(result);
            });
    }
};