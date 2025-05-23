const Routes= require("./routes/Routes.js")

const express= require("express")
let app= express()
app.use(express.json())

const cors = require('cors');
app.use(cors())

const mongoose= require("mongoose")

require('dotenv').config()

const URI= process.env.MONGO_URI

mongoose.connect(URI,{}).then(console.log("MongoDB connected")).catch((e)=>{console.log(e)});

const rateLimit = require('express-rate-limit')

const limiter= rateLimit({
    windowMs: 1000,
    limit: 1
})

app.use(limiter)

app.use("/api/", Routes)

app.get("/", (req, res)=>{
    res.status(200).send("Vercel")
})

app.listen(8000,()=>{
    console.log("Port connected at 8000");
})