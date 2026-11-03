
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Lock,
  ShieldCheck,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import './Settings.css';

function Settings() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage('Your password has been updated successfully.');
    setPassword('');
    setConfirmPassword('');
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">

        <div className="settings-heading">
          <h1>Account Settings</h1>
          <p>Manage your account security and preferences.</p>
        </div>

        <div className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-icon">
              <Lock />
            </div>
            <div>
              <h2>Change Password</h2>
              <p>Keep your CYON account secure.</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange}>

            <label>New Password</label>
            <div className="settings-password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <label>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />

            {error && (
              <div className="settings-message error">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {message && (
              <div className="settings-message success">
                <CheckCircle size={18} />
                {message}
              </div>
            )}

            <button
              type="submit"
              className="settings-save-button"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>

          </form>
        </div>

        <div className="settings-card">
          <div className="settings-card-heading">
            <div className="settings-icon">
              <ShieldCheck />
            </div>
            <div>
              <h2>Account Security</h2>
              <p>Your account is protected by Supabase authentication.</p>
            </div>
          </div>
        </div>

        <div className="settings-card logout-card">
          <div className="settings-card-heading">
            <div className="settings-icon">
              <LogOut />
            </div>
            <div>
              <h2>Sign Out</h2>
              <p>Sign out of your CYON account on this device.</p>
            </div>
          </div>

          <button
            className="settings-logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}

export default Settings;
