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
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSchool = void 0;
const school_model_1 = require("../model/school.model");
const addSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    console.log(req.body);
    if (data.schoolLocation) {
        try {
            const school = new school_model_1.School(data);
            yield school.save();
            return res.json({ success: true });
        }
        catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
                return res.json({ success: false, message: err.message });
            }
            return res.json({ success: false, message: 'Erreur inconnue' });
        }
    }
    else {
        return res.json({ success: false, message: 'schoolLocation manquant' });
    }
});
exports.addSchool = addSchool;
