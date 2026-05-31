module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Utilisateur connecté :", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ Utilisateur déconnecté :", socket.id);
    });
  });
};
