
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import {
  User,
  Camera,
  Save,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';

import './Profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    parish: '',
    date_of_birth: '',
    avatar_url: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  // LOAD USER PROFILE
  const loadProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const {
        data: { user: currentUser },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !currentUser) {
        throw new Error('Unable to load your account. Please log in again.');
      }

      setUser(currentUser);

      const { data, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (profileError) {
        throw new Error(`Profile loading failed: ${profileError.message}`);
      }

      if (!data) {
        throw new Error(
          'Your profile record could not be found. Please contact your administrator.'
        );
      }

      setFormData({
        full_name: data.full_name || '',
        phone: data.phone || '',
        parish: data.parish || '',
        date_of_birth: data.date_of_birth || '',
        avatar_url: data.avatar_url || ''
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // HANDLE INPUT CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // UPLOAD PROFILE PICTURE
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file || !user) return;

    setError('');
    setMessage('');

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please select a JPG, PNG or WEBP image.');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Your image must be smaller than 5MB.');
      e.target.value = '';
      return;
    }

    setUploading(true);

    try {
      const extension = file.name.split('.').pop().toLowerCase();

      // Each upload gets a unique filename
      const filePath = `${user.id}/avatar-${Date.now()}.${extension}`;

      // Upload image to avatars bucket
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: false,
          contentType: file.type
        });

      if (uploadError) {
        throw new Error(
          `Storage upload failed: ${uploadError.message}`
        );
      }

      // Generate public URL
      const { data: publicData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = publicData.publicUrl;

      // Save image URL to profiles table
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: avatarUrl
        })
        .eq('id', user.id)
        .select('id');

      if (updateError) {
        throw new Error(
          `Profile update failed: ${updateError.message}`
        );
      }

      if (!updatedProfile || updatedProfile.length === 0) {
        throw new Error(
          'The image uploaded, but your profile was not updated. Check your profiles table and permissions.'
        );
      }

      setFormData(prev => ({
        ...prev,
        avatar_url: avatarUrl
      }));

      setMessage('Your profile picture has been updated successfully.');

    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // SAVE PERSONAL INFORMATION
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return;

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim(),
          parish: formData.parish.trim(),
          date_of_birth: formData.date_of_birth || null
        })
        .eq('id', user.id)
        .select('id');

      if (updateError) {
        throw new Error(updateError.message);
      }

      if (!updatedProfile || updatedProfile.length === 0) {
        throw new Error(
          'No profile record was updated. Check your profile permissions.'
        );
      }

      setMessage('Your personal information has been saved successfully.');

    } catch (err) {
      setError(`Unable to save profile: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // GENERATE INITIALS
  const initials = formData.full_name
    ? formData.full_name
        .split(' ')
        .filter(Boolean)
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'CY';

  if (loading) {
    return (
      <div className="profile-loading">
        <Loader2 className="spin" size={28} />
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* PAGE HEADER */}
        <div className="profile-heading">
          <div>
            <h1>My Profile</h1>
            <p>
              Manage your personal information and profile picture.
            </p>
          </div>

          <button
            type="button"
            className="profile-refresh-button"
            onClick={loadProfile}
            title="Refresh profile"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        {/* PROFILE CARD */}
        <div className="profile-card">

          {/* PROFILE PICTURE */}
          <div className="profile-picture-section">

            <div className="profile-picture">
              {formData.avatar_url ? (
                <img
                  src={formData.avatar_url}
                  alt="Member profile"
                  onError={() => {
                    setFormData(prev => ({
                      ...prev,
                      avatar_url: ''
                    }));
                  }}
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <h3>{formData.full_name || 'CYON Member'}</h3>
            <p className="profile-email">
              {user?.email}
            </p>

            <label className="profile-upload-button">
              {uploading ? (
                <Loader2 className="spin" size={17} />
              ) : (
                <Camera size={17} />
              )}

              {uploading ? 'Uploading...' : 'Change Photo'}

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
                disabled={uploading}
                hidden
              />
            </label>

            <p className="profile-image-hint">
              JPG, PNG or WEBP. Maximum 5MB.
            </p>

          </div>

          {/* PERSONAL INFORMATION */}
          <form onSubmit={handleSubmit}>

            <div className="profile-form-heading">
              <User size={21} />
              <div>
                <h2>Personal Information</h2>
                <p>Update your account details below.</p>
              </div>
            </div>

            <div className="profile-form-grid">

              {/* FULL NAME */}
              <div className="profile-field">
                <label>Full Name</label>

                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="profile-field">
                <label>Email Address</label>

                <div className="profile-input-icon">
                  <Mail size={17} />

                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                  />
                </div>
              </div>

              {/* PHONE */}
              <div className="profile-field">
                <label>Phone Number</label>

                <div className="profile-input-icon">
                  <Phone size={17} />

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* PARISH */}
              <div className="profile-field">
                <label>Parish</label>

                <div className="profile-input-icon">
                  <MapPin size={17} />

                  <input
                    type="text"
                    name="parish"
                    value={formData.parish}
                    onChange={handleChange}
                    placeholder="Enter your parish"
                  />
                </div>
              </div>

              {/* DATE OF BIRTH */}
              <div className="profile-field">
                <label>Date of Birth</label>

                <div className="profile-input-icon">
                  <Calendar size={17} />

                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                  />
                </div>
              </div>

            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="profile-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* SUCCESS MESSAGE */}
            {message && (
              <div className="profile-success">
                <CheckCircle size={18} />
                <span>{message}</span>
              </div>
            )}

            {/* SAVE BUTTON */}
            <div className="profile-form-actions">
              <button
                type="submit"
                className="profile-save-button"
                disabled={saving || uploading}
              >
                {saving ? (
                  <Loader2 className="spin" size={18} />
                ) : (
                  <Save size={18} />
                )}

                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

export default Profile;
