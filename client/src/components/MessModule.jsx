import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Utensils, Star, Lock, Flame } from 'lucide-react';

const HOSTEL_NAMES = [
  "Pearl Hostel",
  "Ruby Hostel",
  "Emerald Hostel",
  "Sapphire Hostel",
  "Diamond Hostel"
];

export default function MessModule() {
  const { user } = useAuth();
  const [selectedHostel, setSelectedHostel] = useState('Pearl Hostel');
  const [activeDay, setActiveDay] = useState('Monday');
  const [messData, setMessData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  // Review Form State
  const [dishName, setDishName] = useState('');
  const [mealType, setMealType] = useState('Lunch');
  const [ratingVal, setRatingVal] = useState(5);
  const [comment, setComment] = useState('');
  const [revMsg, setRevMsg] = useState('');

  const isHostellerOrStaff = user?.isHosteller || user?.isStaff || user?.isAdmin;

  useEffect(() => {
    fetchMessData();
  }, [selectedHostel, activeDay]);

  const fetchMessData = async () => {
    try {
      setLoading(true);
      setAccessDenied(false);
      const res = await API.get(`/mess?day=${activeDay}&hostel=${selectedHostel}`);
      if (res.data.success) {
        setMessData(res.data.data);
        setRatings(res.data.data.ratings || []);
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setAccessDenied(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/mess/review', {
        day: activeDay,
        hostelName: selectedHostel,
        mealType,
        dishName,
        rating: ratingVal,
        comment
      });

      if (res.data.success) {
        setRevMsg('Thank you! Mess meal rating submitted.');
        fetchMessData();
        setTimeout(() => {
          setRevMsg('');
          setDishName('');
          setComment('');
        }, 1500);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const menu = messData?.menu;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            <Utensils color="#dc2626" size={28} /> 5. REC Hosteller Mess Menu & Dish Ratings
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            Weekly meal schedule for Pearl, Ruby, Emerald, Sapphire & Diamond hostels, live mess rush gauge & dish ratings.
          </p>
        </div>

        {/* Hostel Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)' }}>Hostel:</label>
          <select
            className="form-control"
            value={selectedHostel}
            onChange={(e) => setSelectedHostel(e.target.value)}
            style={{ width: '190px', fontWeight: 800 }}
          >
            {HOSTEL_NAMES.map((h, i) => (
              <option key={i} value={h}>{h}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Restricted Access Banner for Day Scholars */}
      {accessDenied && (
        <div className="restricted-box">
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(239,68,68,0.15)', color: '#dc2626', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
            <Lock size={26} />
          </div>
          <h3>Hosteller Mess Restricted Access</h3>
          <p>
            Mess menus, rush gauges, and dish ratings are strictly reserved for verified REC Hostel Residents, Staff, and Admins.
          </p>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            If you are a hosteller, update your profile type to <strong>REC Hostel Resident</strong> in "My Student Profile".
          </div>
        </div>
      )}

      {!accessDenied && (
        <>
          {/* Day Navigation Tabs & Mess Rush Gauge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {days.map((d) => (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  className={`btn ${activeDay === d ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: '20px', padding: '8px 18px', fontWeight: 800 }}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Live Rush Gauge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)', padding: '10px 18px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
              <Flame color="#dc2626" size={20} />
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Live Mess Rush</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#dc2626' }}>{messData?.rushGauge || 'Moderate Rush'}</div>
              </div>
            </div>
          </div>

          {/* Main Layout: Left = Weekly Menu, Right = Ratings & Submission */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
            {/* Left Column: Meal Menu */}
            <div>
              {menu && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div className="card" style={{ borderLeft: '4px solid #2563eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>🍳 Breakfast (07:30 AM - 09:00 AM)</h3>
                      <span className="badge badge-primary" style={{ fontWeight: 800 }}>Morning Meal</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {menu.breakfast?.map((item, idx) => (
                        <li key={idx} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', fontSize: '14px', color: 'var(--text-main)', fontWeight: 600 }}>
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card" style={{ borderLeft: '4px solid #059669' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>🍛 Lunch (12:30 PM - 02:00 PM)</h3>
                      <span className="badge badge-success" style={{ fontWeight: 800 }}>Special Meals</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {menu.lunch?.map((item, idx) => (
                        <li key={idx} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', fontSize: '14px', color: 'var(--text-main)', fontWeight: 600 }}>
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card" style={{ borderLeft: '4px solid #d97706' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>☕ Evening Tea & Snacks (04:30 PM)</h3>
                      <span className="badge badge-warning" style={{ fontWeight: 800 }}>Snack Slot</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {menu.snacks?.map((item, idx) => (
                        <li key={idx} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', fontSize: '14px', color: 'var(--text-main)', fontWeight: 600 }}>
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="card" style={{ borderLeft: '4px solid var(--rec-purple)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)' }}>🌙 Dinner (07:30 PM - 09:00 PM)</h3>
                      <span className="badge badge-purple" style={{ fontWeight: 800 }}>Night Meal</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {menu.dinner?.map((item, idx) => (
                        <li key={idx} style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)', fontSize: '14px', color: 'var(--text-main)', fontWeight: 600 }}>
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Rate Mess Dish & Ratings Feed */}
            <div>
              {/* Submit Review Card */}
              <div className="card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                  <Star color="#d97706" size={22} /> Rate Today's Mess Dish ({selectedHostel})
                </h3>

                {revMsg && <div style={{ color: '#059669', marginBottom: '14px', fontSize: '14px', fontWeight: 700 }}>{revMsg}</div>}

                <form onSubmit={handleReviewSubmit}>
                  <div className="form-group">
                    <label>Meal Session</label>
                    <select className="form-control" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Snacks">Evening Snacks</option>
                      <option value="Dinner">Dinner</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Dish Name</label>
                    <input
                      className="form-control"
                      placeholder="e.g. Paneer Butter Masala, Ghee Pongal"
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Rating (1 to 5 Stars)</label>
                    <select className="form-control" value={ratingVal} onChange={(e) => setRatingVal(Number(e.target.value))}>
                      <option value={5}>★★★★★ (5/5 - Excellent Dish)</option>
                      <option value={4}>★★★★☆ (4/5 - Tasty)</option>
                      <option value={3}>★★★☆☆ (3/5 - Average)</option>
                      <option value={2}>★★☆☆☆ (2/5 - Needs Improvement)</option>
                      <option value={1}>★☆☆☆☆ (1/5 - Poor)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Feedback / Review</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Write your review for mess committee..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: 800 }}>Submit Dish Rating</button>
                </form>
              </div>

              {/* Student Ratings Feed */}
              <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '14px', color: 'var(--text-main)' }}>Recent Hosteller Dish Reviews</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '440px', overflowY: 'auto' }}>
                {ratings.map((rev) => (
                  <div key={rev.id} style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-main)' }}>{rev.dishName} ({rev.mealType})</span>
                      <span style={{ color: '#d97706', fontWeight: 800, fontSize: '14px' }}>★ {rev.rating}/5</span>
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--rec-purple)', fontWeight: 800, marginBottom: '6px' }}>📍 {rev.hostelName || 'Pearl Hostel'}</div>
                    <p style={{ fontSize: '14px', color: 'var(--text-main)', margin: '4px 0 8px', lineHeight: '1.55' }}>"{rev.comment}"</p>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>By {rev.studentName}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
