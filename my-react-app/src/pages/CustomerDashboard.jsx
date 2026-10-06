import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchFilter from '../components/SearchFilter';
import api from '../services/api';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    return null;
  }
};

const CustomerDashboard = () => {
  const user = getStoredUser();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rentals, setRentals] = useState([]);

  const fetchProperties = async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.type) params.append('type', filters.type);
      if (filters.maxRent) params.append('maxRent', filters.maxRent);

      const response = await api.get(`/properties?${params.toString()}`);
      setProperties(response.data.properties || []);
    } catch (error) {
      setProperties([]);
    }
  };

  const fetchRentals = async () => {
    if (!user) return;

    try {
      const response = await api.get(`/rentals/customer/${user.id}`);
      setRentals(response.data.rentals || []);
    } catch (error) {
      setRentals([]);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      await Promise.all([fetchProperties(), fetchRentals()]);
      setLoading(false);
    };

    loadDashboard();
  }, []);

  const activeRentals = rentals.filter((rental) => rental.status === 'Active').length;
  const completedRentals = rentals.filter((rental) => rental.status === 'Completed').length;
  const availableProperties = properties.filter((property) => property.status === 'Available').length;

  return (
    <div className="page-shell container">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Customer dashboard</span>
          <h1>Welcome, {user?.name || 'Customer'}</h1>
        </div>
      </div>

      <div className="stats-grid customer-stats">
        <div className="stat-panel">
          <h3>{availableProperties}</h3>
          <p>Available Properties</p>
        </div>
        <div className="stat-panel">
          <h3>{rentals.length}</h3>
          <p>My Rentals</p>
        </div>
        <div className="stat-panel">
          <h3>{activeRentals}</h3>
          <p>Active Rentals</p>
        </div>
        <div className="stat-panel">
          <h3>{completedRentals}</h3>
          <p>Completed Rentals</p>
        </div>
      </div>

      <div className="search-panel">
        <h2>Find Your Next Home</h2>
        <SearchFilter onSearch={fetchProperties} />
      </div>

      {loading ? (
        <p className="loading-text">Loading properties...</p>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <div key={property._id} className="property-adapter">
              <Link to={`/properties/${property._id}`} className="property-link-card">
                <div className="property-mini">
                  <h3>{property.title}</h3>
                  <p>{property.location}</p>
                  <span>₹{Number(property.rent).toLocaleString('en-IN')}/month</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
