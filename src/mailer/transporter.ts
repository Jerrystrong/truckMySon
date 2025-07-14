import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import path from "path";
dotenv.config({
    path:path.resolve(__dirname,'../../../.env')
})

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_SMTP,
        pass:process.env.EMAIL_PASSWORD
    }
})

export {transporter}