import express, { urlencoded,json } from "express";
import mongoose from "mongoose";
import connectDB from "./config/dbConn.js";
import Student from "./models/Student.js";
import session from 'express-session';
import MongoStore from "connect-mongo";

//defining the consonants
const app =  express();
const port = process.env.PORT || 3000

//the middleware
app.use(json())
app.use(urlencoded())
app.use(session({
    secret: "the sessions secret",
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/sessionsDB',
        collection: 'sessions'
    }),
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 5*60*1000 //i want five minutes
    }
}))

//connecting to the DB
connectDB();

//the routes
//this is the home page for logged in users
app.get('/', (req, res) => {
    if(req.session.isAuth){
        res.status(200).send("welcome to the home page")
    }else{
        res.status(200).send("you cannot access the home page......")
    }
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

//TODO
//check if mongoDB allows a data type of object,
// like if you want to have something like this
//course: {
//     courseID: "MUK2918",
//     courseName: "Bachelor of Science in Mechanical Engineering"
// }



//our dummy form
const provideLoginDetails = (studentNumber, email) => {
    return [studentNumber, email]
}

const loginAuthenticatedUser = (req, res) => {
    req.session.isAuth = true;
    res.redirect('/')
}

const authenticateUser = (studentID, email) => {
    const user = Student.findOne({studentID: studentID, email: email}, (error, student) => {
        if(!error){
            if(!student){
                console.log("student not found....")
            }else if(student){
                console.log(student)
            }
        }else if(error){
            console.log(error)
        }
    })
    return user
}

app.get('/login', (req, res) => {
    const details = provideLoginDetails("21-U-1519", "trevornangosha16@gmail.com")
    const isValidUser = authenticateUser(details[0], details[1])
    console.log(isValidUser)
    if(isValidUser == undefined || isValidUser == false){
        res.status(400).send("Invalid login details....")
    }else{
        loginAuthenticatedUser(req, res)
    }
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
