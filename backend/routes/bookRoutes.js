const express = require('express');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


const {
  getAllBooks,
  getMyBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = bookController;

const router = express.Router();

// Apply auth middleware
router.use(authMiddleware);

// Specific routes FIRST
router.get('/my-books', getMyBooks);
//  Get all books (ADMIN ONLY)
router.get('/', adminMiddleware, getAllBooks);
router.post('/', createBook);

// Parameterized routes LAST
router.get('/:id', getBookById);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);

module.exports = router;