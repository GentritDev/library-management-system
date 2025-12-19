import { useState, useEffect } from 'react';
import { userAPI, booksAPI } from '../services/api';
import axios from 'axios';

const Profile = () => {
    // STATE VARIABLES
    const [user, setUser] = useState(null);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Edit mode
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',  
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // AI Summary state
    const [showSummary, setShowSummary] = useState(false);
    const [summary, setSummary] = useState('');
    const [summaryStats, setSummaryStats] = useState(null);
    const [loadingSummary, setLoadingSummary] = useState(false);

    // FETCH DATA
    useEffect(() => {
        fetchProfile();
        fetchBooks();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await userAPI.getProfile();
            setUser(response.data. data);
            setFormData({
                name: response. data.data.name,
                email: response.data.data. email,
                password: '',  
            });
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const fetchBooks = async () => {
        try {
            const response = await booksAPI.getMyBooks();
            setBooks(response.data.data);
        } catch (err) {
            console.error('Error fetching books:', err);
        }
    };

    // UPDATE PROFILE
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        
        try {
            const updateData = {
                name: formData.name,
                email: formData.email,
            };
            
            if (formData.password && formData.password. trim() !== '') {
                updateData. password = formData.password;
            }

            const response = await userAPI. updateProfile(updateData);

            if (response.data.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully' });
                setEditMode(false);
                setFormData({ 
                    name: response.data.data.name,
                    email: response.data. data.email,
                    password: ''
                });
                fetchProfile();
            }
            
        } catch (err) {
            console.error('Update error:', err);
            setMessage({ 
                type: 'error', 
                text: err.response?.data?.message || 'Failed to update profile' 
            });
        }
    };

    // AI SUMMARY FUNCTION
    const generateAISummary = async () => {
    try {
        
        setLoadingSummary(true);
        setShowSummary(true);
        setSummary('');
        setSummaryStats(null);
        
        
         // Use environment-based API URL
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await axios.get(
            `${API_URL}/ai/summary`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type':  'application/json'
                }
            }
        );
        
        
        if (response.data.success) {
            const summaryText = response.data.summary;
            const statsData = response.data.stats;
            
            console.log('[4] Summary:', summaryText);
            console. log('[5] Stats:', statsData);
            
            setSummary(summaryText);
            setSummaryStats(statsData);
        } else {
            setSummary('No summary available');
        }
        
    } catch (err) {
       
        
        setSummary(
            err.response?.data?.message || 
            err.response?.data?.error || 
            err.message || 
            'Failed to generate summary.  Please try again.'
        );
    } finally {
        setLoadingSummary(false);
    }
};

    // CALCULATE STATS
    const stats = {
        totalBooks: books.length,
        toRead: books.filter(b => b.status === 'to-read').length,
        reading: books.filter(b => b.status === 'reading').length,
        completed: books.filter(b => b.status === 'completed').length,
        totalPages: books.reduce((sum, book) => sum + (book.pages || 0), 0),
    };

    // LOADING STATE
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-50 to-blue-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    // RENDER
    return (
        <div className="min-h-screen bg-linear-t-to-br from-purple-50 to-blue-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
                    <p className="text-gray-600 text-lg">
                        Manage your account and view your reading statistics
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Success/Error Message */}
                {message. text && (
                    <div className={`mb-6 p-4 rounded-lg ${
                        message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                        {message.text}
                        <button 
                            onClick={() => setMessage({ type: '', text:  '' })}
                            className="ml-4 text-sm underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* AI SUMMARY MODAL */}
                {showSummary && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
                            <button
                                onClick={() => setShowSummary(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
                            >
                                &times;
                            </button>
                            
                            <div className="text-center mb-6">
                                <h2 className="text-3xl font-bold text-gray-800">AI Reading Summary</h2>
                            </div>

                            {loadingSummary ?  (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Analyzing your reading habits...</p>
                                </div>
                            ) : (
                                <>
                                    {/* Summary Text */}
                                    <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6 min-h-[120px]">
                                        {summary ?  (
                                            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                {summary}
                                            </p>
                                        ) : (
                                            <p className="text-gray-500 italic">
                                                No summary available.  Click Regenerate to try again.
                                            </p>
                                        )}
                                    </div>

                                    {/* Stats Boxes */}
                                    {summaryStats && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                            <div className="bg-blue-50 rounded-lg p-4 text-center">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {summaryStats.total || 0}
                                                </div>
                                                <div className="text-sm text-gray-600">Total Books</div>
                                            </div>
                                            <div className="bg-green-50 rounded-lg p-4 text-center">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {summaryStats.completed || 0}
                                                </div>
                                                <div className="text-sm text-gray-600">Completed</div>
                                            </div>
                                            <div className="bg-yellow-50 rounded-lg p-4 text-center">
                                                <div className="text-2xl font-bold text-yellow-600">
                                                    {summaryStats. totalPages?. toLocaleString() || 0}
                                                </div>
                                                <div className="text-sm text-gray-600">Total Pages</div>
                                            </div>
                                            <div className="bg-purple-50 rounded-lg p-4 text-center">
                                                <div className="text-2xl font-bold text-purple-600">
                                                    {summaryStats.averagePages || 0}
                                                </div>
                                                <div className="text-sm text-gray-600">Avg Pages</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={generateAISummary}
                                            disabled={loadingSummary}
                                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Regenerate
                                        </button>
                                        <button
                                            onClick={() => setShowSummary(false)}
                                            className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                                {! editMode && (
                                    <button
                                        onClick={() => setEditMode(true)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            {editMode ?  (
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus: ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e. target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-2">
                                            New Password 
                                            <span className="text-sm text-gray-500 font-normal ml-2">
                                                (leave blank to keep current)
                                            </span>
                                        </label>
                                        <input
                                            type="password"
                                            value={formData. password}
                                            onChange={(e) => setFormData({ ... formData, password: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            minLength={6}
                                            placeholder="Enter new password (optional)"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditMode(false);
                                                setFormData({ 
                                                    name: user.name, 
                                                    email: user.email,
                                                    password: ''
                                                });
                                                setMessage({ type: '', text: '' });
                                            }}
                                            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold mb-1">Name</p>
                                        <p className="text-lg text-gray-800">{user?. name || 'N/A'}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold mb-1">Email</p>
                                        <p className="text-lg text-gray-800">{user?.email || 'N/A'}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold mb-1">Account Type</p>
                                        <p className="text-lg text-gray-800">
                                            {user?.isAdmin ? 'Admin' : 'User'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600 font-semibold mb-1">Member Since</p>
                                        <p className="text-lg text-gray-800">
                                            {user?.createdAt ?  new Date(user.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reading Statistics */}
                    <div>
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex flex-col gap-4 mb-6">
                                <h2 className="text-xl font-bold text-gray-800">Reading Stats</h2>
                                
                                <button
                                    onClick={generateAISummary}
                                    className="w-full px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hoverto-blue-700 transition font-medium shadow-lg"
                                >
                                    AI Summary
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                                    <span className="text-gray-700 font-semibold">Total Books</span>
                                    <span className="text-2xl font-bold text-blue-600">{stats.totalBooks}</span>
                                </div>

                                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                                    <span className="text-gray-700 font-semibold">To Read</span>
                                    <span className="text-xl font-bold text-yellow-600">{stats.toRead}</span>
                                </div>

                                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                                    <span className="text-gray-700 font-semibold">Reading</span>
                                    <span className="text-xl font-bold text-purple-600">{stats.reading}</span>
                                </div>

                                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                    <span className="text-gray-700 font-semibold">Completed</span>
                                    <span className="text-xl font-bold text-green-600">{stats. completed}</span>
                                </div>

                                <div className="flex justify-between items-center p-4 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                                    <span className="text-gray-700 font-semibold">Total Pages</span>
                                    <span className="text-xl font-bold text-blue-600">
                                        {stats.totalPages. toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
