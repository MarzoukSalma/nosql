const { register, login } = require("./auth.service");

const registerController = async (req, res) => {
  try {
    const { nom, prenom, email, password, filiere, niveau } = req.body;

    if (!nom || !prenom || !email || !password) {
      return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    const result = await register({
      nom,
      prenom,
      email,
      password,
      filiere,
      niveau,
    });

    return res.status(201).json({
      message: "Inscription réussie",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      etudiant: {
        id: result.etudiant.id,
        nom: result.etudiant.nom,
        prenom: result.etudiant.prenom,
        email: result.etudiant.email,
        filiere: result.etudiant.filiere,
        niveau: result.etudiant.niveau,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const result = await login({ email, password });

    return res.status(200).json({
      message: "Connexion réussie",
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      etudiant: {
        id: result.etudiant.id,
        nom: result.etudiant.nom,
        prenom: result.etudiant.prenom,
        email: result.etudiant.email,
        filiere: result.etudiant.filiere,
        niveau: result.etudiant.niveau,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { registerController, loginController };
