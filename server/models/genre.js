'use strict';
module.exports = function(sequelize, DataTypes) {
  var Genre = sequelize.define('Genre', {
    title: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Genre.hasOne(models.Record);
      }
    }
  });
  return Genre;
};
