'use strict';
module.exports = (sequelize, DataTypes) => {
  var user_images = sequelize.define('user_images', {
    user_id: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type:DataTypes.STRING,
      allowNull: false
    },
    src: {
      type:DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return user_images;
};