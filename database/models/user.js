'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    email: {
      type:DataTypes.STRING,
      allowNull: false
    },
    first_name: {
      type:DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type:DataTypes.STRING,
      allowNull: false
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false
    },
    image_id: {
      type:DataTypes.INTEGER
    },
    birthday: {
      type:DataTypes.DATE,
      allowNull: false
    },
    description: {
      type:DataTypes.STRING
    },
    sex: {
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
  return user;
};