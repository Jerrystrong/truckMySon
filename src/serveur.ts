import express from 'express'
import { router } from './router/route'
import expressSession from 'express-session'
import { getHash } from './utils/hashAdminPass';
import dotenv from 'dotenv'
import path from "path";
import MongoStore from 'connect-mongo';
import { addSchool } from './controlleur/addSchool.controler';
dotenv.config({
    path:path.resolve(__dirname,'../../.env')
})
// getHash('@admin01Jeremie')
const app=express()
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'));    
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../upload')));
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(expressSession({
    secret:`${process.env.SECRETWORD}`,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, 
    },
    store:MongoStore.create({
      mongoUrl:process.env.MONGOURI,
      ttl:7*1000*60*60*24
    })
}))
// app.post('/add-school/data',addSchool);
app.use(router)

export {app}