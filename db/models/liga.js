'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class liga extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here  
      // liga.belongsTo(models.regiao, {
      //   foreignKey: 'id_regiao',
      //   onDelete: 'CASCADE'
      // })
    }
  }
  liga.init({
    nome_liga: DataTypes.STRING,
    edicao: DataTypes.STRING,
    jogos: DataTypes.STRING,
    id_regiao: DataTypes.INTEGER,

  }, {
    sequelize,
    modelName: 'liga',
  });
  return liga;
};


// 'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class liga extends Model {
//     /**
     
// Helper method for defining associations.
// This method is not a part of Sequelize lifecycle.
// The models/index file will call this method automatically.*/
// static associate(models) {// define association here
//   liga.belongsTo(models.regiao, {
//     foreignKey: 'regiaoId',
//     onDelete: 'CASCADE',
//     as: 'regiao'});}
// }
// liga.init({
//   nome_liga: DataTypes.STRING,
//   regiaoId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: 'regiao',
//       key: 'id'}}}, {
//   sequelize,
//   modelName: 'liga',});
// return liga;
// };