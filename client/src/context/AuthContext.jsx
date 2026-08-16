import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const DEMO_ACCOUNTS = [
  { label: "Day Scholar Student", email: "student.dayscholar@rajalakshmi.edu.in", description: "CSE 3rd Year • J Block • Day Scholar" },
  { label: "Hosteller Student (Pearl)", email: "hostel.student1@rajalakshmi.edu.in", description: "ECE 2nd Year • Pearl Hostel • Hosteller" },
  { label: "Club Lead (Coding Club)", email: "lead.coding@rajalakshmi.edu.in", description: "CSE 3rd Year • Club Lead" },
  { label: "ECE Staff / Faculty", email: "staff.ece@rajalakshmi.edu.in", description: "Assistant Prof • I Block Staff" },
  { label: "REC Admin", email: "admin@rajalakshmi.edu.in", description: "Dean Office • Full System Admin" }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('rec_campus_token') || null);
  const [loading, setLoading] = useState(true);
  
  // Theme Engine (Dark / Light Mode)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('rec_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rec_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // History & Hash-based Routing (Prevents Back Button landing on Firefox Home Page)
  const getInitialModule = () => {
    const hash = window.location.hash.replace('#', '');
    const validModules = ['dashboard', 'timetable', 'events', 'lostFound', 'clubs', 'mess', 'canteen', 'transport', 'profile'];
    return validModules.includes(hash) ? hash : 'dashboard';
  };

  const [activeModule, setActiveModuleState] = useState(getInitialModule);
  
  // Real-Time Multi-User Sync State
  const [syncData, setSyncData] = useState(null);
  const [lastServerTimestamp, setLastServerTimestamp] = useState(0);
  const [isSynced, setIsSynced] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState(new Date().toLocaleTimeString());

  // Handle module change with History API pushState
  const setActiveModule = useCallback((mod) => {
    setActiveModuleState(mod);
    const hash = '#' + mod;
    if (window.location.hash !== hash) {
      window.history.pushState({ module: mod }, '', hash);
    }
  }, []);

  // Listen to browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      const targetModule = event.state?.module || window.location.hash.replace('#', '') || 'dashboard';
      setActiveModuleState(targetModule);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Real-Time Polling Engine for Multi-User Live Sync
  const performSync = useCallback(async () => {
    if (!token) return;
    try {
      const res = await API.get(`/sync/poll?since=${lastServerTimestamp}`);
      if (res.data.success) {
        if (res.data.hasUpdates) {
          setSyncData(res.data.data);
          setLastServerTimestamp(res.data.serverTimestamp);
        }
        setIsSynced(true);
        setLastSyncedAt(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.warn('Sync poll error:', err.message);
      setIsSynced(false);
    }
  }, [token, lastServerTimestamp]);

  // Background 3-second polling timer for live updates
  useEffect(() => {
    if (!user || !token) return;
    performSync(); // Initial fetch
    const interval = setInterval(performSync, 3000);
    return () => clearInterval(interval);
  }, [user, token, performSync]);

  // Load User Profile on Mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('rec_campus_token');
      if (storedToken) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            setToken(storedToken);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Session restore failed:', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      const newToken = res.data.token;
      localStorage.setItem('rec_campus_token', newToken);
      setToken(newToken);
      setUser(res.data.user);
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await API.post('/auth/register', userData);
    if (res.data.success) {
      const newToken = res.data.token;
      localStorage.setItem('rec_campus_token', newToken);
      setToken(newToken);
      setUser(res.data.user);
      return res.data;
    }
  };

  const quickDemoLogin = async (email) => {
    const res = await API.post('/auth/demo-switch', { email });
    if (res.data.success) {
      const newToken = res.data.token;
      localStorage.setItem('rec_campus_token', newToken);
      setToken(newToken);
      setUser(res.data.user);
      return res.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('rec_campus_token');
    setToken(null);
    setUser(null);
    window.location.hash = '#dashboard';
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      quickDemoLogin,
      logout,
      activeModule,
      setActiveModule,
      syncData,
      isSynced,
      lastSyncedAt,
      performSync,
      theme,
      toggleTheme
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
