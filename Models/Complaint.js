const  mongoose  = require("mongoose");
const mongooseModel=new mongoose.Schema({
    consumerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "consumerdb",
        required: true,
      },
      complaint:{
        type:String,
        required:true
      },
      date:{
        type:Date,
        required:true,
        default:Date.now()
      },

})
module.exports=mongoose.model("complaint",mongooseModel)