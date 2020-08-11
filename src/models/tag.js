const DataTypes = require('sequelize');
const { Model } = DataTypes;

class Tag extends Model {
  static init(sequelize) {
    return super.init(
      {
        body: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
      },
      {
        modelName: 'Tag',
        tableName: 'tags',
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci', // 이모티콘 저장
        sequelize,
      },
    );
  }

  static associate(db) {
    db.Tag.belongsToMany(db.Post, {
      through: 'PostTag',
    });
  }
}

module.exports = Tag;
