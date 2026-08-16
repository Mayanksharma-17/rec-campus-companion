import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Megaphone, Plus, Users, CheckCircle2, Lock, X } from 'lucide-react';

export default function ClubsModule() {
  const { user, syncData } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [tagFilter, setTagFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // Post Announcement Modal
  const [showPostModal, setShowPostModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Notice');
  const [content, setContent] = useState('');
  const [postMsg, setPostMsg] = useState('');

  // Join Club Modal
  const [showJoinModal, setShowJoinModal] = useState(false);

  const canPost = user?.isClubLead || user?.isStaff || user?.isAdmin;

  // Real-Time Multi-User Sync Effect
  useEffect(() => {
    fetchClubs();
    if (syncData && syncData.clubAnnouncements) {
      let filtered = syncData.clubAnnouncements;
      if (tagFilter !== 'All') {
        filtered = filtered.filter(a => a.tags?.includes(tagFilter) || a.category === tagFilter || a.clubTag === tagFilter);
      }
      setAnnouncements(filtered);
      setLoading(false);
    } else {
      fetchAnnouncements();
    }
  }, [tagFilter, syncData]);

  const fetchClubs = async () => {
    try {
      const res = await API.get('/clubs');
      if (res.data.success) {
        setClubs(res.data.data);
      }
    } catch (err) {
      console.warn('Clubs fetch error:', err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      let url = `/clubs/announcements?tag=${tagFilter}`;
      if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
      const res = await API.get(url);
      if (res.data.success) {
        setAnnouncements(res.data.data);
      }
    } catch (err) {
      console.warn('Announcements fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClub = async (clubName) => {
    try {
      const res = await API.post('/clubs/join', { clubName });
      if (res.data.success) {
        alert(res.data.message);
        window.location.reload();
      }
    } catch (err) {
      alert('Join error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/clubs/announcements', {
        title, category, content, clubName: user?.clubsJoined?.[0] || 'Coding Club REC'
      });
      if (res.data.success) {
        setPostMsg('Announcement successfully published!');
        fetchAnnouncements();
        setTimeout(() => {
          setShowPostModal(false);
          setPostMsg('');
          setTitle('');
          setContent('');
        }, 1200);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            <Megaphone color="#d97706" size={28} /> 4. Club Announcements & Search Portal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Official notices, recruitment drives, and event updates for Coding Club, Rotaract, IEEE REC & EDC.
          </p>
        </div>

        {canPost && (
          <button className="btn btn-primary" onClick={() => setShowPostModal(true)}>
            <Plus size={16} /> Post Announcement
          </button>
        )}
      </div>

      {/* Clubs Directory */}
      <div style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '18px', color: 'var(--text-main)' }}>REC Recognized Clubs & Student Chapters</h2>
        <div className="grid-3">
          {clubs.map((club) => {
            const isJoined = user?.clubsJoined?.includes(club.name);
            return (
              <div key={club.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span className="badge badge-purple" style={{ fontWeight: 800 }}>{club.category}</span>
                  <span className="badge badge-primary" style={{ fontWeight: 800 }}><Users size={13} /> {club.membersCount} Members</span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>{club.name}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: '1.5' }}>{club.description}</p>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>Lead: <strong style={{ color: 'var(--text-main)' }}>{club.leadName}</strong></div>

                {isJoined ? (
                  <span className="badge badge-success" style={{ width: '100%', justifyContent: 'center', padding: '10px', fontWeight: 800 }}>
                    <CheckCircle2 size={15} /> Active Club Member
                  </span>
                ) : (
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%', fontWeight: 800, padding: '10px' }} onClick={() => handleJoinClub(club.name)}>
                    Join {club.name}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Announcements Feed */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)' }}>Club Announcements Feed</h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Recruitment', 'Notice', 'Event'].map((tag) => (
              <button
                key={tag}
                onClick={() => setTagFilter(tag)}
                className={`btn btn-sm ${tagFilter === tag ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: '20px', padding: '8px 16px', fontWeight: 800 }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {announcements.map((ann) => (
            <div key={ann.id} className="card" style={{ borderLeft: '4px solid #d97706' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="badge badge-warning" style={{ fontWeight: 800 }}>{ann.clubName}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 600 }}>{ann.date}</span>
              </div>
              <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>{ann.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.65', marginBottom: '14px' }}>{ann.content}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {ann.tags?.map((t, idx) => (
                  <span key={idx} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '8px', background: 'var(--bg-elevated)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontWeight: 700 }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join Modal */}
      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowJoinModal(false)} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={22} />
            </button>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '18px', color: 'var(--text-main)' }}>Select a Club to Join</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {clubs.map((c) => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', padding: '14px', borderRadius: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-main)' }}>{c.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.category}</div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => { handleJoinClub(c.name); setShowJoinModal(false); }}>
                    Join Club
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowPostModal(false)} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={22} />
            </button>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '18px', color: 'var(--text-main)' }}>Post Club Announcement</h2>
            {postMsg && <div style={{ color: '#059669', marginBottom: '14px', fontSize: '14px', fontWeight: 700 }}>{postMsg}</div>}
            <form onSubmit={handlePostSubmit}>
              <div className="form-group">
                <label>Announcement Title</label>
                <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Core Committee Recruitment 2026" required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Recruitment">Recruitment</option>
                  <option value="Notice">Notice</option>
                  <option value="Event">Event</option>
                </select>
              </div>
              <div className="form-group">
                <label>Announcement Content</label>
                <textarea className="form-control" rows="4" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write official announcement text..." required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: 800 }}>Post Announcement</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
