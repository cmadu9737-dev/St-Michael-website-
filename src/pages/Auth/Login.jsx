
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage('');

      // Step 1: Authenticate with Supabase
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });

      if (authError) {
        throw authError;
      }

      // Step 2: Retrieve the member's profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, role, subgroup_id')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        await supabase.auth.signOut();
        throw new Error(
          'Your account profile could not be found. Please contact your administrator.'
        );
      }

      // Step 3: Redirect administrators
      if (profile.role === 'admin') {
        navigate('/admin', { replace: true });
        return;
      }

      // Step 4: Retrieve the assigned subgroup
      if (!profile.subgroup_id) {
        await supabase.auth.signOut();
        throw new Error(
          'No subgroup has been assigned to your account. Please contact your administrator.'
        );
      }

      const { data: subgroup, error: subgroupError } = await supabase
        .from('subgroups')
        .select('name, slug')
        .eq('id', profile.subgroup_id)
        .single();

      if (subgroupError || !subgroup) {
        await supabase.auth.signOut();
        throw new Error(
          'Your subgroup information could not be retrieved. Please contact your administrator.'
        );
      }

      // Step 5: Redirect to the correct subgroup dashboard
      navigate(`/dashboard/${subgroup.slug}`, { replace: true });

    } catch (error) {
      console.error('Login error:', error);

      if (
        error.message?.toLowerCase().includes('email not confirmed')
      ) {
        setMessage(
          'Please confirm your email address before signing in. Check your inbox.'
        );
      } else if (
        error.message?.toLowerCase().includes('invalid login credentials')
      ) {
        setMessage('Incorrect email address or password.');
      } else {
        setMessage(error.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">

      <section className="login-image">
        <img
          src="/src/assets/St.%20Michael.png"
          alt="St. Michael CYON"
        />

        <div className="login-image-content">
          <span className="login-image-tag">
            CATHOLIC YOUTH ORGANIZATION OF NIGERIA
          </span>

          <h1>Faith. Unity. Service.</h1>

          <p>
            Growing together in faith, building lasting friendships,
            and serving God and humanity.
          </p>
        </div>
      </section>

      <section className="login-form-section">
        <div className="login-form-container">

          <img
            src="/src/assets/cyonlogo.png"
            alt="CYON Logo"
            className="login-logo"
          />

          <span className="login-small-title">
            WELCOME BACK
          </span>

          <h2>Sign in to CYON</h2>

          <p className="login-description">
            Enter your account details to access your CYON community.
          </p>

          <form onSubmit={handleSubmit} className="login-form">

            <label htmlFor="login-email">
              Email Address
            </label>

            <input
              id="login-email"
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />

            <label htmlFor="login-password">
              Password
            </label>

            <input
              id="login-password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

          </form>

          {message && (
            <p className="login-message" role="alert">
              {message}
            </p>
          )}

          <p className="login-switch">
            Don't have an account?{' '}
            <Link to="/register">Create account</Link>
          </p>

          <Link to="/" className="login-back-home">
            ← Back to homepage
          </Link>

          <div className="login-footer">
            © {new Date().getFullYear()} CYON. All rights reserved.
          </div>

        </div>
      </section>

    </main>
  );
}

export default Login;
