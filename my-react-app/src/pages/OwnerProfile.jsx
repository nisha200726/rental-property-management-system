const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    return null;
  }
};

const OwnerProfile = () => {
  const user = getStoredUser();

  return (
    <div className="page-shell container">
      <div className="profile-card">
        <span className="eyebrow">Owner profile</span>
        <h1>{user?.name || 'Owner Name'}</h1>
        <div className="profile-list">
          <div className="profile-row"><span>Name</span><strong>{user?.name || 'N/A'}</strong></div>
          <div className="profile-row"><span>Email</span><strong>{user?.email || 'N/A'}</strong></div>
          <div className="profile-row"><span>Phone</span><strong>{user?.phone || 'N/A'}</strong></div>
          <div className="profile-row"><span>Role</span><strong>{user?.role || 'owner'}</strong></div>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
