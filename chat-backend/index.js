var http = require("http");
var express = require("express");
var cors = require("cors");
var socketIO = require("socket.io");
var constants = require("./constants");

var { addMessage, getMessagesInRoom } = require("./messages");
var { addUserToCurrentUsers, removeUserFromCurrentUsers, getPeopleInRoom } = require("./users");

var app = express();
app.use(cors());

var PORT = constants.PORT || process.env.PORT;

var server = http.createServer(app);

var io = socketIO(server, {
  cors: {
    origin: constants.SOCKET_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  var { roomId, name } = socket.handshake.query;
  socket.join(roomId);
  console.log('USER JOINED', name)
  var user = addUserToCurrentUsers(socket.id, roomId, name);
  io.in(roomId).emit(constants.PERSON_JOINED_EVT, user);

  socket.broadcast.emit(constants.NEW_USER_EVT, `"${user.name}" has joined the chat`);

  socket.on(constants.NEW_MESSAGE_EVT, (data) => {
    var message = addMessage(roomId, data);
    io.in(roomId).emit(constants.NEW_MESSAGE_EVT, message);
  });

  socket.on("disconnect", () => {
    removeUserFromCurrentUsers(socket.id);
    io.in(roomId).emit(constants.PERSON_LEFT_EVT, user);
    socket.leave(roomId);
  });
});

app.get("/rooms/:roomId/users", (req, res) => {
  var users = getPeopleInRoom(req.params.roomId);
  return res.json({ users });
});

app.get("/rooms/:roomId/messages", (req, res) => {
  var messages = getMessagesInRoom(req.params.roomId);
  return res.json({ messages });
});


server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});