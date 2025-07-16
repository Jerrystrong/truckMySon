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
exports.confirmMail = void 0;
const transporter_1 = require("./transporter");
const confirmMail = (destinateur, code, title) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield transporter_1.transporter.sendMail({
            from: 'Team gestion Eleve <supportgestion@gmail.com>',
            to: destinateur,
            subject: 'Confirmation log in',
            text: 'Utiliser le code pour confirmer votre connection',
            html: `<div>
                    <h1>${title}</h1>
                    <div style="background-color:#7AC6D2;color:#fefefe;padding:10px;width:fit-content;border-radius:10px">
                        ${code}
                    </div>
                    <p>Ou <a href="http://localhost:3003/teacher-password/complet-login">Cliqué ici</a></p>
                </div>`
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.confirmMail = confirmMail;
