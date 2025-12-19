const express = require('express');
const { processQuery, getExamples, generateSummary } = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');
const { generateAnswer } = require('../services/aiService');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// AI query endpoint
router.post('/query', processQuery);

// Get example queries
router.get('/examples', getExamples);

// Generate reading summary
router.get('/summary', generateSummary);

module.exports = router;