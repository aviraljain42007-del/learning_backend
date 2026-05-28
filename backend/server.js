require("dotenv").config()


const app = require("./app")
const connectdb = require("./config/db")
const redisClient = require("./config/redis")


redisClient.connect().catch(console.error)
const PORT = process.env.PORT

const startserver = async () =>{
    await connectdb();
    app.listen(PORT , () => {
    console.log(`app is listening on port ${PORT} `)
})

}

startserver()








