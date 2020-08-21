const request = require('supertest');

const server = require('./server.js');
const db = require('../database/dbConfig.js');

describe('server', () => {
    describe('/register', () => {
        it('should regester a new user', async () => {
            await request(server).post('/api/auth/register').send({
                "username": "sammy",
                "password": "pass"
            });
            const users = await db('users');

            expect(users).toHaveLength(2);
        });

        it('should display a status 201 once created', async () => {
            const res = await request(server).post('/api/auth/register').send({
                "username": "person",
                "password": "pass"
            });
            
            expect(res.status).toBe(201);
        });
    });

    describe('/login', () => {
        it('should display a status 200 when logged in', async () => {
            const res = await request(server).post('/api/auth/login').send({
                "username": "sammy",
                "password": "pass"
            })

            expect(res.status).toBe(200);
        });

        it('should display a 401 when the incorrect login is provided', async () => {
            const res = await request(server).post('/api/auth/login').send({
                "username": "incorrect",
                "password": "incorrect"
            });

            expect(res.status).toBe(401);
        });
    });

    describe('/jokes', () => {
        it('should display a status 200 after logging in and making a request', async () => {
            const res = await request(server).post('/api/auth/login').send({
                "username": "sammy",
                "password": "pass"
            })

            const token = res.body.userToken;

            const response = await request(server).get('/api/jokes').set({ Authorization: token });

            expect(response.status).toBe(200);
        });

        it('should display a status 401 if the wrong creds are given', async () => {
            const response = await request(server).get('/api/jokes').set({ Authorization: "this is not a token" });

            expect(response.status).toBe(401);
        })
    });
});