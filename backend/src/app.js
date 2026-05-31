require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const { connectDB } = require("./config/neo4j");
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

// Middlewares
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));


// Routes
app.use("/api/auth", require("./modules/auth/auth.routes"));
app.use("/api/profile", require("./modules/profile/profile.routes"));
app.use("/api/conversations", require("./modules/messages/messages.routes"));
app.use("/api/feed", require("./modules/feed/feed.routes"));
app.use("/api/network", require("./modules/network/network.routes"));
app.use("/api/resources", require("./modules/resources/resources.routes"));

// Socket.io
require("./socket/socket.handler")(io);

// Démarrage
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
  });
});

module.exports = { app, io };
