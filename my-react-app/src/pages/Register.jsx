import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'owner',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/register', formData);
      setMessage({ type: 'success', text: 'Registration successful! Redirecting to login...' });
      setTimeout(() => navigate('/login'), 900);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Registration failed. Please check your details and try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card register-card">
        <div className="auth-header">
          <span className="brand-badge">RentalHub</span>
          <h1>Create Account</h1>
          <p>Join as an owner or customer to manage your rental journey.</p>
        </div>

        {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="Your full name" required />
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Create a password" required />
          </div>

          <div className="input-group">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="9876543210" required />
          </div>

          <div className="input-group">
            <label>Role</label>
            <div className="role-toggle">
              <label className={formData.role === 'owner' ? 'role-option active' : 'role-option'}>
                <input type="radio" name="role" value="owner" checked={formData.role === 'owner'} onChange={handleChange} />
                <span>Owner</span>
              </label>
              <label className={formData.role === 'customer' ? 'role-option active' : 'role-option'}>
                <input type="radio" name="role" value="customer" checked={formData.role === 'customer'} onChange={handleChange} />
                <span>Customer</span>
              </label>
            </div>
          </div>

          <button type="submit" className="primary-button full-width" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
