import request from 'supertest';
import app from '../src/app';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

describe('Authentication Middleware', () => {
    const validToken = jwt.sign({ userId: '550e8400-e29b-41d4-a716-446655440000' }, JWT_SECRET);

    it('should allow access with valid token', async () => {
        const res = await request(app)
            .get('/api/expenses')
            .set('Authorization', `Bearer ${validToken}`);
        
        expect(res.status).not.toBe(401);
    });

    it('should reject request without token', async () => {
        const res = await request(app).get('/api/expenses');

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
    });

    it('should reject request with invalid token', async () => {
        const res = await request(app)
            .get('/api/expenses')
            .set('Authorization', 'Bearer invalid-token');
    
        expect(res.status).toBe(401);
    });
});