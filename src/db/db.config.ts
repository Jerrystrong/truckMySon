import mongoose from "mongoose";
import dotenv from 'dotenv'
import path from "path";
dotenv.config({
    path:path.resolve(__dirname,'../../.env')
})
const connectionDb=async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGOURI}`);
    } catch (error) {
        console.log(error)
    }  
}
export {connectionDb}