"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Like.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          hooks: true,
        },
      });
      models.Like.belongsTo(models.Post, {
        foreignKey: {
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          hooks: true,
        },
      });
      models.Like.belongsTo(models.Comment, {
        foreignKey: {
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          hooks: true,
        },
      });
    }
  }
  Like.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      CommentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Comment",
          key: "id",
        },
      },
      PostId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Post",
          key: "id",
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "id",
        },
      },
      userIdLike: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Like",
    }
  );
  return Like;
};
