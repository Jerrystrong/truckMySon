import { checkEvent } from "../utils/checkEvent";

describe('All util test',()=>{
    describe('event test',()=>{
        it('It should return true if number is even',()=>{
            expect(checkEvent(10)).toBe(true)
        })
    })
})