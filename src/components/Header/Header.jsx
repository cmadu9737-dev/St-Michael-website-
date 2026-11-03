
import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import {
  Home,
  Users,
  CalendarDays,
  Megaphone,
  Mail,
  LogIn,
  UserPlus,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  ChevronDown
} from 'lucide-react';

import { supabase } from '../../lib/supabase';
import './Header.css';
import logo from '../../assets/cyonlogo.png';

const navItems = [
  { name: 'Home', path: '/' , icon: Home },
  { name: 'Subgroups', path: '/#subgroups', icon: Users },
  { name: 'Events', path: '/#events', icon: CalendarDays },
  { name: 'Announcements', path: '/#announcements', icon: Megaphone },
  { name: 'Members', path: '/#members', icon: Users },
  { name: 'Contact', path: '/#contact', icon: Mail }
];

function Header() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    const loadProfile = async (user) => {
      if (!user) {
        if (mounted) setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, role')
        .eq('id', user.id)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        console.error('Profile error:', error.message);
        return;
      }

      setProfile(data);
    };

    const initialize = async () => {
      const {
        data: { session: currentSession }
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(currentSession);
      await loadProfile(currentSession?.user);
    };

    initialize();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setMenuOpen(false);

      if (event === 'SIGNED_OUT' || !newSession) {
        setProfile(null);
      } else {
        setTimeout(() => {
          loadProfile(newSession.user);
        }, 0);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Scroll to homepage sections
  useEffect(() => {
    if (location.pathname !== '/') return;

    const hash = location.hash;

    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const timer = setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [location.pathname, location.hash]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    setMenuOpen(false);
    navigate('/');
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .filter(Boolean)
        .map(part => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'M';

  return (
    <header className="site-header">

      <Link to="/" className="header-brand">
        <img src={logo} alt="St. Michael CYON logo" />

        <div className="brand-text">
          <h2>St. Michael Catholic</h2>
          <h2>
            Youth Organization <span>(CYON)</span>
          </h2>
          <p>Akwakuma, Owerri – Imo State</p>
        </div>
      </Link>

      <nav className="main-navigation">
        {navItems.map(({ name, path, icon: Icon }) => (
          <Link
            key={name}
            to={path}
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            <Icon size={18} />
            <span>{name}</span>
          </Link>
        ))}
      </nav>

      <div className="header-actions">

        {!session ? (
          <>
            <Link to="/login" className="login-button">
              <LogIn size={17} />
              Login
            </Link>

            <Link to="/register" className="register-button">
              <UserPlus size={17} />
              Register
            </Link>
          </>
        ) : (
          <div className="header-profile">

            <button
              className="header-profile-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open account menu"
              aria-expanded={menuOpen}
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="header-avatar"
                />
              ) : (
                <span className="header-avatar header-avatar-initials">
                  {initials}
                </span>
              )}

              <span className="header-profile-name">
                {profile?.full_name || 'My Account'}
              </span>

              <ChevronDown size={16} />
            </button>

            {menuOpen && (
              <div className="header-profile-dropdown">

                <div className="header-dropdown-name">
                  {profile?.full_name || 'CYON Member'}
                </div>

                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                >
                  <LayoutDashboard size={17} />
                  My Dashboard
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={17} />
                  My Profile
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setMenuOpen(false)}
                >
                  <Settings size={17} />
                  Settings
                </Link>

                <button onClick={handleLogout}>
                  <LogOut size={17} />
                  Log Out
                </button>

              </div>
            )}

          </div>
        )}

      </div>
    </header>
  );
}

export default Header;
