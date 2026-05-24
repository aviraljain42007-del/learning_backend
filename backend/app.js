const express = require("express")
const cors = require("cors")
const cookieparser = require("cookie-parser")
const userroutes = require("./routes/userroutes")
const productroutes = require("./routes/productroutes")
const orderroutes = require("./routes/orderroutes")
const urlroutes = require("./routes/urlroutes")
const errorMiddleware = require("./middleware/errorMiddleware")
const mongoSanitize = require("express-mongo-sanitize")
const rateLimit = require("./middleware/rateLimiter")

const app = express()

app.use(express.json())
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))
app.use(cookieparser())

// Sanitize data against NoSQL query injection
//app.use(mongoSanitize())

// Apply rate limiting to all requests
// app.use(rateLimit)

app.use("/api" , userroutes)
app.use("/api", productroutes)
app.use("/api", orderroutes)
app.use("/api", urlroutes)

app.get("/" , (req , res) =>{
    res.send("api running")
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Centralized error handling middleware (MUST be last)
app.use(errorMiddleware)

module.exports = app

