"use strict";

const EXPRESS = require('express');
const HTTP = require('http');

const APP = EXPRESS();
const PORT = 8080;

const SERVER = HTTP.createServer(APP);
const { Server } = require('socket.io');
const IO = new Server(SERVER);

APP.get('/', function (request, response) {
    response.sendFile('index.html', {
        root: __dirname
    });
});

IO.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);
    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    })
});

SERVER.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});