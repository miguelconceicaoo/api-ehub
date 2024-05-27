'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jogador extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  jogador.init({
    nome_jogador: DataTypes.STRING,
    nacionalidade: DataTypes.STRING,
    funcao: DataTypes.STRING,
    birth: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'jogador',
  });
  return jogador;
};