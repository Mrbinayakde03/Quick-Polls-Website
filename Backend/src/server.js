import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import http from "http";
import app from "./app.js";
import { initSockets } from "./sockets.js";

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// initialize socket.io and attach to server
const io = initSockets(server, { corsOrigin: process.env.CLIENT_URL });
app.set("io", io);

// connect to MongoDB then start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
