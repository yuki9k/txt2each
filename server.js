"use strict";

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
});

app.use(express.static("public"));

const users = new Users();

io.on("connection", (socket) => {
  console.log(
    "\x1b[96mWebSocket\x1b[0m",
    socket.id,
    "\x1b[92mconnected\x1b[0m"
  );

  socket.on("newUser", (name) => {
    // const newUser = {
    //   id: socket.id,
    //   userName: name,
    //   nameColor: randomRGB(),
    // };
    // users.push(newUser);
    // const newUser = new User(socket.id, name, users);
    users.createUser(socket.id, name);
    console.log("Created user:", socket.id);
    console.log(users.connectedUsers);
  });

  socket.on("sendChat", (chatMsg) => {
    console.log(chatMsg);
    const user = getUser(socket.id);

    io.emit(
      "renderChat",
      `
		<p class="chat-msg"> <span style="color:${user.nameColor}">${user.userName}</span>: ${chatMsg}</p>
		`
    );
  });

  socket.on("disconnect", () => {
    // removeUser(socket.id);
    users.destroyUser(socket.id);
    console.log("Removed user:", socket.id);
    console.log(users.connectedUsers);

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

function returnRandRgb() {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);

  return `rgb(${r}, ${g}, ${b})`;
}

// function removeUser(id) {
//   for (let i = 0; i < users.length; i++) {
//     if (users[i].id === id) {
//       users.splice(i, 1);
//     }
//   }
// }

function getUser(id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return users[i];
    }
  }
}

function Users() {
  this.connectedUsers = [];
  this.createUser = function (id, name) {
    this.connectedUsers.push(new User(id, name));
  };
  this.destroyUser = function (id) {
    for (let i = 0; i < this.connectedUsers.length; i++) {
      if (this.connectedUsers[i].id === id) {
        this.connectedUsers.splice(i, 1);
      }
    }
  };
}

function User(id, name) {
  const randColor = returnRandRgb();
  this.id = id;
  this.userName = name;
  this.nameColor = randColor;
  // this.sendMsg = function (msg) {};
  this.changeNameColor = function (r, g, b) {
    // code to handle arguments ???
    this.nameColor = `rgb(${r}, ${g}, ${b})`;
  };
}

function Chat() {
  this.chatLog = [];
  this.renderMsg = function (user, msg) {
    if (this.chatLog.length > 20) {
      this.chatLog.splice(0, 1);
    }

    this.chatLog.push(msg);
    return {user.userName, nameColor: user.nameColor, msg}
  };
}
