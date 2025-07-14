"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const adminSchema = new mongoose_1.default.Schema({
    adminName: {
        type: String,
        require: [true, 'school name is required']
    },
    adminPassword: {
        type: String,
        require: [true, 'school location is required']
    },
    adminEmail: {
        type: String,
        require: [true, 'school location is required'],
        unique: [true, "email have to be unique"],
        validate: {
            validator: (e) => validator_1.default.isEmail(e),
            message: 'have to be a email'
        }
    }
});
const Admin = mongoose_1.default.model('Admin', adminSchema);
exports.Admin = Admin;
