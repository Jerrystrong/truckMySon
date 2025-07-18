import mongoose from "mongoose";

const presenceSchema=new mongoose.Schema({
    studentName:String,
    heure:String,
    teacher:String,
    getDate:Number,
    createAt:Date.now
})

const Presence = mongoose.model('Presence', presenceSchema)
export {Presence}