import React, { useState } from 'react';

const BLUE = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BLUE_SOFT = 'rgba(0,104,255,0.14)';
const BG = '#f8fafc';
const BG2 = '#f1f3f6';
const BDR = '#edeef1';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';
const SUCC = '#16a34a';
const SUCC_BG = '#f0fdf4';
const ERR = '#ef4444';
const ERR_BG = '#fef2f2';
const WARN = '#d97706';
const WARN_BG = '#fffbeb';

const StatCard = ({ label, value, icon, delta, deltaText, deltaType = 'up' }) => (
  <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 20, padding: '28px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default' }} className="hover:shadow-lg hover:border-blue-200">
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div style={{ padding: 12, background: BLUE_FAINT, color: BLUE, borderRadius: 14 }}>{icon}</div>
      <span style={{ 
        fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 99, 
        background: deltaType === 'up' ? SUCC_BG : deltaType === 'warn' ? WARN_BG : ERR_BG,
        color: deltaType === 'up' ? SUCC : deltaType === 'warn' ? WARN : ERR,
        textTransform: 'uppercase', letterSpacing: '0.7px'
      }}>{delta}</span>
    </div>
    <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: 32, fontWeight: 700, color: T1, lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: 14, color: T2, fontWeight: 600, marginTop: 10 }}>{label}</div>
    <div style={{ fontSize: 11, color: T3, marginTop: 6 }}>{deltaText} vs last week</div>
  </div>
);

const AppointmentRow = ({ patient, time, type, status, gender, age, onAction }) => (
  <div 
    onClick={onAction}
    style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 16px', borderBottom: `1px solid ${BDR}`, transition: 'background 0.2s', cursor: 'pointer' }}
    onMouseEnter={(e) => e.currentTarget.style.background = BG}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
  >
    <div style={{ width: 44, height: 44, borderRadius: 12, background: BLUE_SOFT, color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>
      {patient[0]}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: T1 }}>{patient}</div>
      <div style={{ fontSize: 11, color: T3, fontWeight: 600, marginTop: 2 }}>{age}Y • {gender} • {type}</div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: T2 }}>{time}</div>
      <div style={{ fontSize: 10, color: status === 'URGENT' ? ERR : T3, fontWeight: 800, marginTop: 4, background: status === 'URGENT' ? ERR_BG : 'transparent', padding: '2px 6px', borderRadius: 4 }}>{status}</div>
    </div>
  </div>
);

const LogItem = ({ title, desc, time, type }) => (
  <div style={{ display: 'flex', gap: 14, padding: '14px 0', borderBottom: `1px solid ${BDR}`, opacity: 0.9 }}>
    <div style={{ width: 6, height: 6, borderRadius: '50%', background: type === 'med' ? BLUE : type === 'lab' ? WARN : SUCC, marginTop: 6, flexShrink: 0 }}></div>
    <div style={{ flex: 1 }}>
       <div style={{ fontSize: 13, fontWeight: 700, color: T1 }}>{title}</div>
       <div style={{ fontSize: 11, color: T2, marginTop: 2 }}>{desc}</div>
       <div style={{ fontSize: 10, color: T3, marginTop: 4, fontWeight: 600 }}>{time}</div>
    </div>
  </div>
);

