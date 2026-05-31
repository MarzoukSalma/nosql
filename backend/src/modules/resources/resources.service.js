const { v4: uuid } = require('uuid');
const neo4j = require('neo4j-driver');
const { neogma } = require('../../config/neo4j');

// ─── Publier une ressource ────────────────────────────────────────
const createResource = async (userId, { titre, description, type, fileUrl, departement, tags = [] }) => {
  const id = uuid();
  const createdAt = new Date().toISOString();

  const result = await neogma.queryRunner.run(
    `MATCH (e:Etudiant {id: $userId})
     CREATE (r:Resource {
       id: $id,
       titre: $titre,
       description: $description,
       type: $type,
       fileUrl: $fileUrl,
       departement: $departement,
       tags: $tags,
       downloads: 0,
       saves: 0,
       createdAt: $createdAt
     })
     CREATE (e)-[:A_PUBLIE]->(r)
     RETURN r { .*, auteur: e { .id, .nom, .prenom, .avatar } } AS resource`,
    {
      userId, id, titre,
      description: description ?? null,
      type, fileUrl: fileUrl ?? null,
      departement: departement ?? null,
      tags: JSON.stringify(tags),
      createdAt,
    }
  );

  return result.records[0].get('resource');
};

// ─── Lister toutes les ressources (filtres + pagination) ──────────
const getResources = async ({ type, departement, tag, search, skip = 0, limit = 20 }) => {
  // Construction dynamique des filtres WHERE
  const filters = [];
  const params = { skip: neo4j.int(skip), limit: neo4j.int(limit) };

  if (type)        { filters.push('r.type = $type');               params.type = type; }
  if (departement) { filters.push('r.departement = $departement'); params.departement = departement; }
  if (tag)         { filters.push('r.tags CONTAINS $tag');         params.tag = tag; }
  if (search)      { filters.push('toLower(r.titre) CONTAINS toLower($search)'); params.search = search; }

  const where = filters.length > 0 ? `WHERE ${filters.join(' AND ')}` : '';

  const result = await neogma.queryRunner.run(
    `MATCH (auteur:Etudiant)-[:A_PUBLIE]->(r:Resource)
     ${where}
     RETURN r { .*, auteur: auteur { .id, .nom, .prenom, .avatar } } AS resource
     ORDER BY r.createdAt DESC
     SKIP $skip LIMIT $limit`,
    params
  );

  return result.records.map(r => r.get('resource'));
};

// ─── Détail d'une ressource ───────────────────────────────────────
const getResourceById = async (resourceId, userId) => {
  const result = await neogma.queryRunner.run(
    `MATCH (auteur:Etudiant)-[:A_PUBLIE]->(r:Resource {id: $resourceId})
     OPTIONAL MATCH (me:Etudiant {id: $userId})-[save:A_SAUVEGARDE]->(r)
     RETURN r {
       .*,
       auteur: auteur { .id, .nom, .prenom, .avatar },
       isSaved: save IS NOT NULL
     } AS resource`,
    { resourceId, userId }
  );

  if (result.records.length === 0) throw new Error('Ressource introuvable');
  return result.records[0].get('resource');
};

// ─── Sauvegarder / Unsave (toggle) ───────────────────────────────
const toggleSave = async (userId, resourceId) => {
  const result = await neogma.queryRunner.run(
    `MATCH (e:Etudiant {id: $userId}), (r:Resource {id: $resourceId})
     OPTIONAL MATCH (e)-[save:A_SAUVEGARDE]->(r)
     WITH e, r, save
     CALL {
       WITH e, r, save
       WITH e, r, save WHERE save IS NOT NULL
       DELETE save
       SET r.saves = r.saves - 1
       RETURN 'unsaved' AS action
       UNION
       WITH e, r, save
       WITH e, r, save WHERE save IS NULL
       CREATE (e)-[:A_SAUVEGARDE {savedAt: $savedAt}]->(r)
       SET r.saves = r.saves + 1
       RETURN 'saved' AS action
     }
     RETURN action, r.saves AS totalSaves`,
    { userId, resourceId, savedAt: new Date().toISOString() }
  );

  const record = result.records[0];
  return {
    action: record.get('action'),
    totalSaves: record.get('totalSaves').toNumber(),
  };
};

// ─── Mes ressources sauvegardées ──────────────────────────────────
const getSavedResources = async (userId) => {
  const result = await neogma.queryRunner.run(
    `MATCH (me:Etudiant {id: $userId})-[s:A_SAUVEGARDE]->(r:Resource)
     MATCH (auteur:Etudiant)-[:A_PUBLIE]->(r)
     RETURN r { .*, auteur: auteur { .id, .nom, .prenom, .avatar }, savedAt: s.savedAt } AS resource
     ORDER BY s.savedAt DESC`,
    { userId }
  );

  return result.records.map(r => r.get('resource'));
};

// ─── Incrémenter le compteur de downloads ────────────────────────
const incrementDownload = async (resourceId) => {
  await neogma.queryRunner.run(
    `MATCH (r:Resource {id: $resourceId})
     SET r.downloads = r.downloads + 1`,
    { resourceId }
  );
};

// ─── Demander une ressource introuvable ───────────────────────────
const requestResource = async (userId, { titre, description }) => {
  const id = uuid();
  const createdAt = new Date().toISOString();

  const result = await neogma.queryRunner.run(
    `MATCH (e:Etudiant {id: $userId})
     CREATE (req:ResourceRequest {
       id: $id,
       titre: $titre,
       description: $description,
       status: 'pending',
       createdAt: $createdAt
     })
     CREATE (e)-[:A_DEMANDE]->(req)
     RETURN req { .*, demandeur: e { .id, .nom, .prenom } } AS request`,
    { userId, id, titre, description: description ?? null, createdAt }
  );

  return result.records[0].get('request');
};

// ─── Supprimer sa propre ressource ───────────────────────────────
const deleteResource = async (userId, resourceId) => {
  const result = await neogma.queryRunner.run(
    `MATCH (e:Etudiant {id: $userId})-[:A_PUBLIE]->(r:Resource {id: $resourceId})
     DETACH DELETE r
     RETURN count(r) AS deleted`,
    { userId, resourceId }
  );

  const deleted = result.records[0].get('deleted').toNumber();
  if (deleted === 0) throw new Error('Ressource introuvable ou non autorisé');
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  toggleSave,
  getSavedResources,
  incrementDownload,
  requestResource,
  deleteResource,
};