// variables declaration
const waCall=document.getElementById('wa-call')
const normalCall=document.getElementById('normal-call')

const redirectFunction=(lien)=>{
    location.replace(lien)
}
let isPoupopEnseignant=false
/**
 * 
 * @param {Array<string>} userInfo 
 */
const setPoupop=(userInfo)=>{
    // console.log(userInfo)
    const infoUser=Array.from(userInfo)
    isPoupopEnseignant=!isPoupopEnseignant
    const poupopSignleUser=document.querySelector('#poupopSignleUser')
    const poopopContainer=document.querySelector('#poopopContainer')
    poupopSignleUser.classList.remove('hidden')
    poopopContainer.innerHTML=""
    infoUser.map((info)=>{
        const infos=Object.entries(info)
        poopopContainer.innerHTML=poopopContainer.innerHTML+`<div class="border border-slate-700 h-[50px] rounded-md py-1 px-3 flex flex-col">
            <small>${infos[0][0]}</small>
            <!-- <label class="text-slate-700">Jeremie KIMPIOKA</label> -->
            <input type="text" class="text-slate-700 focus:border-0 focus:outline-0 placeholder:text-slate-700 text-[14px]" placeholder="${infos[0][1]}" value="${infos[0][1]}">
        </div>`
    })
    console.log(infoUser)
    // infoUser.map((info)=>{console.log(Object.entries(info))})
}
const removeSingleuser=()=>{
    const poupopSignleUser=document.querySelector('#poupopSignleUser')
    poupopSignleUser.classList.add('hidden')
}

const addTeacher=()=>{
    const addTeacherEl=document.getElementById('addTeacher')
    addTeacherEl.classList.remove('hidden')
}
const removeAddTeache=()=>{
    const addTeacherEl=document.getElementById('addTeacher')
    addTeacherEl.classList.add('hidden')
}
const openStutentPoopop=(userInfo)=>{
    const poupopSignleStudent=document.querySelector('#poupopSignleStudent')
    const eleveContainer=document.querySelector('#eleveContainer')
    const studentName=document.getElementById('studentName')
    poupopSignleStudent.classList.remove('hidden')
    const infoUser=Array.from(userInfo)
    studentName.textContent=`${userInfo[1].Nom} ${userInfo[3].Prenom}`
    waCall.setAttribute('data-phone',userInfo[9].Tel)
    normalCall.setAttribute('data-phone',userInfo[9].Tel)
    infoUser.map((info)=>{
        const infos=Object.entries(info)
        eleveContainer.innerHTML=eleveContainer.innerHTML+`<div class="border border-slate-700 h-[50px] rounded-md py-1 px-3 flex flex-col">
            <small>${infos[0][0]}</small>
            <!-- <label class="text-slate-700">Jeremie KIMPIOKA</label> -->
            <input type="text" class="text-slate-700 focus:border-0 focus:outline-0 placeholder:text-slate-700 text-[14px]" placeholder="${infos[0][1]}" value="${infos[0][1]}">
        </div>`
    })
}
const openAddStudent=()=>{
    const addSignleStudent=document.getElementById('addSignleStudent')
    addSignleStudent.classList.remove('hidden')
}
const removeSingleEleve=()=>{
    const poupopSignleStudent=document.querySelector('#poupopSignleStudent')
    poupopSignleStudent.classList.add('hidden')
}
const removSingleEleve=()=>{
    const addSignleStudent=document.getElementById('addSignleStudent')
    addSignleStudent.classList.add('hidden')
}
// form feeds
const focusBorder=(e)=>{
    const emailContainer=document.querySelector('#emailContainer')
    const userEmail=document.querySelector('#userEmail')
    const submitButton=document.querySelector('#submitButton')
    if(userEmail.value !== ''){
        emailContainer.classList.add('outline-2')
        emailContainer.classList.add('outline-slate-700/70')
        if(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.value)){
            submitButton.removeAttribute('disabled')
            submitButton.classList.add('bg-slate-700')
            submitButton.classList.remove('bg-slate-700/50')
            submitButton.classList.add('hover:bg-slate-900')
        }else{
            submitButton.setAttribute('disabled','true')
            submitButton.classList.remove('bg-slate-700')
            submitButton.classList.add('bg-slate-700/50')
            submitButton.classList.remove('hover:bg-slate-900')
        }
    }else{
        emailContainer.classList.remove('outline-2')
        emailContainer.classList.remove('outline-slate-700/70')
    }
}

const setHiddenId=async()=>{
    const teacherClasse=document.getElementById('teacherClasse')
    const teacherClasseIdentifiant=document.getElementById('teacherClasseIdentifiant')
    const fetchD= await fetch('/get-classes')
    const json= await fetchD.json()
    const isRight=json.data.find((classObj) => { return teacherClasse.value === classObj.name })
    if(isRight){
        teacherClasseIdentifiant.classList.remove('hidden')
        teacherClasseIdentifiant.setAttribute('value',isRight.identifiant)
    }

    
}
// events
waCall.addEventListener('click',function(){
    const phoneNumber=this.dataset.phone
    window.open(`whatsapp://send?phone=${phoneNumber}`)
})
normalCall.addEventListener('click',function(){
    const phoneNumber=this.dataset.phone
    window.open(`tel:${phoneNumber}`)
})