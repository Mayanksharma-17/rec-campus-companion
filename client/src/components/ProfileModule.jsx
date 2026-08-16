import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { User, Camera, ShieldCheck, CheckCircle2, Sparkles, Save } from 'lucide-react';

const HOSTELS = [
  "Pearl Hostel",
  "Ruby Hostel",
  "Emerald Hostel",
  "Sapphire Hostel",
  "Diamond Hostel"
];

export default function ProfileModule() {
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [pfpUrl, setPfpUrl] = useState(user?.pfpUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`);
  const [bio, setBio] = useState(user?.bio || 'REC Campus Student');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [department, setDepartment] = useState(user?.department || 'CSE');
  const [year, setYear] = useState(user?.year || '2nd Year');
  const [isHosteller, setIsHosteller] = useState(user?.isHosteller || false);
  const [designation, setDesignation] = useState(user?.designation || 'Pearl Hostel');

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  // Handle Profile Picture File Upload
  const handlePfpFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Please select an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPfpUrl(reader.result); // Base64 data URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const finalDesignation = isHosteller ? designation : 'Day Scholar Student';
      const res = await API.put('/auth/profile', {
        name, pfpUrl, bio, phone, gender, department, year, isHosteller, designation: finalDesignation
      });
      if (res.data.success) {
        localStorage.setItem('rec_campus_token', res.data.token);
        setMsg('Profile details & PFP successfully updated!');
        setTimeout(() => setMsg(''), 3000);
        window.location.reload();
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          <User color="#2563eb" size={28} /> My Student Profile & Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
          Customize your profile picture (PFP), personal details, and hostel affiliations.
        </p>
      </div>

      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        {/* Left Column: Avatar & Profile Customization Form */}
        <div className="card">
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '22px', color: 'var(--text-main)' }}>Profile Customization</h2>

          {msg && (
            <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', color: '#059669', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
              <CheckCircle2 size={18} /> <span>{msg}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit}>
            {/* PFP Uploader Box */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '14px' }}>
                <img
                  src={pfpUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                  alt="Profile Avatar"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #2563eb',
                    boxShadow: '0 8px 24px rgba(37,99,235,0.35)'
                  }}
                />
                <label
                  htmlFor="pfp-input"
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    border: '2px solid var(--bg-card)'
                  }}
                  title="Upload New Profile Picture (PFP)"
                >
                  <Camera size={20} />
                </label>
                <input
                  id="pfp-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePfpFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>
                Click camera icon to upload custom PFP image (JPG / PNG)
              </span>
            </div>

            {/* Profile Fields */}
            <div className="form-group">
              <label>Full Student / Staff Name</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Bio / Status Tag</label>
              <input
                className="form-control"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. 2nd Year CSE | Web Developer"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label>Department</label>
                <select className="form-control" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="IT">IT</option>
                  <option value="MECH">MECH</option>
                  <option value="EEE">EEE</option>
                  <option value="AIDS">AI & DS</option>
                  <option value="BIOTECH">Biotech</option>
                </select>
              </div>

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
            </div>

            <div style={{ display: isHosteller ? 'grid' : 'block', gridTemplateColumns: isHosteller ? '1fr 1fr' : '1fr', gap: '14px' }}>
              <div className="form-group">
                <label>Student Residence Type</label>
                <select
                  className="form-control"
                  value={isHosteller ? 'hosteller' : 'dayscholar'}
                  onChange={(e) => setIsHosteller(e.target.value === 'hosteller')}
                >
                  <option value="dayscholar">Bus / Day Scholar</option>
                  <option value="hosteller">REC Hostel Resident</option>
                </select>
              </div>

              {isHosteller && (
                <div className="form-group">
                  <label>Select Hostel Name</label>
                  <select className="form-control" value={designation} onChange={(e) => setDesignation(e.target.value)}>
                    {HOSTELS.map((h, i) => <option key={i} value={h}>{h}</option>)}
                  </select>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '14px', fontWeight: 800 }} disabled={loading}>
              <Save size={16} /> {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Right Column: Account Badges & Affiliations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Card 1: Official Student ID Card Badge */}
          <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div>
                <span className="badge badge-primary" style={{ fontWeight: 800 }}><ShieldCheck size={13} /> VERIFIED CAMPUS IDENTITY</span>
                <h3 style={{ fontSize: '22px', fontWeight: 900, marginTop: '6px', color: 'var(--text-main)' }}>{user?.name}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
              <img
                src={pfpUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                alt="Avatar"
                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb' }}
              />
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: '12px', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Role Access Level:</span>
                <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{user?.role?.toUpperCase()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Department:</span>
                <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>{user?.department} ({user?.year})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Location / Hostel:</span>
                <span style={{ fontWeight: 800, color: '#059669' }}>
                  {isHosteller ? (user?.designation || designation) : 'Day Scholar Student'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Joined Clubs & Badges */}
          <div className="card">
            <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
              <Sparkles size={20} color="#d97706" /> Active Club Affiliations ({user?.clubsJoined?.length || 0})
            </h3>

            {user?.clubsJoined && user.clubsJoined.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {user.clubsJoined.map((c, i) => (
                  <span key={i} className="badge badge-purple" style={{ fontSize: '13px', padding: '8px 14px', fontWeight: 800 }}>
                    <CheckCircle2 size={15} /> {c}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                No active club memberships yet. Visit the <strong>Club Announcements</strong> portal to join REC chapters!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
