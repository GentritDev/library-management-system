import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const Navbar = () => {
  // const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);  

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await userAPI.getProfile();
      setUser(response. data. data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

 const handleLogout = () => {
    setLoggingOut(true);
    
    // Create overlay
    const overlay = document. createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top:  0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      z-index: 9999;
      display:  flex;
      align-items:  center;
      justify-content:  center;
      animation: fadeIn 0.2s ease;
    `;
    overlay.innerHTML = `
      <div style="
        background: white;
        padding: 2rem 3rem;
        border-radius: 1rem;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        text-align: center;
      ">
        <div style="color: #1f2937; font-size: 24px; font-weight: bold;">Logging out...</div>
      </div>
    `;
    document.body.appendChild(overlay);
    
    setTimeout(() => {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }, 800);
  };

  return (
    <nav className={`bg-linear-to-r from-purple-600 to-blue-600 text-white shadow-lg transition-opacity duration-300 ${
      loggingOut ? 'opacity-50' : 'opacity-100'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2 hover:opacity-80 transition">
            <span className="text-2xl">📚</span>
            <span className="text-xl font-bold">Library Manager</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/dashboard"
              className="hover:text-purple-200 transition font-medium"
            >
              My Books
            </Link>

            {/* AI Assistant Link */}
            <Link
              to="/ai-assistant"
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition font-medium"
            >
              <span>🤖</span>
              <span>AI Assistant</span>
            </Link>

            {user?. isAdmin && (
              <Link
                to="/admin"
                className="hover:text-purple-200 transition font-medium"
              >
                Admin
              </Link>
            )}

            <Link
              to="/profile"
              className="hover:text-purple-200 transition font-medium"
            >
              👤 Profile
            </Link>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-4 py-2 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 hover:text-red-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;