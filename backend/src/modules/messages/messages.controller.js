const {
  sendPrivateMessage,
  getMessages,
  getConversations,
} = require("./messages.service");

const sendPrivateMessageController = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const { contenu, type } = req.body;

    if (!contenu) {
      return res.status(400).json({ message: "Contenu requis" });
    }

    if (receiverId === req.userId) {
      return res
        .status(400)
        .json({ message: "Impossible de vous écrire à vous-même" });
    }

    const result = await sendPrivateMessage(req.userId, receiverId, {
      contenu,
      type,
    });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMessagesController = async (req, res) => {
  try {
    const { convId } = req.params;
    const messages = await getMessages(req.userId, convId);
    return res.status(200).json({ messages });
  } catch (error) {
    return res.status(403).json({ message: error.message });
  }
};

const getConversationsController = async (req, res) => {
  try {
    const conversations = await getConversations(req.userId);
    return res.status(200).json({ conversations });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendPrivateMessageController,
  getMessagesController,
  getConversationsController,
};
