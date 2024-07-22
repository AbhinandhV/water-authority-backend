const express = require("express")
const nodemailer=require("nodemailer")
const subadminModel = require("../Models/Admin")
const consumermodel=require("../Models/consumer")
const meterReaderModel=require("../Models/meterReader")
const complaint=require("../Models/Complaint")
const router = express.Router()
const bcrypt = require("bcryptjs")
const { model } = require("mongoose")


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




// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'abhinandh9333@gmail.com',
      pass: 'niml qswx awtj ljzv', // Enter your password here
    },
    tls: {
        rejectUnauthorized: false, // Ignore certificate validation
      },
  });
  
  // Define a route for sending emails
  router.post('/sendEmail', (req, res) => {
    const { to, subject, text, username, password, name } = req.body;
    const mailOptions = {
      from: 'abhinandh9333@gmail.com',
      to,
      subject,
      text: `Welcome to Water Authority APP\n\nName: ${name}\nUsername: ${username}\n${text}`,
      auth: {
        password: password, // Use the provided password
      }
    };
  
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully' });
      }
    });
  });

  function generateResetToken() {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return token;
}
const emailLinkHandlerUrl = 'http://192.168.1.3:3000/waterauthority/resetPassword';
//email handler
router.get('/emailLinkHandler', (req, res) => {
    // Retrieve the token from the request query parameters
    const { token } = req.query;
  

    // Handle the email link here and send the reset token in the response
    if (token) {
        // Token received, you can further process it if needed
        res.status(200).json({token });
        console.log(token);
    } else {
        // Token not found in the request, send an error response
        res.status(400).json({ error: 'Token not provided' });
    }
});

// Route to initiate password reset
router.post('/forgotPassword', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the email exists in the database
        const user = await subadminModel.findOne({ subadmin_email: email });
        if (user) {
            console.log(`Password reset requested for email: ${email}`);
            // Generate a reset token
            const resetToken = generateResetToken();

            // Save the reset token to the user's document in the database
            user.resetToken = resetToken;
            await user.save();

            // Create the password reset link
            // const resetLink = `http://10.0.19.186:3000/emailLinkHandler?token=${resetToken}`;
            // const emailLinkHandlerUrl = 'http://10.0.19.186:3000/emailLinkHandler'; // Define the URL

            // Generate the reset link with the token
            const resetLink = `${emailLinkHandlerUrl}?token=${resetToken}`;
            console.log(resetLink);


            // HTML body of the email with the password reset link
            const htmlBody = `
              <p> ${resetToken}To reset your password, click on the following link:</p>
              <a href="${resetLink}">Reset Password</a>
            `;

            // Send email with HTML body
            const mailOptions = {
                from: 'abhinandh9333@gmail.com',
                to: email,
                subject: 'Password Reset',
                html: htmlBody,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    res.status(500).json({ error: 'Failed to send email' });
                } else {
                    console.log('Email sent:', info.response);
                    res.status(200).json({ message: 'Email sent successfully' });
                }
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error initiating password reset:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/resetPassword', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Find the user associated with the reset token
        const user = await subadminModel.findOne({ resetToken: token });
        if (user) {
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password and clear the reset token
            user.password = hashedPassword;
            user.resetToken = undefined;
            await user.save();

            // Password reset successful
            res.status(200).json({ message: 'Password reset successfully' });
        } else {
            // Token is invalid or expired
            res.status(400).json({ error: 'Invalid or expired reset token' });
        }
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

  
router.post("/deletemember", async (req, res) => {
    try {
      const { _id } = req.body;
      const response = await subadminModel.deleteOne({ _id });
      const response2 = await meterReaderModel.deleteOne({ _id });
      if (response.deletedCount === 1||response2.deletedCount===1) {
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
    const existingadmin = await subadminModel.findOne({ username });
    const existingmeterReader = await meterReaderModel.findOne({ username });
    const existingmeterUser = await consumermodel.findOne({ username });
    if (existingadmin||existingmeterReader||existingmeterUser) {
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
    let username = req.body.username;
    let inputpassword = req.body.password;
    const adminusername = "admin";
    const adminpassword = "admin";
    
    if (username === adminusername && inputpassword === adminpassword) {
        console.log("admin login");
        return res.json({ status: "admin login success", userData: { userId: 'admin', username: adminusername } });
    
        
    }

    let data = await subadminModel.findOne({ username: username });
    if (!data) {
        let consumerdata = await consumermodel.findOne({ username: username });
        if (!consumerdata) {
            let metreReaderdata = await meterReaderModel.findOne({ username: username });
            if (!metreReaderdata) {
                return res.json({ status: "invalid user" });
            }
            let dbpassword = metreReaderdata.password;
            const match = await bcrypt.compare(inputpassword, dbpassword);
            if (!match) {
                return res.json({ status: "invalid password" });
            }
            return res.json({ status: "meterReader login success", userData:metreReaderdata });
        }
        let dbpassword = consumerdata.password;
        const match = await bcrypt.compare(inputpassword, dbpassword);
        if (!match) {
            return res.json({ status: "invalid user password" });
        }
        return res.json({ status: "user login success", userData:consumerdata});
    }

    let dbpassword = data.password;
    if (!dbpassword) {
        return res.json({ status: "invalid user" });
    }
    const match = await bcrypt.compare(inputpassword, dbpassword);
    if (!match) {
        return res.json({ status: "invalid password" });
    }
    res.json({ status: "login subadmin successfull", userData:data });
});

router.post("/viewsubadmin",async(req,res)=>
{
    let result=await subadminModel.find()
    res.json(result)
})
router.post("/viewmeterReader",async(req,res)=>
{
    let result=await meterReaderModel.find()
    res.json(result)
})
router.post("/viewConsumer",async(req,res)=>
{
    let result=await consumermodel.find()
    res.json(result)
})
router.post("/searchuser",async(req,res)=>
{
    let id=req.body._id
    console.log(id)
    let consumerdata=await consumermodel.findById(id)
    let meterdata=await meterReaderModel.findById(id)
    if(consumerdata)
    {
    res.json({status:"success",data:consumerdata})
    }
    if(meterdata)
    {
    res.json({status:"success",data:meterdata})
    }

})
router.post("/searchHome",async(req,res)=>
{
    let data=await consumermodel.findOne({ housenumber:req.body.housenumber})
    if(data)
    {
        res.json({status:"success",data:data})
    }
    else{
        res.json({status:"error",message:"no data found"})
    }
})
router.post("/complaint",async(req,res)=>
{
  let data=req.body
  console.log(data)
  if(data)
    {
        let complaintmodel=new complaint(data)
       
        complaintmodel.save()
        return(res.status(200).json({
            status:"success",data:data
        }))
    }
    res.json({
        status:"data not recieved"
    })
    
})
router.post("/viewcomplaints",async(req,res)=>{
    try {
        let data=await complaint.find().populate("consumerId").exec()
        return res.status(200).json({
            status:"success",
            data:data
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            status:'error',
            message:"internal sever error"
        })
    }
})
module.exports = router