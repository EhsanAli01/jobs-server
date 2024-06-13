'use strict';
const {
  Model
} = require('sequelize');
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
        foreignKey: 'userId',
        as: 'user'
      })
      jobRequest.belongsTo(models.jobs, {
        foreignKey: 'jobId',
        as: 'jobs'
      })
    }
  }
  jobRequest.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: false
    },
    education: {
      type: DataTypes.STRING,
      allowNull: false
    },
    languages: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue('languages');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('languages', JSON.stringify(value));
      }
    },
    skills: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const value = this.getDataValue('skills');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('skills', JSON.stringify(value));
      }
    },
    reqDescription: {
      type: DataTypes.STRING,
      allowNull: false
    },
    jobId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'jobRequest',
  });
  return jobRequest;
};