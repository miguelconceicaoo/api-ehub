'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class noticia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  noticia.init({
    id_liga: DataTypes.INTEGER,
    portal_noticia: DataTypes.STRING,
    noticia_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'noticia',
  });
  return noticia;
};