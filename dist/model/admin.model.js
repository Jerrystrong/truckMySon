"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
adminSchema.pre('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('adminPassword')) {
            const salt = yield bcrypt_1.default.genSalt();
            const hashed = yield bcrypt_1.default.hash(this.adminPassword, salt);
            this.adminPassword = hashed;
        }
    });
});
const Admin = mongoose_1.default.model('Admin', adminSchema);
exports.Admin = Admin;