export default function DashboardPage() {
  const [notification, setNotification] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  const triggerNotify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAction = (type) => {
    setLoadingAction(true);
    setTimeout(() => {
      setLoadingAction(false);
      triggerNotify(`Action "${type}" processed successfully.`);
    }, 1200);
  };

  return (
    <div style={{ maxWidth: 1240, paddingBottom: 60, position: 'relative' }}>
      {/* Dynamic Notification Toast */}
      {notification && (
        <div style={{ 
          position: 'fixed', top: 24, right: 24, background: T1, color: '#fff', padding: '12px 24px', 
          borderRadius: 12, fontSize: 13, fontWeight: 600, boxShadow: '0 10px 40px rgba(0,0,0,0.2)', 
          zIndex: 9999, display: 'flex', alignItems: 'center', gap: 10, animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{ width: 6, height: 6, background: SUCC, borderRadius: '50%' }}></div>
          {notification}
        </div>
      )}

      {/* Header Section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 32, fontWeight: 800, color: T1, margin: 0, letterSpacing: '-0.5px' }}>Clinical Workspace</h1>
          <p style={{ fontSize: 15, color: T2, marginTop: 6, fontWeight: 500 }}>Wednesday, 18 October 2023 • <span style={{ color: BLUE, fontWeight: 700 }}>8 Consultations</span> Remaining</p>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
           <button 
             onClick={() => handleAction('Practice Report Generation')}
             disabled={loadingAction}
             style={{ background: '#fff', border: `1px solid ${BDR}`, padding: '12px 24px', borderRadius: 14, fontSize: 13, fontWeight: 700, color: T2, cursor: 'pointer', transition: 'all 0.2s', opacity: loadingAction ? 0.6 : 1 }}
           >
             {loadingAction ? 'Processing...' : 'Practice Reports'}
           </button>
           <button 
             onClick={() => handleAction('Initiating Consultation')}
             style={{ background: BLUE, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 14, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,104,255,0.15)', transition: 'transform 0.2s' }}
             onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.96)'}
             onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
           >
             + New Consultation
           </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 32 }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            <StatCard label="Total Active Patients" value="1,248" delta="+12%" deltaText="Weekly Growth" icon={<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>} />
            <StatCard label="Consultation Load" value="82%" delta="Busy" deltaType="warn" icon={<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>} />
            <StatCard label="Critical Alerts" value="02" delta="Urgent" deltaType="error" icon={<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>} />
            <StatCard label="Patient Satisfaction" value="4.92" delta="Stable" deltaType="up" icon={<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21 12 17.77 5.82 21 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>} />
          </div>

          <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 24, padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 19, fontWeight: 700, color: T1, margin: 0 }}>Upcoming Consultation Agenda</h3>
              <button onClick={() => triggerNotify('Fetching monthly schedule...')} style={{ border: 'none', background: BLUE_FAINT, color: BLUE, fontSize: 12, fontWeight: 700, padding: '7px 16px', borderRadius: 10, cursor: 'pointer' }}>View Month View</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <AppointmentRow onAction={() => triggerNotify('Opening Marcus Johnson profile...')} patient="Marcus Johnson" time="10:30 AM" type="Cardiac Assessment" status="URGENT" age="42" gender="Male" />
              <AppointmentRow onAction={() => triggerNotify('Opening Sarah Chen profile...')} patient="Sarah Chen" time="11:15 AM" type="Neurology Consult" status="IN-PERSON" age="31" gender="Female" />
              <AppointmentRow onAction={() => triggerNotify('Opening Emily Rodriguez profile...')} patient="Emily Rodriguez" time="01:45 PM" type="Post-Surgery Review" status="VIDEO" age="54" gender="Female" />
              <AppointmentRow onAction={() => triggerNotify('Opening David Miller profile...')} patient="David Miller" time="02:30 PM" type="Routine Checkup" status="IN-PERSON" age="62" gender="Male" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #004dc4 100%)`, borderRadius: 28, padding: 32, color: '#fff', boxShadow: '0 20px 40px rgba(0,104,255,0.2)' }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 16px' }}>CuraMind AI Diagnostic</h3>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
               Clinical analysis of your current surgical group shows a 14% higher-than-average recovery time.
            </p>
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
               <button onClick={() => handleAction('Mobility Protocol Synthesis')} style={{ border: 'none', background: '#fff', color: BLUE, fontSize: 13, fontWeight: 800, padding: '12px', borderRadius: 14, cursor: 'pointer' }}>Generate Protocol</button>
            </div>
          </div>

          <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 24, padding: 28 }}>
            <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: T1, margin: '0 0 20px' }}>Clinical Activity Feed</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
               <LogItem title="Prescription Sent" desc="Atorvastatin 20mg for Marcus Johnson" time="12 mins ago" type="med" />
               <LogItem title="Lab Results Received" desc="CBC Panel: Alice Brown" time="45 mins ago" type="lab" />
               <LogItem title="Emergency Consultation" desc="Video call with patient X-2301" time="2 hours ago" type="alert" />
            </div>
            <button onClick={() => triggerNotify('Loading historical log entries...')} style={{ marginTop: 16, border: 'none', background: BLUE_FAINT, color: BLUE, fontSize: 12, fontWeight: 700, padding: '10px', borderRadius: 10, cursor: 'pointer' }}>View All Logs</button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
