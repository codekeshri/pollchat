const Sequelize = require('sequelize'); //table
const sequelize = require('../util/sequelize'); //connected object

const User =sequelize.define('users', {
    name: {type: Sequelize.STRING},
    email:{type: Sequelize.STRING},
    password: {type: Sequelize.STRING},
    }, 
    
)

module.exports = User;
