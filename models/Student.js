import mongoose from "mongoose"
import Course from "./Course.js";

const studentSchema = new mongoose.Schema({
    studentNumber: {type: String, required: true, unique: true},
    registrationNumber: {type: String, required: true, unique:true},
    password: {type: String, required: true, unique: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, unique: true},
    dateOfBirth: Date,
    homeDistrict: String,
    gender: String,
    nationality: String,
    nextOfKin: String,
    nextOfKinPhoneNumber: String,
    religion: String,
    NIN: {type: String},
    dateStudentAccountCreated: {type: Date, default: Date.now},
    course: {type: mongoose.Schema.Types.ObjectId, ref: Course},
    telephoneNumber: String,

})

export default mongoose.model("Student", studentSchema);   