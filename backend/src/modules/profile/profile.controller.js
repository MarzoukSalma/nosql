const { getProfile, updateProfile, updatePhoto } = require("./profile.service");

const getProfileController = async (req, res) => {
  try {
    const etudiant = await getProfile(req.params.id);
    return res.status(200).json({ etudiant });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const { nom, prenom, filiere, niveau, bio } = req.body;
    const etudiant = await updateProfile(req.params.id, {
      nom,
      prenom,
      filiere,
      niveau,
      bio,
    });
    return res.status(200).json({ message: "Profil mis à jour", etudiant });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updatePhotoController = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Aucune photo envoyée" });
    const photoUrl = `/uploads/${req.file.filename}`;
    const etudiant = await updatePhoto(req.params.id, photoUrl);
    return res.status(200).json({ message: "Photo mise à jour", etudiant });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProfileController,
  updateProfileController,
  updatePhotoController,
};
