'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jobRequests', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      experience: {
        type: Sequelize.STRING,
        allowNull: false
      },
      education: {
        type: Sequelize.STRING,
        allowNull: false
      },
      languages: {
        type: Sequelize.TEXT,
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
        type: Sequelize.TEXT,
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
        type: Sequelize.STRING,
        allowNull: false
      },
      jobId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('jobRequests');
  }
};