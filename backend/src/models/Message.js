const { ModelFactory, DataTypes } = require("neogma");
const { neogma } = require("../config/neo4j");

const Message = ModelFactory(
  {
    label: "Message",
    schema: {
      id: { type: "string", required: true },
      contenu: { type: "string", required: true },
      type: { type: "string" }, // 'text' | 'image' | 'file'
      dateEnvoi: { type: "string" },
      lu: { type: "boolean" },
    },
    primaryKeyField: "id",
  },
  neogma,
);

module.exports = Message;
