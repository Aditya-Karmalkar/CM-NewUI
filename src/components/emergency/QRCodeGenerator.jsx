import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';

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

const Chip = ({ children, color, bg }) => (
  <span style={{ display:'inline-block', fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:99, background:bg, color:color, marginRight:4, marginBottom:4 }}>
    {children}
  </span>
);

const InfoRow = ({ icon, label, children }) => (
  <div style={{ display:'flex', gap:12, padding:'12px 0', borderBottom:`1px solid ${BDR}` }}>
    <div style={{ width:28, height:28, borderRadius:7, background:BG, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:14 }}>{icon}</div>
    <div style={{ flex:1 }}>
      <div style={{ fontSize:10, fontWeight:600, letterSpacing:'0.8px', textTransform:'uppercase', color:T3, marginBottom:4 }}>{label}</div>
      {children}
    </div>
  </div>
);

const QRCodeGenerator = ({ profile, userProfile, onClose }) => {
  const [qrDataURL, setQrDataURL] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('qr'); // 'qr' | 'card'

  const patientData = {
    fullName:          userProfile?.fullName || profile?.fullName || 'Not Provided',
    bloodType:         profile?.bloodType || null,
    allergies:         profile?.allergies || [],
    emergencyContacts: profile?.emergencyContacts || [],
    medications:       profile?.medications || [],
    medicalConditions: profile?.medicalConditions || [],
  };

  useEffect(() => { generateQR(); }, [profile]);

  const generateQR = async () => {
    setLoading(true);
    try {
      const text = [
        'CURAMIND EMERGENCY PROFILE',
        '',
        `PATIENT: ${patientData.fullName}`,
        `BLOOD TYPE: ${patientData.bloodType || 'Unknown'}`,
        '',
        `ALLERGIES: ${patientData.allergies.length ? patientData.allergies.join(', ') : 'None'}`,
        '',
        `EMERGENCY CONTACTS:`,
        ...(patientData.emergencyContacts.length
          ? patientData.emergencyContacts.map(c => `  ${c.name} (${c.relationship}) - ${c.phoneNumber || c.phone}`)
          : ['  None listed']),
        '',
        `MEDICATIONS:`,
        ...(patientData.medications.length
          ? patientData.medications.map(m => `  ${m.name} ${m.dosage} - ${m.frequency}`)
          : ['  None listed']),
        '',
        `CONDITIONS: ${patientData.medicalConditions.join(', ') || 'None'}`,
        `UPDATED: ${new Date().toLocaleDateString()}`,
      ].join('\n');

      const url = await QRCode.toDataURL(text, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.95,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
        width: 500,
      });
      setQrDataURL(url);
    } catch (e) {
      toast.error('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataURL) return;
    const a = document.createElement('a');
    a.href = qrDataURL;
    a.download = 'curamind-emergency-qr.png';
    a.click();
    toast.success('QR code downloaded');
  };

  const copyData = () => {
    const payload = {
      bloodType: patientData.bloodType, allergies: patientData.allergies,
      emergencyContacts: patientData.emergencyContacts, medications: patientData.medications,
      medicalConditions: patientData.medicalConditions, lastUpdated: new Date().toISOString(),
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
      .then(() => toast.success('Data copied to clipboard'))
      .catch(() => toast.error('Failed to copy'));
  };

  const downloadCard = async () => {
    try {
      const el = document.getElementById('emergency-card-preview');
      if (!el) return;
      const canvas = await html2canvas(el, { backgroundColor: '#ffffff', scale: 2, useCORS: true });
      const a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'curamind-emergency-card.png';
      a.click();
      toast.success('Emergency card downloaded');
    } catch {
      toast.error('Failed to download card');
    }
  };

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', backdropFilter:'blur(4px)',
      display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:16,
    }}>
      <div style={{
        background:'#fff', borderRadius:20, width:'100%', maxWidth:860,
        maxHeight:'92vh', overflowY:'auto', boxShadow:'0 24px 64px rgba(0,0,0,0.18)',
        fontFamily:"'Inter',sans-serif",
      }}>
        {/* Header */}
        <div style={{ padding:'22px 28px', borderBottom:`1px solid ${BDR}`, display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:42, height:42, borderRadius:12, background:ERR_BG, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg viewBox="0 0 24 24" style={{width:20,height:20,stroke:ERR,fill:'none',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'}}>
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/>
            </svg>
          </div>
          <div>
            <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:16, fontWeight:700, color:T1, margin:0 }}>Emergency Medical QR</h2>
            <p style={{ fontSize:11, color:T3, margin:'2px 0 0' }}>Shareable emergency profile for first responders</p>
          </div>
          <button onClick={onClose}
            style={{ marginLeft:'auto', width:32, height:32, borderRadius:'50%', border:`1px solid ${BDR}`, background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:T2 }}>
            <svg viewBox="0 0 24 24" style={{width:14,height:14,stroke:'currentColor',fill:'none',strokeWidth:2.5}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        {/* Tabs */}
        <div style={{ padding:'16px 28px 0', display:'flex', gap:4 }}>
          {[['qr','📱 QR Code'],['card','🪪 Emergency Card']].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)}
              style={{ padding:'8px 18px', borderRadius:'8px 8px 0 0', border:`1px solid ${tab===id?BDR:'transparent'}`, borderBottom:tab===id?'1px solid #fff':'none', background:tab===id?'#fff':BG, color:tab===id?BLUE:T2, fontSize:12, fontWeight:tab===id?600:400, cursor:'pointer', marginBottom:tab===id?-1:0, position:'relative', zIndex:tab===id?1:0 }}>
              {label}
            </button>
          ))}
          <div style={{ flex:1, borderBottom:`1px solid ${BDR}` }}></div>
        </div>

        <div style={{ padding:28 }}>
          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 0', gap:16 }}>
              <div style={{ width:44, height:44, border:`3px solid rgba(0,104,255,0.15)`, borderTopColor:BLUE, borderRadius:'50%', animation:'spin 0.8s linear infinite' }}></div>
              <p style={{ fontSize:13, color:T3 }}>Generating QR code…</p>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          ) : tab === 'qr' ? (

            /* ─── QR TAB ─── */
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, alignItems:'start' }}>
              {/* Left: QR */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
                {/* QR frame */}
                <div style={{ position:'relative', padding:16, background:'linear-gradient(135deg,#fef2f2,#fff)', border:`2px solid ${ERR}`, borderRadius:18, boxShadow:`0 8px 32px ${ERR}20` }}>
                  {/* Corner decorations */}
                  {[{t:0,l:0},{t:0,r:0},{b:0,l:0},{b:0,r:0}].map((pos,i)=>(
                    <div key={i} style={{ position:'absolute', width:18, height:18, borderColor:ERR, borderStyle:'solid', borderRadius:2, ...Object.fromEntries(Object.entries(pos).map(([k,v])=>[k,v])), borderWidth: (pos.t===0?'2':'0')+' '+(pos.r===0?'2':'0')+' '+(pos.b===0?'2':'0')+' '+(pos.l===0?'2':'0')+'px' }}></div>
                  ))}
                  <img src={qrDataURL} alt="Emergency QR" style={{ width:210, height:210, display:'block', borderRadius:4 }} />
                  {/* Cross in center */}
                  <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:28, height:28, borderRadius:6, background:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,0.12)', display:'flex', alignItems:'center', justifyContent:'center', border:`1.5px solid ${ERR}` }}>
                    <svg viewBox="0 0 20 20" style={{width:14,height:14}}>
                      <rect x="8" y="2" width="4" height="16" fill={ERR} rx="1"/>
                      <rect x="2" y="8" width="16" height="4" fill={ERR} rx="1"/>
                    </svg>
                  </div>
                </div>

                {/* Scan tips */}
                <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:6 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, background:SUCC_BG, borderRadius:8, padding:'8px 12px' }}>
                    <span style={{ fontSize:14 }}>✅</span>
                    <span style={{ fontSize:11, color:SUCC, fontWeight:500 }}>Works with iPhone Camera & Android Camera</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, background:WARN_BG, borderRadius:8, padding:'8px 12px' }}>
                    <span style={{ fontSize:14 }}>⚠️</span>
                    <span style={{ fontSize:11, color:WARN, fontWeight:500 }}>Google Lens may search web — use phone camera instead</span>
                  </div>
                </div>

                {/* Action buttons */}
                <div style={{ display:'flex', gap:10, width:'100%' }}>
                  <button onClick={downloadQR}
                    style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:7, padding:'10px', border:'none', borderRadius:9, background:BLUE, color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    <svg viewBox="0 0 24 24" style={{width:14,height:14,stroke:'currentColor',fill:'none',strokeWidth:2.5,strokeLinecap:'round'}}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download QR
                  </button>
                  <button onClick={copyData}
                    style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:7, padding:'10px', border:`1px solid ${BDR}`, borderRadius:9, background:'#fff', color:T2, fontSize:12, fontWeight:500, cursor:'pointer' }}>
                    <svg viewBox="0 0 24 24" style={{width:14,height:14,stroke:'currentColor',fill:'none',strokeWidth:2,strokeLinecap:'round'}}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                    Copy Data
                  </button>
                </div>
              </div>

              {/* Right: Profile summary */}
              <div>
                <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:600, color:T1, marginBottom:16 }}>Profile Summary</div>

                {/* Blood type hero */}
                <div style={{ display:'flex', alignItems:'center', gap:14, background:'linear-gradient(135deg,#fef2f2,#fff0f0)', border:`1px solid ${ERR}`, borderRadius:12, padding:'14px 16px', marginBottom:14 }}>
                  <div style={{ width:48, height:48, borderRadius:12, background:ERR, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Poppins',sans-serif", fontSize:16, fontWeight:800, flexShrink:0 }}>
                    {patientData.bloodType || '?'}
                  </div>
                  <div>
                    <div style={{ fontSize:10, fontWeight:600, color:T3, textTransform:'uppercase', letterSpacing:'0.8px' }}>Blood Type</div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:700, color:ERR }}>{patientData.bloodType || 'Unknown'}</div>
                  </div>
                </div>

                <InfoRow icon="⚠️" label="Allergies">
                  {patientData.allergies.length > 0
                    ? <div>{patientData.allergies.map((a,i)=><Chip key={i} color={WARN} bg={WARN_BG}>{a}</Chip>)}</div>
                    : <span style={{ fontSize:12, color:T3 }}>None listed</span>}
                </InfoRow>

                <InfoRow icon="📞" label="Emergency Contacts">
                  {patientData.emergencyContacts.length > 0
                    ? patientData.emergencyContacts.map((c,i)=>(
                      <div key={i} style={{ marginBottom:6 }}>
                        <div style={{ fontSize:12, fontWeight:600, color:T1 }}>{c.name}</div>
                        <div style={{ fontSize:11, color:T3 }}>{c.relationship} · <span style={{ color:BLUE, fontFamily:'monospace' }}>{c.phoneNumber||c.phone}</span></div>
                      </div>
                    ))
                    : <span style={{ fontSize:12, color:T3 }}>None listed</span>}
                </InfoRow>

                <InfoRow icon="💊" label="Medications">
                  {patientData.medications.length > 0
                    ? patientData.medications.map((m,i)=>(
                      <div key={i} style={{ marginBottom:4, fontSize:12, color:T1 }}>{m.name} <span style={{ color:T3 }}>{m.dosage}</span></div>
                    ))
                    : <span style={{ fontSize:12, color:T3 }}>None listed</span>}
                </InfoRow>

                <InfoRow icon="🩺" label="Medical Conditions">
                  {patientData.medicalConditions.length > 0
                    ? <div>{patientData.medicalConditions.map((c,i)=><Chip key={i} color="#7c3aed" bg="#f5f3ff">{c}</Chip>)}</div>
                    : <span style={{ fontSize:12, color:T3 }}>None listed</span>}
                </InfoRow>

                <div style={{ paddingTop:10, fontSize:10, color:T3, textAlign:'right' }}>
                  Last updated: {new Date().toLocaleDateString('en-IN', {day:'numeric',month:'long',year:'numeric'})}
                </div>
              </div>
            </div>

          ) : (

            /* ─── CARD TAB ─── */
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
              {/* Download button */}
              <button onClick={downloadCard}
                style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 22px', border:'none', borderRadius:9, background:BLUE, color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                <svg viewBox="0 0 24 24" style={{width:14,height:14,stroke:'currentColor',fill:'none',strokeWidth:2.5,strokeLinecap:'round'}}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Emergency Card (PNG)
              </button>

              {/* Card preview */}
              <div id="emergency-card-preview" style={{
                background:'#fff', border:`2.5px solid ${ERR}`, borderRadius:18,
                width:380, padding:24, boxShadow:`0 8px 40px ${ERR}18`,
                fontFamily:"'Inter',sans-serif",
              }}>
                {/* Card header */}
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:18, paddingBottom:14, borderBottom:`2px solid ${ERR}` }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:ERR, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg viewBox="0 0 24 24" style={{width:18,height:18,stroke:'#fff',fill:'none',strokeWidth:2.5,strokeLinecap:'round'}}>
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:800, color:ERR, letterSpacing:'0.5px' }}>EMERGENCY MEDICAL INFO</div>
                    <div style={{ fontSize:9, color:T3, letterSpacing:'0.5px', textTransform:'uppercase' }}>CuraMind · Healthcare Platform</div>
                  </div>
                  {qrDataURL && <img src={qrDataURL} alt="QR" style={{ width:50, height:50, marginLeft:'auto', borderRadius:4, border:`1px solid ${BDR}` }} />}
                </div>

                {/* Blood type */}
                <div style={{ display:'flex', alignItems:'center', gap:10, background:'linear-gradient(135deg,#fef2f2,#fff0f4)', borderRadius:10, padding:'10px 14px', marginBottom:12, border:`1px solid ${ERR}30` }}>
                  <div style={{ width:38, height:38, borderRadius:9, background:ERR, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Poppins',sans-serif", fontSize:14, fontWeight:800, flexShrink:0 }}>
                    {patientData.bloodType || '?'}
                  </div>
                  <div>
                    <div style={{ fontSize:9, fontWeight:600, color:T3, textTransform:'uppercase', letterSpacing:'0.7px' }}>Blood Type</div>
                    <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:15, fontWeight:700, color:ERR }}>{patientData.bloodType || 'Unknown'}</div>
                  </div>
                </div>

                {/* Allergies */}
                {patientData.allergies.length > 0 && (
                  <div style={{ marginBottom:10, padding:'10px 14px', background:WARN_BG, borderRadius:9, border:`1px solid ${WARN}30` }}>
                    <div style={{ fontSize:9, fontWeight:700, color:WARN, textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:5 }}>⚠️ Allergies</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                      {patientData.allergies.map((a,i)=>(
                        <span key={i} style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:99, background:WARN, color:'#fff' }}>{a}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emergency contacts */}
                {patientData.emergencyContacts.length > 0 && (
                  <div style={{ marginBottom:10, padding:'10px 14px', background:SUCC_BG, borderRadius:9, border:`1px solid ${SUCC}30` }}>
                    <div style={{ fontSize:9, fontWeight:700, color:SUCC, textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:6 }}>📞 Emergency Contacts</div>
                    {patientData.emergencyContacts.map((c,i)=>(
                      <div key={i} style={{ marginBottom:4 }}>
                        <span style={{ fontSize:11, fontWeight:600, color:T1 }}>{c.name}</span>
                        <span style={{ fontSize:10, color:T3 }}> · {c.relationship}</span>
                        <div style={{ fontSize:11, fontWeight:600, color:SUCC, fontFamily:'monospace' }}>{c.phoneNumber||c.phone}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Medications */}
                {patientData.medications.length > 0 && (
                  <div style={{ marginBottom:10, padding:'10px 14px', background:BLUE_FAINT||'rgba(0,104,255,0.06)', borderRadius:9, border:`1px solid rgba(0,104,255,0.15)` }}>
                    <div style={{ fontSize:9, fontWeight:700, color:BLUE, textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:5 }}>💊 Current Medications</div>
                    {patientData.medications.map((m,i)=>(
                      <div key={i} style={{ fontSize:11, color:T2, marginBottom:2 }}>• {m.name} <span style={{ color:T3 }}>{m.dosage}</span></div>
                    ))}
                  </div>
                )}

                {/* Conditions */}
                {patientData.medicalConditions.length > 0 && (
                  <div style={{ marginBottom:10, padding:'10px 14px', background:'#f5f3ff', borderRadius:9, border:'1px solid rgba(124,58,237,0.15)' }}>
                    <div style={{ fontSize:9, fontWeight:700, color:'#7c3aed', textTransform:'uppercase', letterSpacing:'0.7px', marginBottom:5 }}>🩺 Medical Conditions</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                      {patientData.medicalConditions.map((c,i)=>(
                        <span key={i} style={{ fontSize:10, padding:'2px 8px', borderRadius:99, background:'#7c3aed', color:'#fff', fontWeight:600 }}>{c}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div style={{ borderTop:`1px dashed ${BDR}`, paddingTop:10, marginTop:4, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontSize:9, color:T3 }}>Updated: {new Date().toLocaleDateString('en-IN')}</span>
                  <span style={{ fontSize:9, color:BLUE, fontWeight:600 }}>CuraMind.app</span>
                </div>
              </div>

              <p style={{ fontSize:11, color:T3, textAlign:'center' }}>Download as PNG to print or share with your doctor</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;