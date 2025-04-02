const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const User = require('../src/models/User');
const { setupDatabase, userOne } = require('./fixtures/db');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(setupDatabase);

describe('Auth Routes', () => {
    describe('User Registration', () => {
        it('should register a new regular user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'testpass123',
                    role: 'user'
                })
                .expect(201);

            const user = await User.findById(response.body._id);
            expect(user).not.toBeNull();
            expect(user.role).toBe('user');
        });

        it('should register a new admin user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Admin User',
                    email: 'admin@example.com',
                    password: 'adminpass123',
                    role: 'admin'
                })
                .expect(201);

            const user = await User.findById(response.body._id);
            expect(user).not.toBeNull();
            expect(user.role).toBe('admin');
        });

        it('should not register user with invalid role', async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Invalid User',
                    email: 'invalid@example.com',
                    password: 'pass123',
                    role: 'superadmin' // invalid role
                })
                .expect(400);
        });

        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@test.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.name).toBe('Test User');
            expect(res.body.email).toBe('test@test.com');
            expect(res.body).not.toHaveProperty('password');
        });

        it('should not register user with existing email', async () => {
            await User.create({
                name: 'Existing User',
                email: 'test@test.com',
                password: 'password123'
            });

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User',
                    email: 'test@test.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message', 'User already exists');
        });

        it('should validate required fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test User'
                });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('User Login', () => {
        beforeEach(async () => {
            await User.create({
                name: 'Test User',
                email: 'test@test.com',
                password: 'password123'
            });
        });

        it('should login existing user', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: userOne.email,
                    password: 'userpass123'
                })
                .expect(200);

            expect(response.body.token).not.toBeNull();
        });

        it('should not login with wrong credentials', async () => {
            await request(app)
                .post('/api/auth/login')
                .send({
                    email: userOne.email,
                    password: 'wrongpassword'
                })
                .expect(400);
        });

        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.email).toBe('test@test.com');
        });

        it('should not login with incorrect password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com',
                    password: 'wrongpassword'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Invalid email or password');
        });

        it('should not login with non-existent email', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@test.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(401);
            expect(res.body).toHaveProperty('message', 'Invalid email or password');
        });
    });
});
