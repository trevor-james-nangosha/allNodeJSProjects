import express, { urlencoded,json } from "express";
import mongoose from "mongoose";
import connectDB from "./config/dbConn.js";
import Student from "./models/Student.js";

//defining the consonants
const app =  express();
const port = process.env.PORT || 3000

//the middleware
app.use(json())
app.use(urlencoded())

//connecting to the DB
connectDB();

//the routes
app.get('/', (req, res) => {
    res.json({
        "route": "/",
        "message": "this is the home page."
    })
})

// API to return a JSON of all the students
app.get('/students', (req, res) => {
    Student.find((error, students) => {
        if(!error){
            res.json(students)
        }else{
            console.log(error)
        }
    })
}) 

//API to return a particular user depending on their studentID
app.get('/students/:studentID', (req, res) => {
    Student.findOne(req.params, (error, student) => {
        if(!error){
            if(!student){
                res.status(400).send("Student not found.....")
            }else if(student){
                res.json(student)
            }
        }else if(error){
            console.log(error)
        }
    })
})

//an API to return the name of the course of a particular user
app.get('/students/:studentID/course/:courseName', (req, res) => {
    Student.findOne(req.params, (error, student) => {
        if(!error){
            if(!student){
                res.status(400).send("Student not found.....")
            }else if(student){
                res.json(student)
            }
        }else if(error){
            console.log(error)
        }
    })
    // res.send(req.params)
})

//for invalid 404 requests
app.get('*', (req, res) => {
    res.status(404).send("Page not found....")
})

mongoose.connection.once("open", () => {
    console.log("connected to mongoDB..........");
    app.listen(port, () => {
        console.log(`Server started on port ${port}..........`)
    })
})
