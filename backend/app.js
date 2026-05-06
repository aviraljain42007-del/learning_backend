const express = require("express")
const cors = require("cors")
const cookieparser = require("cookie-parser")
const userroutes = require("./routes/userroutes")
const productroutes = require("./routes/productroutes")
const orderroutes = require("./routes/orderroutes")
const errorMiddleware = require("./middleware/errorMiddleware")
const mongoSanitize = require("express-mongo-sanitize")
const limiter = require("./middleware/rateLimiter")

const app = express()

app.use(express.json())
app.use(cors({
    origin : "https://localhost:5173",
    credentials : true
}))
app.use(cookieparser())

// Sanitize data against NoSQL query injection
app.use(mongoSanitize())

// Apply rate limiting to all requests
app.use(limiter)

app.use("/api/user" , userroutes)
app.use("/api", productroutes)
app.use("/api", orderroutes)

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

