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

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getStoredUser();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'House',
    rent: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/properties/${id}`);
        const property = response.data.property;
        setFormData({
          title: property.title,
          description: property.description,
          location: property.location,
          type: property.type,
          rent: property.rent,
        });
      } catch (error) {
        setMessage({ type: 'error', text: error?.response?.data?.message || 'Unable to load property.' });
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      setMessage({ type: 'error', text: 'Please log in to edit property data.' });
      return;
    }

    try {
      setSubmitting(true);
      await api.put(`/properties/${id}`, {
        ...formData,
        ownerId: user.id,
        rent: Number(formData.rent),
      });

      setMessage({ type: 'success', text: 'Property updated successfully.' });
      setTimeout(() => navigate('/owner/properties'), 900);
    } catch (error) {
      setMessage({ type: 'error', text: error?.response?.data?.message || 'Failed to update property.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page-shell container loading-text">Loading property data...</div>;
  }

  return (
    <div className="page-shell container">
      <div className="form-shell">
        <div className="section-heading">
          <span className="eyebrow">Edit listing</span>
          <h2>Edit Property</h2>
        </div>

        {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit} className="styled-form">
          <div className="input-group">
            <label htmlFor="title">Property Title</label>
            <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows="4" value={formData.description} onChange={handleChange} required />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="location">Location</label>
              <input id="location" name="location" type="text" value={formData.location} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label htmlFor="type">Property Type</label>
              <select id="type" name="type" value={formData.type} onChange={handleChange}>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Room">Room</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="rent">Monthly Rent</label>
            <input id="rent" name="rent" type="number" min="1" value={formData.rent} onChange={handleChange} required />
          </div>

          <button type="submit" className="primary-button full-width" disabled={submitting}>
            {submitting ? 'Updating Property...' : 'Update Property'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
