import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const response = await api.post('/login', formData);
      const loggedInUser = response.data.user;

      localStorage.setItem('user', JSON.stringify(loggedInUser));
      setMessage({ type: 'success', text: 'Login successful. Redirecting...' });

      setTimeout(() => {
        if (loggedInUser.role === 'owner') {
          navigate('/owner/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      }, 600);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Unable to log in right now. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card login-card">
        <div className="auth-header">
          <span className="brand-badge">RentalHub</span>
          <h1>Welcome Back</h1>
          <p>Sign in to manage your rentals with confidence.</p>
        </div>

        {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="input-group">
            <label>Role</label>
            <div className="role-toggle">
              <label className={formData.role === 'owner' ? 'role-option active' : 'role-option'}>
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  checked={formData.role === 'owner'}
                  onChange={handleChange}
                />
                <span>Owner</span>
              </label>

              <label className={formData.role === 'customer' ? 'role-option active' : 'role-option'}>
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={formData.role === 'customer'}
                  onChange={handleChange}
                />
                <span>Customer</span>
              </label>
            </div>
          </div>

          <button type="submit" className="primary-button full-width" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="switch-text">
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
