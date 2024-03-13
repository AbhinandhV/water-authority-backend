const express=require("express")
const connectionModel=require("../Models/connection")
const router=express.Router()

router.post("/newconnection", async (req, res) => {
    let data = req.body
    let connectionObj = new connectionModel(data)
    let result =await connectionObj.save()
    res.json({
        status:"new application submitted",
        data:result
    })
})

module.exports=router