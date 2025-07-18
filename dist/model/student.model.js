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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const studentSchema = new mongoose_1.default.Schema({
    identifiant: {
        type: String,
        require: [true, "L'identifiant de l'evele est obligatoire"],
        unique: [true, "unique"],
    },
    studentName: {
        type: String,
        require: [true, "Le nom de l'evele est obligatoire"]
    },
    studentPostname: {
        type: String,
        require: [true, "Le postnom de l'evele est obligatoire"]
    },
    studentLastname: {
        type: String,
        require: [true, "Le prenom de l'evele est obligatoire"]
    },
    studentBirthDay: {
        type: String,
        require: [true, "Le age de l'evele est obligatoire"]
    },
    studentClasse: {
        type: String,
        require: [true, "Le classe de l'evele est obligatoire"]
    },
    studentClasseIdentnifiant: {
        type: String,
        require: [true, "Le identifiant de la classe de l'evele est obligatoire"]
    },
    studentParent: {
        type: String,
        require: [true, "Le nom du parent est obligatoire"]
    },
    studentPhone: {
        type: String,
        require: [true, "Le phone de parent est obligatoire"]
    },
    studentEmail: {
        type: String,
        require: [true, "L'email de l'evele est obligatoire"],
        validate: {
            validator: (e) => validator_1.default.isEmail(e),
            message: 'have to be a email'
        }
    },
    studentProfil: String,
    studentPresence: String,
    teacherId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Teacher'
    }
});
const Student = mongoose_1.default.model('Student', studentSchema);
exports.Student = Student;
