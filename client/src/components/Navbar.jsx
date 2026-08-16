import React, { useState } from 'react';
import { useAuth, DEMO_ACCOUNTS } from '../context/AuthContext';
import { ShieldCheck, LogOut, Sparkles, ChevronDown, CheckCircle2, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logout, quickDemoLogin, setActiveModule, theme, toggleTheme } = useAuth();
  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);

  const handleDemoSwitch = async (email) => {
    try {
      setLoadingDemo(true);
      await quickDemoLogin(email);
      setShowDemoMenu(false);
    } catch (err) {
      alert('Demo switch failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingDemo(false);
    }
  };

  return (
    <nav style={{
      background: 'var(--nav-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    }}>
      {/* Left Container: Brand & Left-Aligned Theme Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }} onClick={() => setActiveModule('dashboard')}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #6A1B9A, #5A1582)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            color: 'white',
            fontSize: '15px',
            boxShadow: '0 4px 16px rgba(106,27,154,0.4)',
            letterSpacing: '0.5px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <span>REC</span>
            <span style={{ fontSize: '7px', opacity: 0.8, marginTop: '-2px' }}>ESTD 1997</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1.2, margin: 0, color: 'var(--text-main)' }}>
                RAJALAKSHMI ENGINEERING COLLEGE
              </h2>
              <span className="badge badge-gold" style={{ fontSize: '10px', padding: '1px 8px' }}>
                AUTONOMOUS
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--rec-purple)', fontWeight: 700 }}>NAAC A++ Grade</span>
              <span>•</span>
              <span>NBA Accredited</span>
              <span>•</span>
              <span style={{ color: '#059669', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                <ShieldCheck size={12} /> rajalakshmi.org
              </span>
            </div>
          </div>
        </div>

        {/* Left-Aligned Theme Mode Switcher (Dark / Light) */}
        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-sm"
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            fontWeight: 700,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            cursor: 'pointer'
          }}
          title="Toggle Light / Dark Mode"
        >
          {theme === 'dark' ? (
            <><Moon size={14} color="#a855f7" /> <span>Dark</span></>
          ) : (
            <><Sun size={14} color="#f59e0b" /> <span>Light</span></>
          )}
        </button>
      </div>

      {/* Right Container: Quick Role Switcher, User Avatar & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Quick Role Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            disabled={loadingDemo}
            style={{
              background: 'linear-gradient(135deg, rgba(106,27,154,0.15), rgba(142,36,170,0.12))',
              border: '1px solid rgba(168,85,247,0.35)',
              color: 'var(--rec-purple)',
              fontWeight: 700
            }}
          >
            <Sparkles size={14} color="var(--rec-purple)" />
            <span>{loadingDemo ? 'Switching...' : 'Demo Role Switcher'}</span>
            <ChevronDown size={14} />
          </button>

          {showDemoMenu && (
            <div style={{
              position: 'absolute',
              top: '115%',
              right: 0,
              width: '330px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '10px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              zIndex: 200
            }}>
              <div style={{ padding: '6px 10px 10px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', letterSpacing: '0.5px' }}>
                CLICK ROLE TO TEST MULTI-USER ACTIONS:
              </div>
              <div style={{ marginTop: '8px' }}>
                {DEMO_ACCOUNTS.map((acc, i) => (
                  <button
                    key={i}
                    onClick={() => handleDemoSwitch(acc.email)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      background: user?.email === acc.email ? 'rgba(106,27,154,0.15)' : 'transparent',
                      border: user?.email === acc.email ? '1px solid var(--rec-purple)' : '1px solid var(--border-color)',
                      borderRadius: '10px',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{acc.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{acc.description}</div>
                    </div>
                    {user?.email === acc.email && <CheckCircle2 size={16} color="#a855f7" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Logout */}
        {user && (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => setActiveModule('profile')}
            title="Click to view & edit profile"
          >
            <img
              src={user.pfpUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
              alt={user.name}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #a855f7',
                boxShadow: '0 2px 10px rgba(168,85,247,0.35)'
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{user.name}</div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                <span className="badge badge-purple" style={{ fontSize: '10px', padding: '1px 7px' }}>{user.role.toUpperCase()}</span>
              </div>
            </div>
          </div>
        )}

        <button className="btn btn-secondary btn-sm" onClick={logout} title="Log Out">
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
