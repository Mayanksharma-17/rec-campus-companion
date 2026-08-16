import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, PartyPopper, Search, Megaphone, Utensils, Coffee, Bus, ShieldCheck, ArrowRight, Lock, MapPin, Award, GraduationCap } from 'lucide-react';

export default function Dashboard() {
  const { user, setActiveModule } = useAuth();
  const isStaffOrAdmin = user?.isStaff || user?.isAdmin;

  return (
    <div>
      {/* Welcome & REC Branding Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #6A1B9A 0%, #4a148c 100%)',
        border: '1px solid rgba(168, 85, 247, 0.45)',
        borderRadius: '24px',
        padding: '36px',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
        boxShadow: '0 14px 35px rgba(106, 27, 154, 0.35)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '700px' }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.35)', padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Award size={13} /> NAAC A++ ACCREDITED • AUTONOMOUS
            </span>
            <span style={{ background: 'rgba(245, 158, 11, 0.3)', color: '#fef08a', border: '1px solid rgba(245, 158, 11, 0.55)', padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <GraduationCap size={13} /> 28+ YEARS OF EXCELLENCE (ESTD. 1997)
            </span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.03em' }}>
            Welcome to REC Campus Companion 👋
          </h1>
          <p style={{ color: '#f1f5f9', fontSize: '15px', marginTop: '12px', lineHeight: '1.65' }}>
            Official student & staff digital utility hub for <strong style={{ color: '#ffffff' }}>Rajalakshmi Engineering College (Thandalam, Chennai)</strong>. Access live timetables, hackathons, lost & found board, club announcements, mess ratings across Pearl, Ruby, Emerald, Sapphire & Diamond hostels, canteen menus (HUT CAFE, REC CAFE, 6th Sense Garden, Blackbuck Cafe), and 130+ bus route schedules.
          </p>

          {/* Institutional Quote */}
          <div style={{ marginTop: '16px', fontSize: '13px', color: '#fef08a', fontStyle: 'italic', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>"Hardwork Beats Talent When Talent Doesn't Work Hard"</span> — Official REC Motto
          </div>
        </div>

        {/* User Account Card */}
        {user && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            padding: '22px 24px',
            borderRadius: '20px',
            minWidth: '270px',
            position: 'relative',
            zIndex: 2,
            boxShadow: '0 12px 30px rgba(0,0,0,0.45)'
          }}>
            <div style={{ fontSize: '11px', color: '#cbd5e1', fontWeight: 800, letterSpacing: '0.05em' }}>AUTHENTICATED MEMBER:</div>
            <div style={{ fontSize: '17px', fontWeight: 900, color: '#ffffff', marginTop: '4px' }}>{user.name}</div>
            <div style={{ fontSize: '13px', color: '#e2e8f0', marginTop: '2px' }}>{user.email}</div>
            <div style={{ fontSize: '12px', color: '#34d399', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
              <MapPin size={13} /> {user.designation || 'REC Campus, Thandalam'}
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
              <span className="badge badge-purple" style={{ background: 'rgba(168, 85, 247, 0.35)', color: '#ffffff' }}>{user.role.toUpperCase()}</span>
              {user.isHosteller ? (
                <span className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.35)', color: '#ffffff' }}>HOSTELLER</span>
              ) : (
                <span className="badge badge-primary" style={{ background: 'rgba(59, 130, 246, 0.35)', color: '#ffffff' }}>DAY SCHOLAR</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Institutional Highlights Bar (rajalakshmi.org Stats) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '20px',
        marginBottom: '36px'
      }}>
        <div className="card" style={{ textAlign: 'center', padding: '20px', borderLeft: '4px solid #6A1B9A' }}>
          <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--rec-purple)' }}>95%+</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 800, marginTop: '2px' }}>Placement Record</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px', borderLeft: '4px solid #d97706' }}>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#d97706' }}>550+</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 800, marginTop: '2px' }}>Expert Faculty</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px', borderLeft: '4px solid #059669' }}>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#059669' }}>130+</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 800, marginTop: '2px' }}>Bus Fleet Routes</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px', borderLeft: '4px solid #2563eb' }}>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#2563eb' }}>18+</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 800, marginTop: '2px' }}>B.E. / B.Tech Programs</div>
        </div>
      </div>

      {/* Core Utility Modules Grid */}
      <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '20px', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
        Campus Utility Modules
      </h2>

      <div className="grid-3" style={{ marginBottom: '36px' }}>
        {/* Module 1 */}
        <div className="card" onClick={() => setActiveModule('timetable')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(59,130,246,0.15)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={24} />
            </div>
          </div>
          <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>1. Timetable Viewer</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.55' }}>
            Class schedule across J Block, I Block, A Block, B block, K block & vacant room locator.
          </p>
          <div style={{ fontSize: '14px', color: '#2563eb', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            Open Timetable <ArrowRight size={15} />
          </div>
        </div>

        {/* Module 2 */}
        <div className="card" onClick={() => setActiveModule('events')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(168,85,247,0.18)', color: 'var(--rec-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PartyPopper size={24} />
            </div>
          </div>
          <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>2. Events Feed & RSVP</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.55' }}>
            Events at Indoor auditorium, REC CAFE Lawn & J Block with instant Digital QR Entry Pass.
          </p>
          <div style={{ fontSize: '14px', color: 'var(--rec-purple)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            Explore Events <ArrowRight size={15} />
          </div>
        </div>

        {/* Module 3 */}
        <div className="card" onClick={() => setActiveModule('lostFound')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16,185,129,0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Search size={24} />
            </div>
          </div>
          <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>3. Lost & Found Board</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.55' }}>
            Report missing items at HUT CAFE, REC CAFE, J Block or hostels with image file upload.
          </p>
          <div style={{ fontSize: '14px', color: '#059669', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            View Board <ArrowRight size={15} />
          </div>
        </div>

        {/* Module 4 */}
        <div className="card" onClick={() => setActiveModule('clubs')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(245,158,11,0.15)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Megaphone size={24} />
            </div>
            {!isStaffOrAdmin && !(user?.isClubMember) && (
              <span className="badge badge-danger"><Lock size={12} /> Member Locked</span>
            )}
          </div>
          <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>4. Club Announcements</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.55' }}>
            Notices & recruitment drives for Coding Club, Rotaract, IEEE REC in Indoor auditorium.
          </p>
          <div style={{ fontSize: '14px', color: '#d97706', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            Open Club Portal <ArrowRight size={15} />
          </div>
        </div>

        {/* Module 5 */}
        <div className="card" onClick={() => setActiveModule('mess')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(239,68,68,0.15)', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Utensils size={24} />
            </div>
            {!isStaffOrAdmin && !user?.isHosteller && (
              <span className="badge badge-danger"><Lock size={12} /> Hostellers Locked</span>
            )}
          </div>
          <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>5. Mess Menu & Ratings</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.55' }}>
            Weekly food menu for Pearl, Ruby, Emerald, Sapphire & Diamond Hostels with live ratings.
          </p>
          <div style={{ fontSize: '14px', color: '#dc2626', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            Check Mess Menu <ArrowRight size={15} />
          </div>
        </div>

        {/* Module 6 */}
        <div className="card" onClick={() => setActiveModule('canteen')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(16,185,129,0.15)', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Coffee size={24} />
            </div>
          </div>
          <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>6. Canteen & Food Court</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.55' }}>
            HUT CAFE, REC CAFE, 6th Sense Garden & Blackbuck Cafe food menus, crowd meter & reviews.
          </p>
          <div style={{ fontSize: '14px', color: '#059669', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            View Canteen Menu <ArrowRight size={15} />
          </div>
        </div>

        {/* Module 7 */}
        <div className="card" onClick={() => setActiveModule('transport')} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(59,130,246,0.15)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bus size={24} />
            </div>
          </div>
          <h3 style={{ fontSize: '19px', fontWeight: 800, marginBottom: '6px', color: 'var(--text-main)' }}>7. Bus Transport Hub</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: '1.55' }}>
            130 REC bus routes, morning & return trip schedules, stops search, and helpline contacts.
          </p>
          <div style={{ fontSize: '14px', color: '#2563eb', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
            View Bus Routes & Schedules <ArrowRight size={15} />
          </div>
        </div>
      </div>
    </div>
  );
}
