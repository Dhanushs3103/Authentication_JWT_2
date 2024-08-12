//packages
let express = require("express");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt")

//local imports
let SECRET_KEY_1 = process.env.SECRET_KEY_1;
let SECRET_KEY_2 = process.env.SECRET_KEY_2;
let SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS,10);
let UserModel = require("../models/user.model.js");
const { model } = require("mongoose");
let authenticate = require("../middlewares/auth.middleware.js")

//middleware as a parent route
let authRouter = express.Router();

// function to generate accessToken
function generateAccessToken(payload) {
  try {
      return jwt.sign(payload, SECRET_KEY_1, { expiresIn: "15m" });
  } catch (error) {
      console.error("Error generating access token:", error);
      return null;
  }
}

// function to generate refreshToken
function generateRefreshToken(payload) {
  try {
      return jwt.sign(payload, SECRET_KEY_2, { expiresIn: "12h" });
  } catch (error) {
      console.error("Error generating refresh token:", error);
      return null;
  }
}

//Endpoint for registering the user
authRouter.post("/register", async (req, res) => {
  try {
    // destructuring the req.body
    let { userName, age, email, password, role } = req.body;
    // finding if the user already registered or not
    const user = await UserModel.find({ userName });
    //if present - sending res as user already registered please login
    if (user.length > 0) {
      return res.status(307).json({ message: "user already registered, please login." });
    }
    //Hashing the password before storing in the DB
    bcrypt.hash(password, SALT_ROUNDS, async (err, hash) => {
      try {
        if(err){
            res.status(500).json({message:err})
        }
        // If not present - Registering the new user
        const newUser = await UserModel({
            userName,password:hash,age,email,role
        });
        //saving the user to DB
        await newUser.save();
        //sending the response as user registered successfully
        res.status(201).json({message:"User Registered Successfully"})
      } catch (error) {
        console.log(error);
        res.status(500).send(error);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error });
  }
});

//Endpoint for login the user
authRouter.post("/login", async (req, res) => {
 try {
    //destructuring the credentials
    let {email, password} = req.body;
    // checking if the user is found in the DB
    const user = await UserModel.findOne({email});
    //if not present - responding user not found
    if(!user) return res.status(400).json({message:"User not found"})
    
    // If user present - comparing the password and generating token
    bcrypt.compare(password, user.password, async (err, result) =>{
      try {
        //checking if error is present
        if(err){
          res.status(500).send(err);
        }
        //checking if result is true or false
        if(result){
          let accessToken = generateAccessToken({role:user.role});
          let refreshToken = generateRefreshToken({role:user.role})
          //Checking if token exits or not
          if (!accessToken || !refreshToken) {
            return res.status(500).json({ message: "Error generating tokens" });
        }
         // Setting tokens as headers
         res.set('Access_Token', `Bearer ${accessToken}`);
         res.set('Refresh_Token', `Bearer ${refreshToken}`);
         //sending response as login successful
         res.status(200).json({message:"login successful",})
        }else{
          res.status(400).json({message:"Wrong credentials"})
        }

      } catch (error) {
        res.status(500).send(error)
        console.log(error);
        
      }
  });
    
 } catch (error) {
  console.log(error);
  res.status(500).json({message:error})
  
 }
});

// // testing route - delete it later
// authRouter.get("/users", authenticate, (req,res)=>{
//   res.send("Users data ...")
// })


//exporting the authRouter
module.exports = authRouter;
