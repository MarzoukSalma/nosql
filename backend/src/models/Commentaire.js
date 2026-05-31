const { ModelFactory } = require('neogma');
const { neogma } = require('../config/neo4j.js');

const Commentaire = ModelFactory(
  {
    label: 'Commentaire',
    schema: {
      id:        { type: 'string', required: true },
      contenu:   { type: 'string', required: true },
      createdAt: { type: 'string' },
    },
    primaryKeyField: 'id',
    relationships: {
      AUTEUR: {
        model: 'Etudiant',
        direction: 'in',
        name: 'A_COMMENTE',
      },
    },
  },
  neogma
);

module.exports = { Commentaire };