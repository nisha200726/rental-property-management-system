import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Favorites from './pages/Favorites';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerProperties from './pages/OwnerProperties';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import OwnerRentals from './pages/OwnerRentals';
import OwnerProfile from './pages/OwnerProfile';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerRentals from './pages/CustomerRentals';
import CustomerProfile from './pages/CustomerProfile';
import './App.css';

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

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/properties"
            element={
              <ProtectedRoute allowedRole="customer">
                <Properties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/properties/:id"
            element={
              <ProtectedRoute allowedRole="customer">
                <PropertyDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/favorites"
            element={
              <ProtectedRoute allowedRole="customer">
                <Favorites />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/dashboard"
            element={
              <ProtectedRoute allowedRole="owner">
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/properties"
            element={
              <ProtectedRoute allowedRole="owner">
                <OwnerProperties />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/properties/add"
            element={
              <ProtectedRoute allowedRole="owner">
                <AddProperty />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/add-property"
            element={
              <ProtectedRoute allowedRole="owner">
                <AddProperty />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/properties/edit/:id"
            element={
              <ProtectedRoute allowedRole="owner">
                <EditProperty />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/edit-property/:id"
            element={
              <ProtectedRoute allowedRole="owner">
                <EditProperty />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/rentals"
            element={
              <ProtectedRoute allowedRole="owner">
                <OwnerRentals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner/profile"
            element={
              <ProtectedRoute allowedRole="owner">
                <OwnerProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/dashboard"
            element={
              <ProtectedRoute allowedRole="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/rentals"
            element={
              <ProtectedRoute allowedRole="customer">
                <CustomerRentals />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customer/profile"
            element={
              <ProtectedRoute allowedRole="customer">
                <CustomerProfile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
