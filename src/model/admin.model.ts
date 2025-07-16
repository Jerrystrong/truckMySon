import mongoose from "mongoose";
import validator from 'validator'
import bcrypt from 'bcrypt'
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
adminSchema.pre('save', async function (this: mongoose.Document & { adminPassword: string }) {
    if (this.isModified('adminPassword')) {
        const salt = await bcrypt.genSalt();
        const hashed = await bcrypt.hash(this.adminPassword, salt);
        this.adminPassword = hashed;
    }
});

const Admin=mongoose.model('Admin',adminSchema)
export {Admin}