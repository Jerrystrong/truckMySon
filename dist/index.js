"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const db_config_1 = require("./db/db.config");
const serveur_1 = require("./serveur");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const server = (0, http_1.createServer)(serveur_1.app);
const io = new socket_io_1.Server(server);
exports.io = io;
(0, db_config_1.connectionDb)();
const Port = process.env.PORT || 3003;
io.on('connect', (socket) => {
    console.log('user connected');
    socket.on('userLocation', (data) => {
        console.log(data);
    });
});
mongoose_1.default.connection.on('open', () => {
    console.log('mongoose connected');
    server.listen(Port, () => {
        console.log(`app is listen to  the port ${Port}`);
        // createRootTeacher()
    });
});
