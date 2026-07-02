'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }

  Game.init(
    {
      user_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
      score: DataTypes.INTEGER,
      started_at: DataTypes.DATE,
      finished_at: DataTypes.DATE,
      board_data: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: 'Game',
    },
  );

  return Game;
};
