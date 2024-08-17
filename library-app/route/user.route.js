const mongoose=require("mongoose")
const {UserModel,BookModel}=require("../models/user.model")
const express=require("express")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const auth=require("../middleware/auth")
const role=require("../middleware/role")
require("dotenv").config()
const route=express.Router()

route.post("/register",async(req,res)=>{
    const {email,name,pass,role}=req.body
    try{
        const exist=await UserModel.findOne({name})
        if(exist){
            return res.send("User already register")
        }
        bcrypt.hash(pass,5,async(err,hash)=>{
            if(err){
                return res.send("Error while hashing password")
            }
            const user=new UserModel({
                email,
                name,
                pass:hash,
                role
            })
            await user.save()
            return res.status(200).json({message: "User registered successfully",user})
        })
    }
    catch(err){
        console.log(err)
        res.json({
            message:"server error"
        })
    }
})

route.post("/login",async(req,res)=>{
    const {email,pass}=req.body
    try{
        const user=await UserModel.findOne({email})
        if(!user){
            return res.status(400).json({message:"Register first"})
        }
        bcrypt.compare(pass,user.pass,(err,result)=>{
            if(err){
                return res.status(400).json({message:"Wrong credentials"})
            }
            if(result){
                const token=jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:process.env.JWT_EXPIRES_IN})
                res.status(200).json({message:"Login successful",token})
            }else{
                return res.status(400).json({message:"Wrong credentials"})
            }
        })
    }
    catch(err){
        console.log(err)
        res.json({
            message:"server error"
        })
    }
})

route.use(auth)

route.post('/create-books', role(['creator']), async (req, res) => {
    const { title, author } = req.body;
    try{
        const exist=await BookModel.findOne({title})
        if(exist){
            return res.send("book already exist")
        }
        const newBook = new BookModel({ title, author, userId: req.user._id });
        await newBook.save();
        res.status(201).json(newBook);
    }
    catch(err){
        console.log(err)
        res.json({
            message:"server error"
        })
    }
});

route.get("/get-books",role(['viewer']),async(req,res)=>{
    const userId=req.user._id
    try{
        const books=await BookModel.find({userId})
        return res.status(200).json({books})
    }
    catch(err){
        console.log(err)
        res.json({
            message:"server error"
        })
    }
})

route.get("/view-books",role(["view_all"]),async(req,res)=>{
    try{
        const books=await BookModel.find()
        if(!books){
            return res.send(400).json({message:"Books not available"})
        }
        return res.status(200).json({books})
    }
    catch(err){
        console.log(err)
        res.json({
            message:"server error"
        })
    }
})

route.patch("/update/:id",role(['creator']),async(req,res)=>{
    const payload=req.body
    const bookId=req.params.id
    const userId=req.user._id
    try{
        const book=await BookModel.findByIdAndUpdate({_id:bookId,userId:userId},payload,{new:true})
        if(!book){
            return res.send("Book not found or you are unauthorized for updating book")
        }
        res.status(200).json({message:"Book updated Successfully",book})
    }
    catch(err){
        console.log(err)
        res.json({
            message:"Error while updating book"
        })
    }
})

route.delete("/delete/:id",role(['creator']),async(req,res)=>{
    const bookId=req.params.id
    const userId=req.user._id
    try{
        const book=await BookModel.findOneAndDelete({_id:bookId,userId:userId})
        if(!book){
            res.send("Book not found")
        }
        res.status(200).json({message:"Book deleted successfully"})
    }
    catch(err){
        console.log(err)
        res.json({
            message:"Error while deleting book"
        })
    }
})

module.exports=route