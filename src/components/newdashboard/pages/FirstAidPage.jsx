import React, { useState } from 'react';

const BLUE       = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BG         = '#f8fafc';
const BDR        = '#edeef1';
const T1         = '#111111';
const T2         = '#595959';
const T3         = '#a0a0a0';
const ERR        = '#ef4444';
const ERR_BG     = '#fef2f2';
const SUCC       = '#16a34a';
const SUCC_BG    = '#f0fdf4';
const WARN       = '#d97706';
const WARN_BG    = '#fffbeb';

const guides = [
  {
    id:'cpr', title:'CPR Guide', sub:'Cardiopulmonary Resuscitation', icon:'❤️‍🔥', color:ERR, bg:ERR_BG,
    steps:[
      'Ensure the scene is safe — check for dangers.',
      'Check for responsiveness — tap shoulders and shout.',
      'Call emergency services (112 / 108) immediately.',
      'Position the person on their back on a firm surface.',
      'Place heel of hand on centre of chest (lower half of sternum).',
      'Interlock fingers. Keep arms straight.',
      'Push down hard and fast — 5–6 cm depth, 100–120 compressions/min.',
      'After 30 compressions, give 2 rescue breaths (if trained).',
      'Continue until help arrives or person shows signs of life.',
    ]
  },
  {
    id:'choking', title:'Choking Response', sub:'Heimlich Manoeuvre', icon:'🫁', color:WARN, bg:WARN_BG,
    steps:[
      'Ask "Are you choking?" — if yes, tell them you will help.',
      'Encourage coughing if they can still cough forcefully.',
      'Stand behind the person; lean them slightly forward.',
      'Give 5 firm back blows between shoulder blades with heel of hand.',
      'Give 5 abdominal thrusts — fist above navel, sharp inward-upward pull.',
      'Alternate back blows and abdominal thrusts.',
      'If unconscious, start CPR and call emergency services.',
    ]
  },
  {
    id:'wound', title:'Wound Care', sub:'Cuts & Bleeding', icon:'🩹', color:BLUE, bg:BLUE_FAINT,
    steps:[
      'Wash your hands or use gloves before touching the wound.',
      'Apply direct pressure with a clean cloth or bandage.',
      'Elevate the injured area above heart level if possible.',
      'Maintain pressure for at least 10–15 minutes without lifting.',
      'Clean wound gently with clean water once bleeding stops.',
      'Apply antiseptic and cover with a sterile bandage.',
      'Seek medical care for deep, gaping, or contaminated wounds.',
    ]
  },
  {
    id:'burns', title:'Burns First Aid', sub:'Heat & Chemical Burns', icon:'🔥', color:WARN, bg:WARN_BG,
    steps:[
      'Remove the source of burn — stop exposure immediately.',
      'Cool the burn with cool (not ice cold) running water for 20 minutes.',
      'Do NOT use ice, butter, or toothpaste.',
      'Remove jewellery/tight clothing near the burn if possible.',
      'Cover loosely with cling film or clean non-fluffy material.',
      'Do NOT burst blisters.',
      'Seek medical care for burns larger than 3cm or on face/hands.',
    ]
  },
  {
    id:'stroke', title:'Stroke Recognition', sub:'FAST Method', icon:'🧠', color:'#7c3aed', bg:'#f5f3ff',
    steps:[
      'FACE — Ask person to smile. Is one side drooping?',
      'ARMS — Ask them to raise both arms. Does one drift down?',
      'SPEECH — Ask a simple sentence. Is speech slurred or strange?',
      'TIME — If ANY sign, call emergency services (112) immediately.',
      'Note the time symptoms started — critical for treatment.',
      'Keep person calm; do NOT give food or water.',
      'Stay with them until emergency services arrive.',
    ]
  },
  {
    id:'fracture', title:'Fracture / Sprain', sub:'Bone & Joint Injuries', icon:'🦴', color:T2, bg:BG,
    steps:[
      'RICE: Rest — stop using the injured part immediately.',
      'Ice — apply wrapped ice/cold pack for 20 min every 2 hours.',
      'Compression — wrap with bandage to reduce swelling.',
      'Elevation — raise the injured limb above heart level.',
      'Immobilize fractures with a improvised splint if needed.',
      'Do NOT try to straighten a broken bone.',
      'Seek immediate medical care for severe pain or deformity.',
    ]
  },
];

