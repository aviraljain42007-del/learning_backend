const express = require("express")
const cors = require("cors")
const cookieparser = require("cookie-parser")
const userroutes = require("./routes/userroutes")
const productroutes = require("./routes/productroutes")
const orderroutes = require("./routes/orderroutes")
const app = express()
app.use(express.json())
app.use(cors({
    origin : "https://localhost:5173",
    credentials : true
}))
app.use(cookieparser())
app.use("/api/user" , userroutes)
app.use("/api",productroutes)
app.use("/api",orderroutes)

app.get("/" , (req , res) =>{
    res.send("api running")
})

module.exports = app