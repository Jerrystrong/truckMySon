"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.createRootTeacher = exports.Teacher = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const teacherSchema = new mongoose_1.default.Schema({
    teacherIdentifiant: {
        type: String,
        require: [true, "L'identifiant est obligatoire"]
    },
    teacherName: {
        type: String,
        require: [true, "Le nom est obligatoire"]
    },
    teacherPostname: {
        type: String,
        require: [true, "Le postnom est obligatoire"]
    },
    teacherLastname: {
        type: String,
        require: [true, "Le prenom est obligatoire"]
    },
    teacherBirthDay: {
        type: String,
        require: [true, "Le age est obligatoire"]
    },
    teacherClasse: {
        type: String,
        require: [true, "Le classe est obligatoire"]
    },
    teacherClasseIdentifiant: {
        type: String,
        require: [true, "Le identifiant de la classe est obligatoire"]
    },
    teacherPhone: {
        type: String,
        require: [true, "Le phone de parent est obligatoire"]
    },
    teacherEmail: {
        type: String,
        require: [true, "L'email est obligatoire"],
        unique: [true, "L'email doit etre unique"],
        validate: {
            validator: (e) => validator_1.default.isEmail(e),
            message: 'have to be a email'
        }
    },
    confirmCode: String,
    isConfirmed: Boolean,
    codeExpiretion: Number,
    adminId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Admin'
    }
});
const Teacher = mongoose_1.default.model('Teacher', teacherSchema);
exports.Teacher = Teacher;
const createRootTeacher = () => __awaiter(void 0, void 0, void 0, function* () {
    const teacher = new Teacher({
        teacherIdentifiant: 'GTE-102988-25',
        teacherName: 'KIMPIOKA',
        teacherPostname: 'TANDU',
        teacherLastname: 'Jeremie',
        teacherBirthDay: '25',
        teacherClasse: 'admin',
        teacherClasseIdentifiant: 'admin',
        teacherPhone: '+243982208865',
        teacherEmail: 'jeremiekimpioka52@gmail.com',
        adminId: '686e48a95b8890815f5a23da'
    });
    yield teacher.save();
});
exports.createRootTeacher = createRootTeacher;
