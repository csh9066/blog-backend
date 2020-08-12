const DataTypes = require('sequelize');
const bcrypt = require('bcrypt');
const { Model } = DataTypes;

class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        username: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: true,
        },
        hashedPassword: {
          type: DataTypes.STRING(200),
          allowNull: false,
        },
      },
      {
        modelName: 'User',
        tableName: 'users',
        charset: 'utf8',
        collate: 'utf8_general_ci', // 한글 저장
        sequelize,
      },
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post);
  }

  async checkPassword(password) {
    const checkedHashPassword = await bcrypt.compare(
      password,
      this.hashedPassword,
    );
    return checkedHashPassword;
  }
}

module.exports = User;
