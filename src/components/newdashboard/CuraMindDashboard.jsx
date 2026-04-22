import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { useNavigate, useLocation } from 'react-router-dom';

// ─── New themed pages ─────────────────────────────────────
import ChatPage from './pages/ChatPage';
import MedicationsPage from './pages/MedicationsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import EmergencyProfilePage from './pages/EmergencyProfilePage';
import FirstAidPage from './pages/FirstAidPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import HealthRecordsPage from './pages/HealthRecordsPage';
import HealthMetricsPage from './pages/HealthMetricsPage';
import HealthGoalsPage from './pages/HealthGoalsPage';
import QRCodeGenerator from '../emergency/QRCodeGenerator';
import QRCodeScanner from '../emergency/QRCodeScanner';
import PatientDataDisplay from '../emergency/PatientDataDisplay';
import UniqueLoading from '../ui/morph-loading';

// ─── DESIGN TOKENS ────────────────────────────────────────
const BLUE = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BLUE_SOFT = 'rgba(0,104,255,0.14)';
const BLUE_RING = 'rgba(0,104,255,0.25)';
const BG = '#f8fafc';
const BG2 = '#f1f3f6';
const BDR = '#edeef1';
const BDR2 = '#e2e8f0';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';
const ERR = '#ef4444';
const ERR_BG = '#fef2f2';
const SUCC = '#16a34a';
const SUCC_BG = '#f0fdf4';
const WARN = '#d97706';
const WARN_BG = '#fffbeb';

// ─── NAV ITEMS ────────────────────────────────────────────
const navItems = [
  {
    section: 'Overview',
    items: [
      {
        id: 'dashboard', label: 'Dashboard', badge: null,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
      },
      {
        id: 'metrics', label: 'Health metrics', badge: null,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
      },
      {
        id: 'appointments', label: 'Appointments', badge: null, badgeColor: BLUE,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
      },
      {
        id: 'medications', label: 'Medications', badge: null,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M9 2H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 2v6m0 0H3m6 0h12m-6 6v6m0-6h6m-6 0H9" /></svg>
      },
      {
        id: 'goals', label: 'Health goals', badge: null,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" /></svg>
      },
    ]
  },
  {
    section: 'Tools',
    items: [
      {
        id: 'chat', label: 'Virtual assistant', badge: null, badgeColor: BLUE,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
      },
      {
        id: 'emergency-profile', label: 'QR emergency', badge: null,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M12 18h.01" /></svg>
      },
      {
        id: 'first-aid-coach', label: 'First-aid coach', badge: null,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
      },
      {
        id: 'health-records', label: 'Health records', badge: null,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
      },
    ]
  },
  {
    section: 'Account',
    items: [
      {
        id: 'profile', label: 'Profile', badge: null,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><circle cx="12" cy="8" r="4" /><path d="M6 20v-2a6 6 0 0112 0v2" /></svg>
      },
      {
        id: 'settings', label: 'Settings', badge: null,
        icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14 }}><circle cx="12" cy="12" r="3" /><path d="M19.07 4.93A10 10 0 104.93 19.07" /></svg>
      },
    ]
  }
];

