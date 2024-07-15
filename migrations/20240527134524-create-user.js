"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      experience: {
        type: Sequelize.STRING,
      },
      education: {
        type: Sequelize.STRING,
      },
      languages: {
        type: Sequelize.TEXT,
        get() {
          const value = this.getDataValue("languages");
          return value ? JSON.parse(value) : [];
        },
        set(value) {
          this.setDataValue("languages", JSON.stringify(value));
        },
      },
      skills: {
        type: Sequelize.TEXT,
        get() {
          const value = this.getDataValue("skills");
          return value ? JSON.parse(value) : [];
        },
        set(value) {
          this.setDataValue("skills", JSON.stringify(value));
        },
      },
      description: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      reviews: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
