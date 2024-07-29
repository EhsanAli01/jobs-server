"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      reviews.belongsTo(models.user, {
        foreignKey: "userId",
        as: "user",
      });
      reviews.belongsTo(models.jobs, {
        foreignKey: "jobId",
        as: "jobs",
      });
    }
  }
  reviews.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      starCount: DataTypes.INTEGER,
      message: DataTypes.STRING,
      jobId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "reviews",
    }
  );
  return reviews;
};
