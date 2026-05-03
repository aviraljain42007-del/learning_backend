require("dotenv").config()


const app = require("./app")
const connectdb = require("./config/db")
connectdb()
//console.log(process.cwd())
const PORT = process.env.PORT




app.listen(PORT , () => {
    console.log(`app is listening on port ${PORT} `)
})



