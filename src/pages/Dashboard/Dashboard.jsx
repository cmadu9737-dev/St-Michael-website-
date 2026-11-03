
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Megaphone,
  Cake,
  ClipboardCheck,
  Wallet,
  Users,
  Bell,
  UserRound,
  Camera,
  Pencil,
  X,
  Save,
  LoaderCircle,
  Mail,
  Phone,
  MapPin,
  ShieldCheck
} from 'lucide-react';

import { supabase } from '../../lib/supabase';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [subgroup, setSubgroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    parish: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const {
          data: { user },
          error: authError
        } = await supabase.auth.getUser();

        if (authError || !user) {
          navigate('/login');
          return;
        }

        const { data: member, error: profileError } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone, parish, avatar_url, role, subgroup_id')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        let group = null;

        if (member.subgroup_id) {
          const { data, error: groupError } = await supabase
            .from('subgroups')
            .select('id, name, slug')
            .eq('id', member.subgroup_id)
            .single();

          if (groupError) throw groupError;
          group = data;
        }

        if (active) {
          const completeProfile = {
            ...member,
            email: member.email || user.email
          };

          setProfile(completeProfile);
          setSubgroup(group);

          setFormData({
            full_name: member.full_name || '',
            phone: member.phone || '',
            parish: member.parish || ''
          });
        }
      } catch (err) {
        console.error('Dashboard loading error:', err);
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [navigate]);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData(previous => ({
      ...previous,
      [name]: value
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image.');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError('Your profile picture must be smaller than 3MB.');
      return;
    }

    setError('');
    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  function closeEditor() {
    setEditing(false);
    setSelectedImage(null);
    setImagePreview('');
    setMessage('');
    setError('');

    setFormData({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      parish: profile?.parish || ''
    });
  }

  async function handleSaveProfile(event) {
    event.preventDefault();

    setSaving(true);
    setError('');
    setMessage('');

    try {
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('Please log in again.');
      }

      let avatarUrl = profile.avatar_url;

      if (selectedImage) {
        const fileExtension = selectedImage.name.split('.').pop();
        const filePath =
          `${user.id}/${Date.now()}.${fileExtension}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, selectedImage, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);

        avatarUrl = publicUrlData.publicUrl;
      }

      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name.trim(),
          phone: formData.phone.trim(),
          parish: formData.parish.trim(),
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setProfile(previous => ({
        ...previous,
        ...updatedProfile,
        email: previous.email
      }));

      setSelectedImage(null);
      setImagePreview('');
      setEditing(false);
      setMessage('Your profile has been updated successfully.');

    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Unable to update your profile.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <LoaderCircle className="loading-spinner" size={35} />
        <p>Preparing your CYON dashboard...</p>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="dashboard-error">
        <h2>Dashboard could not load</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try again
        </button>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: 'Events',
      description: 'Discover upcoming meetings, programmes and activities.',
      icon: CalendarDays,
      color: 'green'
    },
    {
      title: 'Announcements',
      description: 'Stay informed about important CYON updates.',
      icon: Megaphone,
      color: 'orange'
    },
    {
      title: 'Birthdays',
      description: 'Celebrate birthdays with fellow CYON members.',
      icon: Cake,
      color: 'pink'
    },
    {
      title: 'Attendance',
      description: 'Keep track of your meetings and attendance.',
      icon: ClipboardCheck,
      color: 'blue'
    },
    {
      title: 'Payments',
      description: 'Review your contributions and payment records.',
      icon: Wallet,
      color: 'purple'
    },
    {
      title: 'Members',
      description: 'Connect with members of your CYON community.',
      icon: Users,
      color: 'teal'
    }
  ];

  const displayedAvatar = imagePreview || profile?.avatar_url;

  return (
    <main className="member-dashboard">

      <div className="dashboard-topbar">
        <div>
          <p className="dashboard-eyebrow">ST. MICHAEL CYON</p>
          <h1>Member Dashboard</h1>
          <p>Welcome to your CYON community portal.</p>
        </div>

        <div className="dashboard-topbar-icon">
          <Bell size={21} />
        </div>
      </div>

      {message && (
        <div className="dashboard-success">
          {message}
          <button onClick={() => setMessage('')} aria-label="Dismiss">
            <X size={17} />
          </button>
        </div>
      )}

      {error && profile && (
        <div className="dashboard-error-message">
          {error}
          <button onClick={() => setError('')} aria-label="Dismiss">
            <X size={17} />
          </button>
        </div>
      )}

      <section className="dashboard-hero">
        <div className="dashboard-hero-content">
          <span className="hero-label">WELCOME BACK</span>
          <h2>{profile?.full_name || 'CYON Member'}</h2>
          <p>
            Stay connected, grow in faith and make a difference
            in your CYON community.
          </p>

          <div className="hero-subgroup">
            <Users size={17} />
            <span>{subgroup?.name || 'Subgroup not assigned'}</span>
          </div>
        </div>

        <div className="hero-decoration">
          <div className="hero-decoration-circle">
            <ShieldCheck size={64} />
          </div>
        </div>
      </section>

      <section className="dashboard-profile-section">

        <div className="section-heading">
          <div>
            <h2>My Profile</h2>
            <p>Manage your personal information and profile picture.</p>
          </div>

          {!editing && (
            <button
              className="edit-profile-button"
              onClick={() => {
                setEditing(true);
                setMessage('');
                setError('');
              }}
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-card">

          <div className="profile-main">
            <div className="profile-photo">
              {displayedAvatar ? (
                <img src={displayedAvatar} alt="Member profile" />
              ) : (
                <span>
                  {profile?.full_name?.charAt(0)?.toUpperCase() || 'M'}
                </span>
              )}
            </div>

            <div className="profile-main-details">
              <h3>{profile?.full_name}</h3>
              <p>{profile?.email}</p>
              <span className="member-role">
                {profile?.role || 'Member'}
              </span>
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="profile-detail">
              <Phone size={18} />
              <div>
                <span>Phone Number</span>
                <strong>{profile?.phone || 'Not provided'}</strong>
              </div>
            </div>

            <div className="profile-detail">
              <MapPin size={18} />
              <div>
                <span>Parish</span>
                <strong>{profile?.parish || 'Not provided'}</strong>
              </div>
            </div>

            <div className="profile-detail">
              <Users size={18} />
              <div>
                <span>Subgroup</span>
                <strong>{subgroup?.name || 'Not assigned'}</strong>
              </div>
            </div>

            <div className="profile-detail">
              <Mail size={18} />
              <div>
                <span>Email Address</span>
                <strong>{profile?.email || 'Not available'}</strong>
              </div>
            </div>
          </div>

          {editing && (
            <form className="profile-edit-form" onSubmit={handleSaveProfile}>

              <div className="edit-form-heading">
                <div>
                  <h3>Edit your information</h3>
                  <p>Keep your member details up to date.</p>
                </div>

                <button
                  type="button"
                  className="close-editor"
                  onClick={closeEditor}
                  aria-label="Close editor"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="photo-upload-section">
                <div className="photo-upload-preview">
                  {displayedAvatar ? (
                    <img src={displayedAvatar} alt="New profile preview" />
                  ) : (
                    <UserRound size={35} />
                  )}
                </div>

                <div>
                  <label className="upload-photo-button">
                    <Camera size={16} />
                    Choose Profile Picture
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                    />
                  </label>
                  <p>JPG, PNG or WebP. Maximum size: 3MB.</p>
                </div>
              </div>

              <div className="profile-form-grid">
                <label>
                  Full Name
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                  />
                </label>

                <label>
                  Email Address
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                  />
                  <small>Email cannot be changed here.</small>
                </label>

                <label>
                  Phone Number
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </label>

                <label>
                  Parish
                  <input
                    type="text"
                    name="parish"
                    value={formData.parish}
                    onChange={handleInputChange}
                    placeholder="Enter your parish"
                  />
                </label>
              </div>

              <div className="profile-form-actions">
                <button
                  type="button"
                  className="cancel-edit-button"
                  onClick={closeEditor}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-profile-button"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <LoaderCircle size={17} className="loading-spinner" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="dashboard-features-section">
        <div className="section-heading">
          <div>
            <h2>Your CYON Services</h2>
            <p>Access the services available to members.</p>
          </div>
        </div>

        <div className="dashboard-grid">
          {dashboardCards.map(({ title, description, icon: Icon, color }) => (
            <article className="dashboard-card" key={title}>
              <div className={`dashboard-card-icon ${color}`}>
                <Icon size={23} />
              </div>

              <h3>{title}</h3>
              <p>{description}</p>

              <span className="coming-soon">Coming soon</span>
            </article>
          ))}
        </div>
      </section>

      <footer className="dashboard-footer">
        <p>St. Michael Catholic Youth Organization of Nigeria</p>
        <span>Faith • Service • Unity</span>
      </footer>

    </main>
  );
}

export default Dashboard;
