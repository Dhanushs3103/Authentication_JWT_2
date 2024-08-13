//packages
let express = require("express");

//local imports
let BookModel = require("../models/book.model.js")
let {authenticate,authorize} = require("../middlewares/auth.middleware.js")

// initializing parent route
let libraryRouter = express.Router();

//route to post data to the DB
libraryRouter.post("/addBook",[authenticate,authorize(["librarian"])],async(req,res)=>{
    try {
        // destructuring the req.body
        let {title,genre,pages,publishedYear,author} = req.body;
        //checking if the already exits in the database
        let book = await BookModel.find({title});
        // if present -
        if(book.length > 0) {
            res.status(100).json({message:`Book with this title - ${title} already exits in the dataBase`})
        }
        // if not present -
        let newBook = new BookModel({
            title,genre,pages,publishedYear,author
        })
        // saving to the database
        await newBook.save();
        // sending the response back.
        res.status(201).json({message:"Book added successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
})

//route for getting data from the DB
libraryRouter.get("/allBooks",async(req,res)=>{
    try {
        //extracting data from database
        let books = await BookModel.find();
        //sending books data
        res.status(200).json({
            message:"Data received successfully",
            data:books
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:error})
    }
})

// the above routes is just for creating the books and accessing the books

// simple route for updating entire book 
libraryRouter.put("/updateBook",[authenticate,authorize(["librarian","member"])],(req,res)=>{
    res.status(201).json({message:"Book updated successfully"})
})

//simple route for updating book details
libraryRouter.patch("/updateBook",[authenticate,authorize(["librarian","member"])],(req,res)=>{
    res.status(201).json({message:"Book updated successfully"})
})

// simple delete route
libraryRouter.delete("/deleteBook",[authenticate,authorize(["librarian"])],(req,res)=>{
    res.status(201).json({message:"Book delete successfully"})
})


// exporting libraryRouter
module.exports = libraryRouter