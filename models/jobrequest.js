"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class jobRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      jobRequest.belongsTo(models.user, {
        foreignKey: "userId",
        as: "user",
      });
      jobRequest.belongsTo(models.jobs, {
        foreignKey: "jobId",
        as: "jobs",
      });
    }
  }
  jobRequest.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      expectedSalary: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false
      },
      jobId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "jobRequest",
    }
  );
  return jobRequest;
};
