import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, PartyPopper, Search, Megaphone, Utensils, Coffee, Bus, User, Lock, CheckCircle2 } from 'lucide-react';

export default function Sidebar() {
  const { user, activeModule, setActiveModule } = useAuth();

  const isStaffOrAdmin = user?.isStaff || user?.isAdmin;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, restricted: false },
    { id: 'profile', label: 'My Student Profile', icon: User, restricted: false },
    { id: 'timetable', label: '1. Timetable Viewer', icon: Calendar, restricted: false },
    { id: 'events', label: '2. Events Feed & RSVP', icon: PartyPopper, restricted: false },
    { id: 'lostFound', label: '3. Lost & Found Board', icon: Search, restricted: false },
    { id: 'clubs', label: '4. Club Announcements', icon: Megaphone, restricted: !isStaffOrAdmin && !(user?.isClubMember || user?.isClubLead) },
    { id: 'mess', label: '5. Mess Menu & Ratings', icon: Utensils, restricted: !isStaffOrAdmin && !user?.isHosteller },
    { id: 'canteen', label: '6. Canteen & Food Court', icon: Coffee, restricted: false },
    { id: 'transport', label: '7. Bus Transport Hub', icon: Bus, restricted: false }
  ];

  return (
    <aside style={{
      width: '270px',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid var(--border-color)',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      transition: 'background 0.25s ease'
    }}>
      <div style={{ padding: '0 10px 14px', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        Campus Navigation
      </div>

      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeModule === item.id;
        const isRestricted = item.restricted;

        return (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              border: isActive ? '1px solid var(--border-accent)' : '1px solid transparent',
              background: isActive
                ? 'linear-gradient(135deg, rgba(106,27,154,0.22), rgba(142,36,170,0.14))'
                : 'transparent',
              color: isActive ? 'var(--rec-purple)' : isRestricted ? 'var(--text-dim)' : 'var(--text-main)',
              cursor: 'pointer',
              fontWeight: isActive ? 800 : 600,
              fontSize: '14px',
              textAlign: 'left',
              transition: 'var(--transition-fast)',
              boxShadow: isActive ? '0 4px 14px rgba(106, 27, 154, 0.2)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--bg-card-hover)';
                e.currentTarget.style.transform = 'translateX(3px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Icon size={18} color={isActive ? 'var(--rec-purple)' : isRestricted ? 'var(--text-dim)' : 'var(--text-muted)'} />
              <span>{item.label}</span>
            </div>
            {isRestricted && (
              <Lock size={14} color="#ef4444" title="Restricted Access" />
            )}
          </button>
        );
      })}

      {/* User Status Privileges Box */}
      {user && (
        <div style={{
          marginTop: 'auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '14px',
          padding: '14px',
          fontSize: '12px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-0.01em' }}>
            Active Campus Privileges:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="#10b981" /> Timetable: <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Granted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="#10b981" /> Events & RSVP: <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Granted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="#10b981" /> Lost & Found: <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Granted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="#10b981" /> Canteen Hub: <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Granted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color="#10b981" /> Bus Transport: <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>Granted</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color={isStaffOrAdmin || user.isClubMember ? '#10b981' : '#ef4444'} /> Club Notices:
              <span style={{ color: isStaffOrAdmin || user.isClubMember ? '#059669' : '#dc2626', fontWeight: 700 }}>
                {isStaffOrAdmin || user.isClubMember ? 'Allowed' : 'Locked'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={13} color={isStaffOrAdmin || user.isHosteller ? '#10b981' : '#ef4444'} /> Mess Ratings:
              <span style={{ color: isStaffOrAdmin || user.isHosteller ? '#059669' : '#dc2626', fontWeight: 700 }}>
                {isStaffOrAdmin || user.isHosteller ? 'Allowed' : 'Locked'}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
