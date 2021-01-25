const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
//
const UserStatus = require("./models/userStatus");
const Conversations = require("./models/messageStore");
const { InsertLinkOutlined } = require("@material-ui/icons");
//
function ChatServer(server) {
  this.server = socketIo(server);
  //@@@@@
  this.userStatus =  UserStatus ;
  this.conversations = Conversations ;
  //@@@@@
  this.server
    .use(function (socket, next) {
      if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(
          socket.handshake.query.token,
          process.env.ACCESS_TOKEN_SECRET,
          function (err, userid) {
            if (err) return next(new Error("Authentication error"));
            socket.userid = userid;
            next();
          }
        );
      } else {
        next(new Error("Authentication error"));
      }
    })
    .on("connection", (socket) => this.newConnection(socket));
}

ChatServer.prototype.newConnection = async function (socket) {
  console.log(
    "new connection============================================",
    socket.id
  );
  socket.on("disconnect", () => this.disconnect(socket));
  socket.on("disconnecting", () => this.disconnecting(socket));
  socket.on("typing", (data) => this.typing(socket, data));
  socket.on("stop typing", (data) => this.stopTyping(socket, data));
  socket.on("message", (data) => this.message(socket, data));

  socket.join(socket.userid);
  this.server.emit("status", { sender: socket.userid, status: "online" });
  await User.changeStatus(socket.userid, "online");
  //@@@@@@
  this.userStatus.onLine(socket.userid);
};

ChatServer.prototype.disconnecting = async function (socket) {
  //
  console.log("disconnecting", socket.id);
  this.server.emit("status", { sender: socket.userid, status: "offline" });
  await User.changeStatus(socket.userid, "offline");
  //@@@@@@
  this.userStatus.offLine(socket.userid);
};

ChatServer.prototype.disconnect = function (socket) {
  //
  console.log("disconnected", socket.id);
};

ChatServer.prototype.typing = function (socket, { sender, receivers, text }) {
  //
  //console.log("typing", socket.id, sender, receivers, text);
  for (let receiver in receivers)
    socket.to(receiver).emit("typing", { sender, receivers, text });
};

ChatServer.prototype.typing = function (socket, { sender, receivers, text }) {
  //
  //console.log("stop typing", socket.id, sender, receivers, text);
  for (let receiver in receivers)
    socket.to(receiver).emit("stop typing", { sender, receivers, text });
};

ChatServer.prototype.message = function (socket, { sender, receivers, text }) {
 //console.log("message", socket.id, sender, receivers, text);  
  const timeStamp = Date.now();
  for (let receiver of receivers) {
    try {
      socket.to(receiver).emit("message", { sender, receivers, text , datetime:timeStamp });
    } catch (err) {
      console.error(err);
    }
  }

//@@@@@@@@@@ send back with timestamp to sender:
  console.log("emit to self",socket.userid);
  socket.emit("message", { sender, receivers, text , datetime:timeStamp });
  //@@@@@@@@@@ record in store

  let unread = 1;
   
  if (this.userStatus.getPeer(receivers[0]) == socket.userid && this.userStatus.isOnline(receivers[0]))
    unread = 0;
  this.conversations.newMessage(sender, receivers[0], { sender, receivers, datetime: timeStamp, text }, unread)
   
  //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  
};

ChatServer.prototype.roomExsit = function (roomName) {
  return this.server.adapter.rooms[roomName];
};

module.exports = ChatServer;
