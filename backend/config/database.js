const { Sequelize } = require('sequelize');
require('dotenv').config();


const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {}
});

// Test connection

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

    } catch (error) {
        console.error('Unable to connect to database: ' , error.message);
    }

};

testConnection();
module.exports = sequelize;