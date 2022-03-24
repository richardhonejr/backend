const {Sequelize} = require('sequelize');
const config =require("../config/config")

const Task = config.define('Task', {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        },
        task_date: {
            type: Sequelize.STRING,
            allowNull: false
        },
        category: {
            type: Sequelize.STRING,
            allowNull: false
        },
        priority_level: {
            type: Sequelize.ENUM("low", "medium", "high"),
            defaultValue: "low",
            allowNull: false
        },
        progress_level: {
            type: Sequelize.ENUM("pending", "started", "completed"),
            defaultValue: "pending",
            allowNull: false
        }
}, {timestamps: false});

module.exports = Task;