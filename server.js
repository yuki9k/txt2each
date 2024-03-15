"use strict";

const { log } = require("console");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = 8080;

const server = http.createServer(app);
const io = new Server(server);

app.use((req, res, next) => {
  console.log(
    "\x1b[93mHTTP\x1b[0m",
    req.ip,
    `\x1b[92m${req.method}\x1b[0m`,
    req.url
  );
  next();
});

app.use(express.static("public"));

const chat = new Chat();

io.on("connection", (socket) => {
  console.log(
    "\x1b[96mWebSocket\x1b[0m",
    socket.id,
    "\x1b[92mconnected\x1b[0m"
  );

  socket.on("newUser", (name) => {
    io.to(socket.id).emit("renderChatLog", chat.chatLog);
    chat.users.createUser(socket.id, new User(name));
    console.log("Created user:", socket.id);
  });

  socket.on("sendChat", (incMsg) => {
    const outMsg = chat.createMsg(socket.id, incMsg);
    io.emit("renderMsg", outMsg);
  });

  socket.on("disconnect", () => {
    chat.users.destroyUser(socket.id);
    console.log("Removed user:", socket.id);

    console.log(
      "\x1b[96mWebSocket\x1b[0m",
      socket.id,
      "\x1b[91mdisconnected\x1b[0m"
    );
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port: \x1b[93m${PORT}\x1b[0m`);
});

function Chat() {
  this.users = new Users();
  this.chatLog = [];

  this.createMsg = (id, msg) => {
    if (this.chatLog.length > 20) {
      this.chatLog.splice(0, 1);
    }

    const user = this.users.getUser(id);
    const msgString = `<p class="chat-msg"> <span style="color:${user.nameColor}">${user.userName}</span>: ${msg}</p>`;
    this.chatLog.push(msgString);
    return msgString;
  };
}

function Users() {
  this.connectedUsers = new Map();

  this.createUser = (id, obj) => {
    this.connectedUsers.set(id, obj);
  };

  this.destroyUser = (id) => {
    this.connectedUsers.delete(id);
  };

  this.getUser = (id) => {
    return this.connectedUsers.get(id);
  };
}

function User(name) {
  const randColor = returnRandRgb();
  this.userName = name;
  this.nameColor = randColor;

  this.changeNameColor = function (r, g, b) {
    // code to handle arguments ???
    this.nameColor = `rgb(${r}, ${g}, ${b})`;
  };

  function returnRandRgb() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);

    return `rgb(${r}, ${g}, ${b})`;
  }
}
