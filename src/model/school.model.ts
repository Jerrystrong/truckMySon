import mongoose from "mongoose";

const schoolSchema=new mongoose.Schema({
    schoolName:{
        type:String,
        require:[true,'school name is required']
    },
    schoolLocation:{
        type:Array,
        require:[true,'school location is required']
    },
    schoolLocationString:String
})

const School=mongoose.model('School',schoolSchema)
export {School}