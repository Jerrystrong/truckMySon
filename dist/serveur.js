"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const route_1 = require("./router/route");
const express_session_1 = __importDefault(require("express-session"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, '../../.env')
});
// getHash('@admin01Jeremie')
const app = (0, express_1.default)();
exports.app = app;
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(express_1.default.static(path_1.default.join(__dirname, '../upload')));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: `${process.env.SECRETWORD}`,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
    },
    store: connect_mongo_1.default.create({
        mongoUrl: process.env.MONGOURI,
        ttl: 7 * 1000 * 60 * 60 * 24
    })
}));
// app.post('/add-school/data',addSchool);
app.use(route_1.router);
