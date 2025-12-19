const Groq = require('groq-sdk');
const { Book, User } = require('../models');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Sanitize data - remove sensitive fields
function sanitizeData(data) {
  if (!data || !Array.isArray(data)) return [];

  return data.map(row => {
    const sanitized = { ...row };
    
    // Remove sensitive fields
    const sensitiveFields = [
      'id', 'userId', 'password', 'email', 
      'createdAt', 'updatedAt', 'owner'
    ];
    
    sensitiveFields.forEach(field => delete sanitized[field]);
    
    // Remove UUID patterns
    Object.keys(sanitized).forEach(key => {
      const value = sanitized[key];
      if (typeof value === 'string' && 
          value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        delete sanitized[key];
      }
      
      // Remove nested objects (like owner:  {... })
      if (typeof value === 'object' && value !== null) {
        delete sanitized[key];
      }
    });

    return sanitized;
  });
}

// Process AI Query
const processQuery = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }

    const ruleBasedResult = await tryRuleBasedQuery(query);
    
    if (ruleBasedResult) {
      return res.json({
        success: true,
        data: ruleBasedResult.data,
        answer: ruleBasedResult.answer,
        sql: ruleBasedResult.sql,
        method: 'rule-based'
      });
    }

    const aiResult = await generateAndExecuteSQL(query);
    
    res.json({
      success: true,
      data: aiResult. data,
      answer: aiResult.answer,
      sql: aiResult.sql,
      method: 'ai-generated'
    });

  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing query',
      error: error.message
    });
  }
};

// Rule-based queries
async function tryRuleBasedQuery(query) {
  const lowerQuery = query.toLowerCase();

  // ===== USER QUERIES =====
  
  // Who owns the most books?
  if (lowerQuery.includes('who') && lowerQuery.includes('most books')) {
    const [results] = await Book.sequelize. query(`
      SELECT u.name, COUNT(b.id) as "bookCount"
      FROM users u
      INNER JOIN "Books" b ON b."userId" = u. id
      GROUP BY u.id, u.name
      ORDER BY "bookCount" DESC
      LIMIT 1
    `);

    if (results.length > 0) {
      const topUser = results[0];
      return {
        data: [{ name: topUser.name, bookCount: parseInt(topUser.bookCount) }],
        answer: `${topUser.name} owns the most books with ${topUser.bookCount} books.`,
        sql: 'SELECT name, COUNT(*) FROM users JOIN Books GROUP BY name'
      };
    }
  }

  // How many users are in the system?
  if (lowerQuery.includes('how many users')) {
    const count = await User.count();
    return {
      data: [{ totalUsers: count }],
      answer: `There are ${count} users in the system.`,
      sql: 'SELECT COUNT(*) FROM users'
    };
  }

  // Which user has read the most pages? 
  if (lowerQuery.includes('user') && lowerQuery.includes('most pages')) {
    const [results] = await Book. sequelize.query(`
      SELECT 
        u.name,
        SUM(b.pages) as "totalPages"
      FROM users u
      INNER JOIN "Books" b ON b."userId" = u.id
      WHERE b.status = 'completed'
      GROUP BY u.id, u.name
      ORDER BY "totalPages" DESC
      LIMIT 1
    `);

    if (results.length > 0) {
      const topReader = results[0];
      return {
        data: [{
          name:  topReader.name,
          totalPages: parseInt(topReader.totalPages)
        }],
        answer: `${topReader.name} has read the most pages with ${topReader.totalPages} pages completed.`,
        sql: 'SELECT name, SUM(pages) FROM users JOIN Books WHERE status=completed GROUP BY name'
      };
    } else {
      return {
        data: [],
        answer: 'No users have completed any books yet.',
        sql: 'SELECT name, SUM(pages) FROM users JOIN Books WHERE status=completed'
      };
    }
  }

  // ===== BOOK QUERIES ===== 
  // (keep the rest of your book queries here)
  
  // ...  rest of the function
}

