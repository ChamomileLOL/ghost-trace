require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

// --- THE TRAP: YOUR DB CREDENTIALS ---
// I changed the DB name to 'ghost-trace' so we don't touch your youtube-clone data.
const MONGO_URI = "mongodb+srv://admin:yjzlQ9Nh1to1tIsq@cluster0.fxcoggp.mongodb.net/ghost-trace?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("🔥 MongoDB Connected (The Vault is Open)"))
  .catch(err => console.error("❌ DB Fail:", err));

// --- THE TRAP: SCHEMA (Syllabus: Data Modeling) ---
const SessionSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  eventType: String, // 'move' or 'click'
  data: Object // Stores {x, y}
});
const Session = mongoose.model('Session', SessionSchema);

// --- THE TRAP: WEBSOCKET PIPELINE (Syllabus: Real-time Comms) ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow any frontend to connect
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`👻 Ghost Connected: ${socket.id}`);

  // When User A moves mouse...
  socket.on('mouse_move', async (data) => {
    // 1. Broadcast to User B (The Visual Trick)
    socket.broadcast.emit('ghost_move', data);

    // 2. Save to DB (The Syllabus Requirement)
    // We don't await this because we want speed. Fire and forget.
    Session.create({ eventType: 'move', data: data });
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected');
  });
});

// --- THE TRAP: DYNAMIC PORT ASSIGNMENT ---
// Render gives us process.env.PORT (10000). 
// If we are on localhost, we use 5001.
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
});