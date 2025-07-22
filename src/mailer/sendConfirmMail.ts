import { transporter } from "./transporter"


const confirmMail=async (destinateur:string,code:string,title:string)=>{
    try{
        const link='<a href="https://truckmyson.onrender.com/teacher-password/complet-login">Cliqué ici</a>'
        const message=await transporter.sendMail({
            from:'Team gestion Eleve <supportgestion@gmail.com>',
            to:destinateur,
            subject:'Confirmation log in',
            text:'Utiliser le code pour confirmer votre connection',
            html:`<div>
                    <h1>${title}</h1>
                    <div style="background-color:#7AC6D2;color:#fefefe;padding:10px;width:fit-content;border-radius:10px">
                        ${code}
                    </div>
                    <p>Ou ${code==='Code de verification'?link:''}</p>
                </div>`
        })
    }catch(err){
        console.log(err)
    }
}
export {confirmMail}