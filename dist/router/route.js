"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const isAuthentified_1 = require("../utils/isAuthentified");
const teacher_model_1 = require("../model/teacher.model");
const admin_model_1 = require("../model/admin.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const class_model_1 = require("../model/class.model");
const generateCodeR_1 = require("../utils/generateCodeR");
const sendConfirmMail_1 = require("../mailer/sendConfirmMail");
const student_model_1 = require("../model/student.model");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const school_model_1 = require("../model/school.model");
const token_util_1 = require("../utils/token.util");
const getDistance_1 = require("../utils/getDistance");
const index_1 = require("../index");
const presence_model_1 = require("../model/presence.model");
const upload = (0, multer_1.default)({ dest: path_1.default.join(__dirname, '../../upload') });
const router = (0, express_1.Router)();
exports.router = router;
// add school
router.post('/add/school/data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log(body);
    if (body.schoolLocation) {
        try {
            const school = new school_model_1.School(body);
            yield school.save();
            res.json({ success: true });
        }
        catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
                res.json({ success: false, message: err.message });
            }
            // return res.json({ success: false, message: 'Erreur inconnue' });
        }
    }
    else {
        res.json({ success: false, message: 'schoolLocation manquant' });
        console.log('schoolLocation manquant');
    }
}));
// rendre un enseignant admin
router.post('/api/set-admin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const genCode = (0, generateCodeR_1.generateCode)();
    const pw = `@adm${genCode}in`;
    data.adminPassword = pw;
    if (data.adminEmail) {
        try {
            const admin = new admin_model_1.Admin({ adminName: data.adminName, adminEmail: data.adminEmail, adminPassword: data.adminPassword });
            yield admin.save();
            const teacher = yield teacher_model_1.Teacher.findOne({ teacherIdentifiant: data.identifiant });
            if (admin.adminEmail) {
                if (teacher) {
                    teacher.adminId = admin._id;
                    yield teacher.save();
                    yield (0, sendConfirmMail_1.confirmMail)(admin.adminEmail, pw, 'Code Admin');
                    res.status(200).json({ success: true, passWord: pw });
                }
            }
        }
        catch (err) {
            if (err && err instanceof Error) {
                console.log(err);
                res.status(500).json({ success: false, message: err.message });
            }
        }
    }
}));
// router.post('/add-school/data',addSchool);
router.get('/', isAuthentified_1.isAuthentified, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teacher = yield teacher_model_1.Teacher.find({});
    const student = yield student_model_1.Student.find({ teacherId: req.session.user.teacherId });
    const adStudent = yield student_model_1.Student.find({});
    const classes = yield class_model_1.Class.find({});
    setTimeout(() => {
        index_1.io.emit('essaie', true);
    }, 1000);
    res.render('index.ejs', { user: req.session.user, teacher: teacher[teacher.length - 1], student: student[student.length - 1], students: student, teachers: teacher, adStudent, classes });
}));
router.get('/enseignant', isAuthentified_1.isAuthentified, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teachers = yield teacher_model_1.Teacher.find({});
    res.render('enseignant.ejs', { user: req.session.user, teachers: teachers });
}));
router.get('/eleves', isAuthentified_1.isAuthentified, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const teacher = yield teacher_model_1.Teacher.findById(req.session.user.teacherId);
    const dateString = new Date().toISOString().split('T')[0];
    const presence = yield presence_model_1.Presence.find({ dateString, teacher: req.session.user.teacherId });
    console.log(presence);
    res.render('eleves.ejs', { user: req.session.user, teacher, presence });
}));
router.get('/eleves/list', isAuthentified_1.isAuthentified, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentNameRaw = req.query.studentName;
    const studentName = typeof studentNameRaw === 'string' ? studentNameRaw : Array.isArray(studentNameRaw) ? studentNameRaw[0] : '';
    console.log(studentName);
    if (studentName) {
        const students = yield student_model_1.Student.find({ teacherId: req.session.user.teacherId });
        const filteredStudents = students.filter((std) => {
            const stdName = typeof std.studentName === 'string' ? std.studentName.toLowerCase() : '';
            const stdLastName = typeof std.studentLastname === 'string' ? std.studentLastname.toLowerCase() : '';
            const searchName = typeof studentName === 'string' ? studentName.toLowerCase() : '';
            return stdName.includes(searchName) ? true : stdLastName.includes(searchName) ? true : false;
        });
        return res.render('studentListe.ejs', { user: req.session.user, students: filteredStudents });
    }
    else {
        const students = yield student_model_1.Student.find({ teacherId: req.session.user.teacherId });
        return res.render('studentListe.ejs', { user: req.session.user, students });
    }
}));
router.get('/parameter', isAuthentified_1.isAuthentified, (req, res) => {
    res.render('parameter.ejs', { user: req.session.user });
});
router.get('/login', (req, res) => {
    res.render('login.ejs');
});
router.get('/admin-password/safe', (req, res) => {
    if (req.session.user) {
        res.render('adminLogin.ejs', { user: req.session.user, error: '' });
    }
    else {
        res.redirect('/login');
    }
});
router.get('/teacher-password/complet-login', (req, res) => {
    if (req.session.user) {
        res.render('teacherLogin.ejs', { user: req.session.user, error: '' });
    }
    else {
        res.redirect('/login');
    }
});
router.get('/notivation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const user = yield teacher_model_1.Teacher.findById(req.session.user.teacherId);
        const notification = user === null || user === void 0 ? void 0 : user.notification;
        const currentDate = new Date().toLocaleDateString();
        res.render('notification.ejs', { user: req.session.user, notification, currentDate });
    }
    else {
        res.redirect('/login');
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail } = req.body;
    const teacher = yield teacher_model_1.Teacher.findOne({ teacherEmail: userEmail });
    if (teacher === null || teacher === void 0 ? void 0 : teacher.adminId) {
        // complete password
        const currentAdmin = yield admin_model_1.Admin.findOne({ adminEmail: teacher === null || teacher === void 0 ? void 0 : teacher.teacherEmail });
        req.session.user = { adminId: currentAdmin === null || currentAdmin === void 0 ? void 0 : currentAdmin._id, email: currentAdmin === null || currentAdmin === void 0 ? void 0 : currentAdmin.adminEmail };
        res.redirect('/admin-password/safe');
    }
    else {
        // not admin => confirm password by email
        const code = (0, generateCodeR_1.generateCode)();
        if (teacher) {
            teacher.confirmCode = code;
            teacher.codeExpiretion = new Date().getTime() + 5 * 60 * 1000;
            yield teacher.save();
            if (typeof teacher.teacherEmail === 'string') {
                yield (0, sendConfirmMail_1.confirmMail)(teacher.teacherEmail, code, 'Code de verification');
                req.session.user = { teacherId: teacher === null || teacher === void 0 ? void 0 : teacher._id, email: teacher === null || teacher === void 0 ? void 0 : teacher.teacherEmail };
                res.redirect('/teacher-password/complet-login');
            }
            else {
                throw new Error('Teacher email is missing or invalid');
            }
        }
    }
}));
// student login
router.post('/api/login/student', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { studentIdentifiant, studentClasse } = req.body;
    if (!studentIdentifiant) {
        res.json({ success: false, message: 'vous devez entrer votre identifiant' });
    }
    else {
        const student = yield student_model_1.Student.findOne({ identifiant: studentIdentifiant }).populate('teacherId', 'teacherName teacherLastname teacherPhone');
        const school = yield school_model_1.School.findOne({});
        if (student) {
            const token = (0, token_util_1.generateToken)(student === null || student === void 0 ? void 0 : student._id.toString());
            res.json({ success: true, student: student, token: token, schoolId: school === null || school === void 0 ? void 0 : school._id });
        }
        else {
            res.status(404).json({ success: false, message: 'aucun eleve correspond à cet token' });
        }
    }
}));
router.post('/api/get-student-position', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { points } = req.body;
    const { token } = req.body;
    const { schoolId } = req.body;
    const authentified = (0, token_util_1.verifyToken)(token);
    if (authentified.valid) {
        const school = yield school_model_1.School.findById(schoolId);
        const student = yield student_model_1.Student.findById(authentified.payload.token).populate('teacherId', 'teacherName teacherLastname teacherPhone');
        //  req.session.user.school=school
        if (school === null || school === void 0 ? void 0 : school.schoolLocation) {
            const distance = Math.round((0, getDistance_1.getDistanceFromLatLonInKm)(points.latitude, points.longitude, school === null || school === void 0 ? void 0 : school.schoolLocation[1], school === null || school === void 0 ? void 0 : school.schoolLocation[0]));
            // console.log(distance)
            // console.log(getDistanceFromLatLonInKm(-4.32,15.29,48.85,2.35))
            const teacher = yield teacher_model_1.Teacher.findOne({ teacherClasseIdentifiant: student === null || student === void 0 ? void 0 : student.studentClasseIdentnifiant });
            // console.log('teacher')
            // console.log(teacher)
            if (distance >= 0.1) {
                console.log('events time');
                index_1.io.emit('onFarAway', {
                    message: `l'élève est éloigné de ${distance} de l'école`,
                    noms: `${student === null || student === void 0 ? void 0 : student.studentName} ${student === null || student === void 0 ? void 0 : student.studentLastname}`,
                    parentPhone: (student === null || student === void 0 ? void 0 : student.teacherId) && 'teacherPhone' in student.teacherId ? student.teacherId.teacherPhone : ''
                });
                if (teacher) {
                    teacher === null || teacher === void 0 ? void 0 : teacher.notification.push([`${student === null || student === void 0 ? void 0 : student.studentName} ${student === null || student === void 0 ? void 0 : student.studentLastname}`, `l'élève est éloigné de ${distance} de l'école`, `${new Date().toLocaleDateString()}`, `${student === null || student === void 0 ? void 0 : student.studentPhone}`]);
                    yield teacher.save();
                }
            }
            index_1.io.emit('presence', { noms: `${student === null || student === void 0 ? void 0 : student.studentName} ${student === null || student === void 0 ? void 0 : student.studentLastname}`,
                parentPhone: (student === null || student === void 0 ? void 0 : student.teacherId) && 'teacherPhone' in student.teacherId ? student.teacherId.teacherPhone : '', time: new Date() });
            const date = new Date();
            if (teacher) {
                const dateString = date.toISOString().split('T')[0];
                const prensence = new presence_model_1.Presence({
                    studentName: `${student === null || student === void 0 ? void 0 : student.studentName} ${student === null || student === void 0 ? void 0 : student.studentLastname}`,
                    heure: `${date.getHours() + 1}: ${date.getMinutes()}`,
                    getDate: date.getTime(),
                    teacher: teacher === null || teacher === void 0 ? void 0 : teacher._id,
                    dateString
                });
                yield prensence.save();
                res.json({ success: true, distance: distance });
            }
            else {
                res.json({ success: true, distance: distance });
            }
        }
    }
    else {
        res.json({ success: false, message: 'token expire', redirect: true });
    }
}));
router.post('/admin-password/safe', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userPassword } = req.body;
    try {
        const admin = yield admin_model_1.Admin.findById(req.session.user.adminId);
        if ((admin === null || admin === void 0 ? void 0 : admin.adminPassword) && typeof admin.adminPassword === 'string') {
            const decodedPw = yield bcrypt_1.default.compare(userPassword, admin.adminPassword);
            if (!decodedPw) {
                res.render('adminLogin.ejs', { user: req.session.user, error: 'Mot de passe incorrect' });
            }
            else {
                req.session.user.verified = true;
                req.session.user.userName = admin.adminName;
                if (req.session.user.userName) {
                    return res.redirect('/');
                }
                res.redirect('/');
            }
        }
        else {
            throw new Error('Admin password not found or invalid');
        }
    }
    catch (e) {
        console.log(e);
    }
}));
router.post('/teacher-password/complet-login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { codeConfirmation } = req.body;
    if (!codeConfirmation) {
        res.render('teacherLogin.ejs', { user: req.session.user, error: 'Sorry!!!Entrer le code' });
    }
    try {
        const teacher = yield teacher_model_1.Teacher.findById(req.session.user.teacherId);
        const currentTime = new Date().getTime();
        if (!teacher || teacher.codeExpiretion == null) {
            return res.render('teacherLogin.ejs', { user: req.session.user, error: 'Informations de l\'enseignant manquantes ou code expiré' });
        }
        if (currentTime > teacher.codeExpiretion) {
            return res.render('teacherLogin.ejs', { user: req.session.user, error: 'Le code a expiré' });
        }
        if (codeConfirmation === teacher.confirmCode) {
            if (teacher) {
                teacher.isConfirmed = true;
                teacher.confirmCode = '';
                req.session.user.userName = `${teacher === null || teacher === void 0 ? void 0 : teacher.teacherName} ${teacher === null || teacher === void 0 ? void 0 : teacher.teacherLastname}`;
                req.session.user.classe = teacher.teacherClasse;
                if (req.session.user.userName) {
                    return res.redirect('/');
                }
                res.redirect('/');
            }
        }
        else {
            res.render('teacherLogin.ejs', { user: req.session.user, error: 'Code incorrect' });
        }
    }
    catch (err) {
        console.log(err);
    }
}));
router.get('/admin/as-teacher', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userEmail } = req.query;
    const teacher = yield teacher_model_1.Teacher.findOne({ teacherEmail: userEmail });
    console.log(userEmail);
    // not admin => confirm password by email
    const code = (0, generateCodeR_1.generateCode)();
    if (teacher) {
        teacher.confirmCode = code;
        teacher.codeExpiretion = new Date().getTime() + 5 * 60 * 1000;
        yield teacher.save();
        if (typeof teacher.teacherEmail === 'string') {
            yield (0, sendConfirmMail_1.confirmMail)(teacher.teacherEmail, code, 'Code de verification');
            req.session.user = { teacherId: teacher === null || teacher === void 0 ? void 0 : teacher._id, email: teacher === null || teacher === void 0 ? void 0 : teacher.teacherEmail };
            res.redirect('/teacher-password/complet-login');
        }
        else {
            throw new Error('Teacher email is missing or invalid');
        }
    }
}));
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Erreur de déconnexion' });
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});
// teacher action route
// =======
router.post('/add/teacher', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (body.teacherEmail) {
        const identifiant = `GTE-${(0, generateCodeR_1.generateCode)()}-${new Date().getFullYear().toString().slice(2, 3)}EE`;
        body.teacherIdentifiant = identifiant;
        const teacher = new teacher_model_1.Teacher(body);
        try {
            yield teacher.save();
            const teachers = yield teacher_model_1.Teacher.find({});
            res.json({ success: true, data: teachers });
        }
        catch (error) {
            if (error instanceof Error) {
                res.json({ success: false, message: error.message });
            }
        }
    }
    else {
        console.log('not data');
    }
}));
// add stuedent
//,upload.single('studentProfil')
router.post('/add-student', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    // const file=req.file
    console.log(body);
    if (body.studentName) {
        function createStudent() {
            return __awaiter(this, arguments, void 0, function* (attempt = 0) {
                if (attempt > 5) {
                    return res.json({ success: false, message: 'Impossible de générer un identifiant unique après plusieurs tentatives' });
                }
                body.identifiant = `25-${(0, generateCodeR_1.generateCode)()}-EC20`;
                console.log(body);
                const student = new student_model_1.Student(body);
                try {
                    yield student.save();
                    return res.json({ success: true });
                }
                catch (error) {
                    if (error instanceof Error) {
                        console.error(error.message);
                        // Vérifie si c’est une erreur MongoDB de duplication
                        // @ts-ignore
                        if (error.code === 11000) { // Erreur de duplication
                            return createStudent(attempt + 1);
                        }
                        return res.json({ success: false, message: error.message });
                    }
                    return res.json({ success: false, message: 'Erreur inconnue' });
                }
            });
        }
        createStudent();
    }
}));
router.get('/get-classes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const classes = yield class_model_1.Class.find({});
    res.json({ data: classes });
}));
