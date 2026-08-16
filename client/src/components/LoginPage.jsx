import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import API from '../services/api';
import { ShieldCheck, Sparkles, CheckCircle2, Lock, User, Mail, Building, Calendar, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, register, quickDemoLogin } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' or 'register'

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male');
  const [department, setDepartment] = useState('CSE');
  const [year, setYear] = useState('2nd Year');
  const [isHosteller, setIsHosteller] = useState(false);

  // Status State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registryInfo, setRegistryInfo] = useState(null);

  const handleRegistryCheck = async (emailVal) => {
    if (!emailVal.endsWith('@rajalakshmi.edu.in')) {
      setRegistryInfo(null);
      return;
    }
    try {
      const res = await API.post('/auth/registry-check', { email: emailVal });
      if (res.data.success && res.data.foundInRegistry) {
        setRegistryInfo(res.data.data);
        setName(res.data.data.name);
        setGender(res.data.data.gender);
        setDepartment(res.data.data.department);
        setYear(res.data.data.year);
        setIsHosteller(res.data.data.isHosteller);
      } else {
        setRegistryInfo(null);
      }
    } catch (err) {
      console.warn('Registry check error:', err);
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (val.includes('@')) {
      handleRegistryCheck(val);
    }
  };

  const handleDemoClick = async (demoEmail) => {
    try {
      setLoading(true);
      setError('');
      setEmail(demoEmail);
      setPassword('Password@123');
      await quickDemoLogin(demoEmail);
    } catch (err) {
      console.error('Demo login error:', err);
      setError(err.response?.data?.message || err.message || 'Demo authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.endsWith('@rajalakshmi.edu.in')) {
      setError('Official Domain Enforced: Email must end with @rajalakshmi.edu.in');
      return;
    }

    try {
      setLoading(true);
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, gender, department, year, isHosteller });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at top right, #1e293b, #0b0f19 80%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        maxWidth: '1100px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '40px',
        alignItems: 'center'
      }}>
        {/* Left Column: Branding & Demo Quick-Login Grid */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <img
              src="/rec_logo.jpg"
              alt="Rajalakshmi Engineering College Logo"
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                objectFit: 'contain',
                background: '#ffffff',
                padding: '4px',
                boxShadow: '0 8px 24px rgba(106,27,154,0.4)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            />
            <div>
              <span className="badge badge-purple" style={{ background: 'rgba(168,85,247,0.2)', color: '#e9d5ff', border: '1px solid rgba(168,85,247,0.4)' }}>
                <ShieldCheck size={12} /> OFFICIAL CAMPUS HUB
              </span>
              <h1 style={{ fontSize: '28px', fontWeight: 800, marginTop: '4px', color: '#ffffff' }}>REC Campus Companion</h1>
            </div>
          </div>

          <p style={{ fontSize: '15px', color: '#cbd5e1', lineHeight: '1.6', marginBottom: '24px' }}>
            A single-window utility hub unifying timetable management, event RSVPs, lost & found reporting, club announcements, hosteller mess ratings, and 130+ bus routes for Rajalakshmi Engineering College.
          </p>

          {/* 1-Click Demo Accounts Card Grid */}
          <div style={{ background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#d8b4fe', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Sparkles size={14} color="#d8b4fe" /> 1-Click Demo Accounts (Select Any Role to Login Instantly):
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {DEMO_ACCOUNTS.map((acc, i) => (
                <button
                  key={i}
                  onClick={() => handleDemoClick(acc.email)}
                  disabled={loading}
                  style={{
                    background: 'rgba(30, 41, 59, 0.85)',
                    border: '1px solid rgba(168, 85, 247, 0.35)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    textAlign: 'left',
                    color: '#ffffff',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: loading ? 0.7 : 1,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                  }}
                  onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.background = 'rgba(106, 27, 154, 0.3)'; } }}
                  onMouseLeave={(e) => { if (!loading) { e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.35)'; e.currentTarget.style.background = 'rgba(30, 41, 59, 0.85)'; } }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>{acc.label}</div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '3px', wordBreak: 'break-all' }}>{acc.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.92)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8)',
          backdropFilter: 'blur(16px)'
        }}>
          {/* Mode Switcher */}
          <div style={{ display: 'flex', background: 'rgba(30, 41, 59, 0.9)', padding: '4px', borderRadius: '10px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => { setMode('login'); setError(''); }}
              style={{
                flex: 1, padding: '10px', border: 'none', borderRadius: '8px',
                background: mode === 'login' ? 'linear-gradient(135deg, #6A1B9A, #8e24aa)' : 'transparent',
                color: mode === 'login' ? '#ffffff' : '#94a3b8',
                fontWeight: 800, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              style={{
                flex: 1, padding: '10px', border: 'none', borderRadius: '8px',
                background: mode === 'register' ? 'linear-gradient(135deg, #6A1B9A, #8e24aa)' : 'transparent',
                color: mode === 'register' ? '#ffffff' : '#94a3b8',
                fontWeight: 800, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s ease'
              }}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', color: '#f87171', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              <AlertCircle size={16} /> <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label style={{ color: '#e2e8f0', fontWeight: 700 }}>Official REC Email ID (@rajalakshmi.edu.in)</label>
              <input
                type="email"
                className="form-control"
                style={{ background: 'rgba(30, 41, 59, 0.9)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
                placeholder="name@rajalakshmi.edu.in"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>

            {registryInfo && (
              <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', color: '#34d399', marginBottom: '16px' }}>
                <div style={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} /> Found in Official REC Roster Sheet!
                </div>
                <div style={{ marginTop: '2px', color: '#e2e8f0' }}>Role: <strong>{registryInfo.role.toUpperCase()}</strong> ({registryInfo.designation})</div>
              </div>
            )}

            {mode === 'register' && (
              <>
                <div className="form-group">
                  <label style={{ color: '#e2e8f0', fontWeight: 700 }}>Full Student / Staff Name</label>
                  <input
                    className="form-control"
                    style={{ background: 'rgba(30, 41, 59, 0.9)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
                    placeholder="e.g. Vignesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ color: '#e2e8f0', fontWeight: 700 }}>Gender</label>
                    <select
                      className="form-control"
                      style={{ background: 'rgba(30, 41, 59, 0.9)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label style={{ color: '#e2e8f0', fontWeight: 700 }}>Department</label>
                    <select
                      className="form-control"
                      style={{ background: 'rgba(30, 41, 59, 0.9)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="IT">IT</option>
                      <option value="MECH">MECH</option>
                      <option value="EEE">EEE</option>
                      <option value="AIDS">AI & DS</option>
                      <option value="BIOTECH">Biotech</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label style={{ color: '#e2e8f0', fontWeight: 700 }}>Year of Study</label>
                    <select
                      className="form-control"
                      style={{ background: 'rgba(30, 41, 59, 0.9)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Staff">Faculty / Staff</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ color: '#e2e8f0', fontWeight: 700 }}>Student Type</label>
                    <select
                      className="form-control"
                      style={{ background: 'rgba(30, 41, 59, 0.9)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
                      value={isHosteller ? 'hosteller' : 'dayscholar'}
                      onChange={(e) => setIsHosteller(e.target.value === 'hosteller')}
                    >
                      <option value="dayscholar">Bus / Day Scholar</option>
                      <option value="hosteller">REC Hostel Resident</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label style={{ color: '#e2e8f0', fontWeight: 700 }}>Password</label>
              <input
                type="password"
                className="form-control"
                style={{ background: 'rgba(30, 41, 59, 0.9)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '8px', fontWeight: 800 }} disabled={loading}>
              {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Portal' : 'Register Official Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
