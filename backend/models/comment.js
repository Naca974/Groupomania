"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Comment.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          hooks: true,
        },
      });
      models.Comment.belongsTo(models.Post, {
        foreignKey: {
          allowNull: false,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          hooks: true,
        },
      });
      models.Comment.hasMany(models.Like,{hooks: true,onDelete: 'CASCADE', onUpdate: 'CASCADE'});

    }
  }
  Comment.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      PostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Post",
          key: "id",
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
      likes: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      commentImageUrl: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
