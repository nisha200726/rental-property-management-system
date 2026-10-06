import { Link } from 'react-router-dom';

const Home = () => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user') || 'null');
  } catch (error) {
    user = null;
  }

  const isOwner = user?.role === 'owner';
  const isCustomer = user?.role === 'customer';
  const primaryPath = isOwner ? '/owner/properties' : isCustomer ? '/properties' : '/login';
  const secondaryPath = isOwner ? '/owner/properties/add' : isCustomer ? '/customer/rentals' : '/register';
  const primaryLabel = isOwner ? 'Manage My Properties' : isCustomer ? 'Browse Properties' : 'Login';
  const secondaryLabel = isOwner ? 'Add Property' : isCustomer ? 'My Rentals' : 'Create Account';

  const features = [
    { title: 'Find Properties', text: 'Browse homes and rentals in your preferred city and budget.' },
    { title: 'Easy Renting', text: 'Set dates, reserve your next property, and manage bookings smoothly.' },
    { title: 'Manage Properties', text: 'Owners can list, update, and track rentals from one dashboard.' },
    { title: 'Track Rentals', text: 'Monitor current, cancelled, and completed rentals in real time.' },
  ];

  return (
    <div className="page-shell">
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Trusted rental platform</span>
            <h1>Find Your Perfect Place</h1>
            <p>
              {isOwner
                ? 'Manage your property listings and rental activity in one place.'
                : 'Discover, manage, and rent properties with ease.'}
            </p>
            <div className="hero-actions">
              <Link to={primaryPath} className="primary-button">{primaryLabel}</Link>
              <Link to={secondaryPath} className="secondary-button">{secondaryLabel}</Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="property-showcase">
              <div className="showcase-card premium-card">
                <span>{isOwner ? 'Owner workspace' : isCustomer ? 'Customer marketplace' : 'RentalHub'}</span>
                <h3>
                  {isOwner
                    ? 'Your properties, your control'
                    : isCustomer
                      ? 'Find a place that fits your needs'
                      : 'Renting made clearer'}
                </h3>
                <p>
                  {isOwner
                    ? 'Add listings, update details, and manage availability.'
                    : isCustomer
                      ? 'Browse available rentals from your customer account.'
                      : 'A simpler way for owners and renters to manage the process.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="features-section container">
        <div className="section-heading">
          <span className="eyebrow">How it works</span>
          <h2>Simple steps to your next rental</h2>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={feature.title}>
              <div className="feature-icon">0{index + 1}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="about-section container">
        <div className="about-card">
          <div>
            <span className="eyebrow">About RentalHub</span>
            <h2>Modern rental management for people and properties</h2>
          </div>
          <p>
            RentalHub brings together property owners and renters in one streamlined marketplace.
            Owners can manage listings, rental requests, and property status while customers can
            search homes, schedule stays, and track bookings from a single dashboard.
          </p>
        </div>
      </section>

    </div>
  );
};

export default Home;
