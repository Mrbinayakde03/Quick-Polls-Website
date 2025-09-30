import { Server } from "socket.io";

export function initSockets(server, { corsOrigin } = {}) {
  const io = new Server(server, {
    cors: {
      origin: corsOrigin || "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);

    socket.on("joinPoll", (pollId) => {
      if (!pollId) return;
      socket.join(`poll:${pollId}`);
    });

    socket.on("leavePoll", (pollId) => {
      if (!pollId) return;
      socket.leave(`poll:${pollId}`);
    });

    socket.on("disconnect", () => {
      // console.log('Socket disconnected', socket.id);
    });
  });

  return io;
}
