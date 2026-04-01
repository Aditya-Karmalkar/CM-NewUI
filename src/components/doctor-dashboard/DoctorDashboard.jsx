import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import Curamind_logo from '../../assets/Curamind_logo.jpg';
import UniqueLoading from '../ui/morph-loading';

// --- Doctor Pages ---
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import SchedulePage from './pages/SchedulePage';
import ConsultationsPage from './pages/ConsultationsPage';
import EHRManagerPage from './pages/EHRManagerPage';
import SettingsPage from './pages/SettingsPage';
import CredentialsPage from './pages/CredentialsPage';

// ─── DESIGN TOKENS ────────────────────────────────────────
const BLUE = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BLUE_SOFT = 'rgba(0,104,255,0.14)';
const BG = '#f8fafc';
const BG2 = '#f1f3f6';
const BDR = '#edeef1';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';
const ERR = '#ef4444';

// ─── NAV ITEMS ────────────────────────────────────────────
const navItems = [
  {
    section: 'Practice',
    items: [
      {
        id: 'dashboard', label: 'Overview', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
      },
      {
        id: 'patients', label: 'My Patients', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
      },
      {
        id: 'schedule', label: 'Schedule', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
      },
    ]
  },
  {
    section: 'Clinical Tools',
    items: [
      {
        id: 'consultations', label: 'Consultations', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
      },
      {
        id: 'ehr', label: 'EHR Manager', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
      },
      {
        id: 'analytics', label: 'Analytics', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M21.21 15.89A10 10 0 118 2.83" /><path d="M22 12A10 10 0 0012 2v10z" /></svg>
      },
    ]
  },
  {
    section: 'Professional',
    items: [
      {
        id: 'profile', label: 'Credentials', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a6 6 0 0112 0v2" /></svg>
      },
      {
        id: 'settings', label: 'Preferences', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
      },
    ]
  }
];

const Sidebar = ({ activeView, onNavigate, user, onSignOut, collapsed }) => {
  const initials = (user?.user_metadata?.full_name || user?.email || 'D')
    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  
  return (
    <aside style={{
      width: collapsed ? 0 : 230, minWidth: collapsed ? 0 : 230, background: '#fff', borderRight: `1px solid ${BDR}`,
      display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', overflowY: 'auto', zIndex: 50,
      transition: 'width 0.25s ease, min-width 0.25s ease',
    }} data-lenis-prevent>
      <div style={{ padding: '20px 18px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${BDR}`, flexShrink: 0 }}>
        <img src={Curamind_logo} alt="CuraMind Logo" style={{ width: 32, height: 32, borderRadius: 9, objectFit: 'cover' }} />
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: T1, whiteSpace: 'nowrap' }}>
          Cura<span style={{ color: BLUE }}>Mind</span> <span style={{ fontSize: 10, fontWeight: 500, color: BLUE, background: BLUE_FAINT, padding: '2px 6px', borderRadius: 6, marginLeft: 4 }}>DR</span>
        </div>
      </div>
      <nav style={{ flex: 1, paddingBottom: 8 }}>
        {navItems.map(group => (
          <div key={group.section}>
            <div style={{ padding: '18px 16px 5px', fontSize: 10, fontWeight: 600, letterSpacing: '1.3px', color: T3, textTransform: 'uppercase' }}>{group.section}</div>
            {group.items.map(item => {
              const isActive = activeView === item.id;
              return (
                <button key={item.id} onClick={() => onNavigate(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', margin: '1px 8px', borderRadius: 6, cursor: 'pointer', width: 'calc(100% - 16px)',
                    border: 'none', textAlign: 'left', background: isActive ? BLUE_FAINT : 'transparent', color: isActive ? BLUE : T2, fontSize: 13, transition: 'all .15s',
                  }}>
                  <span style={{ width: 28, height: 28, borderRadius: 7, background: isActive ? BLUE_SOFT : BG2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: isActive ? BLUE : T2 }}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div style={{ padding: '14px 16px', borderTop: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: BLUE_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: BLUE }}>{initials}</div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
          <div style={{ fontSize: 10, color: T3 }}>Healthcare Professional</div>
        </div>
        <button onClick={onSignOut} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: ERR, fontSize: 11, fontWeight: 600, padding: 4 }}>Logout</button>
      </div>
    </aside>
  );
};

export default function DoctorDashboard() {
  const [activeView, setActiveView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/signin');
      else {
        setUser(session.user);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_err, session) => {
      if (!session) navigate('/signin');
      else setUser(session.user);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardPage />;
      case 'patients': return <PatientsPage />;
      case 'schedule': return <SchedulePage />;
      case 'consultations': return <ConsultationsPage />;
      case 'ehr': return <EHRManagerPage />;
      case 'profile': return <CredentialsPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <UniqueLoading size="lg" />
        <p style={{ fontFamily: "'Inter', sans-serif", color: BLUE, fontSize: 14, fontWeight: 600, marginTop: 24, letterSpacing: '0.5px' }} className="animate-pulse">Loading Clinical Portal...</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: BG, fontFamily: "'Inter', sans-serif" }}>
      <Sidebar activeView={activeView} onNavigate={setActiveView} user={user} onSignOut={handleSignOut} />
      <main data-lenis-prevent style={{ 
        marginLeft: 230, height: '100vh', overflowY: 'auto', padding: '24px 32px', boxSizing: 'border-box'
      }}>
        {renderContent()}
      </main>
    </div>
  );
}
