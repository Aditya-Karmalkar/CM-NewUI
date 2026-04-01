import React, { useState } from 'react';

const BLUE = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BG = '#f8fafc';
const BDR = '#edeef1';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';

const RecordItem = ({ title, date, type, fileType, onAction }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: `1px solid ${BDR}`, background: '#fff', borderRadius: 14, marginBottom: 12 }}>
    <div style={{ width: 44, height: 44, borderRadius: 10, background: BLUE_FAINT, color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: T1 }}>{title}</div>
      <div style={{ fontSize: 11, color: T3, marginTop: 2 }}>{type} • {fileType}</div>
    </div>
    <div style={{ textAlign: 'right', marginRight: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: T2 }}>Uploaded {date}</div>
    </div>
    <div style={{ display: 'flex', gap: 8 }}>
      <button onClick={() => onAction('View')} style={{ border: `1px solid ${BDR}`, background: 'transparent', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, color: T2, cursor: 'pointer' }}>View</button>
      <button onClick={() => onAction('Download')} style={{ border: 'none', background: BLUE, color: '#fff', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Download</button>
    </div>
  </div>
);

export default function EHRManagerPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All Records');
  const [records] = useState([
    { title: "Complete Blood Count (CBC)", date: "Oct 14, 2023", type: "Lab Results", fileType: "PDF" },
    { title: "Chest X-Ray Sidebar View", date: "Oct 12, 2023", type: "Imaging (DICOM)", fileType: "DICOM" },
    { title: "Cardiology Consultation Summary", date: "Oct 08, 2023", type: "Clinical Summaries", fileType: "PDF" },
    { title: "Pre-Surgery Consent Form", date: "Sep 28, 2023", type: "Consent Forms", fileType: "Digital" },
    { title: "Kidney Function Test", date: "Sep 20, 2023", type: "Lab Results", fileType: "PDF" },
  ]);

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.type.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'All Records' || r.type === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleAction = (record, action) => {
    alert(`${action} triggered for ${record.title}. This would open the secure document viewer.`);
  };

  return (
    <div style={{ maxWidth: 900 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: T1, margin: 0 }}>EHR Manager</h1>
          <p style={{ fontSize: 13, color: T2, marginTop: 4 }}>Access and manage Electronic Health Records.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
           <input 
             type="text" 
             placeholder="Search records..." 
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             style={{ padding: '10px 16px', borderRadius: 12, border: `1px solid ${BDR}`, fontSize: 13, minWidth: 260, focus: { outline: `2px solid ${BLUE}` } }}
           />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, overflowX: 'auto', paddingBottom: 10 }}>
        {['All Records', 'Lab Results', 'Imaging (DICOM)', 'Clinical Summaries', 'Consent Forms'].map((cat) => (
          <button key={cat} onClick={() => setActiveTab(cat)} style={{ 
            padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer',
            background: activeTab === cat ? BLUE : '#fff', color: activeTab === cat ? '#fff' : T2, border: `1px solid ${activeTab === cat ? BLUE : BDR}`,
            transition: 'all 0.2s'
          }}>{cat}</button>
        ))}
      </div>

      <div>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: T1, marginBottom: 16 }}>Found {filteredRecords.length} Records</h3>
        {filteredRecords.length > 0 ? (
          filteredRecords.map(r => <RecordItem key={r.title} {...r} onAction={(action) => handleAction(r, action)} />)
        ) : (
          <div style={{ padding: '60px', textAlign: 'center', background: '#fff', border: `1px dashed ${BDR}`, borderRadius: 20 }}>
             <p style={{ color: T3, fontSize: 14, fontWeight: 500 }}>No medical records found for this category.</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: 32, background: 'linear-gradient(135deg, #0068ff 0%, #004dc4 100%)', borderRadius: 20, padding: 24, color: '#fff', boxShadow: '0 10px 25px rgba(0,104,255,0.15)' }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 16px' }}>AI Record Summary</h3>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.9)', margin: 0 }}>
          I've analyzed Marcus Johnson's last 6 months of lab results. There's a downward trend in Creatinine levels since his diet modification in August.
        </p>
      </div>
    </div>
  );
}
