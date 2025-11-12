import request from 'supertest';
import app from '../src/app';
import pool from '../src/config/database';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

describe('Expense Endpoints', () => {
    let testUserId: string;
    let testToken: string;
    let testExpenseId: string;

    // Create test user before all tests
    beforeAll(async () => {
        const result = await pool.query(
            "INSERT INTO users (email, password_hash) VALUES ('expense-test@example.com', 'hash') RETURNING id"
        );
        testUserId = result.rows[0].id;
        testToken = jwt.sign({ userId: testUserId }, JWT_SECRET);
    });

    // Clean up after all tests
    afterAll(async () => {
        await pool.query('DELETE FROM users WHERE email = $1', [
            'expense-test@example.com'
        ]);
    });

    describe('POST /api/expenses', () => {
        it('should create a new expense', async () => {
            const res = await request(app)
                .post('/api/expenses')
                .set('Authorization', `Bearer ${testToken}`)
                .send({
                    amount: 25.5,
                    category: 'Food',
                    description: 'Lunch at Chipotle',
                    date: '2025-11-02',
                });
            
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.amount).toBe('25.50');
            expect(res.body.category).toBe('Food');

            testExpenseId = res.body.id;
        });

        it('should require authentication', async () => {
            const res = await request(app)
                .post('/api/expenses')
                .send({
                    amount: 10,
                    category: 'Food',
                    date: '2025-11-02',
                });

            expect(res.status).toBe(401);
        });

        it('should reject invalid amount', async () => {
            const res = await request(app)
                .post('/api/expenses')
                .set('Authorization', `Bearer ${testToken}`)
                .send({
                    amount: -10,
                    category: 'Food',
                    date: '2025-11-02',
                });

            expect(res.status).toBe(400);
        });

        it('should reject missing required fields', async () => {
            const res = await request(app)
                .post('/api/expenses')
                .set('Authorization', `Bearer ${testToken}`)
                .send({
                    amount: 10,
                });

            expect(res.status).toBe(400);
        });
    });

    describe('GET /api/expenses', () => {
        it('should return user expenses', async () => {
            const res = await request(app)
                .get('/api/expenses')
                .set('Authorization', `Bearer ${testToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('amount');
            expect(res.body[0]).toHaveProperty('category');
        });

        it('should require authentication', async () => {
            const res = await request(app)
                .get('/api/expenses');
            
            expect(res.status).toBe(401);
        });
    });

    describe('PUT /api/expenses/:id', () => {
        it('should update an expense', async () => {
            const res = await request(app)
                .put(`/api/expenses/${testExpenseId}`)
                .set('Authorization', `Bearer ${testToken}`)
                .send({
                    amount: 30.0,
                    category: 'Food',
                    description: 'Updated description',
                    date: '2025-11-02',
                });

            expect(res.status).toBe(200);
            expect(res.body.amount).toBe('30.00');
            expect(res.body.description).toBe('Updated description');
        });

        it('should not allow updating another users expense', async () => {
            // Create another user
            const otherUser = await pool.query(
                "INSERT INTO users (email, password_hash) VALUES ('other@example.com', 'hash') RETURNING id"
            );
            const otherUserId = otherUser.rows[0].id;
            const otherToken = jwt.sign({ userId: otherUserId }, JWT_SECRET);

            // Try to update first user's expense
            const res = await request(app)
                .put(`/api/expenses/${testExpenseId}`)
                .set('Authorization', `Bearer ${otherToken}`)
                .send({
                    amount: 100,
                    category: 'Hacking',
                    date: '2025-11-02',
                });

            expect(res.status).toBe(404);

            // Clean up
            await pool.query('DELETE FROM users WHERE id = $1', [otherUserId]);
        });
    });

    describe('DELETE /api/expenses/:id', () => {
        it('should delete an expense', async () => {
            const res = await request(app)
                .delete(`/api/expenses/${testExpenseId}`)
                .set('Authorization', `Bearer ${testToken}`)

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message');

            // Verify deletion
            const getRes = await request(app)
                .get('/api/expenses')
                .set('Authorization', `Bearer ${testToken}`);

            const deletedExpense = getRes.body.find((e: any) => e.id === testExpenseId);
            expect(deletedExpense).toBeUndefined();
        });

        it('should not allow deleting another users expense', async () => {
            // Create another user and their expense
            const otherUser = await pool.query(
                "INSERT INTO users (email, password_hash) VALUES ('other-delete@example.com', 'hash') RETURNING id"
            );
            const otherUserId = otherUser.rows[0].id;

            const otherExpense = await pool.query(
                "INSERT INTO expenses (user_id, amount, category, date) VALUES ($1, $2, $3, $4) RETURNING id", [otherUserId, 50, 'Food', '2025-11-02']
            );
            const otherExpenseId = otherExpense.rows[0].id;

            // Try to delete other user's expense
            const res = await request(app)
                .delete(`/api/expenses/${otherExpenseId}`)
                .set('Authorization', `Bearer ${testToken}`);

            expect(res.status).toBe(404);

            // Clean up
            await pool.query('DELETE FROM users WHERE id = $1', [otherUserId]);
        });
    });

    describe('GET /api/expenses/summary', () => {
        it('should return spending summary by category', async () => {
            const res = await request(app)
                .get('/api/expenses/summary')
                .set('Authorization', `Bearer ${testToken}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            if(res.body.length > 0) {
                expect(res.body[0]).toHaveProperty('category');
                expect(res.body[0]).toHaveProperty('total');
            }
        });

        it('should require authentication', async () => {
            const res = await request(app)
                .get('/api/expenses/summary');

            expect(res.status).toBe(401);
        });
    });
});