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

//TODO;
//implement the login functionality for the students using their student numbers and passwords

//DID YOU KNOW????
//async functions that take a callback return a promise in case a callback is not specified
//for example with the bcrypt compare api
//this thing has given me a really hard time to figure out, but thanks to the bcrypt documentation,
//i finally figured it out.

//defining the consonants                  
const app =  express();
const port = process.env.PORT || 3000

app.use(json())
app.use(urlencoded())
app.use(cors())
app.use(session({
    secret: "this is where you put whatever session secret that you want",
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

//returns all students
app.get('/v1/students', (req, res) => {
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


app.post('/v1/login', async (req, res) => {
    const {email, password} = req.body;
    Student.findOne({email}, (error,student) => {
        if(!error){
            if(!student){
                res.send("the student was not found........")
            }else{
                try {
                    // bcrypt.compare(password, student.password, (error, result) => {
                    //     console.log(result)
                    // })    
                    bcrypt.compare(password, student.password)
                    .then(result => {
                        if(result){
                            req.session.isAuth = true
                            res.redirect('/')
                        }else{
                            res.redirect('/v1/login')
                        }
                    })            
                } catch (error) {
                    res.send(error)
                }
            }
        }else{
            res.send(error)
        }
    })
})


app.post('/v1/students', async (req, res) => {
    const {password, firstName, lastName, email} = req.body       
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt).then((hashedPassword) => {
            const newStudent = new Student({
                studentNumber: generateStudentNumber(),
                registrationNumber: generateRegistrationNumber(),
                firstName,
                lastName,
                email,
                password: hashedPassword
            })
            newStudent.save((error, student) => {
                if(!error){
                    res.send("student saved.........")
                }else{
                    console.log(error)
                }
            })
        }).catch((error) => {
            console.error(error)
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
