const { neogma } = require('../../config/neo4j');
const neo4j = require('neo4j-driver');

// ─── Envoyer une demande de connexion ─────────────────────────────
const sendRequest = async (fromId, toId) => {
  if (fromId === toId) throw new Error('Action invalide');

  const result = await neogma.queryRunner.run(
    `MATCH (a:Etudiant {id: $fromId}), (b:Etudiant {id: $toId})
    
     OPTIONAL MATCH (a)-[existing:AMI|DEMANDE_AMI]-(b)
     WITH a, b, existing
     WHERE existing IS NULL
     CREATE (a)-[:DEMANDE_AMI {createdAt: $createdAt}]->(b)
     RETURN b { .id, .nom, .prenom, .avatar } AS target`,
    { fromId, toId, createdAt: new Date().toISOString() }
  );

  if (result.records.length === 0)
    throw new Error('Demande déjà envoyée ou déjà connectés');

  return result.records[0].get('target');
};

// ─── Accepter une demande ─────────────────────────────────────────
const acceptRequest = async (userId, fromId) => {
  const result = await neogma.queryRunner.run(
    `MATCH (from:Etudiant {id: $fromId})-[req:DEMANDE_AMI]->(me:Etudiant {id: $userId})
     DELETE req
     CREATE (me)-[:AMI {since: $since}]->(from)
     CREATE (from)-[:AMI {since: $since}]->(me)
     RETURN from { .id, .nom, .prenom, .avatar } AS newFriend`,
    { userId, fromId, since: new Date().toISOString() }
  );

  if (result.records.length === 0)
    throw new Error('Demande introuvable');

  return result.records[0].get('newFriend');
};

// ─── Refuser / annuler une demande ────────────────────────────────
const declineRequest = async (userId, fromId) => {
  await neogma.queryRunner.run(
    `MATCH (from:Etudiant {id: $fromId})-[req:DEMANDE_AMI]->(me:Etudiant {id: $userId})
     DELETE req`,
    { userId, fromId }
  );
};

// ─── Supprimer une connexion ──────────────────────────────────────
const removeConnection = async (userId, otherId) => {
  await neogma.queryRunner.run(
    `MATCH (a:Etudiant {id: $userId})-[r:AMI]-(b:Etudiant {id: $otherId})
     DELETE r`,
    { userId, otherId }
  );
};

// ─── Mes connexions ───────────────────────────────────────────────
const getMyConnections = async (userId) => {
  const result = await neogma.queryRunner.run(
    `MATCH (me:Etudiant {id: $userId})-[:AMI]->(ami:Etudiant)
     RETURN ami { .id, .nom, .prenom, .avatar, .filiere, .universite } AS connection`,
    { userId }
  );

  return result.records.map(r => r.get('connection'));
};

// ─── Demandes reçues en attente ───────────────────────────────────
const getPendingRequests = async (userId) => {
  const result = await neogma.queryRunner.run(
    `MATCH (from:Etudiant)-[req:DEMANDE_AMI]->(me:Etudiant {id: $userId})
     RETURN from { .id, .nom, .prenom, .avatar, .filiere, .universite },
            req.createdAt AS sentAt`,
    { userId }
  );

  return result.records.map(r => ({
    ...r.get('from'),
    sentAt: r.get('sentAt'),
  }));
};

// ─── Suggestions intelligentes (amis d'amis, même filière) ────────
const getSuggestions = async (userId, limit = 10) => {
  const result = await neogma.queryRunner.run(
    `MATCH (me:Etudiant {id: $userId})
     OPTIONAL MATCH (me)-[:AMI]->(ami)-[:AMI]->(s:Etudiant)
     WHERE s.id <> $userId AND NOT (me)-[:AMI|DEMANDE_AMI]-(s)
     WITH me, s, count(ami) AS mutualCount
     WHERE s IS NOT NULL
     RETURN {
       etudiant: s { .id, .nom, .prenom, .avatar, .filiere, .universite },
       score: mutualCount * 2,
       mutualCount: mutualCount,
       reason: "Ami d'un ami"
     } AS item
     
     UNION
     
     MATCH (me:Etudiant {id: $userId})
     MATCH (mf:Etudiant {filiere: me.filiere})
     WHERE mf.id <> $userId 
       AND NOT (me)-[:AMI|DEMANDE_AMI]-(mf)
     RETURN {
       etudiant: mf { .id, .nom, .prenom, .avatar, .filiere, .universite },
       score: 1,
       mutualCount: 0,
       reason: "Même filière"
     } AS item
     
     ORDER BY item.score DESC, item.etudiant.nom ASC
     LIMIT $limit`,
    { userId, limit: neo4j.int(limit) }
  );

  return result.records.map(r => r.get('item'));
};

// ─── Statut de relation entre deux utilisateurs ───────────────────
const getRelationStatus = async (userId, otherId) => {
  const result = await neogma.queryRunner.run(
    `MATCH (me:Etudiant {id: $userId}), (other:Etudiant {id: $otherId})
     OPTIONAL MATCH (me)-[ami:AMI]->(other)
     OPTIONAL MATCH (me)-[sent:DEMANDE_AMI]->(other)
     OPTIONAL MATCH (other)-[received:DEMANDE_AMI]->(me)
     RETURN {
       isConnected:       ami IS NOT NULL,
       requestSent:       sent IS NOT NULL,
       requestReceived:   received IS NOT NULL
     } AS status`,
    { userId, otherId }
  );

  return result.records[0].get('status');
};

module.exports = {
  sendRequest,
  acceptRequest,
  declineRequest,
  removeConnection,
  getMyConnections,
  getPendingRequests,
  getSuggestions,
  getRelationStatus,
};