import mongoose from "mongoose"
import { connectionDb } from "./db/db.config"
import { app } from "./serveur"
import { createRootTeacher } from './model/teacher.model';
connectionDb()
const Port=process.env.PORT||3003
mongoose.connection.on('open',()=>{
    console.log('mongoose connected')
    app.listen(Port,()=>{
        console.log(`app is listen to  the port ${Port}`)
        // createRootTeacher()
    })
})