/**
 * Created by prasanna_d on 10/2/2017.
 */
//Import repository files
const model = require('../../database/models');

//Export functions
module.exports = {
    userFindOrCreate: async function(user){
        return await model.users.findOrCreate({
            where: {
                email: user.email
            },
            defaults: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                password: user.password,
                image_id: 0,
                birthday: new Date('1994-08-09'),
                description: '',
                sex: user.gender
            }
        })
    },

    userFindOne: async function(user){
        return await model.users.findOne({
            where: {
                email: user.email
            }
        })
    }
};