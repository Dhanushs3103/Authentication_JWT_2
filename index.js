// packages
let dotenv = require("dotenv").config()
let express = require("express")

//local imports
let connection = require("./config/db.connect.js");
let PORT = parseInt(process.env.PORT,10) || 3005 // port number
let authRouter = require("./routes/auth.routes.js")
let libraryRouter = require("./routes/library.routes.js")
let cors = require("cors")

// starting the server
let app = express()

//middlewares
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }))
app.use(express.json())
app.use('/auth',authRouter)
app.use("/books",libraryRouter)

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

