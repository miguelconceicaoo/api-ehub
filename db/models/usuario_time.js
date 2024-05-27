'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuario_time extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  usuario_time.init({
    id_usuario: DataTypes.INTEGER,
    id_time: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'usuario_time',
  });
  return usuario_time;
};