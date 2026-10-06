import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import api from '../services/api';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    return null;
  }
};

const OwnerProperties = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getStoredUser();

  const fetchProperties = async () => {
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
    fetchProperties();
  }, []);

  const handleEdit = (property) => {
    navigate(`/owner/properties/edit/${property._id}`);
  };

  const handleDelete = async (property) => {
    const confirmed = window.confirm('Are you sure you want to delete this property?');
    if (!confirmed) return;

    try {
      await api.delete(`/properties/${property._id}`, {
        data: { ownerId: user.id },
      });
      alert('Property deleted successfully.');
      fetchProperties();
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to delete property.');
    }
  };

  return (
    <div className="page-shell container">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Manage listings</span>
          <h1>My Properties</h1>
        </div>
        <Link to="/owner/properties/add" className="primary-button">+ Add Property</Link>
      </div>

      {loading ? (
        <p className="loading-text">Loading your properties...</p>
      ) : properties.length === 0 ? (
        <div className="empty-card">No properties listed yet.</div>
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

export default OwnerProperties;
