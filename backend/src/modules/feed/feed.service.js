const { v4: uuid } = require('uuid');
const neo4j = require('neo4j-driver');
const { neogma } = require('../../config/neo4j.js');

// ─── Créer un post ────────────────────────────────────────────────
const createPost = async (authorId, { contenu, type = 'texte', mediaUrl }) => {
  const id = uuid();
  const createdAt = new Date().toISOString();

  // On crée le nœud et la relation [:A_PUBLIE] en une seule requête
  await neogma.queryRunner.run(
    `MATCH (e:Etudiant {id: $authorId})
     CREATE (p:Publication {id: $id, contenu: $contenu, type: $type, mediaUrl: $mediaUrl, likes: 0, createdAt: $createdAt})
     CREATE (e)-[:A_PUBLIE]->(p)
     RETURN p`,
    { authorId, id, contenu, type, mediaUrl: mediaUrl ?? null, createdAt }
  );

  return { id, contenu, type, mediaUrl, likes: 0, createdAt };
};

// ─── Feed personnalisé (posts des connexions + soi-même) ──────────
const getFeed = async (userId, { skip = 0, limit = 20 } = {}) => {
  const result = await neogma.queryRunner.run(
    `MATCH (moi:Etudiant {id: $userId})
     
     OPTIONAL MATCH (moi)-[:AMI|SUIT]->(autre:Etudiant)-[:A_PUBLIE]->(p:Publication)
     
     OPTIONAL MATCH (moi)-[:A_PUBLIE]->(monPost:Publication)
     WITH collect(p) + collect(monPost) AS allPosts
     UNWIND allPosts AS post
     
     MATCH (auteur:Etudiant)-[:A_PUBLIE]->(post)
     
     OPTIONAL MATCH (moi)-[like:A_LIKE]->(post)
     RETURN post {
       .*,
       auteur: auteur { .id, .nom, .prenom, .avatar },
       isLiked: like IS NOT NULL
     } AS feed
     ORDER BY post.createdAt DESC
     SKIP $skip LIMIT $limit`,
    { userId, skip: neo4j.int(skip), limit: neo4j.int(limit) }
  );

  return result.records.map(r => r.get('feed'));
};

// ─── Like / Unlike (toggle) ───────────────────────────────────────
const toggleLike = async (userId, postId) => {
  const result = await neogma.queryRunner.run(
  `
  MATCH (e:Etudiant {id: $userId}), (p:Publication {id: $postId})
  OPTIONAL MATCH (e)-[like:A_LIKE]->(p)

  FOREACH (_ IN CASE WHEN like IS NULL THEN [1] ELSE [] END |
    CREATE (e)-[:A_LIKE]->(p)
    SET p.likes = coalesce(p.likes, 0) + 1
  )

  FOREACH (_ IN CASE WHEN like IS NOT NULL THEN [1] ELSE [] END |
    DELETE like
    SET p.likes = coalesce(p.likes, 0) - 1
  )

  RETURN
    CASE
      WHEN like IS NULL THEN 'liked'
      ELSE 'unliked'
    END AS action,
    p.likes AS totalLikes
  `,
  { userId, postId }
);

  const record = result.records[0];
  return {
    action: record.get('action'),
    totalLikes: record.get('totalLikes').toNumber(),
  };
};

// ─── Commenter un post ────────────────────────────────────────────
const addComment = async (userId, postId, { contenu }) => {
  const id = uuid();
  const createdAt = new Date().toISOString();

  const result = await neogma.queryRunner.run(
    `MATCH (e:Etudiant {id: $userId}), (p:Publication {id: $postId})
     CREATE (c:Commentaire {id: $id, contenu: $contenu, createdAt: $createdAt})
     CREATE (e)-[:A_COMMENTE]->(c)
     CREATE (p)-[:A_COMMENTE]->(c)
     RETURN c { .*, auteur: e { .id, .nom, .prenom, .avatar } } AS comment`,
    { userId, postId, id, contenu, createdAt }
  );

  return result.records[0].get('comment');
};

// ─── Récupérer les commentaires d'un post ─────────────────────────
const getComments = async (postId) => {
  const result = await neogma.queryRunner.run(
    `MATCH (p:Publication {id: $postId})-[:A_COMMENTE]->(c:Commentaire)
     MATCH (auteur:Etudiant)-[:A_COMMENTE]->(c)
     RETURN c { .*, auteur: auteur { .id, .nom, .prenom, .avatar } } AS comment
     ORDER BY c.createdAt ASC`,
    { postId }
  );

  return result.records.map(r => r.get('comment'));
};

// ─── Supprimer un post (auteur seulement) ─────────────────────────
const deletePost = async (userId, postId) => {
  await neogma.queryRunner.run(
    `MATCH (e:Etudiant {id: $userId})-[:A_PUBLIE]->(p:Publication {id: $postId})
     OPTIONAL MATCH (p)-[:A_COMMENTE]->(c:Commentaire)
     DETACH DELETE p, c`,
    { userId, postId }
  );
};

module.exports = {
  createPost,
  getFeed,
  toggleLike,
  addComment,
  getComments,
  deletePost,
};