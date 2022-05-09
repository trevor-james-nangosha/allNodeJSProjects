// import mongoose from "mongoose";
const mongoose = require('mongoose')
const DB_URI = "mongodb://localhost/students"

const connectDB =async () => {
    try {
        await mongoose.connect(DB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    } catch (error) {
        console.log(error)
    }
}

// export default connectDB;
module.exports = connectDB;