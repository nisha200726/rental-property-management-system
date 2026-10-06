import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    return null;
  }
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showRentalForm, setShowRentalForm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [rentalForm, setRentalForm] = useState({
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/properties/${id}`);
        setProperty(response.data.property);
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(response.data.property._id));
      } catch (error) {
        setProperty(null);
        setMessage({
          type: 'error',
          text: error?.response?.data?.message || 'Property not found.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const next = favorites.includes(property._id)
      ? favorites.filter((favoriteId) => favoriteId !== property._id)
      : [...favorites, property._id];

    localStorage.setItem('favorites', JSON.stringify(next));
    setIsFavorite(next.includes(property._id));
    window.dispatchEvent(new Event('favorites:updated'));
  };

  const handleRentalInput = (event) => {
    const { name, value } = event.target;
    setRentalForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleRentalSubmit = async (event) => {
    event.preventDefault();
    const user = getStoredUser();

    if (!user || user.role !== 'customer') {
      setMessage({ type: 'error', text: 'Please log in as a customer to rent a property.' });
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/rentals', {
        propertyId: property._id,
        customerId: user.id,
        startDate: rentalForm.startDate,
        endDate: rentalForm.endDate,
      });

      setMessage({ type: 'success', text: 'Rental created successfully. Redirecting to your rentals...' });
      setShowRentalForm(false);
      setTimeout(() => navigate('/customer/rentals'), 900);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error?.response?.data?.message || 'Unable to process the rental request right now.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page-shell container loading-text">Loading property details...</div>;
  }

  if (!property) {
    return (
      <div className="page-shell container">
        <div className="empty-card">{message.text || 'Property not found.'}</div>
      </div>
    );
  }

  const owner = property.ownerId || {};
  const currentUser = getStoredUser();
  const isCustomer = currentUser?.role === 'customer';
  const isAvailable = property.status === 'Available';

  return (
    <div className="page-shell container">
      <div className="property-detail-layout">
        <div className="property-detail-card">
          <div className="detail-top-row">
            <span className={`status-badge ${isAvailable ? 'available' : 'rented'}`}>
              {property.status}
            </span>
            <button type="button" className={`favorite-button ${isFavorite ? 'active' : ''}`} onClick={toggleFavorite}>
              {isFavorite ? '♥ Saved' : '♡ Save Property'}
            </button>
          </div>

          <h1>{property.title}</h1>
          <p className="detail-meta">{property.location} · {property.type}</p>
          <div className="detail-price">₹{Number(property.rent).toLocaleString('en-IN')}/month</div>
          <p className="property-description">{property.description}</p>

          {isCustomer && (
            <div className="detail-actions">
              {isAvailable ? (
                <button type="button" className="primary-button" onClick={() => setShowRentalForm(true)}>
                  Rent This Property
                </button>
              ) : (
                <button type="button" className="secondary-button disabled-button" disabled>
                  Currently Rented
                </button>
              )}
            </div>
          )}

          <div className="amenities-box">
            <h3>Property Highlights</h3>
            <div className="amenity-list">
              <span>Parking</span>
              <span>Water Supply</span>
              <span>Security</span>
              <span>Wi-Fi</span>
            </div>
          </div>

          {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

          {showRentalForm && isCustomer && isAvailable && (
            <form className="rental-form" onSubmit={handleRentalSubmit}>
              <h3>Confirm Rental</h3>

              <div className="input-row">
                <div className="input-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input id="startDate" name="startDate" type="date" value={rentalForm.startDate} onChange={handleRentalInput} required />
                </div>

                <div className="input-group">
                  <label htmlFor="endDate">End Date</label>
                  <input id="endDate" name="endDate" type="date" value={rentalForm.endDate} onChange={handleRentalInput} required />
                </div>
              </div>

              <div className="detail-actions">
                <button type="submit" className="primary-button" disabled={submitting}>
                  {submitting ? 'Renting...' : 'Confirm Rental'}
                </button>
                <button type="button" className="secondary-button" onClick={() => setShowRentalForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <aside className="owner-info-card">
          <h3>Owner Information</h3>
          <div className="owner-detail-item">
            <span>Name</span>
            <strong>{owner.name || 'N/A'}</strong>
          </div>
          <div className="owner-detail-item">
            <span>Email</span>
            <strong>{owner.email || 'N/A'}</strong>
          </div>
          <div className="owner-detail-item">
            <span>Phone</span>
            <strong>{owner.phone || 'N/A'}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PropertyDetails;
