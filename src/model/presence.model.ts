import mongoose from "mongoose";

const presenceSchema=new mongoose.Schema({
    studentName:String,
    heure:String,
    teacher:String,
    getDate:Number,
    dateString: String,
    phoneParent:String,
    createAt: {
        type: Date,
        default: Date.now
    }
})

const Presence = mongoose.model('Presence', presenceSchema)
export {Presence}