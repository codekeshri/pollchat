const Sequelize = require("sequelize"); //table
const sequelize = require("../util/sequelize"); //connected object

const Poll = sequelize.define("polls", {
  partyname: {type: Sequelize.STRING},
  index: {type: Sequelize.INTEGER},
  totalvotes: {type: Sequelize.INTEGER, defaultValue: 5},
});

module.exports = Poll;