// AI-generated SQL
async function generateAndExecuteSQL(query) {
  const prompt = `Convert to SQL SELECT query (no sensitive fields like id, email, password):

Database: Books(title, author, genre, pages, status, price, readCount), users(name)

Query: "${query}"

Return only SQL: `;

  const completion = await groq.chat.completions.create({
    messages: [{ role:  'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature:  0.1,
    max_tokens: 200
  });

  let sql = completion.choices[0].message.content.trim()
    .replace(/```sql/g, '').replace(/```/g, '').trim();
  
  if (!sql.toUpperCase().startsWith('SELECT')) {
    throw new Error('Only SELECT queries allowed');
  }

  const [results] = await Book.sequelize.query(sql);
  const sanitizedResults = sanitizeData(results);

  const answerPrompt = `Answer in 1-2 sentences based on:  ${JSON.stringify(sanitizedResults. slice(0, 3))}
Question: "${query}"`;
  
  const answerCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: answerPrompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 100
  });

  return {
    data: sanitizedResults,
    answer: answerCompletion.choices[0].message.content.trim(),
    sql: sql
  };
}

// Get example queries
const getExamples = async (req, res) => {
  try {
    const examples = [
      {
        category: 'Users',
        queries: [
          'Who owns the most books?',
          'How many users are in the system?'
        ]
      },
      {
        category: 'Books',
        queries: [
          'Which is the most popular book?',
          'Show the 5 most expensive books',
          'What books cost more than $20?'
        ]
      },
      {
        category: 'Statistics',
        queries: [
          'What is the average book price?',
          'How many books are completed? ',
          'Which genre is most common?'
        ]
      }
    ];

    res.json({ success: true, data: examples });
  } catch (error) {
    console.error('Error fetching examples:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching examples'
    });
  }
};

// Generate summary (already sanitized in previous version)
const generateSummary = async (req, res) => {
  try {
    console.log('AI Summary requested by user:', req.user.id);
    
    const books = await Book.findAll({
      where: { userId: req.user.id }
    });

    console.log(`Generating summary for ${books.length} books`);

    if (books.length === 0) {
      return res.json({
        success: true,
        summary: "You haven't added any books yet!  Start building your library.",
        stats: {
          total: 0,
          completed: 0,
          reading: 0,
          toRead: 0,
          totalPages: 0,
          genres: [],
          averagePages: 0,
          mostReadGenre: null
        }
      });
    }

    const stats = {
      total: books. length,
      completed: books. filter(b => b.status === 'completed').length,
      reading: books.filter(b => b.status === 'reading').length,
      toRead: books.filter(b => b.status === 'to-read').length,
      totalPages: books.reduce((sum, b) => sum + (b.pages || 0), 0),
      genres: [... new Set(books.map(b => b.genre).filter(Boolean))],
      averagePages:  Math.round(books.reduce((sum, b) => sum + (b.pages || 0), 0) / books.length) || 0,
      mostReadGenre: getMostCommon(books. map(b => b.genre).filter(Boolean))
    };

    const prompt = `Generate a friendly 3-sentence reading summary: 
- Total:  ${stats.total} books
- Completed: ${stats.completed}
- Reading: ${stats.reading}
- Pages: ${stats.totalPages}
- Genres: ${stats.genres.join(', ')}

Be encouraging and specific. Plain text only: `;

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 200
    });

    res.json({
      success: true,
      summary: completion.choices[0].message.content.trim(),
      stats: stats
    });

  } catch (error) {
    console.error('Error generating summary:', error. message);
    res.status(500).json({
      success: false,
      message: 'Error generating summary',
      error: error.message
    });
  }
};

function getMostCommon(arr) {
  if (arr.length === 0) return null;
  const counts = {};
  arr.forEach(item => counts[item] = (counts[item] || 0) + 1);
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
}

module.exports = {
  processQuery,
  getExamples,
  generateSummary
};