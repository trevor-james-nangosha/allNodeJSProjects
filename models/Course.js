import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    courseCode: String,
    courseName: String
})

export default mongoose.model("Course", courseSchema);   