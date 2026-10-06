const RentalCard = ({ rental, role = 'customer', onCancel, onComplete }) => {
  const property = rental.propertyId || {};
  const customer = rental.customerId || {};

  return (
    <article className="rental-card">
      <div className="rental-header">
        <div>
          <h3>{property.title || 'Property'}</h3>
          <p>{property.location || 'Location unavailable'}</p>
        </div>
        <span className={`status-badge ${rental.status === 'Active' ? 'active' : rental.status === 'Completed' ? 'completed' : rental.status === 'Cancelled' ? 'cancelled' : 'pending'}`}>
          {rental.status}
        </span>
      </div>

      <div className="rental-grid">
        {role === 'owner' && (
          <>
            <div><span>Customer</span><strong>{customer.name || 'N/A'}</strong></div>
            <div><span>Email</span><strong>{customer.email || 'N/A'}</strong></div>
            <div><span>Phone</span><strong>{customer.phone || 'N/A'}</strong></div>
          </>
        )}
        <div><span>Rent</span><strong>₹{Number(rental.rentAmount || property.rent || 0).toLocaleString('en-IN')}</strong></div>
        <div><span>Start</span><strong>{new Date(rental.startDate).toLocaleDateString()}</strong></div>
        <div><span>End</span><strong>{new Date(rental.endDate).toLocaleDateString()}</strong></div>
      </div>

      {role === 'customer' && rental.status === 'Active' && (
        <button type="button" className="danger-button" onClick={() => onCancel(rental)}>
          Cancel Rental
        </button>
      )}

      {role === 'owner' && rental.status === 'Active' && (
        <button type="button" className="primary-button" onClick={() => onComplete(rental)}>
          Complete Rental
        </button>
      )}
    </article>
  );
};

export default RentalCard;
