const express = require("express");

const billModel = require("../Models/billmodel");

const router = express.Router();

//add bill
const UserModel = require('../Models/consumer');

router.post("/add", async (req, res) => {
  try {
    let input = req.body;

    // Retrieve the user's ID based on the house number
    const user = await UserModel.findOne({ housenumber: input.housenumber });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found for the provided house number",
      });
    }

    let unitPrice = 20;
    let inputUnit = input.meterReading;
    let calculatedTotalPrice = unitPrice * inputUnit;

    // Create a new bill with the user's ID
    let newBill = new billModel({
      consumerId: user._id, // Assuming the user ID field is 'consumerId'
      housenumber: input.housenumber,
      meterReading: input.meterReading,
      totalPrice: calculatedTotalPrice,
    });
    await newBill.save();

    res.status(200).json({
      status: "success",
      totalPrice: calculatedTotalPrice,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: "Something went wrong in adding the bill",
    });
  }
});


router.post("/viewbill", async (req, res) => {
  try {
    let userid = req.body.userid; // Change to use userid instead of housenumber
    console.log(userid);

    let userData = await UserModel.findOne({ _id: userid }); // Find user data by userid
    if (userData) {
      let id = userData._id;
      let billdata = await billModel.find({ consumerId: id });
      if (billdata) {
        res.json(billdata);
      } else {
        res.json({ status: "No bill found for the given user ID" });
      }
    } else {
      res.json({ status: "Invalid user ID" });
    }
  } catch (error) {
    console.log("Error fetching bill data:", error);
    res.status(500).json({ status: "Error fetching bill data" });
  }
});

router.post("/updateStatus", async (req, res) => {
  let id = req.body.id
  console.log(id)
  let data = await billModel.findById(id)
  if (data) {
    data.status = true
    await data.save()
    console.log(data)
    res.status(200).json({ status: "success", updatedData: data })
  }
  else {
    res.json({ status: "no data found with userid", id })
  }

})

//view all bills
router.get("/viewall", async (req, res) => {
  try {
    let paid = await billModel.find({ status: true })
    let unPaid = await billModel.find({ status: false })
    res.json({
      status: "success",
      paid: paid,
      unPaid: unPaid
    })

  } catch (error) {
    console.error(error)
    res.json({
      status: "error",
      message: "somthing went wrong in view all bills"
    })
  }
})


module.exports = router;