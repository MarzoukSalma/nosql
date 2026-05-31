const { Neogma } = require("neogma");

const neogma = new Neogma({
  url: process.env.NEO4J_URI,
  username: process.env.NEO4J_USERNAME,
  password: process.env.NEO4J_PASSWORD,
});

const connectDB = async () => {
  try {
    await neogma.verifyConnectivity();
    console.log("✅ Neo4j connecté avec succès");
  } catch (error) {
    console.error("❌ Erreur connexion Neo4j :", error.message);
    process.exit(1);
  }
};

module.exports = { neogma, connectDB };
