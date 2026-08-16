import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { QRCodeSVG } from 'qrcode.react';
import { PartyPopper, Calendar, MapPin, Users, Plus, CheckCircle2, QrCode, X, ShieldAlert } from 'lucide-react';

export default function EventsModule() {
  const { user, syncData } = useAuth();
  const [events, setEvents] = useState([]);
  const [userRsvps, setUserRsvps] = useState([]);
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedTicketEvent, setSelectedTicketEvent] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Event Form State
  const [title, setTitle] = useState('');
  const [eventCat, setEventCat] = useState('Tech');
  const [organizer, setOrganizer] = useState('');
  const [date, setDate] = useState('2026-09-10');
  const [time, setTime] = useState('10:00 AM');
  const [venue, setVenue] = useState('Indoor auditorium');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [createMsg, setCreateMsg] = useState('');

  const canPublish = user?.isClubLead || user?.isStaff || user?.isAdmin;

  // Real-Time Sync: Refresh list automatically on multi-user updates
  useEffect(() => {
    if (syncData && syncData.events) {
      let filtered = syncData.events;
      if (category !== 'All') {
        filtered = filtered.filter(e => e.category.toLowerCase() === category.toLowerCase());
      }
      setEvents(filtered);
      setUserRsvps(syncData.events.filter(e => e.rsvps.includes(user?.email)).map(e => e.id));
      setLoading(false);
    } else {
      fetchEvents();
    }
  }, [category, syncData, user?.email]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/events?category=${category}`);
      if (res.data.success) {
        setEvents(res.data.data);
        setUserRsvps(res.data.userRsvps || []);
      }
    } catch (err) {
      console.warn('Events fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRsvpToggle = async (eventId) => {
    if (!user) {
      alert('Please sign in to RSVP for events.');
      return;
    }
    try {
      const res = await API.post(`/events/${eventId}/rsvp`);
      if (res.data.success) {
        fetchEvents();
      }
    } catch (err) {
      alert('RSVP error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/events', {
        title, category: eventCat, organizer, date, time, venue, description, bannerUrl
      });
      if (res.data.success) {
        setCreateMsg('Event published to campus feed!');
        fetchEvents();
        setTimeout(() => {
          setShowCreateModal(false);
          setCreateMsg('');
          setTitle('');
          setDescription('');
        }, 1200);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div>
      {/* Header & Publish Trigger */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            <PartyPopper color="var(--rec-purple)" size={28} /> 2. Campus Events Feed & Digital RSVP
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Discover upcoming tech hackathons, culturals, and workshops at Indoor auditorium, J Block & REC CAFE.
          </p>
        </div>

        {canPublish ? (
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} /> Publish New Event
          </button>
        ) : (
          <span className="badge badge-warning" style={{ fontSize: '12px', padding: '6px 12px' }}>
            <ShieldAlert size={14} /> Event Creation: Restricted to Club Leads / Staff / Admin
          </span>
        )}
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['All', 'Tech', 'Cultural', 'Sports', 'Workshop'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '20px', padding: '8px 18px', fontWeight: 800 }}
          >
            {cat} Events
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid-3">
        {events.map((evt) => {
          const isRsvpd = userRsvps.includes(evt.id) || (evt.rsvps && evt.rsvps.includes(user?.email));

          return (
            <div key={evt.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: '170px', margin: '-24px -24px 18px -24px', overflow: 'hidden' }}>
                <img src={evt.bannerUrl} alt={evt.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span className="badge badge-purple" style={{ position: 'absolute', top: '14px', right: '14px', fontWeight: 800 }}>
                  {evt.category}
                </span>
              </div>

              <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>{evt.title}</h3>
              <p style={{ fontSize: '13px', color: '#2563eb', fontWeight: 700, marginBottom: '14px' }}>By {evt.organizer}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-main)', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <Calendar size={15} color="#2563eb" /> <span style={{ color: 'var(--text-main)' }}>{evt.date} • {evt.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <MapPin size={15} color="#059669" /> <span style={{ color: 'var(--text-main)' }}>{evt.venue}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <Users size={15} color="var(--rec-purple)" /> <span style={{ color: 'var(--text-main)' }}>{evt.rsvps ? evt.rsvps.length : 0} Students Attending</span>
                </div>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '22px', flex: 1, lineHeight: '1.6' }}>{evt.description}</p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                <button
                  onClick={() => handleRsvpToggle(evt.id)}
                  className={`btn ${isRsvpd ? 'btn-secondary' : 'btn-primary'}`}
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  {isRsvpd ? <><CheckCircle2 size={16} color="#059669" /> RSVPed</> : 'RSVP Now'}
                </button>

                {isRsvpd && (
                  <button
                    className="btn btn-outline"
                    onClick={() => setSelectedTicketEvent(evt)}
                    title="View Digital QR Entry Pass"
                  >
                    <QrCode size={16} /> Ticket Pass
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* QR Ticket Pass Modal */}
      {selectedTicketEvent && (
        <div className="modal-overlay" onClick={() => setSelectedTicketEvent(null)}>
          <div className="modal-box" style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedTicketEvent(null)} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={22} />
            </button>

            <span className="badge badge-success" style={{ marginBottom: '14px', fontWeight: 800, padding: '6px 14px' }}>OFFICIAL EVENT ENTRY PASS</span>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-main)' }}>{selectedTicketEvent.title}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '22px', marginTop: '4px' }}>
              Present this QR Pass at the venue entrance for gate check-in.
            </p>

            <div style={{ background: 'white', padding: '22px', borderRadius: '20px', display: 'inline-block', marginBottom: '22px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
              <QRCodeSVG value={JSON.stringify({ eventId: selectedTicketEvent.id, email: user?.email, name: user?.name, timestamp: Date.now() })} size={190} />
            </div>

            <div style={{ textAlign: 'left', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', padding: '18px', borderRadius: '14px', fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.6' }}>
              <div><strong>Ticket Holder:</strong> {user?.name}</div>
              <div><strong>Official Email:</strong> {user?.email}</div>
              <div><strong>Date & Time:</strong> {selectedTicketEvent.date} @ {selectedTicketEvent.time}</div>
              <div><strong>Venue:</strong> {selectedTicketEvent.venue}</div>
            </div>
          </div>
        </div>
      )}

      {/* Publish New Event Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowCreateModal(false)} style={{ position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={22} />
            </button>
            <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '18px', color: 'var(--text-main)' }}>Publish New Campus Event</h2>

            {createMsg && <div style={{ color: '#059669', marginBottom: '14px', fontSize: '14px', fontWeight: 700 }}>{createMsg}</div>}

            <form onSubmit={handleCreateEvent}>
              <div className="form-group">
                <label>Event Title</label>
                <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. REC CodeFest 2026" required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-control" value={eventCat} onChange={(e) => setEventCat(e.target.value)}>
                    <option value="Tech">Tech</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Organizer Club / Dept</label>
                  <input className="form-control" value={organizer} onChange={(e) => setOrganizer(e.target.value)} placeholder="e.g. Coding Club REC" required />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input className="form-control" value={time} onChange={(e) => setTime(e.target.value)} placeholder="10:00 AM - 04:00 PM" required />
                </div>
              </div>
              <div className="form-group">
                <label>Venue (College Location)</label>
                <select className="form-control" value={venue} onChange={(e) => setVenue(e.target.value)}>
                  <option value="Indoor auditorium">Indoor auditorium</option>
                  <option value="REC CAFE Lawn">REC CAFE Lawn</option>
                  <option value="HUT CAFE Pavilion">HUT CAFE Pavilion</option>
                  <option value="J Block Seminar Hall">J Block Seminar Hall</option>
                  <option value="I Block Conference Room">I Block Conference Room</option>
                  <option value="A Block Main Audi">A Block Main Audi</option>
                  <option value="B block Amphitheatre">B block Amphitheatre</option>
                  <option value="K block Tech Hall">K block Tech Hall</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Event details, registration guidelines..." required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: 800 }}>Publish Event to Feed</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
