import express, { urlencoded,json } from "express";
import mongoose from "mongoose";
import connectDB from "./config/dbConn.js";
import Student from "./models/Student.js";
import session from 'express-session';
import MongoStore from "connect-mongo";
import cors from 'cors'
import bcrypt from 'bcrypt'
import { generateRegistrationNumber } from "./utilities/utilities.js";
import { generateStudentNumber } from "./utilities/utilities.js";

//TODO
//how to set up ejs for template rendering
//look at the mongoDB error codes and how to fix them
//download the TODO VSCode extension
//look at the E11000 that is making my mongodb code fail

//defining the consonants
const app =  express();
const port = process.env.PORT || 3000

app.use(json())
app.use(urlencoded())
app.set('view engine', 'ejs');
app.use(cors())
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

connectDB();

app.get('/', (req, res) => {
    if(req.session.isAuth){
        res.status(200).send("welcome to the home page")
    }else{
        res.status(200).send("please login to access site services......")
    }
})

app.get('/students', (req, res) => {
    if(req.session.isAuth){
        Student.find((error, students) => {
            if(!error){
                res.json(students)
            }else{
                console.log(error)
            }
        })
    }else{
        res.redirect('/');
    }
    
}) 

app.get('/v1/students/:studentID', (req, res) => {
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
})

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
    //this thing is authenticating even for an empty database
    //TODO
    //fix that
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


//something is wrong here
//the student model is not creating and saving the database instance
app.post('/students', async (req, res) => {
    const {password, firstName, lastName, email} = req.body       
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt).then((hashedPassword) => {
            const newStudent = new Student({
                studentNumber: generateStudentNumber(),
                registrationNumber: generateRegistrationNumber(),
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword
            })
            newStudent.save((error, student) => {
                if(!error){
                    res.send("student saved.........")
                }else{
                    console.log(`error`)
                }
            })
        }).catch((error) => {
            console.error(`error`)
        })
    } catch (error) {
        console.log(error)
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
