import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userAPI,  } from '../../services/api';
import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBooks: 0,
        recentUsers: [],
        recentBooks:  [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const usersResponse = await userAPI.getAllUsers();
            const users = usersResponse.data.data;

            setStats({
                totalUsers: users.length,
                totalBooks: users.reduce((sum, user) => sum + (user.books?. length || 0), 0),
                recentUsers: users. slice(0, 5),
                recentBooks: users
                    .flatMap(user => user.books?. map(book => ({ ...book, userName: user.name })) || [])
                    .slice(0, 5),
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-600">Loading...</p>
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
                         Admin Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Manage users and monitor system activity
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                                <p className="text-4xl font-bold mt-2">{stats.totalUsers}</p>
                            </div>
                            <div className="text-5xl opacity-50">👥</div>
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Total Books</p>
                                <p className="text-4xl font-bold mt-2">{stats.totalBooks}</p>
                            </div>
                            <div className="text-5xl opacity-50">📚</div>
                        </div>
                    </div>

                    <Link to="/admin/users" className="bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Manage Users</p>
                                <p className="text-2xl font-bold mt-2">View All →</p>
                            </div>
                            <div className="text-5xl opacity-50">⚙️</div>
                        </div>
                    </Link>

                    <Link to="/admin/books" className="bg-linear-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm font-medium">View Books</p>
                                <p className="text-2xl font-bold mt-2">See All →</p>
                            </div>
                            <div className="text-5xl opacity-50">📖</div>
                        </div>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Users */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Users</h2>
                        <div className="space-y-3">
                            {stats.recentUsers.map((user) => (
                                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-gray-800">{user.name}</p>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">
                                            {user.books?.length || 0} books
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {user.isAdmin ? ' Admin' : '👤 User'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Books */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">📚 Recent Books</h2>
                        <div className="space-y-3">
                            {stats.recentBooks.map((book) => (
                                <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-semibold text-gray-800">{book.title}</p>
                                        <p className="text-sm text-gray-600">by {book.author}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">
                                            Added by:  {book.userName}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;