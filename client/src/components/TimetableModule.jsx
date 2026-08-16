import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Calendar, Clock, MapPin, User, CheckCircle2, RefreshCw } from 'lucide-react';

export default function TimetableModule() {
  const [dept, setDept] = useState('CSE');
  const [year, setYear] = useState('2');
  const [section, setSection] = useState('A');
  const [selectedDay, setSelectedDay] = useState('Monday');

  const [timetable, setTimetable] = useState(null);
  const [freeRooms, setFreeRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' or 'freeRooms'

  useEffect(() => {
    fetchTimetable();
  }, [dept, year, section]);

  useEffect(() => {
    fetchFreeRooms();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/timetable?dept=${dept}&year=${year}&section=${section}`);
      if (res.data.success) {
        setTimetable(res.data.data);
      }
    } catch (err) {
      console.warn('Timetable fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFreeRooms = async () => {
    try {
      const res = await API.get('/timetable/free-rooms');
      if (res.data.success) {
        setFreeRooms(res.data.data);
      }
    } catch (err) {
      console.warn('Free rooms fetch error:', err);
    }
  };

  const currentSchedule = timetable?.schedule?.[selectedDay] || [];

  return (
    <div>
      {/* Module Title & Tab Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            <Calendar color="#2563eb" size={28} /> Timetable & Vacant Room Locator
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Class-wise period schedule across J Block, I Block, A Block & vacant lecture halls.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', background: 'var(--bg-card)', padding: '6px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          <button
            className={`btn btn-sm ${activeTab === 'schedule' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('schedule')}
            style={{ borderRadius: '16px' }}
          >
            Class Schedule
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'freeRooms' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('freeRooms')}
            style={{ borderRadius: '16px' }}
          >
            Free Classroom Finder ({freeRooms.length})
          </button>
        </div>
      </div>

      {activeTab === 'schedule' ? (
        <>
          {/* Filters Bar */}
          <div className="card" style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>DEPARTMENT</label>
              <select className="form-control" value={dept} onChange={(e) => setDept(e.target.value)} style={{ width: '150px' }}>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="IT">IT</option>
                <option value="MECH">MECH</option>
                <option value="EEE">EEE</option>
                <option value="AIDS">AI & DS</option>
                <option value="BIOTECH">Biotech</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>YEAR</label>
              <select className="form-control" value={year} onChange={(e) => setYear(e.target.value)} style={{ width: '130px' }}>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>SECTION</label>
              <select className="form-control" value={section} onChange={(e) => setSection(e.target.value)} style={{ width: '130px' }}>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
              </select>
            </div>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`btn btn-sm ${selectedDay === day ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '8px 16px', borderRadius: '20px', fontWeight: 800 }}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Timeline List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)', fontWeight: 700 }}>
              <RefreshCw className="spin" size={24} style={{ marginBottom: '8px' }} />
              <div>Fetching Official Class Schedule...</div>
            </div>
          ) : currentSchedule.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', fontWeight: 700 }}>
              No classes scheduled for {selectedDay} in {dept} Year-{year} Sec-{section}.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {currentSchedule.map((p, index) => (
                <div key={index} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: 'rgba(59,130,246,0.15)',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '17px',
                      border: '1px solid rgba(59,130,246,0.3)'
                    }}>
                      P{p.period}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>{p.subject}</h3>
                      <div style={{ display: 'flex', gap: '18px', marginTop: '6px', fontSize: '13px', color: 'var(--text-main)', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                          <Clock size={14} color="#2563eb" /> <span style={{ color: 'var(--text-main)' }}>{p.time}</span>
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                          <User size={14} color="#059669" /> <span style={{ color: 'var(--text-main)' }}>{p.faculty}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-purple" style={{ fontSize: '14px', padding: '6px 14px', fontWeight: 800 }}>
                      <MapPin size={15} /> {p.room}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* Free Room Locator View */
        <div className="grid-3">
          {freeRooms.map((room, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-main)' }}>{room.roomNo}</h3>
                <span className="badge badge-success">{room.status}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: 600 }}>{room.block} • {room.floor}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', fontSize: '12px' }}>
                <span className="badge badge-primary" style={{ fontWeight: 700 }}>Cap: {room.capacity} Seats</span>
                {room.ac && <span className="badge badge-purple" style={{ fontWeight: 700 }}>AC Room</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
