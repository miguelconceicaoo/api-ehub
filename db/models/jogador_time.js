'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jogador_time extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  jogador_time.init({
    id_jogador: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'jogador_time',
  });
  return jogador_time;
};