import bcrypt from 'bcrypt'

const getHash= async (password:string)=>{
    const salt= await bcrypt.genSalt(10)
    const hash= await bcrypt.hash(password,salt) 
    console.log(hash)
}
export {getHash}