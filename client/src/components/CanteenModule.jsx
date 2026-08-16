import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { Coffee, Star, MessageSquare, Flame, Send, UtensilsCrossed } from 'lucide-react';

const CANTEENS = ["HUT CAFE", "REC CAFE", "6th Sense Garden", "Blackbuck Cafe"];

export default function CanteenModule() {
  const { user } = useAuth();
  const [selectedOutlet, setSelectedOutlet] = useState('HUT CAFE');
  const [canteenData, setCanteenData] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form
  const [canteenName, setCanteenName] = useState('HUT CAFE');
  const [dishName, setDishName] = useState('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [submitMsg, setSubmitMsg] = useState('');

  useEffect(() => {
    fetchCanteenData();
  }, [selectedOutlet]);

  const fetchCanteenData = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/canteen?outlet=${encodeURIComponent(selectedOutlet)}`);
      if (res.data.success) {
        setCanteenData(res.data);
        setRatings(res.data.ratings || []);
      }
    } catch (err) {
      console.warn('Canteen data error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/canteen/review', {
        canteenName,
        dishName,
        rating: Number(rating),
        comment
      });
      if (res.data.success) {
        setSubmitMsg('Canteen review submitted successfully!');
        fetchCanteenData();
        setTimeout(() => {
          setSubmitMsg('');
          setDishName('');
          setComment('');
        }, 1200);
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const categories = canteenData?.menuCategories || [];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            <Coffee color="#059669" size={28} /> College Canteen & Food Court Hub
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
            HUT CAFE, REC CAFE, 6th Sense Garden & Blackbuck Cafe menus, mocktails, barista brews, live crowd status, and dish ratings.
          </p>
        </div>

        {/* Live Canteen Crowd Gauge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-card)', padding: '10px 18px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
          <Flame color="#059669" size={20} />
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>Live Canteen Crowd</div>
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#059669' }}>{canteenData?.rushGauge || 'Low Rush'}</div>
          </div>
        </div>
      </div>

      {/* Outlet Filter Tabs */}
      <div className="card" style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-main)' }}>Select Food Court Outlet:</span>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {CANTEENS.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedOutlet(c)}
              className={`btn ${selectedOutlet === c ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '9px 18px', fontWeight: 800, borderRadius: '20px' }}
            >
              {c === 'HUT CAFE' ? '🍔 HUT CAFE' : c === 'REC CAFE' ? '☕ REC CAFE' : c === '6th Sense Garden' ? '🌿 6th Sense Garden' : '☕ Blackbuck Cafe'}
            </button>
          ))}
        </div>
      </div>

      {/* Canteen Categories Grid */}
      <div style={{ marginBottom: '18px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UtensilsCrossed size={22} color="var(--primary)" /> {selectedOutlet} Menu & Pricing
        </h2>
      </div>

      <div className="grid-3" style={{ marginBottom: '36px' }}>
        {categories.map((cat, idx) => (
          <div key={idx} className="card">
            <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '16px', color: '#2563eb' }}>{cat.category}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cat.items?.map((item, itemIdx) => (
                <div key={itemIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--bg-elevated)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-main)' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px', fontWeight: 600 }}>
                      <span style={{ color: '#d97706', fontWeight: 800 }}>★ {item.rating}</span> • Available at {item.availableAt || selectedOutlet}
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: '14px', color: '#059669', background: 'rgba(16,185,129,0.15)', padding: '4px 10px', borderRadius: '8px' }}>
                    {item.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Canteen Food Feedback & Student Reviews */}
      <div className="grid-2">
        {/* Submit Review Card */}
        <div className="card">
          <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <Star color="#d97706" fill="#d97706" size={22} /> Rate Canteen & Cafe Dishes
          </h3>

          {submitMsg && <div style={{ color: '#059669', marginBottom: '14px', fontSize: '14px', fontWeight: 700 }}>{submitMsg}</div>}

          <form onSubmit={handleRatingSubmit}>
            <div className="form-group">
              <label>Select Food Court Outlet</label>
              <select className="form-control" value={canteenName} onChange={(e) => setCanteenName(e.target.value)}>
                {CANTEENS.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Dish / Drink Name</label>
              <input className="form-control" value={dishName} onChange={(e) => setDishName(e.target.value)} placeholder="e.g. Dragon Fruit Smoothie or Caramel Cappuccino" required />
            </div>

            <div className="form-group">
              <label>Star Rating</label>
              <select className="form-control" value={rating} onChange={(e) => setRating(e.target.value)}>
                <option value="5">⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                <option value="4">⭐⭐⭐⭐ (4/5 Good)</option>
                <option value="3">⭐⭐⭐ (3/5 Average)</option>
                <option value="2">⭐⭐ (2/5 Poor)</option>
                <option value="1">⭐ (1/5 Terribly Bad)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Feedback & Review Comment</label>
              <textarea className="form-control" rows="3" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share food feedback for cafe..." required />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: 800 }}>
              <Send size={16} /> Submit Canteen Feedback
            </button>
          </form>
        </div>

        {/* Student Reviews Feed */}
        <div className="card">
          <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <MessageSquare color="#2563eb" size={22} /> Campus Food Court Reviews ({ratings.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '440px', overflowY: 'auto' }}>
            {ratings.map((rev) => (
              <div key={rev.id} style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text-main)' }}>{rev.dishName}</span>
                  <span style={{ color: '#d97706', fontWeight: 800, fontSize: '14px' }}>★ {rev.rating}/5</span>
                </div>
                <div style={{ fontSize: '12px', color: '#059669', fontWeight: 800, marginBottom: '6px' }}>📍 {rev.canteenName || '6th Sense Garden'}</div>
                <p style={{ fontSize: '14px', color: 'var(--text-main)', margin: '4px 0 8px', lineHeight: '1.55' }}>"{rev.comment}"</p>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>By {rev.studentName}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
