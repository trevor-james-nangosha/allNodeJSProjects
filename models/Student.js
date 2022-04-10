import mongoose from "mongoose"

// the reason i am using the mongoDB paradigm
// is because my data is not so structured and i will not
// need any kind of major relationships between my data instances

const studentSchema = new mongoose.Schema({
    studentID: String ,
    name: {type: String, required: true},
    email: {type: String, unique: true},
    dateOfBirth: Date,
    dateStudentAccountCreated: {type: Date, default: Date.now},
    course: {
        courseID: String,
        courseName: String
    },
    telephoneNumber: String,
})

export default mongoose.model("Student", studentSchema);   