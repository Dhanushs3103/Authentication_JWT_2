// packages
import { decrypt } from "dotenv";
import mongoose from "mongoose";

//local imports

// creating user schema for storing users data

let userSchema = mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['librarian','member','guest'],
        required:true
    },
    age:{
        type:Number,
        required:true
    },

})

//creating  UserModel

let UserModel = mongoose.model('user',userSchema);

// exporting the UserModel
export default UserModel 