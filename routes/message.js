const express = require("express");
const messageController = require("../controllers/message");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post(
  "/sendMessage",
  authMiddleware.authenticate,
  messageController.sendMessage
);
router.get(
  "/getMessage",
  authMiddleware.authenticate,
  messageController.getMessage
);
router.post(
  "/deleteMessage",
  authMiddleware.authenticate,
  messageController.deleteMessage
);

module.exports = router;
