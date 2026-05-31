const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const Etudiant = require("../../models/Etudiant");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/jwt");

const register = async ({ nom, prenom, email, password, filiere, niveau }) => {
  // Vérifier si email existe déjà
  const existing = await Etudiant.findOne({ where: { email } });
  if (existing) throw new Error("Email déjà utilisé");

  // Hasher le mot de passe
  const passwordHash = await bcrypt.hash(password, 10);

  // Créer l'étudiant
  const etudiant = await Etudiant.createOne({
    id: uuidv4(),
    nom,
    prenom,
    email,
    passwordHash,
    filiere: filiere || "",
    niveau: niveau || "",
    bio: "",
    photoUrl: "",
    createdAt: new Date().toISOString(),
  });

  const accessToken = generateAccessToken(etudiant.id);
  const refreshToken = generateRefreshToken(etudiant.id);

  return { etudiant, accessToken, refreshToken };
};

const login = async ({ email, password }) => {
  // Trouver l'étudiant
  const etudiant = await Etudiant.findOne({ where: { email } });
  if (!etudiant) throw new Error("Email ou mot de passe incorrect");

  // Vérifier le mot de passe
  const isValid = await bcrypt.compare(password, etudiant.passwordHash);
  if (!isValid) throw new Error("Email ou mot de passe incorrect");

  const accessToken = generateAccessToken(etudiant.id);
  const refreshToken = generateRefreshToken(etudiant.id);

  return { etudiant, accessToken, refreshToken };
};

module.exports = { register, login };
