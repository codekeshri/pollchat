const Sequelize = require('sequelize'); 

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
})

module.exports = sequelize;




























// testing the connection 
// async function testConnection(){
// try{
//     await sequelize.authenticate();
//     console.log('Database Connected');
// } catch(err){
//     console.error('Unable to connect to the database');
// }
// }
// testConnection();
// const sequelize = new Sequelize('expense-tracker', 'root', 'arvind', {
//     host: 'localhost',
//     dialect: 'mysql',
// })






































