'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class noticia_liga extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  noticia_liga.init({
    id_noticia: DataTypes.INTEGER,
    id_liga: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'noticia_liga',
  });
  return noticia_liga;
};