const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt')
const {usersdb,admindb}=require("../Models")

module.exports.signupUser=async (req,res)=>{
    const {name,email,password,image,isAdmin}=req.body;
    let data=null;
    try{
    if(await usersdb.findOne({email:email})){
        return res.status(208).json({
            ok:false,
            message:"User Already exists in the system"
        })
    }
    if(name && (email && new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$").test(email)) && password){
        if(image){
            data=await usersdb.create({
                name:name,
                email:email,
                password:bcrypt.hashSync(password,8),
                image:image
            })
        }else{
            data=await usersdb.create({
                name:name,
                email:email,
                password:bcrypt.hashSync(password,8),
                image:null
            })
        }
        if(isAdmin){
            const admin=await admindb.create({
                adminUser:data._id
            })
            await data.update({
                isAdmin:admin._id
            })
        }
    }
    else{
        return res.status(400).json({
            ok:false,
            message:"Invalid Request"
        })
    }
    if(data){
        return res.status(201).json({
            ok:true,
            message:"User Added Successfully"
        })
    }    
    }catch(error){
        console.log(error)
        return res.status(503).json({
            ok:false,
            message:"Internal error please try again later"
        })
    }
}

module.exports.changePassword=async (req,res)=>{
    const {email,password,confirmPassword}=req.body;
    if(!(password)||!(confirmPassword)||(password!==confirmPassword)){
        return res.status(405).json({
            ok:false,
            message:"Passwords are invalid"
        })
    }
    const user=await usersdb.findOne({email:email});
    if(user){
        await user.update({password:bcrypt.hashSync(password,8)});
        return res.status(200).json({
            ok:true,
            message:"Password Updated Successfully"
        })
    }else{
        return res.status(404).json({
            ok:false,
            message:"invalid Email ID"
        })
    }
}

module.exports.signinUser=async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await usersdb.findOne({email:email})
        if (!user || !(bcrypt.compareSync(password,user.password))){
            return res.status(401).json({
                ok:false,
                message: "Invalid username or password",
            });
        }
        return res.status(200).json({
            message: "Sign in successful, here is your token, please keep it safe!",
            ok:true,
            data:  {
                token: jwt.sign(user.toJSON(),process.env["SECRET"], {expiresIn:  '60m'}),
                userId:user.id,
                userName:user.name,
                image:user.image,
                isAdmin:user.isAdmin
            }
        })
    }catch(error){
        console.log(error)
        return res.status(503).json({
            ok:false,
            message:"Internal server error"
        })
    }
}