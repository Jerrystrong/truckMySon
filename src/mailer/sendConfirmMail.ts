import { transporter } from "./transporter"


const confirmMail=async (destinateur:string,code:string)=>{
    try{
        const message=await transporter.sendMail({
            from:'Team gestion Eleve <supportgestion@gmail.com>',
            to:destinateur,
            subject:'Confirmation log in',
            text:'Utiliser le code pour confirmer le code',
            html:`<div>
                    <h1>Code de verification</h1>
                    <div style="background-color:#7AC6D2;color:#fefefe;padding:10px;width:fit-content;border-radius:10px">
                        ${code}
                    </div>
                    <p>Ou <a href="http://localhost:3003/teacher-password/complet-login">Cliqué ici</a></p>
                </div>`
        })
    }catch(err){
        console.log(err)
    }
}
export {confirmMail}