import mongoose from "mongoose"
import { connectionDb } from "./db/db.config"
import { app } from "./serveur"
import { createRootTeacher } from './model/teacher.model';
import { createServer } from "http";
import { Server } from "socket.io";

const server=createServer(app)
const io=new Server(server)
connectionDb()
const Port=process.env.PORT||3003
io.on('connect',(socket)=>{
    console.log('user connected')
    socket.on('userLocation',(data)=>{
        console.log(data)
    })
})

mongoose.connection.on('open',()=>{
    console.log('mongoose connected')
    server.listen(Port,()=>{
        console.log(`app is listen to  the port ${Port}`)
        // createRootTeacher()
    })
})

export {io}