const express = require("express");
const pollController = require("../controllers/poll");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/fetchPoll", authMiddleware.authenticate, pollController.fetchPoll);

router.post("/addPoll", authMiddleware.authenticate, pollController.addPoll);

module.exports = router;
