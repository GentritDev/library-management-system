const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

/**
 * Clean SQL response from AI (remove markdown, extra text, etc.)
 */
const cleanSQLResponse = (rawSQL) => {
  if (!rawSQL) return '';
  
  let cleaned = rawSQL. trim();
  
  // Remove markdown code blocks
  cleaned = cleaned.replace(/```sql\n?/gi, '');
  cleaned = cleaned.replace(/```\n?/g, '');
  
  // Remove "sql" keyword if at start
  cleaned = cleaned.replace(/^sql\s+/i, '');
  
  // Remove trailing semicolon
  cleaned = cleaned. replace(/;+$/, '');
  
  // Remove any extra whitespace
  cleaned = cleaned.trim();
  
  // If multiple lines, join them
  cleaned = cleaned.split('\n').map(line => line.trim()).join(' ');
  
  // Remove extra spaces
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  return cleaned;
};

/**
 * Convert natural language to SQL query using Groq AI
 */
const textToSQL = async (userQuery) => {
  try {
    console.log('🤖 Converting to SQL:', userQuery);
    
    const systemPrompt = `You are a SQL query generator for a library management system.  

Database schema:
- Table "users":  id (UUID), name (STRING), email (STRING), "isAdmin" (BOOLEAN), "createdAt" (TIMESTAMP)
- Table "books": id (UUID), title (STRING), author (STRING), genre (STRING), pages (INTEGER), "publishedYear" (INTEGER), status (ENUM: 'to-read', 'reading', 'completed'), price (DECIMAL), "readCount" (INTEGER), "userId" (UUID), "createdAt" (TIMESTAMP)

CRITICAL RULES:
1. Return ONLY the SQL query, nothing else
2. NO markdown, NO code blocks, NO explanations
3. Just pure SQL starting with SELECT
4. Use double quotes for column names with capitals
5. Use single quotes for string values
6. Use LIMIT to restrict results

Examples:
User:  "Show the 5 most expensive books"
Response: SELECT b.title, b.author, b.price, u.name as owner FROM books b JOIN users u ON b."userId" = u.id ORDER BY b.price DESC LIMIT 5

User: "Which is the most popular book?"
Response:   SELECT title, author, "readCount" FROM books ORDER BY "readCount" DESC LIMIT 1

Now generate SQL for: `;

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userQuery
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 300
    });

    const rawSQL = completion.choices[0]?.message?.content;
    
    const cleanedSQL = cleanSQLResponse(rawSQL);
    
    // Validate it's a SELECT query
    if (!cleanedSQL.toUpperCase().startsWith('SELECT')) {
      console.error('Invalid SQL - does not start with SELECT');
      throw new Error('Generated query is not a valid SELECT statement');
    }
    
    return {
      success: true,
      sql: cleanedSQL,
      model: 'llama-3.3-70b-versatile'
    };
    
  } catch (error) {
    console.error('Groq API error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Generate natural language answer from query results
 */
const generateAnswer = async (userQuery, sqlResults) => {
  try {
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role:  'system',
          content:  'You are a helpful library assistant. Convert query results into a natural, friendly answer.  Be concise (2-3 sentences max).'
        },
        {
          role: 'user',
          content: `User asked: "${userQuery}"\n\nResults:  ${JSON.stringify(sqlResults. slice(0, 5), null, 2)}\n\nAnswer:`
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature:  0.7,
      max_tokens: 150
    });

    const answer = completion.choices[0]?. message?.content?. trim();
    
    return answer || 'Here are the results from your query. ';
    
  } catch (error) {
    console.error('Answer generation error:', error);
    return 'Here are the results from your query.';
  }
};

module. exports = {
  textToSQL,
  generateAnswer
};