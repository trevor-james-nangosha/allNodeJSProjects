//################################THE FOLLOWING CODE FAILED##############################################

let amin = new Student({
    studentID: "21/U/49382",
    name: "henry joseph philip",
    email: "hjphilip@gmail.com",
    dateOfBirth: new Date(2002, 4, 18),
    course: {
        courseID: "MUK2918",
        courseName: "Bachelor of Science in Mechanical Engineering"
    },
    telephoneNumber: "+256(0)-772-765-144"
})

amin.save((error) => {
    if(!error){
        console.log("user saved.....")
    }
})
//#########################################################################################################
