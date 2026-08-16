import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Search, Plus, MapPin, Calendar, Phone, CheckCircle2, X } from 'lucide-react';

const COLLEGE_LOCATIONS = [
  "HUT CAFE",
  "REC CAFE",
  "6th Sense Garden",
  "Blackbuck Cafe",
  "J Block",
  "I Block",
  "A Block",
  "B block",
  "K block",
  "Indoor auditorium",
  "Pearl Hostel",
  "Ruby Hostel",
  "Emerald Hostel",
  "Sapphire Hostel",
  "Diamond Hostel"
];

export default function LostFoundModule() {
  const { user, syncData } = useAuth();
  const [items, setItems] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Report Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [status, setStatus] = useState('lost');
  const [location, setLocation] = useState('HUT CAFE');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [reportMsg, setReportMsg] = useState('');

  // Real-Time Multi-User Sync Effect
  useEffect(() => {
    if (syncData && syncData.lostFoundItems) {
      let filtered = syncData.lostFoundItems;
      if (statusFilter !== 'all') {
        filtered = filtered.filter(item => item.status === statusFilter);
      }
      if (categoryFilter !== 'All') {
        filtered = filtered.filter(item => item.category === categoryFilter);
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter(item => item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
      }
      setItems(filtered);
      setLoading(false);
    } else {
      fetchItems();
    }
  }, [statusFilter, categoryFilter, searchQuery, syncData]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      let url = `/lost-found?status=${statusFilter}&category=${categoryFilter}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      const res = await API.get(url);
      if (res.data.success) {
        setItems(res.data.data);
      }
    } catch (err) {
      console.warn('Lost & Found fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Real Image File Upload Handler
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size too large. Please select an image under 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result); // Base64 data URL
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems();
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to report items.');
      return;
    }
    try {
      const res = await API.post('/lost-found', {
        title, category, status, location, description, imageUrl, contactPhone
      });
      if (res.data.success) {
        setReportMsg('Item successfully posted to Lost & Found board!');
        fetchItems();
        setTimeout(() => {
          setShowReportModal(false);
          setReportMsg('');
          setTitle('');
          setLocation('HUT CAFE');
          setDescription('');
          setImageUrl('');
        }, 1200);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleClaimToggle = async (itemId) => {
    try {
      const res = await API.patch(`/lost-found/${itemId}/claim`);
      if (res.data.success) {
        fetchItems();
      }
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            <Search color="#059669" size={28} /> Lost & Found Campus Board
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Report missing college IDs, keys, electronics at HUT CAFE, REC CAFE, J Block, I Block, or hostels.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowReportModal(true)}>
          <Plus size={16} /> Report Lost / Found Item
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '260px', display: 'flex', gap: '8px' }}>
          <input
            className="form-control"
            placeholder="Search items by name or location (e.g. HUT CAFE, J Block, Pearl Hostel)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary" style={{ fontWeight: 800 }}>Search</button>
        </form>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'lost', 'found', 'claimed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ textTransform: 'capitalize', borderRadius: '20px', padding: '8px 16px', fontWeight: 800 }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid-3">
        {items.map((item) => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ position: 'relative', height: '190px', margin: '-24px -24px 18px -24px', overflow: 'hidden', borderRadius: '16px 16px 0 0' }}>
              <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

              {/* Status Badge */}
              <span
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  background: item.status === 'lost' ? '#dc2626' : item.status === 'found' ? '#d97706' : '#059669',
                  color: '#ffffff',
                  fontWeight: 900,
                  fontSize: '11px',
                  padding: '5px 14px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                  letterSpacing: '0.05em'
                }}
              >
                {item.status}
              </span>

              {/* Category Overlay Tag */}
              <span
                style={{
                  position: 'absolute',
                  bottom: '14px',
                  left: '14px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  backdropFilter: 'blur(10px)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  fontWeight: 800,
                  fontSize: '12px',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}
              >
                {item.category}
              </span>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>{item.title}</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '16px', flex: 1, lineHeight: '1.55' }}>{item.description}</p>

            <div style={{ fontSize: '13px', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <MapPin size={15} color="#059669" /> <span style={{ color: 'var(--text-main)' }}>{item.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <Phone size={15} color="#2563eb" /> <span style={{ color: 'var(--text-main)' }}>Contact: {item.contactName} ({item.contactPhone})</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <Calendar size={15} color="var(--text-muted)" /> <span style={{ color: 'var(--text-muted)' }}>Reported: {item.dateReported}</span>
              </div>
            </div>

            {/* Claim / Resolve Toggle Button */}
            <button
              className="btn btn-sm"
              onClick={() => handleClaimToggle(item.id)}
              style={{
                width: '100%',
                justifyContent: 'center',
                fontWeight: 800,
                padding: '10px',
                background: item.status === 'claimed' ? 'rgba(16, 185, 129, 0.15)' : 'linear-gradient(135deg, var(--rec-purple), #8e24aa)',
                color: item.status === 'claimed' ? '#059669' : '#ffffff',
                border: item.status === 'claimed' ? '1px solid #10b981' : 'none',
                boxShadow: item.status === 'claimed' ? 'none' : '0 4px 14px rgba(106, 27, 154, 0.35)'
              }}
            >
              {item.status === 'claimed' ? (
                <><CheckCircle2 size={16} color="#059669" /> Item Claimed / Resolved</>
              ) : (
                'Mark as Claimed / Resolved'
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Report Modal with File Upload */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowReportModal(false)} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={22} />
            </button>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '18px', color: 'var(--text-main)' }}>Report Item on Lost & Found Board</h2>

            {reportMsg && <div style={{ color: '#059669', marginBottom: '14px', fontSize: '14px', fontWeight: 700 }}>{reportMsg}</div>}

            <form onSubmit={handleReportSubmit}>
              <div className="form-group">
                <label>Item Title</label>
                <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Blue Boat Earbuds in Case" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label>Status Type</label>
                  <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="lost">Lost Item (I lost this)</option>
                    <option value="found">Found Item (I found this)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="Electronics">Electronics</option>
                    <option value="ID Card">College ID Card</option>
                    <option value="Keys">Keys / Keychain</option>
                    <option value="Documents">Documents / Books</option>
                    <option value="Personal">Personal Belongings</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Campus Location</label>
                <select className="form-control" value={location} onChange={(e) => setLocation(e.target.value)}>
                  {COLLEGE_LOCATIONS.map((loc, idx) => (
                    <option key={idx} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Contact Phone Number</label>
                <input className="form-control" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+91 98401 23456" required />
              </div>

              {/* REAL IMAGE FILE UPLOAD FIELD */}
              <div className="form-group">
                <label>Upload Item Image File</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="form-control"
                  style={{ padding: '8px' }}
                />
                {imageUrl && (
                  <div style={{ marginTop: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#059669', marginBottom: '6px', fontWeight: 700 }}>Image Preview:</div>
                    <img src={imageUrl} alt="Upload Preview" style={{ width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '12px', border: '1px solid var(--border-color)' }} />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the item, colors, unique marks..." required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: 800 }}>Post Item to Campus Board</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
