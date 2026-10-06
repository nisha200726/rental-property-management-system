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

const CustomerRentals = () => {
  const user = getStoredUser();
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRentals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await api.get(`/rentals/customer/${user.id}`);
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

  const handleCancel = async (rental) => {
    try {
      await api.put(`/rentals/${rental._id}/status`, { status: 'Cancelled' });
      alert('Rental cancelled successfully.');
      fetchRentals();
    } catch (error) {
      alert(error?.response?.data?.message || 'Failed to cancel rental.');
    }
  };

  return (
    <div className="page-shell container">
      <div className="section-heading spaced-heading">
        <div>
          <span className="eyebrow">Your bookings</span>
          <h2>My Rentals</h2>
        </div>
      </div>

      {loading ? (
        <p className="loading-text">Loading your rental history...</p>
      ) : rentals.length === 0 ? (
        <div className="empty-card">You do not have any rental bookings yet.</div>
      ) : (
        <div className="rental-list">
          {rentals.map((rental) => (
            <RentalCard key={rental._id} rental={rental} role="customer" onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerRentals;
