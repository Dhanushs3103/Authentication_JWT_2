// packages6
let dotenv = require("dotenv").config()
let express = require("express")

//local imports
let connection = require("./config/db.connect.js");
let PORT = parseInt(process.env.PORT,10) || 3005 // port number
let authRouter = require("./routes/auth.routes.js")

// starting the server
let app = express()

//middlewares
app.use(express.json())
app.use('/auth',authRouter)

//home route 
app.get("/",(req,res)=>{
    res.send("Server is running fine")
})

// server is listening at port and connected to DB
app.listen(PORT, async()=>{
    try {
        await connection;
        console.log(`Server is running at the port ${PORT} and connected to DB`)
    } catch (error) {
        console.log(error);
    }
})

