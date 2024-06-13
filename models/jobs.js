'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jobs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      jobs.hasMany(models.jobRequest, {
        foreignKey: 'jobId',
        as: 'jobRequest'
      })
      jobs.belongsTo(models.user, {
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }
  jobs.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subCategory: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    images: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue('images');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('images', JSON.stringify(value));
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'jobs',
  });
  return jobs;
};