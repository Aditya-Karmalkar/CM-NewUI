import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useNavigate } from 'react-router-dom';

import UniqueLoading from '../ui/morph-loading';

// --- Admin Pages ---
import OverviewPage from './pages/OverviewPage';
import ManageDoctorsPage from './pages/ManageDoctorsPage';
import PatientsManagerPage from './pages/PatientsManagerPage';
import SystemLogsPage from './pages/SystemLogsPage';
import FinancialsPage from './pages/FinancialsPage';
import CredentialsPage from './pages/CredentialsPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import SecurityProtocolsPage from './pages/SecurityProtocolsPage';


// ─── DESIGN TOKENS ────────────────────────────────────────
const BLUE = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BLUE_SOFT = 'rgba(0,104,255,0.14)';
const BG = '#f8fafc';
const BDR = '#edeef1';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';
const ERR = '#ef4444';

// ─── NAV ITEMS ────────────────────────────────────────────
const navItems = [
  {
    section: 'Enterprise',
    items: [
      { id: 'overview', label: 'Platform Stats', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg> },
      { id: 'doctors', label: 'Verify Doctors', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg> },
      { id: 'patients', label: 'Patient Accounts', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="7" r="4"/><path d="M5.5 21s0-4 6.5-4 6.5 4 6.5 4"/></svg> },
    ]
  },
  {
    section: 'Technical',
    items: [
      { id: 'system', label: 'System Health', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2v4m0 14v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m14 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" /></svg> },
      { id: 'logs', label: 'Security Logs', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg> },
      { id: 'security', label: 'Security Protocols', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },

    ]
  },
  {
    section: 'Business',
    items: [
      { id: 'financials', label: 'Financials', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M7 15h0M11 15h0"/></svg> },
      { id: 'profile', label: 'Credentials', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a6 6 0 0112 0v2" /></svg> },
      { id: 'settings', label: 'Admin Settings', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg> },
    ]
  }
];

const Sidebar = ({ activeView, onNavigate, user, onSignOut }) => {
  return (
    <aside style={{
      width: 230, minWidth: 230, background: '#fff', borderRight: `1px solid ${BDR}`,
      display: 'flex', flexDirection: 'column', height: '100vh', zIndex: 50
    }}>
      <div style={{ padding: '20px 18px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${BDR}` }}>
        <img src="/Curamind_logo.png" alt="CuraMind Logo" style={{ width: 32, height: 32, borderRadius: 9, objectFit: 'cover' }} />
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: T1 }}>
          Cura<span style={{ color: BLUE }}>Mind</span> <span style={{ fontSize: 10, fontWeight: 500, color: BLUE, background: BLUE_FAINT, padding: '2px 6px', borderRadius: 6, marginLeft: 4 }}>ADMIN</span>
        </div>
      </div>
      <nav 
        data-lenis-prevent
        style={{ flex: 1, paddingBottom: 8, overflowY: 'auto' }}
      >
        {navItems.map(group => (
          <div key={group.section}>
            <div style={{ padding: '18px 16px 5px', fontSize: 10, fontWeight: 600, color: T3, textTransform: 'uppercase' }}>{group.section}</div>
            {group.items.map(item => {
              const isActive = activeView === item.id;
              return (
                <button key={item.id} onClick={() => onNavigate(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', margin: '1px 8px', borderRadius: 6, cursor: 'pointer', width: 'calc(100% - 16px)',
                    border: 'none', textAlign: 'left', background: isActive ? BLUE_FAINT : 'transparent', color: isActive ? BLUE : T2, fontSize: 13, transition: 'all .15s',
                  }}>
                  <span style={{ color: isActive ? BLUE : T2 }}>{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div style={{ padding: '14px 16px', borderTop: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: BLUE_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: BLUE }}>AD</div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T1 }}>{user?.email}</div>
          <div style={{ fontSize: 10, color: T3 }}>System Administrator</div>
        </div>
        <button onClick={onSignOut} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: ERR, fontSize: 11 }}>Logout</button>
      </div>
    </aside>
  );
};

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async (u) => {
      const { data, error } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', u.id)
        .single();
      
        // Check environment variable for bypass
        const adminEmails = (process.env.REACT_APP_ADMIN_EMAILS || 'admin@curamind.com,system.admin@curamind.com,root@curamind.com').split(',').map(e => e.trim());
        if (adminEmails.includes(u.email)) return true; 
        navigate('/signin');
      return true;
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/signin');
      else {
        checkAdmin(session.user).then(isAdmin => {
          if (isAdmin) {
            setUser(session.user);
            setLoading(false);
          }
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_err, session) => {
      if (!session) navigate('/signin');
      else {
        checkAdmin(session.user).then(isAdmin => {
          if (isAdmin) setUser(session.user);
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

  const renderContent = () => {
    switch (activeView) {
      case 'overview': return <OverviewPage onNavigate={setActiveView} />;
      case 'doctors': return <ManageDoctorsPage />;
      case 'patients': return <PatientsManagerPage />;
      case 'logs': return <SystemLogsPage onNavigate={setActiveView} />;
      case 'security': return <SecurityProtocolsPage />;
      case 'financials': return <FinancialsPage />;

      case 'profile': return <CredentialsPage />;
      case 'settings': return <AdminSettingsPage />;
      default: return <OverviewPage />;
    }
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}><UniqueLoading size="lg" /></div>;

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw', 
      overflow: 'hidden', 
      background: BG, 
      fontFamily: "'Inter', sans-serif" 
    }}>
      <Sidebar activeView={activeView} onNavigate={setActiveView} user={user} onSignOut={handleSignOut} />
      <main 
        data-lenis-prevent
        style={{ 
          flex: 1, 
          height: '100vh', 
          overflowY: 'auto', 
          padding: '32px',
          boxSizing: 'border-box',
          WebkitOverflowScrolling: 'touch' 
        }}
      >
        {renderContent()}
      </main>
    </div>
  );
}
