'use strict';
module.exports = (sequelize, DataTypes) => {
  var account_settings = sequelize.define('account_settings', {
    user_id: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    show_birthday: {
      type:DataTypes.BOOLEAN,
      allowNull: false
    },
    show_sex: {
      type:DataTypes.BOOLEAN,
      allowNull: false
    },
    show_email: {
      type:DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return account_settings;
};