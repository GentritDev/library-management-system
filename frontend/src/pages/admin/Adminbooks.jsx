import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import Navbar from '../../components/Navbar';

const AdminBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterUser, setFilterUser] = useState('all');

    useEffect(() => {
        fetchAllBooks();
    }, []);

    const fetchAllBooks = async () => {
        try {
            const response = await userAPI.getAllUsers();
            const users = response.data.data;
            
            // Flatten all books from all users
            const allBooks = users.flatMap(user => 
                (user.books || []).map(book => ({
                    ...book,
                    userName: user.name,
                    userEmail: user.email,
                    userId: user.id
                }))
            );
            
            setBooks(allBooks);
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredBooks = filterUser === 'all' 
        ? books 
        : books.filter(b => b.userId === filterUser);

    const uniqueUsers = [...new Set(books.map(b => ({ id: b.userId, name: b.userName })))];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-600">Loading books... </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        📚 All Books
                    </h1>
                    <p className="text-gray-600">
                        View all books across the system
                    </p>
                </div>

                {/* Stats & Filter */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Books</p>
                            <p className="text-3xl font-bold text-blue-600">{books.length}</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by User
                            </label>
                            <select
                                value={filterUser}
                                onChange={(e) => setFilterUser(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Users ({books.length} books)</option>
                                {uniqueUsers.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({books.filter(b => b.userId === user.id).length} books)
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Books Grid */}
                {filteredBooks.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-12 text-center">
                        <p className="text-gray-600 text-lg">No books found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBooks.map((book) => (
                            <div key={book.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{book. title}</h3>
                                <p className="text-gray-600 mb-4">by {book.author}</p>
                                
                                <div className="space-y-2 mb-4">
                                    {book.genre && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Genre:</span> {book.genre}
                                        </p>
                                    )}
                                    {book.pages && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Pages:</span> {book. pages}
                                        </p>
                                    )}
                                    {book.publishedYear && (
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">Year:</span> {book.publishedYear}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Status:</span>{' '}
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            book.status === 'completed' ?  'bg-green-100 text-green-700' :
                                            book. status === 'reading' ? 'bg-purple-100 text-purple-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {book.status === 'to-read' ? '📚 To Read' : 
                                             book.status === 'reading' ? '📖 Reading' :
                                             '✅ Completed'}
                                        </span>
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-500">
                                        👤 Added by:  <span className="font-semibold">{book.userName}</span>
                                    </p>
                                    <p className="text-xs text-gray-500">{book.userEmail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminBooks;