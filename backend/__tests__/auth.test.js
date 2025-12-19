const request = require('supertest');
const app = require('../server');
const { User } = require('../models');
const { describe, beforeAll, afterAll, expect } = require('@jest/globals');
const { where } = require('sequelize');

describe('Auth Endpoints', () => {
    beforeAll(async () => {
        await User.destroy({ where: {email: 'test@example.com'}});

    });

    afterAll(async () => {
        await User.destroy( {where: {email: 'test@example.com' } });

    });

    describe('POST /api/auth/register', ()=>{
        it('should register a new user', async () => {
            const res = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });


            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
            expect(res.body.data.email).toBe('test@example.com');
        });

        it('should not register User with existing email', async () => {
            const res= await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login with correct credentials', async () => {
            const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.token).toBeDefined();
        });

        it('should not login with the wrong password', async () => {
            const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });

            expect(res.statusCode).toBe(401);
            expect(res.body.success).toBe(false);
        });
    });
});