const { v4: uuidv4 } = require("uuid");
const { neogma } = require("../../config/neo4j");

const sendPrivateMessage = async (
  senderId,
  receiverId,
  { contenu, type = "text" },
) => {
  if (!contenu?.trim()) throw new Error("Le message ne peut pas être vide");

  const messageId = uuidv4();
  const convId = uuidv4();
  const dateEnvoi = new Date().toISOString();

  const result = await neogma.queryRunner.run(
    `
    MATCH (sender:Etudiant {id: $senderId})
    MATCH (receiver:Etudiant {id: $receiverId})

    OPTIONAL MATCH (sender)-[:PARTICIPE_A]->(conv:Conversation {type: 'private'})<-[:PARTICIPE_A]-(receiver)

    WITH sender, receiver, conv
    FOREACH (_ IN CASE WHEN conv IS NULL THEN [1] ELSE [] END |
      CREATE (newConv:Conversation {
        id: $convId,
        type: 'private',
        createdAt: $dateEnvoi
      })
      CREATE (sender)-[:PARTICIPE_A]->(newConv)
      CREATE (receiver)-[:PARTICIPE_A]->(newConv)
    )

    MATCH (sender)-[:PARTICIPE_A]->(c:Conversation {type: 'private'})<-[:PARTICIPE_A]-(receiver)

    CREATE (msg:Message {
      id: $messageId,
      contenu: $contenu,
      type: $type,
      dateEnvoi: $dateEnvoi,
      lu: false
    })
    CREATE (msg)-[:DANS]->(c)
    CREATE (sender)-[:A_ENVOYE]->(msg)

    RETURN msg { .id, .contenu, .type, .dateEnvoi, .lu } AS message, c.id AS convId
    `,
    { senderId, receiverId, convId, messageId, contenu, type, dateEnvoi },
  );

  const record = result.records[0];
  if (!record) throw new Error("Envoi échoué");

  return {
    message: record.get("message"),
    conversationId: record.get("convId"),
  };
};

const getMessages = async (userId, conversationId) => {
  const access = await neogma.queryRunner.run(
    `
    MATCH (e:Etudiant {id: $userId})-[:PARTICIPE_A]->(conv:Conversation {id: $convId})
    RETURN conv
    `,
    { userId, convId: conversationId },
  );

  if (access.records.length === 0) {
    throw new Error("Accès refusé à cette conversation");
  }

  const result = await neogma.queryRunner.run(
    `
    MATCH (msg:Message)-[:DANS]->(conv:Conversation {id: $convId})
    MATCH (sender:Etudiant)-[:A_ENVOYE]->(msg)
    RETURN msg {
      .id, .contenu, .type, .dateEnvoi, .lu,
      envoyeur: sender { .id, .nom, .prenom }
    } AS message
    ORDER BY msg.dateEnvoi ASC
    `,
    { convId: conversationId },
  );

  return result.records.map((r) => r.get("message"));
};
const getConversations = async (userId) => {
  const result = await neogma.queryRunner.run(
    `
    MATCH (me:Etudiant {id: $userId})-[:PARTICIPE_A]->(conv:Conversation)
    MATCH (autre:Etudiant)-[:PARTICIPE_A]->(conv)
    WHERE autre.id <> $userId
    OPTIONAL MATCH (msg:Message)-[:DANS]->(conv)
    WITH conv, autre, msg
    ORDER BY msg.dateEnvoi DESC
    WITH conv, autre, collect(msg)[0] AS dernierMessage
    RETURN conv {
      .id, .type, .createdAt,
      avec: autre { .id, .nom, .prenom, .photoUrl },
      dernierMessage: dernierMessage { .contenu, .dateEnvoi, .lu }
    } AS conversation
    ORDER BY conv.createdAt DESC
    `,
    { userId },
  );

  return result.records.map((r) => r.get("conversation"));
};
module.exports = { sendPrivateMessage, getMessages, getConversations };