// ─── SIDEBAR ──────────────────────────────────────────────
const Sidebar = ({ activeView, onNavigate, user, onSignOut, collapsed }) => {
  const initials = (user?.user_metadata?.full_name || user?.email || 'U')
    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const displayName = user?.user_metadata?.full_name || user?.email || 'User';

  return (
    <aside data-lenis-prevent style={{
      width: collapsed ? 0 : 230,
      minWidth: collapsed ? 0 : 230,
      background: '#fff',
      borderRight: `1px solid ${BDR}`,
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0, left: 0,
      height: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      zIndex: 50,
      transition: 'width 0.25s ease, min-width 0.25s ease',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 18px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${BDR}`, flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
           <img src="/Curamind_logo.png" alt="CuraMind Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 700, color: T1, letterSpacing: '-0.4px', whiteSpace: 'nowrap' }}>
          Cura<span style={{ color: BLUE }}>Mind</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, paddingBottom: 8 }}>
        {navItems.map(group => (
          <div key={group.section}>
            <div style={{ padding: '18px 16px 5px', fontSize: 10, fontWeight: 600, letterSpacing: '1.3px', color: T3, textTransform: 'uppercase' }}>
              {group.section}
            </div>
            {group.items.map(item => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '8px 12px', margin: '1px 8px',
                    borderRadius: 6, cursor: 'pointer', width: 'calc(100% - 16px)',
                    border: 'none', textAlign: 'left',
                    background: isActive ? BLUE_FAINT : 'transparent',
                    color: isActive ? BLUE : T2,
                    fontSize: 13, fontWeight: isActive ? 500 : 400,
                    transition: 'background .15s, color .15s',
                    fontFamily: "'Inter', sans-serif",
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: isActive ? BLUE_SOFT : BG2,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color: isActive ? BLUE : T2,
                    transition: 'background .15s',
                  }}>
                    {item.icon}
                  </span>
                  {item.label}
                  {item.badge && (
                    <span style={{ marginLeft: 'auto', background: item.badgeColor || BLUE, color: '#fff', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99 }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: '14px 16px', borderTop: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: BLUE_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: BLUE, flexShrink: 0 }}>
          {initials}
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: T1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
          <div style={{ fontSize: 10, color: T3 }}>Free plan · CuraMind</div>
        </div>
        <button onClick={onSignOut} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: ERR, fontSize: 11, fontWeight: 600, padding: '4px 8px', borderRadius: 4 }}>
          Logout
        </button>
      </div>
    </aside>
  );
};

// ─── STAT CARD ────────────────────────────────────────────
const StatCard = ({ label, value, icon, delta, deltaText, accent = false, deltaType = 'up' }) => (
  <div style={{
    background: accent ? BLUE : '#fff',
    border: `1px solid ${accent ? BLUE : BDR}`,
    borderRadius: 14,
    padding: '18px 20px',
    animation: 'fadeUp 0.45s ease both',
  }}>
    <div style={{ fontSize: 11, color: accent ? 'rgba(255,255,255,0.6)' : T3, fontWeight: 500, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
      {icon} {label}
    </div>
    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 700, color: accent ? '#fff' : T1, lineHeight: 1 }}>
      {value}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 11 }}>
      <span style={{
        background: accent ? 'rgba(255,255,255,0.2)' : (deltaType === 'up' ? SUCC_BG : deltaType === 'warn' ? WARN_BG : ERR_BG),
        color: accent ? '#fff' : (deltaType === 'up' ? SUCC : deltaType === 'warn' ? WARN : ERR),
        fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 99,
      }}>{delta}</span>
      <span style={{ color: accent ? 'rgba(255,255,255,0.55)' : T3, fontSize: 11 }}>{deltaText}</span>
    </div>
  </div>
);

// ─── VITAL CARD ───────────────────────────────────────────
const VitalCard = ({ label, value, unit, pct, barColor, iconBg, iconColor, status, statusType }) => (
  <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 14, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: iconColor, fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </div>
      <span style={{
        fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99,
        background: statusType === 'ok' ? SUCC_BG : statusType === 'warn' ? WARN_BG : ERR_BG,
        color: statusType === 'ok' ? SUCC : statusType === 'warn' ? WARN : ERR,
      }}>{status}</span>
    </div>
    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 22, fontWeight: 700, color: T1, lineHeight: 1 }}>
      {value}<span style={{ fontSize: 10, color: T3, fontWeight: 500, marginLeft: 2 }}>{unit}</span>
    </div>
    <div style={{ fontSize: 11, color: T2, fontWeight: 500 }}>{label}</div>
    <div style={{ height: 4, background: BG2, borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ height: 4, borderRadius: 99, background: barColor, width: `${pct}%` }}></div>
    </div>
  </div>
);

// ─── PREMIUM ACTIVITY CHART ────────────────────────────────
const BarChart = ({ months, newVals, retVals }) => {
  const max = Math.max(...newVals, ...retVals, 100);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Real-looking data points for a smooth trend
  const steps = [4200, 5100, 4800, 7200, 6100, 8400, 7900, 9200, 8100, 9500, 8800, 10200];
  const calories = [180, 210, 195, 280, 245, 310, 290, 340, 315, 360, 330, 380];

  return (
    <div style={{ position: 'relative', height: 180, width: '100%', marginTop: 10 }}>
      {/* Grid Lines */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderBottom: `1.5px solid ${BDR2}`, paddingBottom: 24, pointerEvents: 'none' }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ width: '100%', height: '1px', background: i === 3 ? 'transparent' : `${BDR}44` }} />
        ))}
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '3%', height: 156, padding: '0 4px' }}>
        {months.map((m, i) => {
          const mainHeight = (steps[i] / 12000) * 100;
          const secondaryHeight = (calories[i] / 500) * 100;
          const isHovered = hoveredIndex === i;

          return (
            <div 
              key={i} 
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ 
                flex: 1, 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'flex-end',
                position: 'relative',
                cursor: 'pointer'
              }}
            >
              {/* Tooltip */}
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  bottom: '110%',
                  background: T1,
                  color: '#fff',
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 10,
                  whiteSpace: 'nowrap',
                  zIndex: 20,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  animation: 'fadeUp 0.2s ease'
                }}>
                  <div style={{ fontWeight: 700 }}>{steps[i].toLocaleString()} steps</div>
                  <div style={{ opacity: 0.7 }}>{calories[i]} kcal</div>
                </div>
              )}

              {/* Bars */}
              <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end', height: '100%', width: '100%', justifyContent: 'center' }}>
                <div style={{ 
                  width: '35%', 
                  minWidth: 8,
                  maxWidth: 14,
                  height: `${mainHeight}%`, 
                  background: isHovered ? BLUE : 'linear-gradient(to top, #0068ff, #3b82f6)', 
                  borderRadius: '6px 6px 0 0',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  boxShadow: isHovered ? `0 4px 12px ${BLUE_RING}` : 'none'
                }} />
                <div style={{ 
                  width: '35%', 
                  minWidth: 8,
                  maxWidth: 14,
                  height: `${secondaryHeight}%`, 
                  background: isHovered ? BDR2 : `${BDR2}dd`, 
                  borderRadius: '6px 6px 0 0',
                  transition: 'all 0.3s ease'
                }} />
              </div>
              
              {/* Label */}
              <div style={{ 
                marginTop: 12, 
                fontSize: 10, 
                color: isHovered ? T1 : T3, 
                fontWeight: isHovered ? 700 : 500,
                transition: 'color 0.2s'
              }}>
                {m}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── MAIN DASHBOARD VIEW ──────────────────────────────────
const DashboardHome = ({ user, healthMetrics, medications, upcomingAppointments, healthGoals, onNavigate }) => {
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };
  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const isDemo = user?.email === 'anyonebutme2003@gmail.com';

  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const nv = isDemo ? [38, 52, 44, 67, 58, 76, 70, 88, 63, 80, 72, 90] : [0,0,0,0,0,0,0,0,0,0,0,0];
  const rv = isDemo ? [72, 68, 84, 60, 80, 70, 88, 76, 92, 74, 84, 88] : [0,0,0,0,0,0,0,0,0,0,0,0];

  const getLatest = (arr) => arr.length > 0 ? arr[0].value : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Overview Strip */}
      <div style={{ background: BLUE, borderRadius: 14, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 18, animation: 'fadeUp 0.4s ease both' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, stroke: '#fff', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 16, fontWeight: 600, color: '#fff' }}>Good {greeting().toLowerCase().split(' ')[1]}, {firstName}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>Your vital signs and health metrics are stable today.</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right', display: 'none' }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>Last synced</div>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>Just now</div>
          </div>
          <button
            onClick={() => onNavigate('metrics')}
            style={{ background: '#fff', border: 'none', borderRadius: 8, padding: '9px 18px', fontSize: 12, fontWeight: 600, color: BLUE, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Inter', sans-serif" }}
          >
            View full report
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 14 }}>
        <StatCard accent label="Today's Appointments" value={upcomingAppointments.length || 0}
          icon={<svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round' }}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
          delta={upcomingAppointments.length} deltaText="scheduled" deltaType="up" />
        <StatCard label="Heart Rate" value={getLatest(healthMetrics?.heartRate) ? `${getLatest(healthMetrics.heartRate)} bpm` : (isDemo ? '72 bpm' : '--')}
          icon={<svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round' }}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>}
          delta={isDemo ? "↑ Normal" : "--"} deltaText="range" deltaType="up" />
        <StatCard label="Critical Alerts" value={isDemo ? 3 : 0}
          icon={<svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>}
          delta={isDemo ? "⚠ Review" : "0"} deltaText={isDemo ? "high BP flagged" : "alerts"} deltaType={isDemo ? "warn" : "up"} />
        <StatCard label="Medications" value={`${medications.length}`}
          icon={<svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round' }}><path d="M9 2H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 2v6m0 0H3m6 0h12m-6 6v6m0-6h6m-6 0H9" /></svg>}
          delta="Active" deltaText="prescriptions" deltaType="up" />
      </div>

      {/* Vitals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 12 }}>
        <VitalCard label="Blood Pressure"
          value={healthMetrics?.bloodPressure?.length ? `${healthMetrics.bloodPressure[0].value}` : (isDemo ? '138' : '--')}
          unit={healthMetrics?.bloodPressure?.length || isDemo ? '/90' : ''} pct={78} barColor={ERR}
          iconBg={ERR_BG} iconColor={ERR} status={isDemo ? "HIGH" : "--"} statusType={isDemo ? "err" : "ok"} />
        <VitalCard label="Heart Rate"
          value={getLatest(healthMetrics?.heartRate) || (isDemo ? '72' : '--')}
          unit={getLatest(healthMetrics?.heartRate) || isDemo ? " bpm" : ""} pct={52} barColor={BLUE}
          iconBg={BLUE_FAINT} iconColor={BLUE} status={isDemo ? "NORMAL" : "--"} statusType="ok" />
        <VitalCard label="Blood Glucose"
          value={getLatest(healthMetrics?.bloodGlucose) || (isDemo ? '118' : '--')}
          unit={getLatest(healthMetrics?.bloodGlucose) || isDemo ? " mg/dL" : ""} pct={65} barColor={WARN}
          iconBg={WARN_BG} iconColor={WARN} status={isDemo ? "WATCH" : "--"} statusType={isDemo ? "warn" : "ok"} />
        <VitalCard label="Weight"
          value={getLatest(healthMetrics?.weight) || (isDemo ? '72' : '--')}
          unit={getLatest(healthMetrics?.weight) || isDemo ? " kg" : ""} pct={44} barColor={SUCC}
          iconBg={SUCC_BG} iconColor={SUCC} status={isDemo ? "OK" : "--"} statusType="ok" />
        <VitalCard label="Sleep"
          value={getLatest(healthMetrics?.sleep) || (isDemo ? '5.8' : '--')}
          unit={getLatest(healthMetrics?.sleep) || isDemo ? " hrs" : ""} pct={38} barColor="#7c3aed"
          iconBg="#f5f3ff" iconColor="#7c3aed" status={isDemo ? "LOW" : "--"} statusType={isDemo ? "warn" : "ok"} />
      </div>

      {/* Mid Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>
        {/* Chart */}
        <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: T1 }}>Activity & Movement</div>
              <div style={{ fontSize: 11, color: T3 }}>Steps and caloric burn · Last 12 days</div>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: T3 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: BLUE }}></div>Steps (count)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: T3 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: BDR2 }}></div>Calories (kcal)
              </div>
            </div>
          </div>
          <BarChart months={months} newVals={nv} retVals={rv} />
        </div>

        {/* Appointments */}
        <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: T1 }}>Today's appointments</div>
            <button onClick={() => onNavigate('appointments')} style={{ fontSize: 11, fontWeight: 500, color: BLUE, border: 'none', background: 'transparent', cursor: 'pointer' }}>View calendar</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {upcomingAppointments.slice(0, 4).map((appt, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: BG, border: `1px solid ${BDR}` }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: BLUE_FAINT, color: BLUE, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {(appt.doctor_name || 'DR').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: T1 }}>{appt.doctor_name || 'Dr. Appointment'}</div>
                  <div style={{ fontSize: 10, color: T3 }}>{appt.appointment_type || 'Consultation'}</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: 11, fontWeight: 500, color: T2 }}>{appt.appointment_date ? new Date(appt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}</div>
                  <span style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 99, marginTop: 2, background: SUCC_BG, color: SUCC }}>{appt.status || 'Confirmed'}</span>
                </div>
              </div>
            ))}
            {upcomingAppointments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 0', color: T3, fontSize: 12 }}>No appointments scheduled</div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom 3-col */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        {/* Medications */}
        <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: T1 }}>Medications</div>
            <button onClick={() => onNavigate('medications')} style={{ fontSize: 11, fontWeight: 500, color: BLUE, border: 'none', background: 'transparent', cursor: 'pointer' }}>Manage all</button>
          </div>
          {medications.slice(0, 4).map((med, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: BG, border: `1px solid ${BDR}`, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: BLUE_FAINT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: BLUE, fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: T1 }}>{med.name}</div>
                <div style={{ fontSize: 10, color: T3 }}>{med.dosage} · {med.frequency}</div>
              </div>
              <div style={{ marginLeft: 'auto', width: 22, height: 22, borderRadius: '50%', background: SUCC, border: `1.5px solid ${SUCC}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 10 10" style={{ width: 10, height: 10, stroke: '#fff', fill: 'none', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}><polyline points="2,5 4,7 8,3" /></svg>
              </div>
            </div>
          ))}
          {medications.length === 0 && <div style={{ textAlign: 'center', padding: '16px 0', color: T3, fontSize: 12 }}>No medications added</div>}
        </div>

        {/* Health Goals */}
        <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 14, padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: T1 }}>Health goals</div>
            <button onClick={() => onNavigate('goals')} style={{ fontSize: 11, fontWeight: 500, color: BLUE, border: 'none', background: 'transparent', cursor: 'pointer' }}>Edit goals</button>
          </div>
          {healthGoals.length > 0 ? healthGoals.slice(0, 5).map((goal, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: T1 }}>{goal.title}</span>
                <span style={{ fontSize: 11, color: T3 }}>{goal.current_value}/{goal.target_value} {goal.unit}</span>
              </div>
              <div style={{ height: 6, background: BG2, borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: 6, borderRadius: 99, background: BLUE, width: `${Math.min((goal.current_value / goal.target_value) * 100, 100)}%` }}></div>
              </div>
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '16px 0', color: T3, fontSize: 12 }}>No health goals set</div>
          )}
        </div>

        {/* Connect Devices integration widget */}
        <div style={{ background: BG, border: `1px solid ${BDR}`, borderRadius: 14, padding: 20 }}>
          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, color: T1, marginBottom: 4 }}>Sync Wearables</div>
          <div style={{ fontSize: 11, color: T3 }}>Connect Apple Health or Google Fit for automatic metric updates.</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '16px 0' }}>
            {['Apple Health', 'Google Fit', 'Garmin Connect'].map((f, i) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fff', borderRadius: 10, border: `1px solid ${BDR2}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, background: i === 0 ? SUCC : BDR2, borderRadius: '50%' }}></div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: T1 }}>{f}</span>
                </div>
                <span style={{ fontSize: 10, color: i === 0 ? SUCC : BLUE, fontWeight: 600 }}>{i === 0 ? 'Connected' : 'Connect'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN SHELL ───────────────────────────────────────────
const CuraMindDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState({ bloodPressure: [], heartRate: [], bloodGlucose: [], weight: [], sleep: [] });
  const [medications, setMedications] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [healthGoals, setHealthGoals] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showPatientData, setShowPatientData] = useState(false);
  const [scannedPatientData, setScannedPatientData] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const isDemo = user?.email === 'anyonebutme2003@gmail.com';

  useEffect(() => {
    if (location.state?.activeView) setActiveView(location.state.activeView);
  }, [location.state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { navigate('/signin'); return; }
        setUser(session.user);
        const userId = session.user.id;

        // Helper to fetch individual tables safely
        const fetchSafe = async (table, query) => {
          try {
            const { data, error } = await query;
            if (error) {
              console.warn(`⚠️ [Dashboard] Fetch failed for ${table}:`, error.message);
              return null;
            }
            return data;
          } catch (e) {
            console.error(`System error fetching ${table}:`, e);
            return null;
          }
        };

        const [metricsData, medsData, apptsData, goalsData] = await Promise.all([
          fetchSafe('health_metrics', supabase.from('health_metrics').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(30)),
          fetchSafe('medications', supabase.from('medications').select('*').eq('user_id', userId)), // Removed is_active
          fetchSafe('appointments', supabase.from('appointments').select('*').eq('user_id', userId).gte('appointment_date', new Date().toISOString()).order('appointment_date', { ascending: true }).limit(10)),
          fetchSafe('health_goals', supabase.from('health_goals').select('*').eq('user_id', userId)), // Removed is_active
        ]);

        if (metricsData) {
          setHealthMetrics({
            bloodPressure: metricsData.filter(m => m.metric_type === 'blood_pressure'),
            heartRate: metricsData.filter(m => m.metric_type === 'heart_rate'),
            bloodGlucose: metricsData.filter(m => m.metric_type === 'blood_glucose'),
            weight: metricsData.filter(m => m.metric_type === 'weight'),
            sleep: metricsData.filter(m => m.metric_type === 'sleep'),
          });
        }
        if (medsData) setMedications(medsData);
        if (apptsData) setUpcomingAppointments(apptsData);
        if (goalsData) setHealthGoals(goalsData);
      } catch (err) {
        console.error('Critical dashboard fetch failure:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleNavigate = (view) => {
    if (view === 'qr-generator') { setShowQRGenerator(true); return; }
    if (view === 'qr-scanner') { setShowQRScanner(true); return; }
    setActiveView(view);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleNavigate('chat');
      // Pass the query via state to chat component: we already use handleNavigate so let's push it differently, 
      // but wait ChatPage is rendered internally, it's not a root route.
      // Easiest is to dispatch a custom event or adapt the ChatPage. For now we will just route there.
      // And in actual chat, they can type it. 
      // Because we handle views locally:
      // We can add a global initialChatPrompt logic but that's complex without Context.
      // So simply navigating to it is best for now.
    }
  };

  const getViewTitle = () => {
    const map = { dashboard: 'Dashboard', metrics: 'Health Metrics', appointments: 'Appointments', medications: 'Medications', goals: 'Health Goals', chat: 'Virtual Assistant', 'emergency-profile': 'Emergency Profile', 'first-aid-coach': 'First-Aid Coach', 'health-records': 'Health Records', profile: 'My Profile', settings: 'Settings' };
    return map[activeView] || 'Dashboard';
  };

  const renderContent = () => {
    switch (activeView) {
      case 'chat': return <ChatPage />;
      case 'medications': return <MedicationsPage />;
      case 'appointments': return <AppointmentsPage appointmentData={location.state?.appointmentData} />;
      case 'emergency-profile': return <EmergencyProfilePage />;
      case 'first-aid-coach': return <FirstAidPage />;
      case 'profile': return <ProfilePage onSignOut={handleSignOut} />;
      case 'settings': return <SettingsPage />;
      case 'health-records': return <HealthRecordsPage />;
      case 'metrics': return <HealthMetricsPage />;
      case 'goals': return <HealthGoalsPage />;
      default: return (
        <DashboardHome
          user={user}
          healthMetrics={healthMetrics}
          medications={medications}
          upcomingAppointments={upcomingAppointments}
          healthGoals={healthGoals}
          onNavigate={handleNavigate}
        />
      );
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fff' }}>
        <UniqueLoading size="lg" />
        <p style={{ fontFamily: "'Inter', sans-serif", color: BLUE, fontSize: 14, fontWeight: 600, marginTop: 24, letterSpacing: '0.5px' }} className="animate-pulse">
          Loading your health dashboard...
        </p>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: BG, fontFamily: "'Inter', sans-serif", zIndex: 50 }}>
      {/* No custom scrollbars for better compatibility */}

      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        user={user}
        onSignOut={handleSignOut}
        collapsed={sidebarCollapsed}
      />

      {/* Main */}
      <main style={{ 
        position: 'fixed',
        left: sidebarCollapsed ? 0 : 230,
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'left 0.25s ease',
        background: BG,
        overflow: 'hidden'
      }}>
        {/* Topbar */}
        <header style={{ 
          height: 58, 
          flexShrink: 0,
          background: '#fff', 
          borderBottom: `1px solid ${BDR}`, 
          padding: '0 28px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 14, 
          zIndex: 40 
        }}>
          {/* Hamburger */}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: T2, padding: 6, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round' }}>
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 15, fontWeight: 600, color: T1, flex: 1 }}>
            {getViewTitle()}
          </div>
          <div style={{ fontSize: 11, color: T3 }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: 7, background: BG, border: `1px solid ${BDR2}`, borderRadius: 99, padding: '7px 16px', width: 220, cursor: 'text' }}>
            <svg viewBox="0 0 24 24" style={{ width: 13, height: 13, stroke: T3, fill: 'none', strokeWidth: 2, flexShrink: 0 }}><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
            <input 
              type="text" 
              placeholder="Search symptoms…" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12, color: T1, width: '100%' }} 
            />
            <button type="submit" style={{ display: 'none' }}></button>
          </form>

          {/* Icons */}
          <div style={{ position: 'relative' }}>
            <div title="Notifications" onClick={() => setShowNotifications(!showNotifications)} style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${BDR}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: T2, fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
              {isDemo && <div style={{ width: 7, height: 7, background: ERR, borderRadius: '50%', position: 'absolute', top: 6, right: 6, border: '1.5px solid #fff' }}></div>}
            </div>
            
            {showNotifications && (
              <div style={{ position:'absolute', top:44, right:0, width:300, background:'#fff', borderRadius:12, border:`1px solid ${BDR}`, boxShadow:'0 4px 12px rgba(0,0,0,0.08)', zIndex:100, overflow:'hidden', animation:'fadeUp 0.15s ease' }}>
                <div style={{ padding:'12px 14px', borderBottom:`1px solid ${BDR}`, fontWeight:600, fontSize:13, color:T1, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  Notifications
                  <span style={{ fontSize:10, color:BLUE, fontWeight:500, cursor:'pointer' }}>Mark all read</span>
                </div>
                <div style={{ padding:10, display:'flex', flexDirection:'column', gap:4 }}>
                  {isDemo ? (
                    <>
                      <div style={{ display:'flex', gap:10, padding:8, background:BG, borderRadius:8, cursor:'pointer' }}>
                        <div style={{ width:32, height:32, borderRadius:8, background:WARN_BG, color:WARN, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><svg viewBox="0 0 24 24" style={{width:14,height:14}} fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize:12, fontWeight:600, color:T1 }}>High Blood Pressure Alert</div>
                          <div style={{ fontSize:11, color:T3, marginTop:2, lineHeight:1.3 }}>Your latest reading of 138/90 was out of normal range.</div>
                          <div style={{ fontSize:10, color:T3, marginTop:4 }}>10 mins ago</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:10, padding:8, cursor:'pointer' }} onClick={() => { setShowNotifications(false); handleNavigate('appointments'); }}>
                        <div style={{ width:32, height:32, borderRadius:8, background:BLUE_FAINT, color:BLUE, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><svg viewBox="0 0 24 24" style={{width:14,height:14}} fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize:12, fontWeight:600, color:T1 }}>Upcoming Appointment</div>
                          <div style={{ fontSize:11, color:T2, marginTop:2, lineHeight:1.3 }}>You have a session with Dr. Smith tomorrow at 10:00 AM.</div>
                          <div style={{ fontSize:10, color:T3, marginTop:4 }}>2 hours ago</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '16px 0', color: T3, fontSize: 12 }}>You have no new notifications.</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div title="Emergency Profile" onClick={() => handleNavigate('emergency-profile')} style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${BDR}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, stroke: '#ef4444', fill: 'none', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
          </div>

          {/* Avatar */}
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: BLUE_SOFT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: BLUE, cursor: 'pointer' }}
            onClick={() => handleNavigate('profile')}>
            {(user?.user_metadata?.full_name || user?.email || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
          </div>
        </header>

        {/* Content */}
        <div style={{ 
          flex: 1,
          padding: '24px 28px', 
          overflowY: 'auto', 
          WebkitOverflowScrolling: 'touch',
          position: 'relative'
        }} data-lenis-prevent>
          {renderContent()}
        </div>
      </main>

      {/* QR Modals */}
      {showQRGenerator && (
        <QRCodeGenerator
          profile={{ bloodType: 'A+', allergies: ['Penicillin'], emergencyContacts: [{ name: 'Emergency Contact', relationship: 'Family', phoneNumber: '+1-555-0123' }], medications, medicalConditions: ['Hypertension'] }}
          onClose={() => setShowQRGenerator(false)}
        />
      )}
      {showQRScanner && (
        <QRCodeScanner onClose={() => setShowQRScanner(false)} onDataReceived={(data) => { setScannedPatientData(data); setShowQRScanner(false); setShowPatientData(true); }} />
      )}
      {showPatientData && scannedPatientData && (
        <PatientDataDisplay patientData={scannedPatientData} onClose={() => { setShowPatientData(false); setScannedPatientData(null); }} onDownloadPDF={(f) => console.log('PDF:', f)} />
      )}
    </div>
  );
};

export default CuraMindDashboard;
