"use strict";

const EXPRESS = require('express');
const HTTP = require('http');
const { Server } = require('socket.io');

const APP = EXPRESS();
const PORT = 8080;

const SERVER = HTTP.createServer(APP);
const IO = new Server(SERVER);

APP.use((req, res, next) => {
    console.log('\x1b[93mHTTP\x1b[0m', req.ip, `\x1b[92m${req.method}\x1b[0m`, req.url);
    next();
});

APP.use(EXPRESS.static('public'));

IO.on('connection', (socket) => {
    console.log('\x1b[96mWebSocket\x1b[0m', socket.id, '\x1b[92mconnected\x1b[0m');
    socket.on('disconnect', () => {
        console.log('\x1b[96mWebSocket\x1b[0m', socket.id, '\x1b[91mdisconnected\x1b[0m');
    })
});

SERVER.listen(PORT, () => {
    console.log(`Listening on port: \x1b[93m${PORT}\x1b[0m`);
});