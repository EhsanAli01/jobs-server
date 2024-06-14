'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.jobs, {
        foreignKey: 'userId',
        as: 'jobs'
      })
      user.hasMany(models.jobRequest, {
        foreignKey: 'userId',
        as: 'jobRequests'
      })
    }
  }
  user.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    experience: {
      type: DataTypes.STRING,
    },
    education: {
      type: DataTypes.STRING,
    },
    languages: {
      type: DataTypes.TEXT,
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
      get() {
        const value = this.getDataValue('skills');
        return value ? JSON.parse(value) : [];
      },
      set(value) {
        this.setDataValue('skills', JSON.stringify(value));
      }
    },
    description: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};