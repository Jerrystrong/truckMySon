import mongoose, { Schema } from "mongoose";
import validator from "validator";
const studentSchema=new mongoose.Schema({
    identifiant:{
        type:String,
        require:[true,"L'identifiant de l'evele est obligatoire"],
        unique:[true,"unique"],
    },
    studentName:{
        type:String,
        require:[true,"Le nom de l'evele est obligatoire"]
    },
    studentPostname:{
        type:String,
        require:[true,"Le postnom de l'evele est obligatoire"]
    },
    studentLastname:{
        type:String,
        require:[true,"Le prenom de l'evele est obligatoire"]
    },
    studentBirthDay:{
        type:String,
        require:[true,"Le age de l'evele est obligatoire"]
    },
    studentClasse:{
        type:String,
        require:[true,"Le classe de l'evele est obligatoire"]
    },
    studentClasseIdentnifiant:{
        type:String,
        require:[true,"Le identifiant de la classe de l'evele est obligatoire"]
    },
    studentParent:{
        type:String,
        require:[true,"Le nom du parent est obligatoire"]
    },
    studentPhone:{
        type:String,
        require:[true,"Le phone de parent est obligatoire"]
    },
    studentEmail:{
        type:String,
        require:[true,"L'email de l'evele est obligatoire"],
        validate:{
            validator: (e:string)=> validator.isEmail(e),
            message:'have to be a email'
        }
    },
    studentProfil:String,
    studentPresence:String,
    teacherId:{
        type:Schema.Types.ObjectId,
        ref:'Teacher'
    }
})


const Student=mongoose.model('Student',studentSchema)
export {Student}