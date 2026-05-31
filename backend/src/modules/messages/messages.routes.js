const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middleware");
const {
  sendPrivateMessageController,
  getMessagesController,
  getConversationsController,
} = require("./messages.controller");

router.use(authMiddleware);

router.get("/", getConversationsController);
router.post("/private/:receiverId", sendPrivateMessageController);
router.get("/:convId", getMessagesController);

module.exports = router;
