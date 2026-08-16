import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Bus, Search, Clock, MapPin, Phone, Mail, ExternalLink, ShieldCheck } from 'lucide-react';

export default function TransportModule() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('routes'); // 'routes', 'schedules', 'helpline'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransportData();
  }, [searchQuery]);

  const fetchTransportData = async () => {
    try {
      setLoading(true);
      let url = '/transport';
      if (searchQuery) url += `?search=${encodeURIComponent(searchQuery)}`;
      const res = await API.get(url);
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.warn('Transport data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const routes = data?.routes || [];
  const trips = data?.trips || [];
  const helplines = data?.helplines || [];

  return (
    <div>
      {/* Module Title & Quick Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
            <span className="badge badge-primary" style={{ fontWeight: 800 }}><ShieldCheck size={13} /> OFFICIAL REC TRANSPORT PORTAL</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            <Bus color="#2563eb" size={28} /> 7. REC Bus Transport Hub
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            130 buses across all major Chennai routes. Morning & Return trip schedules, bus bay positions, and coordinator helplines.
          </p>
        </div>

        {/* Quick Link to Official Site */}
        <a
          href="https://www.rectransport.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
          style={{ gap: '8px', textDecoration: 'none', borderRadius: '20px', padding: '10px 18px', fontWeight: 800 }}
        >
          <span>rectransport.com</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Tab Controls & Search Bar */}
      <div className="card" style={{ marginBottom: '28px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Search Input */}
        <div style={{ flex: '1 1 320px', display: 'flex', gap: '8px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              className="form-control"
              style={{ paddingLeft: '40px' }}
              placeholder="Search route no or stop (e.g. Route 27, Poonamallee, Tambaram, Porur, Guindy)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeTab === 'routes' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('routes')}
            style={{ borderRadius: '20px', padding: '8px 18px', fontWeight: 800 }}
          >
            🚌 All Routes ({routes.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'schedules' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('schedules')}
            style={{ borderRadius: '20px', padding: '8px 18px', fontWeight: 800 }}
          >
            ⏰ Trip Schedules ({trips.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'helpline' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('helpline')}
            style={{ borderRadius: '20px', padding: '8px 18px', fontWeight: 800 }}
          >
            📞 Helpline ({helplines.length})
          </button>
        </div>
      </div>

      {/* TAB 1: ALL BUS ROUTES */}
      {activeTab === 'routes' && (
        <div className="grid-3">
          {routes.map((rt) => (
            <div key={rt.id} className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-purple" style={{ fontSize: '14px', fontWeight: 900 }}>{rt.routeNo}</span>
                <span className="badge badge-success" style={{ fontWeight: 800 }}>{rt.liveStatus}</span>
              </div>

              <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '4px', color: 'var(--text-main)' }}>{rt.startPoint}</h3>
              <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: 800, marginBottom: '14px' }}>
                Bus No: {rt.busNo} • {rt.capacity} Seats
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: 'var(--text-main)', marginBottom: '18px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                  <Clock size={15} color="#2563eb" /> <span style={{ color: 'var(--text-main)' }}>Start: <strong>{rt.departureTime}</strong> ➔ REC: <strong>{rt.arrivalTime}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <MapPin size={15} color="#059669" style={{ marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: 'var(--text-main)', fontWeight: 800 }}>Via Boarding Stops:</strong>
                    <div style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '3px', lineHeight: '1.5', fontWeight: 600 }}>
                      {rt.viaStops.join(' • ')}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-elevated)', padding: '12px 14px', borderRadius: '12px', fontSize: '13px', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--border-color)' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Driver: </span>
                  <strong style={{ color: 'var(--text-main)', fontWeight: 800 }}>{rt.driverName}</strong>
                </div>
                <a href={`tel:${rt.driverPhone}`} style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Phone size={13} /> {rt.driverPhone}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: TRIP SCHEDULES */}
      {activeTab === 'schedules' && (
        <div className="grid-2">
          {trips.map((trip, idx) => (
            <div key={idx} className="card" style={{ borderLeft: '4px solid #2563eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-main)' }}>{trip.name}</h3>
                <span className="badge badge-primary" style={{ fontSize: '13px', fontWeight: 800 }}>{trip.time}</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '18px', lineHeight: '1.6' }}>{trip.description}</p>

              <div style={{ display: 'flex', gap: '12px', fontSize: '13px', flexWrap: 'wrap' }}>
                <span className="badge badge-purple" style={{ fontWeight: 800 }}>🚌 {trip.busesCount} Buses Operating</span>
                <span className="badge badge-success" style={{ fontWeight: 800 }}>Scope: {trip.scope}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: HELPLINE & CONTACTS */}
      {activeTab === 'helpline' && (
        <div>
          <div className="card" style={{ marginBottom: '28px', background: 'linear-gradient(135deg, rgba(106,27,154,0.18), rgba(37,99,235,0.12))', border: '1px solid var(--border-accent)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>Official REC Transport Helpdesk</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', marginBottom: '18px', lineHeight: '1.6' }}>
              Have questions regarding bus passes, route alterations, or lost items on buses? Contact the REC Transport Coordinators.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <a href="mailto:rectransport@rajalakshmi.edu.in" className="btn btn-primary" style={{ textDecoration: 'none', fontWeight: 800 }}>
                <Mail size={16} /> Email: rectransport@rajalakshmi.edu.in
              </a>
              <a href="tel:04467181069" className="btn btn-secondary" style={{ textDecoration: 'none', fontWeight: 800 }}>
                <Phone size={16} /> Office: 044 6718 1069 / 1040
              </a>
            </div>
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '18px', color: 'var(--text-main)' }}>Transport Coordinators Roster</h3>
          <div className="grid-3">
            {helplines.map((contact, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{contact.name}</h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px', fontWeight: 600 }}>{contact.role}</div>
                </div>
                <a href={`tel:${contact.phone}`} className="btn btn-outline btn-sm" style={{ textDecoration: 'none', fontWeight: 800 }}>
                  <Phone size={14} /> Call {contact.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
