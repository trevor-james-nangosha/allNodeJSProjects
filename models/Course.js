// import mongoose from "mongoose";
const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    courseCode: String,
    courseName: String
})

// export default mongoose.model("Course", courseSchema);  
module.exports = mongoose.model('Course', courseSchema) 