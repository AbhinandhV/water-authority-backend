const mongoose = require("mongoose");

const billModel = new mongoose.Schema({
  consumerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "consumerdb",
    required: true,
  },
  date:{
    type:Date,
    required:true,
    default:Date.now()
  },
  meterReading:{
    type:Number,
    required:true
  },
  totalPrice:{
    type:Number,
    default:0
  },
  status:{
    type:Boolean,
    default:false
  }
});

module.exports=mongoose.model("bills",billModel)