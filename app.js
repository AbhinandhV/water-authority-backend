const express=require("express")
const mongoose=require("mongoose")
const cors=require("cors")

//alias name
const app=express()

 //Router
const userRouter=require("./Routers/usersRouter")
const connectionRouter=require("./Routers/connectionRouter")

//middlewear
app.use(express.json())
app.use(cors())

 //Connection with db
mongoose.connect("mongodb+srv://abhinandh:jazz9333@cluster0.ubk8s.mongodb.net/waterauthoritydb?retryWrites=true&w=majority",
{
    useNewUrlParser:true
})

//api
app.use("/waterauthority",userRouter)
app.use("/waterauthorityConnection",connectionRouter)

//startserver
app.listen(3000,()=>
{
   console.log("Server Running") 
})

