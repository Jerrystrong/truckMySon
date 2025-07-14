import * as jwt from 'jsonwebtoken'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config({
    path:path.resolve(__dirname,'../../../.env')
})
export const generateToken = (id: string):string => {
    const secret = process.env.SECRETWORD;
    if (!secret) {
        throw new Error('SECRETWORD environment variable is not defined');
    }
    const token = jwt.sign({ token: id }, secret, { expiresIn: 7 * 12 * 60 * 60 });
    return token;
}
export const verifyToken=(token:string):{valid:boolean,payload?:any}=>{
     const secret = process.env.SECRETWORD;
    if (!secret) {
        throw new Error('SECRETWORD environment variable is not defined');
    }
    try {
        const decoded = jwt.verify(token, secret);
        return { valid: true, payload: decoded };
    } catch (err) {
        console.error('Token invalid:', err);
        return { valid: false };
    }
}