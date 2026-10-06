const StatCard = ({ label, value, icon, tone = 'primary' }) => {
  return (
    <div className={`stat-card stat-card-${tone}`}>
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;
