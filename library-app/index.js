const express=require("express")
const mongoose=require("mongoose")
const connection=require("./config/db")
const route=require("./route/user.route")
require("dotenv").config()
const PORT=process.env.PORT
const app=express()
app.use(express.json())
app.use
app.use("/user",route)
app.listen(PORT,async()=>{
    try{
        await connection
        console.log(`Database is connected and listening on ${PORT}`)
    }
    catch(err){
        console.log(err)
    }
})