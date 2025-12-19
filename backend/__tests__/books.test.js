const request = require('supertest');
const app = require('../server');
const { User, Book } = require('../models');

describe('Book Endpoints', () => {
  let token;
  let userId;
  let bookId;

  beforeAll(async () => {
    // Create test user
    await User.destroy({ where: { email: 'booktest@example.com' } });
    
    const user = await User.create({
      name: 'Book Test User',
      email: 'booktest@example.com',
      password: 'password123'
    });
    
    userId = user.id;

    // Login to get token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'booktest@example.com',
        password: 'password123'
      });

    token = res.body.token;
  });

  afterAll(async () => {
    await Book.destroy({ where: { userId } });
    await User.destroy({ where: { id: userId } });
  });

  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const res = await request(app)
        .post('/api/books')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Book',
          author:  'Test Author',
          genre: 'Fiction',
          pages: 300,
          status: 'to-read'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Test Book');
      
      bookId = res.body. data.id;
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/books')
        .send({
          title: 'Test Book',
          author: 'Test Author'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/books/my-books', () => {
    it('should get user books', async () => {
      const res = await request(app)
        .get('/api/books/my-books')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body. data)).toBe(true);
    });
  });

  describe('PUT /api/books/:id', () => {
    it('should update book', async () => {
      const res = await request(app)
        .put(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'reading'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body. data.status).toBe('reading');
    });
  });

  describe('DELETE /api/books/:id', () => {
    it('should delete book', async () => {
      const res = await request(app)
        .delete(`/api/books/${bookId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body. success).toBe(true);
    });
  });
});