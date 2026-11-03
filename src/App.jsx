
import { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';

import { supabase } from './lib/supabase';

import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';

import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';

import Header from './components/Header/Header';

function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    let active = true;

    const checkSession = async () => {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession();

      if (!active) return;

      setAuthenticated(!error && !!session);
      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setAuthenticated(!!session);
        setLoading(false);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  return authenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
}

function DashboardLayout() {
  return (
    <>
      <Header />
      <Dashboard />
    </>
  );
}

function ProfileLayout() {
  return (
    <>
      <Header />
      <Profile />
    </>
  );
}

function SettingsLayout() {
  return (
    <>
      <Header />
      <Settings />
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />} />

        <Route
          path="/dashboard/:subgroupSlug"
          element={<DashboardLayout />}
        />

        <Route path="/profile" element={<ProfileLayout />} />

        <Route path="/settings" element={<SettingsLayout />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
