"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Class = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const classSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        require: [true, 'class name is required']
    },
    identifiant: {
        type: String,
        require: [true, 'identifiant location is required']
    }
});
const Class = mongoose_1.default.model('Class', classSchema);
exports.Class = Class;
