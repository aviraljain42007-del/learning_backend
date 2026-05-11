require("dotenv").config()


const app = require("./app")
const connectdb = require("./config/db")
const redisClient = require("./config/redis")

connectdb()
redisClient.connect().catch(console.error)
const PORT = process.env.PORT




app.listen(PORT , () => {
    console.log(`app is listening on port ${PORT} `)
})



