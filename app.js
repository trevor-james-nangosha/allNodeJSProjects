const { urlencoded, json } = require('express')
const express = require('express')
const connectDB = require('./config/dbConn.js')
const Student = require('./models/Student.js')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cors = require('cors')
const bcrypt = require('bcrypt')
const { generateRegistrationNumber, generateStudentNumber } = require('./utilities/utilities.js')

// import express, { urlencoded,json } from "express";
// import connectDB from "./config/dbConn.js";
// import Student from "./models/Student.js";
// import session from 'express-session';
// import MongoStore from "connect-mongo";
// import cors from 'cors'
// import bcrypt from 'bcrypt'
// import { generateRegistrationNumber, generateStudentNumber } from "./utilities/utilities.js";

//TODO;
//implement the login functionality for the students using their student numbers and passwords
//do the functionality where students can add the remaining fields to their profiles

//for each day, write some tests for my code and contemplate the advantages of Test Driven Development
//with tests, you do not fear making changes to the code.
//every test function should have only one assert statement

//learn how to log for nodeJS, 'cause the errors in the terminal are not very useful
//also, how to debug for nodeJS', using the launch.json file  

//do not store important data like user names and passwords inside the session cookies


//defining the consonants                  
const app =  express();

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
        res.status(200).sendFile('/home/nangosha/PERSONAL PROJECTS/allNodeJSProjects/index.html')
        console.log(req.session)
    }else{
        res.status(403).send("please login to access site services......")
    }
})

//returns all students
app.get('/v1/students', (req, res) => {
    if(req.session.isAuth){
        Student.find((error, students) => {
            if(!error){
                // res.sendStatus(403).json(students)
                res.sendStatus(403)
            }else{
                console.error(error)
            }
        })
    }else{
        // res.sendStatus(200).redirect('/');
        res.sendStatus(200)
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
                    console.log(student) 
                    bcrypt.compare(password, student.password)
                    .then(result => {
                        if(result){
                            req.session.isAuth = true
                            req.session = student
                            res.redirect('/')
                        }else{
                            res.send('login, motherfucker......')
                        }
                    })            
                } catch (error) {
                    console.error(error)
                    res.send(error)
                }
            }
        }else{
            res.send(error)
        }
    })
})

//add a new student to our database
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
                    console.error(error)
                }
            })
        }).catch((error) => {
            console.error(error)
        })
    } catch (error) {
        console.error(error)
    }
})

app.post('/v1/students/details', (req, res) => {
    // if(req.session.isAuth){
    //     const {telephoneNumber, 
    //         homeDistrict, 
    //         gender, 
    //         nationality, 
    //         religion, 
    //         nextOfKin, 
    //         NIN, 
    //         dateOfBirth,
    //         nextOfKinPhoneNumber} = req.body
    //         Student.findOneAndUpdate()
    // }
    console.log(req.session)
})

//for invalid 404 requests
app.get('*', (req, res) => {
    res.status(404).send("Page not found....")
})


module.exports = app;