const { ModelFactory } = require('neogma');
const { neogma } = require('../config/neo4j.js');

const Publication = ModelFactory(
  {
    label: 'Publication',
    schema: {
      id:          { type: 'string', required: true },
      contenu:     { type: 'string', required: true },
      type:        { type: 'string', default: 'texte' }, // texte | image | fichier
      mediaUrl:    { type: 'string' },
      likes:       { type: 'number', default: 0 },
      createdAt:   { type: 'string' },
    },
    primaryKeyField: 'id',
    relationships: {
      AUTEUR: {
        model: 'Etudiant',
        direction: 'in',
        name: 'A_PUBLIE',
      },
      COMMENTAIRES: {
        model: 'Commentaire',
        direction: 'out',
        name: 'A_COMMENTE',
      },
    },
  },
  neogma
);

module.exports = { Publication };