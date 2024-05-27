'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class partida_time_liga extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  partida_time_liga.init({
    id_liga: DataTypes.STRING,
    id_time2: DataTypes.STRING,
    id_time1: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'partida_time_liga',
  });
  return partida_time_liga;
};