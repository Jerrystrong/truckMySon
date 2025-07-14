import mongoose from "mongoose";

const classSchema=new mongoose.Schema({
    name:{
        type:String,
        require:[true,'class name is required']
    },
    identifiant:{
        type:String,
        require:[true,'identifiant location is required']
    }
})

const Class=mongoose.model('Class',classSchema)
export {Class}