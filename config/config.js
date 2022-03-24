//import sequelize ORM to establish database management; maps object syntax onto database schemas
const { Sequelize } = require('sequelize');

//Setup database creds for connection
const config = new Sequelize("task_manager", "root", "%Corel!123", { dialect: 'mysql'});

//add logging:false after the dialect:"mysql" to suppress console messages

module.exports = config;