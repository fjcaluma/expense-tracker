import request from 'supertest';
import app from '../src/app';
import pool from '../src/config/database';

describe('Auth Endpoints', () => {
    // Clean up test data after all tests
    afterAll(async () => {
        await pool.query("DELETE FROM users WHERE email LIKE '%@example.com'");
        await pool.end();
    });

    describe('POST /api/auth/signup', () => {
        it('should create a new user', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
            expect(res.body.user).not.toHaveProperty('password_hash');
        });

        it('should reject duplicate email', async () => {
            // First signup
            await request(app).post('/api/auth/signup').send({
                email: 'duplicate@example.com',
                password: 'password123',
            });

            // Try to signup with same email
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    email: 'duplicate@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(409);
            expect(res.body).toHaveProperty('error');
        });

        it('should reject invalid email', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    email: 'notanemail',
                    password: 'password123',
                });
            
            expect(res.status).toBe(400);
        });

        it('should reject short password', async () => {
            const res = await request(app)
                .post('/api/auth/signup')
                .send({
                    email: 'short@example.com',
                    password: '123',
                });

            expect(res.status).toBe(400);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123',
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', 'test@example.com');
        });

        it('should reject invalid password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword',
                });
            
            expect(res.status).toBe(401);
        });

        it('should reject non-existent user', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123',
                });
            
            expect(res.status).toBe(401);
        });
    });
});