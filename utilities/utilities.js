// import { v4 as uuidv4 } from 'uuid'
const { uuidv4 } = require('uuid');

module.exports = generateRegistrationNumber = () => {
    const randomString = uuidv4();
    const registrationNumber = '21/U/' + randomString.slice(9,13).toUpperCase();
    return registrationNumber;
}

module.exports = generateStudentNumber = () => {
    const randomString = uuidv4();
    const studentNumber = '2100' + randomString.slice(0,6).toUpperCase();
    return studentNumber;
}