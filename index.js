// packages
import dotenv from "dotenv"
dotenv.config();
import express from "express"

//local imports
import connection from "./config/db.connect.js"
let PORT = process.env.PORT // port number
import authRouter from "./routes/auth.routes.js";

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

