import { Router,Request,Response } from "express";
import { isAuthentified } from "../utils/isAuthentified";
import { Teacher } from "../model/teacher.model";
import { Admin } from "../model/admin.model";
import bcrypt from 'bcrypt'
import { Class } from "../model/class.model";
import { generateCode } from "../utils/generateCodeR";
import { MongooseError } from "mongoose";
import { confirmMail } from "../mailer/sendConfirmMail";
import { Student } from "../model/student.model";
import multer from 'multer'
import path from "path";
import { School } from "../model/school.model";
import { generateToken, verifyToken } from '../utils/token.util';
import { getDistanceFromLatLonInKm } from "../utils/getDistance";
import { io } from "..";
import { Presence } from "../model/presence.model";

const upload=multer({dest:path.join(__dirname,'../../upload')})
const router=Router()
// add school
router.post('/add/school/data',async (req:Request,res:Response)=>{
    const body=req.body
    console.log(body)
    if (body.schoolLocation) {
        try {
            const school = new School(body);
            await school.save();
            res.json({ success: true });
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.message);
                res.json({ success: false, message: err.message });
            }
            // return res.json({ success: false, message: 'Erreur inconnue' });
        }
    } else {
        res.json({ success: false, message: 'schoolLocation manquant' });
        console.log('schoolLocation manquant')
    }
})
// rendre un enseignant admin
router.post('/api/set-admin',async(req:Request,res:Response)=>{
    const data=req.body
    const genCode=generateCode()
    const pw=`@adm${genCode}in`
    data.adminPassword=pw
    if(data.adminEmail){
        try{
            const admin = new Admin(data)
            await admin.save()
            if(admin.adminEmail){
                await confirmMail(admin.adminEmail, pw,'Code de verification')
                res.status(200).json({success:true,passWord:pw})
            }
        }catch(err:unknown){
            if(err && err instanceof Error){
                console.log(err)
                res.status(500).json({success:false,message:err.message})
            }
        }
    }

})
// router.post('/add-school/data',addSchool);
router.get('/',isAuthentified,async(req:Request,res:Response)=>{
    const teacher=await Teacher.find({})
    const student=await Student.find({teacherId:req.session.user.teacherId})
    const adStudent=await Student.find({})
    const classes=await Class.find({})
    res.render('index.ejs',{user:req.session.user,teacher:teacher[teacher.length-1],student:student[student.length-1],students:student,teachers:teacher,adStudent,classes})
})
router.get('/enseignant',isAuthentified,async(req:Request,res:Response)=>{
    const teachers=await Teacher.find({})
    res.render('enseignant.ejs',{user:req.session.user,teachers:teachers})
})
router.get('/eleves',isAuthentified,async(req:Request,res:Response)=>{
    const teacher=await Teacher.findById(req.session.user.teacherId)
    const date=new Date()
    const presence=await Presence.find({getDate:date.getTime(),teacher:req.session.user.teacherId})
    res.render('eleves.ejs',{user:req.session.user,teacher,presence})
})
router.get('/eleves/list',isAuthentified,async(req:Request,res:Response)=>{
    const students=await Student.find({teacherId:req.session.user.teacherId})
    res.render('studentListe.ejs',{user:req.session.user,students})
})
router.get('/parameter',isAuthentified,(req:Request,res:Response)=>{
    res.render('parameter.ejs',{user:req.session.user})
})
router.get('/login',(req:Request,res:Response)=>{
    res.render('login.ejs')
})
router.get('/admin-password/safe',(req:Request,res:Response)=>{
    if(req.session.user){
        res.render('adminLogin.ejs',{user:req.session.user,error:''})
    }else{
        res.redirect('/login')
    }
})
router.get('/teacher-password/complet-login',(req:Request,res:Response)=>{
    if(req.session.user){
        res.render('teacherLogin.ejs',{user:req.session.user,error:''})
    }else{
        res.redirect('/login')
    }
})
router.post('/login',async(req:Request,res:Response)=>{
    const {userEmail}=req.body
    const teacher=await Teacher.findOne({teacherEmail:userEmail})
    if(teacher?.adminId){
        // complete password
        const currentAdmin= await Admin.findOne({adminEmail:teacher?.teacherEmail})
        req.session.user={adminId:currentAdmin?._id,email:currentAdmin?.adminEmail}
        res.redirect('/admin-password/safe')
    }else{
        // not admin => confirm password by email
        const code=generateCode()
        if (teacher) {
            teacher.confirmCode = code;
            teacher.codeExpiretion=new Date().getTime()+5*60*1000
            await teacher.save()
            if (typeof teacher.teacherEmail === 'string') {
                await confirmMail(teacher.teacherEmail, code,'Code de verification')
                req.session.user={teacherId:teacher?._id,email:teacher?.teacherEmail}
                res.redirect('/teacher-password/complet-login')
            } else {
                throw new Error('Teacher email is missing or invalid')
            }
        }
    }
})
// student login
router.post('/api/login/student',async(req:Request,res:Response)=>{
    const {studentIdentifiant,studentClasse}= req.body
    if(!studentIdentifiant){
        res.json({success:false,message:'vous devez entrer votre identifiant'})
    }else{
        const student=await Student.findOne({identifiant:studentIdentifiant}).populate('teacherId','teacherName teacherLastname teacherPhone')
        const school=await School.findOne({})
        if(student){
            const token=generateToken(student?._id.toString())
            res.json({success:true,student:student,token:token,schoolId:school?._id})
        }else{
            res.status(404).json({success:false,message:'aucun eleve correspond à cet token'})
        }
    }
})
router.post('/api/get-student-position',async(req:Request,res:Response)=>{
    const {points}=req.body
    const {token}=req.body
    const {schoolId}=req.body
    console.log(token)  
    console.log(schoolId)  
    const authentified=verifyToken(token)
    if(authentified.valid){
         const school=await School.findById(schoolId)
         console.log(`Payload: ${authentified.payload.token}`)
         const student= await Student.findById(authentified.payload.token).populate('teacherId','teacherName teacherLastname teacherPhone')
        //  req.session.user.school=school
        console.log(`Student`)
        console.log(student)
        console.log('is autthentified')
        if(school?.schoolLocation){
            const distance=Math.round(getDistanceFromLatLonInKm(points.latitude,points.longitude,school?.schoolLocation[1],school?.schoolLocation[0]))
            // console.log(distance)
            // console.log(getDistanceFromLatLonInKm(-4.32,15.29,48.85,2.35))
            const teacher=await Teacher.findOne({teacherClasseIdentifiant:student?.studentClasseIdentnifiant})
            console.log('teacher')
            console.log(teacher)
            if(distance>=1){
                io.emit('onFarAway',{
                    message: `l'élève est éloigné de ${distance} de l'école`,
                    noms: `${student?.studentName} ${student?.studentLastname}`,
                    parentPhone: student?.teacherId && 'teacherPhone' in student.teacherId ? student.teacherId.teacherPhone : ''
                })
                if(teacher){
                    teacher?.notification.push([`${student?.studentName} ${student?.studentLastname}`,`l'élève est éloigné de ${distance} de l'école`])
                    await teacher.save()
                }
            }
            io.emit('presence',{noms: `${student?.studentName} ${student?.studentLastname}`,
                    parentPhone: student?.teacherId && 'teacherPhone' in student.teacherId ? student.teacherId.teacherPhone : '',time:new Date()})
            const date=new Date()
            if(teacher){
                const prensence= new Presence({
                    studentName:`${student?.studentName} ${student?.studentLastname}`,
                    heure:`${date.getHours()}: ${date.getMinutes()}`,
                    getDate:date.getTime(),
                    teacher:teacher?._id
                })
                await prensence.save()
                res.json({success:true,distance:distance})
            }else{
                res.json({success:true,distance:distance})
            }
        }
    }else{
        res.json({success:false,message:'token expire',redirect:true})
    }
   
})
router.post('/admin-password/safe',async (req:Request,res:Response)=>{
    const {userPassword}=req.body
    try{
        const admin= await Admin.findById(req.session.user.adminId)
        if (admin?.adminPassword && typeof admin.adminPassword === 'string') {
            const decodedPw = await bcrypt.compare(userPassword, admin.adminPassword)
            if(!decodedPw){
                res.render('adminLogin.ejs',{user:req.session.user,error:'Mot de passe incorrect'})
            }else{
                req.session.user.verified=true
                req.session.user.userName=admin.adminName
                if(req.session.user.userName){
                    return res.redirect('/')
                }
                res.redirect('/')
            }
        } else {
            throw new Error('Admin password not found or invalid')
        }
    }catch(e){
        console.log(e)
    }
})
router.post('/teacher-password/complet-login',async(req:Request,res:Response)=>{
    const {codeConfirmation}=req.body
    if(!codeConfirmation){
        res.render('teacherLogin.ejs',{user:req.session.user,error:'Sorry!!!Entrer le code'})
    }
    try{
        const teacher=await Teacher.findById(req.session.user.teacherId)
        const currentTime=new Date().getTime()
        if (!teacher || teacher.codeExpiretion == null) {
            return res.render('teacherLogin.ejs',{user:req.session.user,error:'Informations de l\'enseignant manquantes ou code expiré'});
        }
        if(currentTime > teacher.codeExpiretion){
            return res.render('teacherLogin.ejs',{user:req.session.user,error:'Le code a expiré'});
        }
        if(codeConfirmation===teacher.confirmCode){
            if (teacher) {
                teacher.isConfirmed = true;
                teacher.confirmCode = '';
                req.session.user.userName=`${teacher?.teacherName} ${teacher?.teacherLastname}`
                req.session.user.classe=teacher.teacherClasse
                if(req.session.user.userName){
                    return res.redirect('/')
                }
                res.redirect('/')
            }
            
        }else{
            res.render('teacherLogin.ejs',{user:req.session.user,error:'Code incorrect'})
        }
    }catch(err){
        console.log(err)
    }
})
router.get('/logout',(req:Request,res:Response)=>{
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Erreur de déconnexion' });
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
})
// teacher action route

