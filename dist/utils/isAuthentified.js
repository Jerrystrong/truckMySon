"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthentified = void 0;
const isAuthentified = (req, res, next) => {
    var _a;
    if ((_a = req.session) === null || _a === void 0 ? void 0 : _a.user) {
        next();
    }
    else {
        res.redirect('/login');
    }
};
exports.isAuthentified = isAuthentified;
