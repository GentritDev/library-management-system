import { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import Navbar from '../../components/Navbar';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await userAPI.getAllUsers();
            setUsers(response.data. data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setMessage({ type: 'error', text: 'Failed to load users' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAdmin = async (userId, currentStatus) => {
        if (window.confirm(`Are you sure you want to ${currentStatus ?  'demote' : 'promote'} this user? `)) {
            try {
                await userAPI.toggleAdminStatus(userId);
                setMessage({ type: 'success', text: 'User status updated successfully' });
                fetchUsers();
            } catch (error) {
                console. error('Error toggling admin status:', error);
                setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update user status' });
            }
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to delete user "${userName}"?  This will also delete all their books! `)) {
            try {
                await userAPI.deleteUser(userId);
                setMessage({ type: 'success', text: 'User deleted successfully' });
                fetchUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete user' });
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center h-96">
                    <p className="text-gray-600">Loading users...</p>
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
                        👥 User Management
                    </h1>
                    <p className="text-gray-600">
                        Manage all registered users
                    </p>
                </div>

                {/* Message */}
                {message.text && (
                    <div className={`mb-6 p-4 rounded-lg ${
                        message.type === 'success' ?  'bg-green-100 text-green-700' :  'bg-red-100 text-red-700'
                    }`}>
                        {message.text}
                        <button 
                            onClick={() => setMessage({ type: '', text: '' })}
                            className="ml-4 text-sm underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Stats */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Users</p>
                            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Admins</p>
                            <p className="text-3xl font-bold text-purple-600">
                                {users.filter(u => u.isAdmin).length}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Regular Users</p>
                            <p className="text-3xl font-bold text-green-600">
                                {users.filter(u => !u.isAdmin).length}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Books
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 shrink-0 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {user.name. charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="text-sm font-medium text-gray-900">
                                                {user.books?. length || 0} books
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.isAdmin 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    :  'bg-green-100 text-green-800'
                                            }`}>
                                                {user.isAdmin ? ' Admin' : '👤 User'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggleAdmin(user. id, user.isAdmin)}
                                                    className={`px-3 py-1 rounded-lg transition-colors ${
                                                        user.isAdmin
                                                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                                    }`}
                                                >
                                                    {user.isAdmin ? '⬇ Demote' : '⬆ Promote'}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id, user.name)}
                                                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                                >
                                                     Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminUsers;