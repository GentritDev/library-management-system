import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { booksAPI } from '../services/api';

import BookCard from '../components/BookCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, reading, completed, to-read

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getMyBooks();
      setBooks(response.data. data);
      setError('');
    } catch (err) {
      setError('Failed to load books');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (id) => {
    if (! confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      await booksAPI.deleteBook(id);
      setBooks(books.filter((book) => book.id !== id));
    } catch (err) {
      setError('Failed to delete book');
      console.error(err);
    }
  };

  // Filter books based on selected filter
  const filteredBooks = filter === 'all' 
    ? books
    : books.filter(book => (book.readingStatus || book.status) === filter);

  // Stats
  const totalBooks = books. length;
  const readingBooks = books.filter(b => (b.readingStatus || b. status) === 'reading').length;
  const completedBooks = books.filter(b => (b.readingStatus || b.status) === 'completed').length;
  const toReadBooks = books. filter(b => (b.readingStatus || b.status) === 'to-read').length;

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 to-blue-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">My Library</h2>
          <p className="text-gray-600 text-lg">Manage your personal book collection</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-semibold mb-1">Total books</p>
            <p className="text-3xl font-bold text-blue-600">{totalBooks}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
            <p className="text-gray-600 text-sm font-semibold mb-1">To Read</p>
            <p className="text-3xl font-bold text-yellow-600">{toReadBooks}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm font-semibold mb-1">Reading</p>
            <p className="text-3xl font-bold text-purple-600">{readingBooks}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-semibold mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-600">{completedBooks}</p>
          </div>
        </div>

        {/* Filter and Add Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'all'
                  ?  'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All Books ({totalBooks})
            </button>

            <button
              onClick={() => setFilter('to-read')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'to-read'
                  ? 'bg-yellow-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              To Read ({toReadBooks})
            </button>

            <button
              onClick={() => setFilter('reading')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'reading'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Reading ({readingBooks})
            </button>

            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === 'completed'
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Completed ({completedBooks})
            </button>
          </div>

          {/* Add Book Button */}
          <button
            onClick={() => navigate('/books/new')}
            className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            📚 Add New Book
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">❌ Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ?  (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your library...</p>
            </div>
          </div>
        ) : filteredBooks.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-xl shadow-lg">
            <div className="text-6xl mb-6">
              {filter === 'all' ? '📚' : 
               filter === 'reading' ? '📖' :
               filter === 'completed' ? '✅' : '📕'}
            </div>

            <h3 className="text-3xl font-bold text-gray-700 mb-4">
              {filter === 'all' ? 'No books yet' : `No ${filter} books`}
            </h3>

            <p className="text-gray-500 text-lg mb-8">
              {filter === 'all'
                ? 'Start building your library by adding your first book!'
                :  `You don't have any books marked as "${filter}"`}
            </p>

            <button
              onClick={() => navigate('/books/new')}
              className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:  transition-all font-semibold text-lg shadow-lg"
            >
              Add Your First Book
            </button>
          </div>
        ) : (
          // Books Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;