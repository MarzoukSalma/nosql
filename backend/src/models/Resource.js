const { ModelFactory } = require('neogma');
const { neogma } = require('../config/neo4j');

const Resource = ModelFactory(
  {
    label: 'Resource',
    schema: {
      id:          { type: 'string', required: true },
      titre:       { type: 'string', required: true },
      description: { type: 'string' },
      type:        { type: 'string', required: true }, // paper | notes | dataset
      fileUrl:     { type: 'string' },
      departement: { type: 'string' },
      tags:        { type: 'string' }, // JSON.stringify([])
      downloads:   { type: 'number', default: 0 },
      saves:       { type: 'number', default: 0 },
      createdAt:   { type: 'string' },
    },
    primaryKeyField: 'id',
    relationships: {
      AUTEUR: {
        model: 'Etudiant',
        direction: 'in',
        name: 'A_PUBLIE',
      },
    },
  },
  neogma
);

module.exports = { Resource };