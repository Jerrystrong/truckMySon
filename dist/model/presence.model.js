"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Presence = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const presenceSchema = new mongoose_1.default.Schema({
    studentName: String,
    heure: String,
    teacher: String,
    getDate: Number,
    createAt: {
        type: Date,
        default: Date.now
    }
});
const Presence = mongoose_1.default.model('Presence', presenceSchema);
exports.Presence = Presence;