export default function FirstAidCoachPage() {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = guides.filter(g =>
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    g.sub.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) {
    const g = guides.find(x=>x.id===selected);
    return (
      <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
        <button onClick={()=>setSelected(null)}
          style={{ display:'flex', alignItems:'center', gap:8, border:'none', background:'transparent', cursor:'pointer', color:BLUE, fontSize:13, fontWeight:500, padding:0 }}>
          <svg viewBox="0 0 24 24" style={{width:14,height:14,stroke:'currentColor',fill:'none',strokeWidth:2,strokeLinecap:'round'}}><polyline points="15 18 9 12 15 6"/></svg>
          Back to all guides
        </button>
        <div style={{ background:'#fff', border:`1px solid ${BDR}`, borderRadius:14, padding:28 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
            <div style={{ width:52, height:52, borderRadius:14, background:g.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>{g.icon}</div>
            <div>
              <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:700, color:T1, margin:0 }}>{g.title}</h2>
              <p style={{ fontSize:12, color:T3, margin:'2px 0 0' }}>{g.sub}</p>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
              <span style={{ fontSize:11, fontWeight:600, padding:'4px 10px', borderRadius:99, background:ERR_BG, color:ERR }}>⚠ Emergency</span>
              <span style={{ fontSize:11, fontWeight:500, padding:'4px 10px', borderRadius:99, background:SUCC_BG, color:SUCC }}>Verified</span>
            </div>
          </div>

          {/* Emergency banner */}
          <div style={{ background:ERR_BG, border:`1px solid ${ERR}`, borderRadius:10, padding:'12px 16px', marginBottom:20, display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ fontSize:18 }}>🚨</span>
            <span style={{ fontSize:12, color:ERR, fontWeight:500 }}>Always call emergency services (112 / 108) first in a life-threatening situation. This guide supplements — it does not replace — professional medical care.</span>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {g.steps.map((step, i) => (
              <div key={i} style={{ display:'flex', gap:14, padding:'14px 16px', background:BG, borderRadius:10, border:`1px solid ${BDR}` }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:g.color, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, flexShrink:0 }}>
                  {i+1}
                </div>
                <p style={{ margin:0, fontSize:13, color:T1, lineHeight:1.6, paddingTop:4 }}>{step}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop:20, padding:'14px 16px', background:BLUE_FAINT, borderRadius:10, fontSize:12, color:BLUE }}>
            💡 <strong>Tip:</strong> Practise these steps in a certified first-aid training course. Knowledge retention is significantly higher with hands-on training.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div>
        <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:700, color:T1, margin:0 }}>Virtual First-Aid Coach</h2>
        <p style={{ fontSize:12, color:T3, margin:'2px 0 0' }}>Step-by-step guides for common emergencies</p>
      </div>

      {/* Emergency banner */}
      <div style={{ background:ERR_BG, border:`1px solid ${ERR}`, borderRadius:12, padding:'14px 18px', display:'flex', gap:12, alignItems:'center' }}>
        <span style={{ fontSize:24 }}>🚨</span>
        <div>
          <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:700, color:ERR }}>Life-threatening emergency?</div>
          <p style={{ fontSize:12, color:ERR, margin:'2px 0 0' }}>Call <strong>112</strong> (India) or <strong>108</strong> (Ambulance) immediately. Do not rely on this guide alone.</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:`1px solid ${BDR}`, borderRadius:99, padding:'8px 16px', maxWidth:340 }}>
        <svg viewBox="0 0 24 24" style={{width:13,height:13,stroke:T3,fill:'none',strokeWidth:2}}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search first-aid guides…"
          style={{ border:'none', background:'transparent', fontSize:12, color:T1, outline:'none', flex:1 }} />
      </div>

      {/* Guides grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:14 }}>
        {filtered.map(g => (
          <button key={g.id} onClick={()=>setSelected(g.id)}
            style={{ background:'#fff', border:`1px solid ${BDR}`, borderRadius:14, padding:20, cursor:'pointer', textAlign:'left', transition:'border-color .15s, box-shadow .15s', display:'flex', alignItems:'center', gap:14 }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=g.color;e.currentTarget.style.boxShadow=`0 4px 16px ${g.color}22`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=BDR;e.currentTarget.style.boxShadow='none';}}>
            <div style={{ width:44, height:44, borderRadius:12, background:g.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{g.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:T1 }}>{g.title}</div>
              <div style={{ fontSize:11, color:T3, marginTop:2 }}>{g.sub}</div>
              <div style={{ fontSize:10, color:BLUE, marginTop:6 }}>{g.steps.length} steps →</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
