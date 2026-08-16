import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { X, ShieldCheck, Mail, Lock, User, Building, Calendar, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function AuthModal({ initialMode = 'login', onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male');
  const [department, setDepartment] = useState('CSE');
  const [year, setYear] = useState('2nd Year');
  const [isHosteller, setIsHosteller] = useState(false);
  const [roomNumber, setRoomNumber] = useState('');

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
        if (res.data.data.roomNumber) setRoomNumber(res.data.data.roomNumber);
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
        if (isHosteller && !roomNumber.trim()) {
          setError('Hosteller Registration Required: Please provide your Hostel Room Number.');
          setLoading(false);
          return;
        }
        await register({ name, email, password, gender, department, year, isHosteller, roomNumber: roomNumber.trim() });
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563eb, #6366f1)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            boxShadow: '0 8px 20px rgba(37,99,235,0.4)'
          }}>
            <ShieldCheck size={28} color="white" />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700 }}>
            {mode === 'login' ? 'Sign In to Campus Companion' : 'Create REC Official Account'}
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>
            Rajalakshmi Engineering College Single Sign-On Portal
          </p>
        </div>

        {/* Toggle Mode */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-dark)',
          padding: '4px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              background: mode === 'login' ? 'var(--primary)' : 'transparent',
              color: mode === 'login' ? 'white' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: '6px',
              background: mode === 'register' ? 'var(--primary)' : 'transparent',
              color: mode === 'register' ? 'white' : 'var(--text-muted)',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '13px',
            color: '#f87171',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-group">
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Official REC Email ID</span>
              <span style={{ fontSize: '11px', color: '#10b981' }}>Must end with @rajalakshmi.edu.in</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                className="form-control"
                placeholder="name@rajalakshmi.edu.in"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
          </div>

          {/* Registry Auto-Match Notification Badge */}
          {registryInfo && (
            <div style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '12px',
              color: '#34d399',
              marginBottom: '16px'
            }}>
              <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={14} /> Found in Official REC Roster Sheet!
              </div>
              <div style={{ marginTop: '4px' }}>
                Assigned Role: <strong>{registryInfo.role.toUpperCase()}</strong> ({registryInfo.designation})
              </div>
            </div>
          )}

          {/* Registration Fields */}
          {mode === 'register' && (
            <>
              <div className="form-group">
                <label>Full Student / Staff Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Vignesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Gender</label>
                  <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select className="form-control" value={department} onChange={(e) => setDepartment(e.target.value)}>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="IT">IT</option>
                    <option value="MECH">MECH</option>
                    <option value="EEE">EEE</option>
                    <option value="AIDS">AI & DS</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>Year of Study</label>
                  <select className="form-control" value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Staff">Faculty / Staff</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Student Type</label>
                  <select
                    className="form-control"
                    value={isHosteller ? 'hosteller' : 'dayscholar'}
                    onChange={(e) => setIsHosteller(e.target.value === 'hosteller')}
                  >
                    <option value="dayscholar">Bus / Day Scholar</option>
                    <option value="hosteller">REC Hostel Resident</option>
                  </select>
                </div>
              </div>

              {isHosteller && (
                <div className="form-group" style={{ marginTop: '4px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Building size={14} color="var(--primary)" /> Hostel Room Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Room 204 or P-304"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    required={isHosteller}
                  />
                </div>
              )}
            </>
          )}

          {/* Password Input */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '8px' }}
          >
            {loading ? <RefreshCw className="spin" size={18} /> : mode === 'login' ? 'Sign In' : 'Complete Registration'}
          </button>
        </form>
      </div>
    </div>
  );
}
