import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  
  const checkAuth = async () => {
    const token = localStorage. getItem('token');

    if (! token) {
      console.log('❌ No token found, redirecting to login');
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Verifying token.. .');
      const response = await userAPI.getProfile();
      
      console.log('✅ Token valid, user:', response.data.data.email);
      setIsAuthenticated(true);
      setIsAdmin(response.data.data.isAdmin);
      setLoading(false);
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🔒 Not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    console.log('🔒 Not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;