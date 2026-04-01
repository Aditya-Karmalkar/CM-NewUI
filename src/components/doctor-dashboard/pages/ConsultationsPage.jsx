import React, { useState } from 'react';

const BLUE = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BG = '#f8fafc';
const BDR = '#edeef1';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';
const ERR = '#ef4444';
const SUCC = '#16a34a';

const ConsultHeader = ({ patientInfo, onSave, onEnd }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, background: '#fff', padding: '16px 24px', borderRadius: 18, border: `1px solid ${BDR}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: BLUE_FAINT, color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
        {patientInfo.name[0]}
      </div>
      <div>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T1 }}>{patientInfo.name}</h3>
        <div style={{ fontSize: 11, color: T3 }}>{patientInfo.age}Y • {patientInfo.gender} • Consult ID: {patientInfo.id}</div>
      </div>
    </div>
    <div style={{ display: 'flex', gap: 12 }}>
      <button onClick={onEnd} style={{ background: '#fef2f2', color: ERR, border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>End Session</button>
      <button onClick={onSave} style={{ background: BLUE, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Save Notes</button>
    </div>
  </div>
);

const ClinicalNote = ({ label, value, onChange }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ fontSize: 11, fontWeight: 700, color: T3, textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>{label}</label>
    <textarea 
      style={{ width: '100%', minHeight: 80, padding: 12, borderRadius: 12, border: `1px solid ${BDR}`, background: BG, fontSize: 13, color: T1, fontFamily: 'inherit', resize: 'vertical' }}
      placeholder={`Type ${label.toLowerCase()}...`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default function ConsultationsPage() {
  const [notes, setNotes] = useState({ symptoms: '', diagnosis: '', prescription: '' });
  const [notification, setNotification] = useState(null);
  
  const patient = { name: "Marcus Johnson", id: "CM-2931-X", age: 42, gender: "Male" };

  const triggerNotify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const applyAISuggestion = () => {
    setNotes({ ...notes, prescription: "Lisinopril 10mg once daily. Monitor blood pressure weekly." });
    triggerNotify("AI treatment plan applied to prescription.");
  };

  const handleSave = () => {
    triggerNotify("Clinical notes saved to patient EHR.");
  };

  const handleEnd = () => {
    if (window.confirm("Are you sure you want to end this clinical session?")) {
      triggerNotify("Session ended. Final report uploaded.");
      setNotes({ symptoms: '', diagnosis: '', prescription: '' });
    }
  };

  return (
    <div style={{ maxWidth: 1100, position: 'relative' }}>
      {notification && (
        <div style={{ position: 'fixed', top: 24, right: 24, background: T1, color: '#fff', padding: '12px 24px', borderRadius: 12, fontSize: 13, fontWeight: 600, boxShadow: '0 10px 40px rgba(0,0,0,0.2)', zIndex: 9999 }}>
          {notification}
        </div>
      )}

      <ConsultHeader patientInfo={patient} onSave={handleSave} onEnd={handleEnd} />

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
        <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 20, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 10, height: 10, background: SUCC, borderRadius: '50%' }}></div>
            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T1 }}>In-Progress Assessment</h4>
          </div>

          <ClinicalNote label="Symptoms & History" value={notes.symptoms} onChange={(val) => setNotes({ ...notes, symptoms: val })} />
          <ClinicalNote label="Primary Diagnosis" value={notes.diagnosis} onChange={(val) => setNotes({ ...notes, diagnosis: val })} />
          <ClinicalNote label="Prescription & Treatment" value={notes.prescription} onChange={(val) => setNotes({ ...notes, prescription: val })} />
          
          <div style={{ marginTop: 24 }}>
             <label style={{ fontSize: 11, fontWeight: 700, color: T3, textTransform: 'uppercase', marginBottom: 12, display: 'block' }}>AI Prescription Assistant</label>
             <div style={{ background: BLUE_FAINT, border: `1px dashed ${BLUE}`, borderRadius: 14, padding: 16 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, color: BLUE }}>
                 <span style={{ fontSize: 12, fontWeight: 700 }}>AI Suggested Treatment Plan</span>
               </div>
               <p style={{ fontSize: 11, color: T2, lineHeight: 1.6, margin: 0 }}>
                 Based on the symptoms provided, consider a regimen of Lisinopril 10mg. 
               </p>
               <button onClick={applyAISuggestion} style={{ marginTop: 10, background: BLUE, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Apply Suggestion</button>
             </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 20, padding: 24 }}>
             <h4 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: T1 }}>Physical Vitals</h4>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
               {[
                 { label: 'Heart Rate', value: '72 bpm', status: 'Stable' },
                 { label: 'Blood Pressure', value: '142/90', status: 'Elevated' }
               ].map(v => (
                 <div key={v.label} style={{ background: BG, padding: 14, borderRadius: 12, border: `1px solid ${BDR}` }}>
                   <div style={{ fontSize: 10, fontWeight: 700, color: T3, textTransform: 'uppercase' }}>{v.label}</div>
                   <div style={{ fontSize: 16, fontWeight: 700, color: T1, margin: '4px 0' }}>{v.value}</div>
                   <div style={{ fontSize: 10, fontWeight: 600, color: v.status === 'Elevated' ? ERR : SUCC }}>{v.status}</div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
