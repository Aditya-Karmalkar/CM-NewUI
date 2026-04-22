import React from 'react';

const BLUE = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BG = '#f8fafc';
const BDR = '#edeef1';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';

const LogItem = ({ message, time, type }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: `1px solid ${BDR}`, background: '#fff' }}>
    <div style={{ width: 8, height: 8, borderRadius: '50%', background: type === 'ERROR' ? '#ef4444' : type === 'WARN' ? '#f59e00' : '#16a34a', flexShrink: 0 }}></div>
    <div style={{ flex: 1, fontSize: 13, color: T1, fontWeight: type === 'ERROR' ? 700 : 500 }}>{message}</div>
    <div style={{ fontSize: 11, color: T3, fontWeight: 700 }}>{time}</div>
    <div style={{ fontSize: 10, fontWeight: 800, color: T3, background: 'rgba(0,0,0,0.05)', padding: '2px 6px', borderRadius: 4 }}>{type}</div>
  </div>
);

export default function SystemLogsPage({ onNavigate }) {
  const logs = [
    { message: "Unusual login attempt from IP 192.168.1.45 (Account: DR-4301)", time: "09:42:01 AM", type: "WARN" },
    { message: "Database replication successful across 3 nodes.", time: "09:30:15 AM", type: "SUCCESS" },
    { message: "AI Engine: Latency exceeded 1500ms in Zone US-East.", time: "09:12:44 AM", type: "ERROR" },
    { message: "New healthcare provider invitation accepted: Dr. Allison Cameron.", time: "08:55:10 AM", type: "SUCCESS" },
    { message: "Security Audit: 42 session tokens rotated.", time: "08:12:00 AM", type: "SUCCESS" },
    { message: "Supabase connection pool reaching 85% capacity.", time: "07:44:11 AM", type: "WARN" },
  ];

  return (
    <div style={{ maxWidth: 1000, paddingBottom: 40 }}>
       <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 700, color: T1, margin: 0 }}>Platform Security Logs</h1>
          <p style={{ fontSize: 14, color: T2, marginTop: 4 }}>Real-time audit trails and enterprise system health monitoring.</p>
       </div>

       <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 20, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: `1px solid ${BDR}`, display: 'flex', gap: 12 }}>
             <button style={{ background: BLUE, color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>All Logs</button>
             <button style={{ background: 'transparent', border: `1px solid ${BDR}`, padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, color: T2, cursor: 'pointer' }}>Critical Errors</button>
             <button onClick={() => onNavigate('security')} style={{ background: 'transparent', border: `1px solid ${BDR}`, padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, color: T2, cursor: 'pointer' }}>Security Audit</button>
          </div>
          {logs.map((l, i) => <LogItem key={i} {...l} />)}
       </div>
    </div>
  );
}
