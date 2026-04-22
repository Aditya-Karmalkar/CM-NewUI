import React from 'react';

const BLUE = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BG = '#f8fafc';
const BDR = '#edeef1';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';

const PatientRow = ({ name, id, email, status, storageUsed }) => (
  <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 18, padding: '16px 20px', display: 'flex', alignItems: 'center', marginBottom: 12 }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: BLUE_FAINT, color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
      {name[0]}
    </div>
    <div style={{ flex: 1.5, marginLeft: 16 }}>
      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T1 }}>{name}</h4>
      <div style={{ fontSize: 11, color: T3, marginTop: 2 }}>ID: {id} • {email}</div>
    </div>
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: T3, textTransform: 'uppercase', marginBottom: 4 }}>Storage</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: T2 }}>{storageUsed} GB</div>
    </div>
    <div style={{ flex: 1, textAlign: 'right', marginRight: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: T3, textTransform: 'uppercase', marginBottom: 4 }}>Account Status</div>
      <div style={{ fontSize: 11, fontWeight: 800, color: status === 'Active' ? '#16a34a' : '#ef4444', background: status === 'Active' ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: 6, display: 'inline-block' }}>{status}</div>
    </div>
    <div style={{ display: 'flex', gap: 10 }}>
       <button style={{ border: `1px solid ${BDR}`, background: 'transparent', padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, color: T2, cursor: 'pointer' }}>Suspend</button>
       <button style={{ background: T1, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Manage Subscription</button>
    </div>
  </div>
);

export default function PatientsManagerPage() {
  const patients = [
    { name: "Marcus Johnson", id: "PAT-2001", email: "marcus.j@gmail.com", status: "Active", storageUsed: 12.5 },
    { name: "Alice Brown", id: "PAT-2002", email: "alice.brown@gmail.com", status: "Active", storageUsed: 4.8 },
    { name: "David Miller", id: "PAT-2003", email: "david.m@gmail.com", status: "Flagged", storageUsed: 8.9 },
    { name: "Sarah Chen", id: "PAT-2004", email: "sarah.chen@gmail.com", status: "Active", storageUsed: 15.2 },
  ];

  return (
    <div style={{ maxWidth: 1000, minHeight: '100.1%', paddingBottom: 40 }}>
       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
             <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 700, color: T1, margin: 0 }}>Patient Account Governance</h1>
             <p style={{ fontSize: 14, color: T2, marginTop: 4 }}>Platform-wide management of all patient entities and digital health properties.</p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
             <button style={{ background: BLUE, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,104,255,0.15)' }}>Export Global Directory</button>
          </div>
       </div>

       <div style={{ display: 'flex', flexDirection: 'column' }}>
          {patients.map(p => <PatientRow key={p.id} {...p} />)}
       </div>
    </div>
  );
}
