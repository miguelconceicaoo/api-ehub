'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class time_liga extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  time_liga.init({
    id_time: DataTypes.INTEGER,
    id_liga: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'time_liga',
  });
  return time_liga;
};