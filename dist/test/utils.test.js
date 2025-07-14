"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const checkEvent_1 = require("../utils/checkEvent");
describe('All util test', () => {
    describe('event test', () => {
        it('It should return true if number is even', () => {
            expect((0, checkEvent_1.checkEvent)(10)).toBe(true);
        });
    });
});
