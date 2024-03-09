"use strict";

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = 8080;

const server = http.createServer(app);
const io = new Server(server);

app.use((req, res, next) => {
    console.log('\x1b[93mHTTP\x1b[0m', req.ip, `\x1b[92m${req.method}\x1b[0m`, req.url);
    next();
});

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('\x1b[96mWebSocket\x1b[0m', socket.id, '\x1b[92mconnected\x1b[0m');
    socket.on('disconnect', () => {
        console.log('\x1b[96mWebSocket\x1b[0m', socket.id, '\x1b[91mdisconnected\x1b[0m');
    });

    // Server listens for event 'newUser', arg is the userName from the client in this case
    // socket.on('newUser', (arg) => {
    //     console.log(arg);
    // })
});

server.listen(PORT, () => {
    console.log(`Listening on port: \x1b[93m${PORT}\x1b[0m`);
});