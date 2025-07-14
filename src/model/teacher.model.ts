import mongoose, { Schema } from 'mongoose'
import validator from "validator";

const teacherSchema=new mongoose.Schema({
        teacherIdentifiant:{
            type:String,
            require:[true,"L'identifiant est obligatoire"]
        },
        teacherName:{
            type:String,
            require:[true,"Le nom est obligatoire"]
        },
        teacherPostname:{
            type:String,
            require:[true,"Le postnom est obligatoire"]
        },
        teacherLastname:{
            type:String,
            require:[true,"Le prenom est obligatoire"]
        },
        teacherBirthDay:{
            type:String,
            require:[true,"Le age est obligatoire"]
        },
        teacherClasse:{
            type:String,
            require:[true,"Le classe est obligatoire"]
        },
        teacherClasseIdentifiant:{
            type:String,
            require:[true,"Le identifiant de la classe est obligatoire"]
        },
        teacherPhone:{
            type:String,
            require:[true,"Le phone de parent est obligatoire"]
        },
        teacherEmail:{
            type:String,
            require:[true,"L'email est obligatoire"],
            unique:[true,"L'email doit etre unique"],
            validate:{
                validator: (e:string)=> validator.isEmail(e),
                message:'have to be a email'
            }
        },
        confirmCode:String,
        isConfirmed:Boolean,
        codeExpiretion:Number,
        adminId:{
            type:Schema.Types.ObjectId,
            ref:'Admin'
        }
})

const Teacher=mongoose.model('Teacher',teacherSchema)
const createRootTeacher=async()=>{
    const teacher= new Teacher({
        teacherIdentifiant:'GTE-102988-25',
        teacherName:'KIMPIOKA',
        teacherPostname:'TANDU',
        teacherLastname:'Jeremie',
        teacherBirthDay:'25',
        teacherClasse:'admin',
        teacherClasseIdentifiant:'admin',
        teacherPhone:'+243982208865',
        teacherEmail:'jeremiekimpioka52@gmail.com',
        adminId:'686e48a95b8890815f5a23da'
    })
    await teacher.save()
}
export {Teacher,createRootTeacher}