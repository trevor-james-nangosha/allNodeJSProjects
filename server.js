//alway a good idea to separate the app from the server, hence this file

// import app from "./app.js";
// import mongoose from 'mongoose';

const app = require('./app.js')
const mongoose = require('mongoose')

const port = process.env.PORT || 3000

mongoose.connection.once("open", () => {
    console.log("connected to mongoDB..........");
    app.listen(port, () => {
        console.log(`Server started on port ${port}..........`)
    })
})