// =======
router.post('/add/teacher',async(req:Request,res:Response)=>{
    const body=req.body
    if(body.teacherEmail){
        const identifiant=`GTE-${generateCode()}-${new Date().getFullYear().toString().slice(2,3)}EE`
        body.teacherIdentifiant=identifiant
        const teacher=new Teacher(body)
        try{
            await teacher.save()
            const teachers=await Teacher.find({})
            res.json({success:true,data:teachers})
        }catch(error: unknown){
            if (error instanceof Error) {
                res.json({success:false,message:error.message})
            }
        }
    }else{
        console.log('not data')
    }
})
// add stuedent
//,upload.single('studentProfil')
router.post('/add-student',async(req:Request,res:Response)=>{
    const body=req.body
    // const file=req.file
    console.log(body)
    if (body.studentName) {
        async function createStudent(attempt = 0) {
            if (attempt > 5) {
                return res.json({ success: false, message: 'Impossible de générer un identifiant unique après plusieurs tentatives' });
            }

            body.identifiant = `25-${generateCode()}-EC20`;
            console.log(body)
            const student = new Student(body);

            try {
                await student.save();
                return res.json({ success: true });
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error(error.message);

                    // Vérifie si c’est une erreur MongoDB de duplication
                    // @ts-ignore
                    if (error.code === 11000) {  // Erreur de duplication
                        return createStudent(attempt + 1);
                    }

                    return res.json({ success: false, message: error.message });
                }

                return res.json({ success: false, message: 'Erreur inconnue' });
            }
        }

        createStudent();
    }

})
router.get('/get-classes',async (req:Request,res:Response)=>{
    const classes=await Class.find({})
    res.json({data:classes})
})
// add school
export {router}