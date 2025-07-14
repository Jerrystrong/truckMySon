import mongoose from "mongoose";
import validator from 'validator'
const adminSchema=new mongoose.Schema({
    adminName:{
        type:String,
        require:[true,'school name is required']
    },
    adminPassword:{
        type:String,
        require:[true,'school location is required']
    },
    adminEmail:{
        type:String,
        require:[true,'school location is required'],
        unique:[true,"email have to be unique"],
        validate:{
            validator: (e:string)=> validator.isEmail(e),
            message:'have to be a email'
        }
    }
})

const Admin=mongoose.model('Admin',adminSchema)
export {Admin}