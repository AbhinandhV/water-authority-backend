const mongoose=require("mongoose")

const meterReader= new mongoose.Schema(
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
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        approvedStatus:{
            default:false,
            type:Boolean
        }
    }

)
module.exports=mongoose.model("meterReader",meterReader)