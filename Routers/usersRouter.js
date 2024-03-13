const express = require("express")
const subadminModel = require("../Models/Admin")
const consumermodel=require("../Models/consumer")
const meterReaderModel=require("../Models/meterReader")
const router = express.Router()
const bcrypt = require("bcryptjs")

const hashFunction = async (password) => {
    const Salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, Salt)
}

router.post("/addsubadmin", async (req, res) => {
    let data = req.body
    let password = data.password
    let hashedpassword=await hashFunction(password)
    data.password = hashedpassword
    let subAdminObj = new subadminModel(data)
    let result =await subAdminObj.save()
    res.json({
        status:"success",
        data:result
    })
})
router.post("/deletemember", async (req, res) => {
    try {
      const { _id } = req.body;
      const response = await subadminModel.deleteOne({ _id });
      if (response.deletedCount === 1) {
        res.json({ status: "success" });
      } else {
        res.status(404).json({ status: "error", message: "Member not found" });
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  });
  router.post("/checkUsernam", async (req, res) => {
    const { username } = req.body;
    const existingUser = await subadminModel.findOne({ username });
    if (existingUser) {
        res.json({ exists: true });
    } else {
        res.json({ exists: false });
    }
});



router.post("/addconsumer", async (req, res) => {
    let data = req.body
    let password = data.password
    let hashedpassword=await hashFunction(password)
    data.password = hashedpassword
    let consumerObj = new consumermodel(data)
    let result =await consumerObj.save()
    res.json({
        status:"success",
        data:result
    })
})

router.post("/addmeterReader", async (req, res) => {
    let data = req.body
    let password = data.password
    let hashedpassword=await hashFunction(password)
    data.password = hashedpassword
    let meterReaderModelObj = new meterReaderModel(data)
    let result =await meterReaderModelObj.save()
    res.json({
        status:"success",
        data:result
    })
})

router.post("/login", async (req, res) => {
    let username = req.body.username
    let inputpassword = req.body.password
    const adminusername = "admin"
    const adminpassword = "admin"
    
    if (username === adminusername && inputpassword === adminpassword) {
        return res.json({ status: "admin login success" })
    }

    let data = await subadminModel.findOne({ username: username })
    if (!data) {
        let consumerdata = await consumermodel.findOne({ username: username })
        if (!consumerdata) {
            let metreReaderdata = await meterReaderModel.findOne({ username: username })
            if (!metreReaderdata) {
                return res.json({ status: "invalid user" })
            }
            let dbpassword = metreReaderdata.password
            const match = await bcrypt.compare(inputpassword, dbpassword)
            if (!match) {
                return res.json({ status: "invalid password" })
            }
            return res.json({ status: "meterReader login success" })
        }
        let dbpassword = consumerdata.password
        const match = await bcrypt.compare(inputpassword, dbpassword)
        if (!match) {
            return res.json({ status: "invalid user password" })
        }
        return res.json({ status: "user login success" })
    }

    let dbpassword = data.password
    if (!dbpassword) {
        return res.json({ status: "invalid user" })
    }
    const match = await bcrypt.compare(inputpassword, dbpassword)
    if (!match) {
        return res.json({ status: "invalid password" })
    }
    res.json({ status: "login subadmin successfull" })
})
router.post("/viewsubadmin",async(req,res)=>
{
    let result=await subadminModel.find()
    res.json(result)
})
module.exports = router