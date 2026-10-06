const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    return null;
  }
};

const CustomerProfile = () => {
  const user = getStoredUser();

  return (
    <div className="page-shell container">
      <div className="profile-card">
        <span className="eyebrow">Customer profile</span>
        <h1>{user?.name || 'Customer Name'}</h1>
        <div className="profile-list">
          <div className="profile-row"><span>Name</span><strong>{user?.name || 'N/A'}</strong></div>
          <div className="profile-row"><span>Email</span><strong>{user?.email || 'N/A'}</strong></div>
          <div className="profile-row"><span>Phone</span><strong>{user?.phone || 'N/A'}</strong></div>
          <div className="profile-row"><span>Role</span><strong>{user?.role || 'customer'}</strong></div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;
