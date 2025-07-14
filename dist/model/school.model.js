"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.School = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const schoolSchema = new mongoose_1.default.Schema({
    schoolName: {
        type: String,
        require: [true, 'school name is required']
    },
    schoolLocation: {
        type: Array,
        require: [true, 'school location is required']
    },
    schoolLocationString: String
});
const School = mongoose_1.default.model('School', schoolSchema);
exports.School = School;
