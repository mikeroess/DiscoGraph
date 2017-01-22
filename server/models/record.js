'use strict';
module.exports = function(sequelize, DataTypes) {
  var Record = sequelize.define('Record', {
    1950: DataTypes.INTEGER,
    GenreId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Record.belongsTo(models.Genre);
      }
    }
  });
  return Record;
};
