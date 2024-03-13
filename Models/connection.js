const mongoose=require("mongoose")
const newconnection=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        place:{
            type:String,
            required:true
        },
        phonenumber:{
            required:true,
            type:String
        },
        applicationStatus:{
            default:false,
            type:Boolean
        }
    }
)
module.exports=mongoose.model("newConnection",newconnection)