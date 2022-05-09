// import supertest from 'supertest'
// import app from '../app.js'
const app = require('../app.js')
const supertest = require('supertest')
const { request } = require('../app.js')

describe('GET v1/students', () => {

    // describe('given that the user is authenticated', () => {
    //     test('should respond with a 403 status code', async () => {
    //         const response = await supertest(app).get('/v1/students');
    //         expect(response.statusCode).toBe(403);
    //         // expect(response).toBeDefined()
    //     })
    // })

    describe('given that the user is not authenticated', () => {
        test('should respond with a 200 status code', async () => {
            const response = await supertest(app).get('/v1/students');
            expect(response.statusCode).toBe(200);
            // expect(response).toBeDefined()
        })
    })

})

describe('the home page', () => {

    describe('given that the user is not authenticated to  access the home page', () => {
        test('should respond with a 403 status code', async () => {
            const response = await supertest(app).get('/');
            expect(response.statusCode).toBe(403);
            // expect(response).toBeDefined()
        })
    })

})