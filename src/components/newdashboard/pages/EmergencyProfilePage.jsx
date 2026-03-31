import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';
import QRCodeGenerator from '../../emergency/QRCodeGenerator';
import QRCodeScanner from '../../emergency/QRCodeScanner';
import PatientDataDisplay from '../../emergency/PatientDataDisplay';

const BLUE       = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BLUE_SOFT  = 'rgba(0,104,255,0.14)';
const BG         = '#f8fafc';
const BDR        = '#edeef1';
const BDR2       = '#e2e8f0';
const T1         = '#111111';
const T2         = '#595959';
const T3         = '#a0a0a0';
const SUCC       = '#16a34a';
const ERR        = '#ef4444';
const ERR_BG     = '#fef2f2';

export default function EmergencyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showQRGen, setShowQRGen] = useState(false);
  const [showQRScan, setShowQRScan] = useState(false);
  const [showPatient, setShowPatient] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [form, setForm] = useState({ blood_type:'', allergies:'', medications:'', medical_conditions:'', emergency_contact_name:'', emergency_contact_phone:'', emergency_contact_relation:'', notes:'' });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const { data:{ session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase.from('emergency_profiles').select('*').eq('user_id', session.user.id).single();
    if (data) {
      setProfile(data);
      setForm({
        blood_type: data.blood_type || '',
        allergies: Array.isArray(data.allergies) ? data.allergies.join(', ') : data.allergies || '',
        medications: Array.isArray(data.medications) ? data.medications.join(', ') : data.medications || '',
        medical_conditions: Array.isArray(data.medical_conditions) ? data.medical_conditions.join(', ') : data.medical_conditions || '',
        emergency_contact_name: data.emergency_contacts?.[0]?.name || '',
        emergency_contact_phone: data.emergency_contacts?.[0]?.phone || data.emergency_contacts?.[0]?.phoneNumber || '',
        emergency_contact_relation: data.emergency_contacts?.[0]?.relationship || '',
        notes: data.notes || '',
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { data:{ session } } = await supabase.auth.getSession();
    const payload = {
      user_id: session.user.id,
      blood_type: form.blood_type,
      allergies: form.allergies.split(',').map(s=>s.trim()).filter(Boolean),
      medications: form.medications.split(',').map(s=>s.trim()).filter(Boolean),
      medical_conditions: form.medical_conditions.split(',').map(s=>s.trim()).filter(Boolean),
      emergency_contacts: [{ name:form.emergency_contact_name, phone:form.emergency_contact_phone, relationship:form.emergency_contact_relation }],
      notes: form.notes,
    };
    if (profile?.id) {
      await supabase.from('emergency_profiles').update(payload).eq('id', profile.id);
    } else {
      await supabase.from('emergency_profiles').insert(payload);
    }
    await fetchProfile();
    setSaving(false);
  };

  const qrProfile = {
    bloodType: form.blood_type,
    allergies: form.allergies.split(',').map(s=>s.trim()).filter(Boolean),
    medications: form.medications.split(',').map(s=>s.trim()).filter(Boolean),
    medicalConditions: form.medical_conditions.split(',').map(s=>s.trim()).filter(Boolean),
    emergencyContacts: [{ name:form.emergency_contact_name, phoneNumber:form.emergency_contact_phone, relationship:form.emergency_contact_relation }],
  };

  const BLOOD_TYPES = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'flex', alignItems:'center' }}>
        <div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:700, color:T1, margin:0 }}>Emergency Profile</h2>
          <p style={{ fontSize:12, color:T3, margin:'2px 0 0' }}>Critical info for first responders</p>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:10 }}>
          <button onClick={()=>setShowQRScan(true)}
            style={{ display:'flex', alignItems:'center', gap:7, background:'#fff', color:T2, border:`1px solid ${BDR2}`, borderRadius:8, padding:'8px 14px', fontSize:12, cursor:'pointer' }}>
            <svg viewBox="0 0 24 24" style={{width:13,height:13,stroke:'currentColor',fill:'none',strokeWidth:2}}><rect x="3" y="3" width="5" height="5"/><rect x="16" y="3" width="5" height="5"/><rect x="3" y="16" width="5" height="5"/><path d="M21 16h-5v5M16 16v0M21 21v0"/></svg>
            Scan QR
          </button>
          <button onClick={()=>setShowQRGen(true)}
            style={{ display:'flex', alignItems:'center', gap:7, background:BLUE, color:'#fff', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
            <svg viewBox="0 0 24 24" style={{width:13,height:13,stroke:'currentColor',fill:'none',strokeWidth:2}}><rect x="5" y="2" width="14" height="20" rx="2"/></svg>
            Generate QR
          </button>
        </div>
      </div>

      {/* Emergency warning */}
      <div style={{ background:ERR_BG, border:`1px solid ${ERR}`, borderRadius:12, padding:'12px 16px', display:'flex', gap:10, alignItems:'center' }}>
        <span style={{ fontSize:18 }}>🆘</span>
        <span style={{ fontSize:12, color:ERR, fontWeight:500 }}>This information will be shown to first responders in case of emergency. Keep it accurate and up-to-date.</span>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:40, color:T3 }}>Loading profile…</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          {/* Medical info */}
          <div style={{ background:'#fff', border:`1px solid ${BDR}`, borderRadius:14, padding:22 }}>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:600, color:T1, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
              🩺 Medical Information
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:8 }}>Blood Type</label>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {BLOOD_TYPES.map(bt=>(
                  <button key={bt} onClick={()=>setForm({...form,blood_type:bt})}
                    style={{ padding:'6px 12px', borderRadius:8, border:`1.5px solid ${form.blood_type===bt?ERR:BDR2}`, background:form.blood_type===bt?ERR_BG:'#fff', color:form.blood_type===bt?ERR:T2, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    {bt}
                  </button>
                ))}
              </div>
            </div>

            {[
              { label:'Allergies (comma-separated)', key:'allergies', placeholder:'Penicillin, Peanuts, Latex' },
              { label:'Current Medications', key:'medications', placeholder:'Amlodipine 5mg, Metformin 500mg' },
              { label:'Medical Conditions', key:'medical_conditions', placeholder:'Hypertension, Type 2 Diabetes' },
              { label:'Additional Notes', key:'notes', placeholder:'Pacemaker fitted 2022, Donor' },
            ].map(f=>(
              <div key={f.key} style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>{f.label}</label>
                <input type="text" value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.placeholder}
                  style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none', fontFamily:"'Inter',sans-serif", boxSizing:'border-box' }} />
              </div>
            ))}
          </div>

          {/* Emergency contact */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ background:'#fff', border:`1px solid ${BDR}`, borderRadius:14, padding:22 }}>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:600, color:T1, marginBottom:16 }}>
                📞 Emergency Contact
              </div>
              {[
                { label:'Contact Name', key:'emergency_contact_name', placeholder:'Jane Doe' },
                { label:'Phone Number', key:'emergency_contact_phone', placeholder:'+91-98765-43210' },
                { label:'Relationship', key:'emergency_contact_relation', placeholder:'Spouse / Parent / Sibling' },
              ].map(f=>(
                <div key={f.key} style={{ marginBottom:14 }}>
                  <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>{f.label}</label>
                  <input type="text" value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.placeholder}
                    style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none', fontFamily:"'Inter',sans-serif", boxSizing:'border-box' }} />
                </div>
              ))}
            </div>

            {/* QR preview card */}
            <div style={{ background:BLUE, borderRadius:14, padding:22, color:'#fff' }}>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:700, color:'#fff', marginBottom:6 }}>Emergency QR Code</div>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)', margin:'0 0 14px' }}>Generate a QR that encodes your emergency profile. First responders can scan it without internet.</p>
              <button onClick={()=>setShowQRGen(true)}
                style={{ width:'100%', background:'rgba(255,255,255,0.15)', border:'none', borderRadius:8, padding:'10px', fontSize:12, fontWeight:600, color:'#fff', cursor:'pointer' }}>
                Generate QR Code
              </button>
            </div>

            <button onClick={handleSave} disabled={saving}
              style={{ padding:'12px', border:'none', borderRadius:10, background:BLUE, color:'#fff', fontSize:13, fontWeight:600, cursor:saving?'not-allowed':'pointer', fontFamily:"'Inter',sans-serif" }}>
              {saving ? 'Saving…' : '💾 Save Emergency Profile'}
            </button>
          </div>
        </div>
      )}

      {showQRGen && <QRCodeGenerator profile={qrProfile} onClose={()=>setShowQRGen(false)} />}
      {showQRScan && <QRCodeScanner onClose={()=>setShowQRScan(false)} onDataReceived={d=>{setScannedData(d);setShowQRScan(false);setShowPatient(true);}} />}
      {showPatient && scannedData && <PatientDataDisplay patientData={scannedData} onClose={()=>{setShowPatient(false);setScannedData(null);}} onDownloadPDF={()=>{}} />}
    </div>
  );
}
