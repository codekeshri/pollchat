//const {response} = require("express");
const Poll = require("../models/poll");

const fetchPoll = async (req, res) => {
  try {
    const parties = await Poll.findAll();
    res.status(200).json(parties);
  } catch (err) {
    res.status(500).json(err);
  }
};

const addPoll = async (req, res) => {
  const index = req.body.index;
  try {
    const partyToAdd = await Poll.findOne({where: {index: index}});
    partyToAdd.totalvotes += 1;
    await partyToAdd.save();
    res.status(200).json({
      success: true,
      message: "Poll added successfully",
      updatedParty: {
        name: partyToAdd.partyname,
        id: partyToAdd.id,
        index: partyToAdd.index,
        totalvotes: partyToAdd.totalvotes,
        message: "Poll added successfully",
      },
    });
  } catch (err) {
    res.status(500).json({message: "Error adding vote to party", error: err});
  }
};

module.exports = {
  addPoll,
  fetchPoll,
};
