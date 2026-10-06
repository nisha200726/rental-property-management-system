import { useEffect, useState } from 'react';
import RentalCard from '../components/RentalCard';
import api from '../services/api';

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    return null;
  }
};

const OwnerRentals = () => {
  const user = getStoredUser();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRentals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await api.get(`/rentals/owner/${user.id}`);
      setRentals(response.data.rentals || []);
    } catch (error) {
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, []);

  const handleComplete = async (rental) => {
    try {
      await api.put(`/rentals/${rental._id}/status`, { status: 'Completed' });
      alert('Rental completed successfully.');
      fetchRentals();
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to complete rental.');
    }
  };

  return (
    <div className="page-shell container">
      <div className="section-heading spaced-heading">
        <div>
          <span className="eyebrow">Owner rentals</span>
          <h2>Rental Requests</h2>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Loading rental details...</p>
      ) : rentals.length === 0 ? (
        <div className="empty-card">No rental activity for your properties yet.</div>
      ) : (
        <div className="rental-list">
          {rentals.map((rental) => (
            <RentalCard key={rental._id} rental={rental} role="owner" onComplete={handleComplete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerRentals;
