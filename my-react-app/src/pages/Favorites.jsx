import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    return null;
  }
};

const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  } catch (error) {
    return [];
  }
};

const Favorites = () => {
  const user = getStoredUser();
  const [favoriteIds, setFavoriteIds] = useState(getFavorites());
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!favoriteIds.length) {
        setProperties([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get('/properties');
        const allProperties = response.data.properties || [];
        const savedProperties = allProperties.filter((property) => favoriteIds.includes(property._id));
        setProperties(savedProperties);
      } catch (error) {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [favoriteIds]);

  const removeFavorite = (propertyId) => {
    const nextFavorites = favoriteIds.filter((id) => id !== propertyId);
    localStorage.setItem('favorites', JSON.stringify(nextFavorites));
    setFavoriteIds(nextFavorites);
  };

  return (
    <div className="page-shell container">
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">Saved homes</span>
          <h1>My Favorites</h1>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Loading your saved properties...</p>
      ) : properties.length === 0 ? (
        <div className="empty-card">
          <p>No saved properties yet.</p>
          <Link to="/properties" className="primary-button">Explore Properties</Link>
        </div>
      ) : (
        <div className="property-grid">
          {properties.map((property) => (
            <article key={property._id} className="property-card">
              <div className="property-header">
                <span className={`status-badge ${property.status === 'Available' ? 'available' : 'rented'}`}>
                  {property.status}
                </span>
              </div>
              <h3>{property.title}</h3>
              <p className="property-address">📍 {property.location}</p>
              <div className="property-type-row">
                <span>{property.type}</span>
                <strong>₹{Number(property.rent).toLocaleString('en-IN')}/mo</strong>
              </div>
              <p className="property-description">{property.description}</p>
              <div className="card-actions">
                <Link to={`/properties/${property._id}`} className="secondary-button">View Details</Link>
                <button type="button" className="danger-button" onClick={() => removeFavorite(property._id)}>
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
