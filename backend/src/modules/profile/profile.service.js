// profile.service.js
const Etudiant = require("../../models/Etudiant");

const getProfile = async (id) => {
  const etudiant = await Etudiant.findOne({ where: { id } });
  if (!etudiant) throw new Error("Profil introuvable");

  const { passwordHash, ...profil } = etudiant.dataValues;
  return profil;
};

const updateProfile = async (id, { nom, prenom, filiere, niveau, bio }) => {
  const etudiant = await Etudiant.findOne({ where: { id } });
  if (!etudiant) throw new Error("Profil introuvable");

  if (nom) etudiant.nom = nom;
  if (prenom) etudiant.prenom = prenom;
  if (filiere) etudiant.filiere = filiere;
  if (niveau) etudiant.niveau = niveau;
  if (bio !== undefined) etudiant.bio = bio;

  await etudiant.save();

  const { passwordHash, ...profil } = etudiant.dataValues;
  return profil;
};

const updatePhoto = async (id, photoUrl) => {
  const etudiant = await Etudiant.findOne({ where: { id } });
  if (!etudiant) throw new Error("Profil introuvable");

  etudiant.photoUrl = photoUrl;
  await etudiant.save();

  const { passwordHash, ...profil } = etudiant.dataValues;
  return profil;
};

module.exports = { getProfile, updateProfile, updatePhoto };
