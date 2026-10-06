import { Link } from 'react-router-dom';

const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  } catch (error) {
    return [];
  }
};

const PropertyCard = ({ property, role = 'customer', compact = false, onDelete, onEdit }) => {
  const owner = property.ownerId || {};
  const favoriteIds = getFavorites();
  const isFavorited = favoriteIds.includes(property._id);

  const toggleFavorite = () => {
    const current = getFavorites();
    const next = current.includes(property._id)
      ? current.filter((id) => id !== property._id)
      : [...current, property._id];

    localStorage.setItem('favorites', JSON.stringify(next));
    window.dispatchEvent(new Event('favorites:updated'));
  };

  return (
    <article className={`property-card ${compact ? 'compact-card' : ''}`}>
      <div className="property-header">
        {role === 'customer' && (
          <button
            type="button"
            className={`favorite-button ${isFavorited ? 'active' : ''}`}
            onClick={toggleFavorite}
            aria-label="Toggle favorite"
          >
            ♥
          </button>
        )}
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

      {role === 'owner' && owner.name && (
        <div className="owner-chip">Owner: {owner.name}</div>
      )}

      <div className="card-actions">
        {role === 'customer' && (
          <Link to={`/properties/${property._id}`} className="secondary-button">
            View Details
          </Link>
        )}

        {role === 'customer' && property.status === 'Available' && (
          <Link to={`/properties/${property._id}`} className="primary-button">
            Rent Now
          </Link>
        )}

        {role === 'owner' && (
          <>
            <button type="button" className="secondary-button" onClick={() => onEdit(property)}>
              Edit
            </button>
            <button type="button" className="danger-button" onClick={() => onDelete(property)}>
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
};

export default PropertyCard;
