import { v4 as uuidv4 } from 'uuid'

export const generateRegistrationNumber = () => {
    const randomString = uuidv4();
    const registrationNumber = '21/U/' + randomString.slice(9,13).toUpperCase();
    return registrationNumber;
}

export const generateStudentNumber = () => {
    const randomString = uuidv4();
    const studentNumber = '2100' + randomString.slice(0,6).toUpperCase();
    return studentNumber;
}

// export const hashPassword = () => {

// }

// export const comparePasswords = () => {

// }