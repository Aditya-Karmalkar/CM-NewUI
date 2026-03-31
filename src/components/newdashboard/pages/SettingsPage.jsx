import React, { useState } from 'react';
import { supabase } from '../../../supabase';
import { auth } from '../../../firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Bell, ShieldCheck, Shield, Palette, BarChart, AlertTriangle, Download, Trash2 } from 'lucide-react';

const BLUE       = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BG         = '#f8fafc';
const BDR        = '#edeef1';
const BDR2       = '#e2e8f0';
const T1         = '#111111';
const T2         = '#595959';
const T3         = '#a0a0a0';
const SUCC       = '#16a34a';
const SUCC_BG    = '#f0fdf4';
const ERR        = '#ef4444';
const ERR_BG     = '#fef2f2';
const WARN       = '#d97706';
const WARN_BG    = '#fffbeb';

const ToggleSwitch = ({ enabled, onChange }) => (
  <button onClick={()=>onChange(!enabled)}
    style={{ width:40, height:22, borderRadius:99, background:enabled?BLUE:'#e5e7eb', border:'none', cursor:'pointer', position:'relative', transition:'background .2s', flexShrink:0 }}>
    <div style={{ position:'absolute', top:3, left:enabled?20:3, width:16, height:16, borderRadius:'50%', background:'#fff', transition:'left .2s', boxShadow:'0 1px 4px rgba(0,0,0,0.15)' }} />
  </button>
);

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('notifications');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState('');
  const [pwForm, setPwForm] = useState({ current:'', new:'', confirm:'' });
  const [pwError, setPwError] = useState('');
  const [notifs, setNotifs] = useState({ appointments:true, medications:true, goals:false, reports:true, emergency:true });
  const [privacy, setPrivacy] = useState({ shareWithDoctors:true, anonymousAnalytics:false, dataExport:false });
  const [display, setDisplay] = useState({ language:'English (India)', dateFormat:'DD/MM/YYYY', timeFormat:'12h', units:'metric' });

  const handleToggle = (key) => setNotifs(prev => ({ ...prev, [key]: !prev[key] }));
  const handlePrivacy = (key) => setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));

  const handleChangePassword = async () => {
    setPwError('');
    if (pwForm.new !== pwForm.confirm) { setPwError('Passwords do not match'); return; }
    if (pwForm.new.length < 8) { setPwError('Password must be at least 8 characters'); return; }
    setSaving(true);
    try {
      const cred = EmailAuthProvider.credential(auth.currentUser.email, pwForm.current);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await updatePassword(auth.currentUser, pwForm.new);
      setSaved('password');
      setPwForm({ current:'', new:'', confirm:'' });
    } catch (e) {
      setPwError(e.message || 'Failed to update password');
    } finally {
      setSaving(false);
      setTimeout(()=>setSaved(''), 3000);
    }
  };

  const Section = ({ id, title, children }) => (
    <div id={id} style={{ background:'#fff', border:`1px solid ${BDR}`, borderRadius:14, padding:22, marginBottom:14 }}>
      <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:600, color:T1, marginBottom:16, paddingBottom:12, borderBottom:`1px solid ${BDR}` }}>{title}</div>
      {children}
    </div>
  );

  const Row = ({ label, desc, children }) => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:`1px solid ${BDR}` }}>
      <div>
        <div style={{ fontSize:12, fontWeight:500, color:T1 }}>{label}</div>
        {desc && <div style={{ fontSize:11, color:T3, marginTop:1 }}>{desc}</div>}
      </div>
      {children}
    </div>
  );

  const SIDEBAR = [
    { id:'notifications', label:'Notifications', icon:<Bell size={14}/> },
    { id:'security',      label:'Security',      icon:<ShieldCheck size={14}/> },
    { id:'privacy',       label:'Privacy',       icon:<Shield size={14}/> },
    { id:'display',       label:'Display',       icon:<Palette size={14}/> },
    { id:'data',          label:'Data & Export', icon:<BarChart size={14}/> },
    { id:'danger',        label:'Danger Zone',   icon:<AlertTriangle size={14}/> },
  ];

  return (
    <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>
      {/* Sidebar */}
      <div style={{ width:180, flexShrink:0, background:'#fff', border:`1px solid ${BDR}`, borderRadius:14, padding:12 }}>
        {SIDEBAR.map(s=>(
          <button key={s.id} onClick={()=>setActiveSection(s.id)}
            style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'9px 10px', borderRadius:8, border:'none', background:activeSection===s.id?BLUE_FAINT:'transparent', color:activeSection===s.id?BLUE:T2, fontSize:12, fontWeight:activeSection===s.id?600:400, cursor:'pointer', textAlign:'left', marginBottom:2 }}>
            <span style={{ fontSize:14 }}>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1 }}>
        <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:700, color:T1, margin:'0 0 16px' }}>Settings</h2>

        {activeSection==='notifications' && (
          <Section title="Notification Preferences">
            {[
              { key:'appointments', label:'Appointment Reminders', desc:'Get reminded 24h before scheduled appointments' },
              { key:'medications',  label:'Medication Alerts',     desc:'Daily reminders for your medication schedule' },
              { key:'goals',        label:'Goal Progress Updates',  desc:'Weekly summary of your health goals' },
              { key:'reports',      label:'Health Reports',        desc:'When new lab results or reports are available' },
              { key:'emergency',    label:'Emergency Alerts',      desc:'Critical health alerts and warnings' },
            ].map(n=>(
              <Row key={n.key} label={n.label} desc={n.desc}>
                <ToggleSwitch enabled={notifs[n.key]} onChange={()=>handleToggle(n.key)} />
              </Row>
            ))}
          </Section>
        )}

        {activeSection==='security' && (
          <Section title="Security">
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>Current Password</label>
              <input type="password" value={pwForm.current} onChange={e=>setPwForm({...pwForm,current:e.target.value})}
                style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none', boxSizing:'border-box' }} />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>New Password</label>
                <input type="password" value={pwForm.new} onChange={e=>setPwForm({...pwForm,new:e.target.value})}
                  style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none', boxSizing:'border-box' }} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>Confirm New Password</label>
                <input type="password" value={pwForm.confirm} onChange={e=>setPwForm({...pwForm,confirm:e.target.value})}
                  style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none', boxSizing:'border-box' }} />
              </div>
            </div>
            {pwError && <div style={{ fontSize:11, color:ERR, marginBottom:10 }}>{pwError}</div>}
            {saved==='password' && <div style={{ fontSize:11, color:SUCC, marginBottom:10 }}>✓ Password updated successfully</div>}
            <button onClick={handleChangePassword} disabled={saving||!pwForm.current||!pwForm.new}
              style={{ padding:'9px 20px', border:'none', borderRadius:8, background:BLUE, color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>
              {saving?'Updating…':'Update Password'}
            </button>
          </Section>
        )}

        {activeSection==='privacy' && (
          <Section title="Privacy & Data">
            {[
              { key:'shareWithDoctors', label:'Share with Doctors', desc:'Allow your care team to view your health dashboard' },
              { key:'anonymousAnalytics', label:'Anonymous Analytics', desc:'Help improve CuraMind by sharing anonymous usage data' },
            ].map(p=>(
              <Row key={p.key} label={p.label} desc={p.desc}>
                <ToggleSwitch enabled={privacy[p.key]} onChange={()=>handlePrivacy(p.key)} />
              </Row>
            ))}
          </Section>
        )}

        {activeSection==='display' && (
          <Section title="Display Preferences">
            {[
              { label:'Language', key:'language', options:['English (India)','हिन्दी','Marathi','Tamil','Telugu'] },
              { label:'Date Format', key:'dateFormat', options:['DD/MM/YYYY','MM/DD/YYYY','YYYY-MM-DD'] },
              { label:'Time Format', key:'timeFormat', options:['12h','24h'] },
              { label:'Units', key:'units', options:['metric','imperial'] },
            ].map(d=>(
              <div key={d.key} style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>{d.label}</label>
                <select value={display[d.key]} onChange={e=>setDisplay({...display,[d.key]:e.target.value})}
                  style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none' }}>
                  {d.options.map(o=><option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </Section>
        )}

        {activeSection==='data' && (
          <Section title="Data & Export">
            <div style={{ background:BG, borderRadius:10, padding:16, marginBottom:14 }}>
              <div style={{ fontSize:12, fontWeight:500, color:T1, marginBottom:4 }}>Export all health data</div>
              <div style={{ fontSize:11, color:T3, marginBottom:12 }}>Download a complete export of your health records, metrics, appointments and medications.</div>
              <button style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', border:`1px solid ${BDR2}`, borderRadius:8, background:'#fff', color:T2, fontSize:12, cursor:'pointer' }}>
                <Download size={14}/> Download Data (JSON)
              </button>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:WARN_BG, border:`1px solid ${WARN}`, borderRadius:10, padding:14, fontSize:12, color:WARN }}>
              <AlertTriangle size={16}/> Data export may take a few minutes. You'll receive a download link via email.
            </div>
          </Section>
        )}

        {activeSection==='danger' && (
          <Section title="Danger Zone">
            <div style={{ background:ERR_BG, border:`1px solid ${ERR}`, borderRadius:10, padding:16 }}>
              <div style={{ fontSize:12, fontWeight:600, color:ERR, marginBottom:4 }}>Delete Account</div>
              <div style={{ fontSize:11, color:ERR, marginBottom:12 }}>This will permanently delete your account and all associated data. This action cannot be undone.</div>
              <button style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 16px', border:`1px solid ${ERR}`, borderRadius:8, background:'#fff', color:ERR, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                <Trash2 size={14}/> Delete My Account
              </button>
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}
