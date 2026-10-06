import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import api from '../services/api';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    return null;
  }
};

const OwnerDashboard = () => {
  const user = getStoredUser();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOwnerProperties = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await api.get(`/properties/owner/${user.id}`);
      setProperties(response.data.properties || []);
    } catch (error) {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerProperties();
  }, []);

  const totalProperties = properties.length;
  const availableProperties = properties.filter((property) => property.status === 'Available').length;
  const rentedProperties = properties.filter((property) => property.status === 'Rented').length;
  const totalRentals = properties.length;

  const handleEdit = (property) => {
    window.location.href = `/owner/properties/edit/${property._id}`;
  };

  const handleDelete = async (property) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this property?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/properties/${property._id}`, {
        data: { ownerId: user.id },
      });
      alert('Property deleted successfully.');
      fetchOwnerProperties();
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to delete property.');
    }
  };

  return (
    <div className="page-shell container">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Owner dashboard</span>
          <h1>Welcome, {user?.name || 'Owner'}</h1>
        </div>
        <div className="dashboard-actions">
          <Link to="/owner/properties/add" className="primary-button">+ Add Property</Link>
        </div>
      </div>

      <div className="stats-grid owner-stats">
        <div className="stat-panel">
          <h3>{totalProperties}</h3>
          <p>Total Properties</p>
        </div>
        <div className="stat-panel">
          <h3>{availableProperties}</h3>
          <p>Available Properties</p>
        </div>
        <div className="stat-panel">
          <h3>{rentedProperties}</h3>
          <p>Rented Properties</p>
        </div>
        <div className="stat-panel">
          <h3>{totalRentals}</h3>
          <p>Total Rentals</p>
        </div>
      </div>

      <div className="dashboard-section-header">
        <h2>My Properties</h2>
        <div className="inline-buttons">
          <Link to="/owner/properties" className="secondary-button">View Properties</Link>
          <Link to="/owner/rentals" className="secondary-button">View Rentals</Link>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Loading your properties...</p>
      ) : properties.length === 0 ? (
        <div className="empty-card">You have not added any properties yet.</div>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property._id}
              property={property}
              role="owner"
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
