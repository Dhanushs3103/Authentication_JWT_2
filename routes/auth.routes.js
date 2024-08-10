//packages
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

//local imports
let SECRET_KEY_1 = process.env.SECRET_KEY_1;
let SECRET_KEY_2 = process.env.SECRET_KEY_2;
import UserModel from "../models/user.model.js";
let SALT_ROUNDS = process.env.SALT_ROUNDS;

//middleware as a parent route
let authRouter = express.Router();

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
authRouter.post("/login", async (req, res) => {});

//exporting the authRouter
export default authRouter;
