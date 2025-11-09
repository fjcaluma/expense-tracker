import request from 'supertest';
import app from '../src/app';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

describe('Authentication Middleware', () => {
    const validToken = jwt.sign({ userId: 'test-user-id' }, JWT_SECRET);

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