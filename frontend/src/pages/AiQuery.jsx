import { useState } from 'react';
import axios from 'axios';

const AiQuery = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [examples] = useState([
    {
      category: 'Users',
      queries: [
        'Who owns the most books?',
        'How many users are in the system?',
        'Which user has read the most pages?'
      ]
    },
    {
      category: 'Books',
      queries: [
        'Which is the most popular book? ',
        'Show the 5 most expensive books',
        'What books cost more than $20?',
        'List all Technology books'
      ]
    },
    {
      category: 'Statistics',
      queries: [
        'What is the average book price?',
        'How many books are completed?',
        'Which genre is most common?'
      ]
    }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = {
      type: 'user',
      text: query,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    const currentQuery = query;
    setQuery('');

    try {
      console.log('Sending query:', currentQuery);
      
      const response = await axios.post(
        'http://localhost:5000/api/ai/query',
        { query: currentQuery },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Response received:', response.data);

      const aiMessage = {
        type: 'ai',
        text: response.data.answer || 'Query executed successfully',
        data: response.data.data || [],
        sql: response.data.sql || '',
        method: response.data. method || 'unknown',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [... prev, aiMessage]);
    } catch (error) {
      console.error('Error processing query:', error);
      console.error('Error response:', error.response?.data);
      
      const errorMessage = {
        type: 'error',
        text: error.response?.data?.message || error.message || 'Failed to process query',
        timestamp:  new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (exampleQuery) => {
    setQuery(exampleQuery);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Query Assistant</h1>
          <p className="text-gray-600 text-lg">
            Ask questions about your library data in natural language
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Example Queries</h2>
              
              <div className="space-y-6">
                {examples.map((category, idx) => (
                  <div key={idx}>
                    <h3 className="text-sm font-semibold text-gray-600 mb-2">
                      {category.category}
                    </h3>
                    <div className="space-y-2">
                      {category.queries && category.queries.map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleExampleClick(q)}
                          className="w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">AI</div>
                    <p className="text-gray-600 text-lg">
                      Start by asking a question or click an example query
                    </p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-3xl rounded-lg p-4 ${
                          msg.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : msg.type === 'error'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="mb-2">{msg.text}</p>

                        {msg.type === 'ai' && msg.data && msg.data.length > 0 && (
                          <div className="mt-4">
                            <div className="bg-white rounded-lg p-4 overflow-x-auto">
                              <table className="min-w-full text-sm">
                                <thead>
                                  <tr className="border-b">
                                    {Object.keys(msg.data[0]).map((key) => (
                                      <th key={key} className="text-left px-4 py-2 font-semibold text-gray-700">
                                        {key}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {msg. data.map((row, rowIdx) => (
                                    <tr key={rowIdx} className="border-b hover:bg-gray-50">
                                      {Object.values(row).map((value, valIdx) => (
                                        <td key={valIdx} className="px-4 py-2 text-gray-800">
                                          {typeof value === 'object' && value !== null
                                            ? JSON.stringify(value)
                                            : String(value)}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                        {msg.type === 'ai' && msg.sql && (
                          <details className="mt-4">
                            <summary className="cursor-pointer text-sm font-semibold text-gray-600 hover:text-gray-800">
                              View SQL Query
                            </summary>
                            <pre className="mt-2 bg-gray-900 text-green-400 p-3 rounded text-xs overflow-x-auto">
                              {msg.sql}
                            </pre>
                          </details>
                        )}

                        {msg.type === 'ai' && msg.method && (
                          <div className="mt-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              msg.method === 'rule-based'
                                ? 'bg-green-200 text-green-800'
                                : 'bg-purple-200 text-purple-800'
                            }`}>
                              {msg.method}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-gray-600">Thinking... </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t bg-gray-50 p-4">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Ask a question about your library..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !query. trim()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processing...' : 'Send'}
                  </button>
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={clearChat}
                      className="px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-medium"
                    >
                      Clear
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiQuery;