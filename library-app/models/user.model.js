const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    pass:{
        type:String,
        required:true
    },
    role:{
        type:[String],
        required:true,
        default:"creator",
        enum:["creator","viewer","view_all"]
    }
},{
    versionKey:false,
    timestamps:true
})
const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    userId: mongoose.Schema.Types.ObjectId
  },{versionKey:false,
    timestamps:true
  });
  
const UserModel=mongoose.model("user",userSchema)
const BookModel=mongoose.model("book", bookSchema)
module.exports={UserModel,BookModel}