import { Navigate } from 'react-router-dom';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    return null;
  }
};

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === 'owner') {
      return <Navigate to="/owner/dashboard" replace />;
    }
    if (user.role === 'customer') {
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
