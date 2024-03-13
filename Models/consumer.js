const mongoose=require("mongoose")
const consumermodel=new mongoose.Schema(
    {
        name:{
            required:true,
            type:String
        },
        phonenumber:{
            required:true,
            type:String
        },
        place:{
            required:true,
            type:String
        },
        email:{
            required:true,
            type:String
        },
        username:{
            required:true,
            type:String
        },
        password:{
            required:true,
            type:String
        }
    }
)

module.exports=mongoose.model("consumerdb",consumermodel)