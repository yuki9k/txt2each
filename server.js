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
  next();
});

app.use(express.static("public"));

let users = [];

io.on("connection", (socket) => {
  console.log(
    "\x1b[96mWebSocket\x1b[0m",
    socket.id,
    "\x1b[92mconnected\x1b[0m"
  );

  socket.on("newUser", (name) => {
    const newUser = {
      id: socket.id,
      userName: name,
      nameColor: randomRGB(),
    };
    users.push(newUser);
    console.log(users);
  });

  socket.on("sendChat", (chatMsg) => {
    console.log(chatMsg);
    const user = getUser(socket.id);

    io.emit(
      "renderChat",
      `
		<p class="chat-msg"> <span style="color:${user.nameColor}">${user.userName}:</span> ${chatMsg}</p>
		`
    );
  });

  socket.on("disconnect", () => {
    removeUser(socket.id);
    console.log("Removed user", socket.id);

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

function randomRGB() {
  let r = Math.floor(Math.random() * 255);
  let g = Math.floor(Math.random() * 255);
  let b = Math.floor(Math.random() * 255);

  return `rgb(${r}, ${g}, ${b})`;
}

function removeUser(id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      users.splice(i, 1);
    }
  }
}

function getUser(id) {
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      return users[i];
    }
  }
}
