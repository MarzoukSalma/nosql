const { ModelFactory } = require("neogma");
const { neogma } = require("../config/neo4j");

const Etudiant = ModelFactory(
  {
    label: "Etudiant",
    schema: {
      id: { type: "string", required: true },
      nom: { type: "string", required: true },
      prenom: { type: "string", required: true },
      email: { type: "string", required: true },
      passwordHash: { type: "string", required: true },
      filiere: { type: "string" },
      niveau: { type: "string" },
      bio: { type: "string" },
      photoUrl: { type: "string" },
      createdAt: { type: "string" },
    },
    primaryKeyField: "id",
    relationships: {
      AMIS: {
        model: "Etudiant",
        direction: "out",
        name: "AMI",
        properties: {
          depuis: { type: "string" },
          statut: { type: "string" },
        },
      },
    },
  },
  neogma,
);

module.exports = Etudiant;
