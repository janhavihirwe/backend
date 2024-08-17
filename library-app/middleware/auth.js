const jwt=require("jsonwebtoken")
const {UserModel}=require("../models/user.model")
require("dotenv").config()

const auth=async(req,res,next)=>{
    if(!req.headers.authorization){
        return res.status(400).json({message:"Token is not provided"})
    }
    const token=req.headers.authorization.split(' ')[1]
    try{
        const decoded=jwt.verify(token,process.env.SECRET_KEY)
        if(!decoded){
            res.status(500).json({message:"Invalid token please login again"})
        }
        const user=await UserModel.findById(decoded.id)
        req.user=user
        next()
    }
    catch(err){
        res.status(500).json({message:"Invalid token"})
    }
}

module.exports=auth