const { Book, User } = require('../models');


// GET ALL BOOKS (Admin only)
const getAllBooks = async (req, res) => {
  try {
    
    if (!req.user. isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }
    
    const books = await Book.findAll({
      include: [{
        model: User,
        as: 'owner', 
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });


    res.json({
      success: true,
      data: books,
      count: books.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:  'Error fetching books',
      error: error.message
    });
  }
};

// GET MY BOOKS
const getMyBooks = async (req, res) => {
  try {
    
    const books = await Book.findAll({
      where: {
        userId: req. user.id
      },
      order: [['createdAt', 'DESC']]
    });


    res.json({
      success: true,
      data: books,
      count: books.length
    });
  } catch (error) {
    console.error('Error fetching my books:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching books',
      error: error.message
    });
  }
};


// GET BOOK BY ID
const getBookById = async (req, res) => {
  try {
    
    
    const whereClause = {
      id: req.params.id
    };
    
    if (! req.user.isAdmin) {
      whereClause.userId = req.user.id;
    }
    
    const book = await Book.findOne({
      where: whereClause,
      include: [{
        model: User,
        as: 'owner', 
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }


    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error(' Error fetching book:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching book',
      error: error.message
    });
  }
};


// CREATE BOOK
const createBook = async (req, res) => {
  try {
    

    const {
      title,
      author,
      genre,
      pages,
      publishedYear,
      description,
      status,
      price,
      readCount
    } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        success: false,
        message: 'Title and author are required'
      });
    }

    const book = await Book.create({
      title,
      author,
      genre,
      pages,
      publishedYear,
      description,
      status:  status || 'to-read',
      price:  price || 0,
      readCount: readCount || 0,
      userId: req.user. id
    });


    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating book',
      error: error.message
    });
  }
};

// UPDATE BOOK
const updateBook = async (req, res) => {
  try {
    
    
    const whereClause = {
      id: req.params.id
    };
    
    if (!req.user.isAdmin) {
      whereClause.userId = req.user.id;
    }
    
    const book = await Book.findOne({
      where: whereClause
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or access denied'
      });
    }

    await book.update(req.body);


    res.json({
      success: true,
      message:  'Book updated successfully',
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating book',
      error: error.message
    });
  }
};

// DELETE BOOK
const deleteBook = async (req, res) => {
  try {
    
    
    const whereClause = {
      id: req.params.id
    };
    
    if (!req.user.isAdmin) {
      whereClause.userId = req.user.id;
    }
    
    const book = await Book.findOne({
      where: whereClause
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found or access denied'
      });
    }

    await book.destroy();


    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting book');
    res.status(500).json({
      success: false,
      message: 'Error deleting book',
      error: error.message
    });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  getMyBooks,
  getBookById,
  updateBook,
  deleteBook,
};