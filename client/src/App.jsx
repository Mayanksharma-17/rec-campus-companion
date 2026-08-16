import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './components/LoginPage';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Dashboard from './components/Dashboard';
import ProfileModule from './components/ProfileModule';
import TimetableModule from './components/TimetableModule';
import EventsModule from './components/EventsModule';
import LostFoundModule from './components/LostFoundModule';
import ClubsModule from './components/ClubsModule';
import MessModule from './components/MessModule';
import CanteenModule from './components/CanteenModule';
import TransportModule from './components/TransportModule';

function MainApp() {
  const { user, loading, activeModule } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', color: 'white' }}>
        <h2>Authenticating REC Campus Companion...</h2>
      </div>
    );
  }

  // If user is not logged in, present full-screen Landing & Login Page immediately
  if (!user) {
    return <LoginPage />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'profile':
        return <ProfileModule />;
      case 'timetable':
        return <TimetableModule />;
      case 'events':
        return <EventsModule />;
      case 'lostFound':
        return <LostFoundModule />;
      case 'clubs':
        return <ClubsModule />;
      case 'mess':
        return <MessModule />;
      case 'canteen':
        return <CanteenModule />;
      case 'transport':
        return <TransportModule />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="main-layout">
        <Sidebar />
        <main className="content-area">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
