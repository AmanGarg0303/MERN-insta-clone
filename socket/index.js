const io = require("socket.io")(8800, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //   console.log(`User Connected: ${socket.id}`);
  //   console.log(`Socket connected`);

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});
