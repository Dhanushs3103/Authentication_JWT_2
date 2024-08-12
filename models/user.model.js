// packages
let mongoose = require("mongoose");

//create schema for storing user details
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
        enum:["librarian","member","guest"],
        required:true
    },
    age:{
        type:Number,
        required:true
    }
},{
    versionKey:false
})

// creating UserModel out userSchema
let UserModel = mongoose.model("user",userSchema)

// exporting the UserModel
module.exports = UserModel;