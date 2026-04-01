import React, { useState } from 'react';

const BLUE = '#0068ff';
const BDR = '#edeef1';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';

const PatientRow = ({ name, id, age, condition, lastVisit, onAction }) => (
  <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 18, padding: '16px 20px', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }}>
    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,104,255,0.08)', color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
      {name[0]}
    </div>
    <div style={{ flex: 1, marginLeft: 16 }}>
      <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T1 }}>{name}</h4>
      <div style={{ fontSize: 11, color: T3, marginTop: 2 }}>ID: {id} • Age: {age}</div>
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: T3, textTransform: 'uppercase', marginBottom: 4 }}>Condition</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: T2 }}>{condition}</div>
    </div>
    <div style={{ flex: 1, textAlign: 'right', marginRight: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: T3, textTransform: 'uppercase', marginBottom: 4 }}>Last Visit</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: T2 }}>{lastVisit}</div>
    </div>
    <div style={{ display: 'flex', gap: 10 }}>
       <button onClick={() => onAction('Profile')} style={{ border: `1px solid ${BDR}`, background: 'transparent', padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, color: T2, cursor: 'pointer' }}>Profile</button>
       <button onClick={() => onAction('Records')} style={{ background: BLUE, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Records</button>
    </div>
  </div>
);

export default function PatientsPage() {
  const [search, setSearch] = useState('');
  const [patients] = useState([
    { name: "Marcus Johnson", id: "CM-1029", age: 42, condition: "Hypertension", lastVisit: "Oct 12, 2023" },
    { name: "Alice Brown", id: "CM-1035", age: 29, condition: "Anxiety Disorder", lastVisit: "Oct 14, 2023" },
    { name: "David Miller", id: "CM-1042", age: 56, condition: "Diabetes Type II", lastVisit: "Oct 08, 2023" },
    { name: "Sarah Chen", id: "CM-1051", age: 31, condition: "Insomnia", lastVisit: "Oct 15, 2023" },
    { name: "Emily Rodriguez", id: "CM-1065", age: 54, condition: "Post-Surgery Recovery", lastVisit: "Oct 17, 2023" },
  ]);

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.condition.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const handlePatientAction = (patient, action) => {
    alert(`${action} triggered for ${patient.name}. This would navigate to the detailed ${action} view.`);
  };

  return (
    <div style={{ maxWidth: 1000 }}>
      {/* Header with Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 700, color: T1, margin: 0 }}>Patient Directory</h1>
          <p style={{ fontSize: 14, color: T2, marginTop: 4 }}>Access and manage {patients.length} active patient health records.</p>
        </div>
        <button style={{ background: BLUE, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,104,255,0.15)' }}>+ Admit New Patient</button>
      </div>

      {/* Filter Bar */}
      <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 18, padding: '12px 20px', marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
         <div style={{ flex: 1, position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search by name, ID, or clinical condition..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 16px 10px 40px', borderRadius: 12, border: `1px solid ${BDR}`, background: '#f8fafc', fontSize: 13, outline: 'none' }}
            />
            <div style={{ position: 'absolute', left: 14, top: 12, color: T3 }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
         </div>
         <div style={{ display: 'flex', gap: 8 }}>
            <button style={{ background: '#fff', border: `1px solid ${BDR}`, padding: '10px 16px', borderRadius: 12, fontSize: 12, fontWeight: 700, color: T2, cursor: 'pointer' }}>Filter: All</button>
            <button style={{ background: '#fff', border: `1px solid ${BDR}`, padding: '10px 16px', borderRadius: 12, fontSize: 12, fontWeight: 700, color: T2, cursor: 'pointer' }}>Sort: Name</button>
         </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredPatients.length > 0 ? (
          filteredPatients.map(p => <PatientRow key={p.id} {...p} onAction={(action) => handlePatientAction(p, action)} />)
        ) : (
          <div style={{ padding: '60px', textAlign: 'center', background: '#fff', border: `1px dashed ${BDR}`, borderRadius: 20 }}>
             <p style={{ color: T3, fontSize: 14, fontWeight: 500 }}>No patients found matching "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
