"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class notifications extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      notifications.belongsTo(models.user, {
        foreignKey: "senderId",
        as: "sender",
      });
      notifications.belongsTo(models.jobs, {
        foreignKey: "jobId",
        as: "job",
      });
    }
  }
  notifications.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      senderId: { type: DataTypes.STRING, allowNull: false },
      receiverId: { type: DataTypes.STRING, allowNull: false },
      jobId: { type: DataTypes.STRING, allowNull: false },
      action: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
      seen: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
    },
    {
      sequelize,
      modelName: "notifications",
    }
  );
  return notifications;
};
