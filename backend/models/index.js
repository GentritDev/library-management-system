const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

// Initialize models
const UserModel = require('./User');
const BookModel = require('./Book');

const User = UserModel(sequelize);
const Book = BookModel(sequelize);

// Define associations
User.hasMany(Book, {
  foreignKey: 'userId',
  as: 'books'
});

Book.belongsTo(User, {
  foreignKey: 'userId',
  as: 'owner'
});

// Sync database function
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    
    // Sync models (alter:  true updates existing tables without dropping)
    await sequelize.sync({ alter: false });
  } catch (error) {
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  Sequelize,
  User,
  Book,
  syncDatabase,
};