// packages
let mongoose = require("mongoose");

//create schema for storing user details
let bookSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    author:{
        type:String,
        required:true
    },
    genre:{
        type:String,
        required:true
    },
    publishedYear:{
        type:Number,
        required:true
    },
    pages:{
        type:Number,
        required:true
    }
},{
    versionKey:false
})

// creating UserModel out userSchema
let BookModel = mongoose.model("book",bookSchema)

// exporting the UserModel
module.exports = BookModel;