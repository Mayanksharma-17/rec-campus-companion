import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Calendar, PartyPopper, Search, Megaphone, Utensils, Coffee, Bus, User, CheckCircle2 } from 'lucide-react';

export default function Sidebar() {
  const { user, activeModule, setActiveModule } = useAuth();

  const isStaffOrAdmin = user?.isStaff || user?.isAdmin;
  const isHostellerOrStaff = user?.isHosteller || isStaffOrAdmin;

  const rawNavItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, isUtility: false },
    { id: 'profile', label: 'My Student Profile', icon: User, isUtility: false },
    { id: 'timetable', label: 'Timetable Viewer', icon: Calendar, isUtility: true },
    { id: 'events', label: 'Events Feed & RSVP', icon: PartyPopper, isUtility: true },
    { id: 'lostFound', label: 'Lost & Found Board', icon: Search, isUtility: true },
    { id: 'clubs', label: 'Club Announcements', icon: Megaphone, isUtility: true },
    { id: 'mess', label: 'Mess Menu & Ratings', icon: Utensils, hostellerOnly: true, isUtility: true },
    { id: 'canteen', label: 'Canteen & Food Court', icon: Coffee, isUtility: true },
    { id: 'transport', label: 'Bus Transport Hub', icon: Bus, isUtility: true }
  ];

  // Filter out Mess for Day Scholars & calculate dynamic sequential numbering (1, 2, 3...)
  const visibleItems = rawNavItems.filter(item => {
    if (item.hostellerOnly && !isHostellerOrStaff) return false;
    return true;
  });

  let utilityIndex = 0;
  const navItems = visibleItems.map(item => {
    if (item.isUtility) {
      utilityIndex++;
      return { ...item, displayLabel: `${utilityIndex}. ${item.label}` };
    }
    return { ...item, displayLabel: item.label };
  });

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
              color: isActive ? 'var(--rec-purple)' : 'var(--text-main)',
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
              <Icon size={18} color={isActive ? 'var(--rec-purple)' : 'var(--text-muted)'} />
              <span>{item.displayLabel}</span>
            </div>
          </button>
        );
      })}
    </aside>
  );
}
