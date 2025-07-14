"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_config_1 = require("./db/db.config");
const serveur_1 = require("./serveur");
(0, db_config_1.connectionDb)();
const Port = process.env.PORT || 3003;
mongoose_1.default.connection.on('open', () => {
    console.log('mongoose connected');
    serveur_1.app.listen(Port, () => {
        console.log(`app is listen to  the port ${Port}`);
        // createRootTeacher()
    });
});
