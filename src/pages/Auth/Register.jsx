
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSubgroup } from '../../utils/subgroup';
import { supabase } from '../../lib/supabase';
import './Auth.css';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    parish: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const subgroup = formData.dateOfBirth
    ? getSubgroup(formData.dateOfBirth)
    : null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setMessage('Password must contain at least 8 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }

    if (new Date(`${formData.dateOfBirth}T00:00:00`) > new Date()) {
      setMessage('Date of birth cannot be in the future.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
            phone: formData.phone.trim(),
            date_of_birth: formData.dateOfBirth,
            parish: formData.parish.trim(),
          },
        },
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('Registration could not be completed.');
      }

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        parish: '',
        password: '',
        confirmPassword: '',
      });

      if (data.session) {
        setMessage('Account created successfully! Redirecting to login...');

        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      } else {
        setMessage(
          'Account created! Please check your email to confirm your account, then sign in.'
        );
      }

    } catch (error) {
      console.error('Registration error:', error);
      setMessage(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">

      <section className="register-image">
        <img
          src="/src/assets/St.%20Michael.png"
          alt="St. Michael CYON"
        />

        <div className="register-image-content">
          <span className="register-image-tag">
            CATHOLIC YOUTH ORGANIZATION OF NIGERIA
          </span>

          <h1>Become Part of Something Greater.</h1>

          <p>
            Join a community of young Catholics growing in faith,
            building friendships, and serving God and humanity.
          </p>
        </div>
      </section>

      <section className="register-form-section">
        <div className="register-form-container">

          <img
            src="/src/assets/cyonlogo.png"
            alt="CYON Logo"
            className="register-logo"
          />

          <span className="register-small-title">
            JOIN OUR COMMUNITY
          </span>

          <h2>Create Your Account</h2>

          <p className="register-description">
            Fill in your information to become part of CYON.
          </p>

          <form onSubmit={handleSubmit} className="register-form">

            <label htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <label htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="register-phone">Phone Number</label>
            <input
              id="register-phone"
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <label htmlFor="register-dob">Date of Birth</label>
            <input
              id="register-dob"
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />

            {subgroup && (
              <div className="register-subgroup-preview">
                <span>YOUR AUTOMATICALLY ASSIGNED SUBGROUP</span>
                <strong>{subgroup.name}</strong>
              </div>
            )}

            <label htmlFor="register-parish">Parish</label>
            <input
              id="register-parish"
              type="text"
              name="parish"
              placeholder="Enter your parish"
              value={formData.parish}
              onChange={handleChange}
              required
            />

            <label htmlFor="register-password">Password</label>
            <input
              id="register-password"
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />

            <label htmlFor="register-confirm-password">
              Confirm Password
            </label>
            <input
              id="register-confirm-password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
            />

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

          </form>

          {message && (
            <p className="register-message" role="status">
              {message}
            </p>
          )}

          <p className="register-switch">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>

          <Link to="/" className="register-back-home">
            ← Back to homepage
          </Link>

          <div className="register-footer">
            © {new Date().getFullYear()} CYON. All rights reserved.
          </div>

        </div>
      </section>

    </main>
  );
}

export default Register;
