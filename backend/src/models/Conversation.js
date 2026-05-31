const { ModelFactory, DataTypes } = require("neogma");
const { neogma } = require("../config/neo4j");

const Conversation = ModelFactory(
  {
    label: "Conversation",
    schema: {
      id: { type: "string", required: true },
      type: { type: "string", required: true }, // 'private' | 'group'
      createdAt: { type: "string" },
    },
    primaryKeyField: "id",
    relationships: {
      MESSAGES: {
        model: "Message",
        direction: "in",
        name: "DANS",
      },
    },
  },
  neogma,
);

module.exports = Conversation;
