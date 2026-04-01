import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';
import { auth } from '../../../firebase';
import { updateProfile } from 'firebase/auth';

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
const SUCC_BG    = '#f0fdf4';
const ERR        = '#ef4444';
const ERR_BG     = '#fef2f2';

export default function ProfilePage({ onSignOut }) {
  const [user, setUser] = useState(null);
  const [supaUser, setSupaUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ full_name:'', phone:'', date_of_birth:'', gender:'', address:'', occupation:'' });

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (u) => {
      if (u) {
        setUser(u);
        // Fetch from supabase users table
        const { data:{ session } } = await supabase.auth.getSession();
        if (session) {
          const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single();
          if (data) {
            setSupaUser(data);
            setForm({ full_name:data.full_name||u.displayName||'', phone:data.phone||'', date_of_birth:data.date_of_birth||'', gender:data.gender||'', address:data.address||'', occupation:data.occupation||'' });
          } else {
            setForm(f=>({ ...f, full_name: u.displayName||'' }));
          }
        }
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { data:{ session } } = await supabase.auth.getSession();
    const payload = { ...form, updated_at: new Date().toISOString() };
    if (supaUser?.id) {
      await supabase.from('users').update(payload).eq('id', session.user.id);
    } else {
      await supabase.from('users').insert({ ...payload, id: session.user.id, email: user?.email });
    }
    // Update Firebase display name
    if (auth.currentUser && form.full_name) {
      try { await updateProfile(auth.currentUser, { displayName: form.full_name }); } catch {}
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = (form.full_name || user?.displayName || user?.email || 'U').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();

  const Section = ({ title, children }) => (
    <div style={{ background:'#fff', border:`1px solid ${BDR}`, borderRadius:14, padding:22, marginBottom:14 }}>
      <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:600, color:T1, marginBottom:16, paddingBottom:12, borderBottom:`1px solid ${BDR}` }}>{title}</div>
      {children}
    </div>
  );

  const Field = ({ label, fkey, type='text', placeholder, options }) => (
    <div style={{ marginBottom:14 }}>
      <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>{label}</label>
      {options ? (
        <select value={form[fkey]} onChange={e=>setForm({...form,[fkey]:e.target.value})}
          style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none', fontFamily:"'Inter',sans-serif" }}>
          <option value="">Select…</option>
          {options.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[fkey]} onChange={e=>setForm({...form,[fkey]:e.target.value})} placeholder={placeholder}
          style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none', fontFamily:"'Inter',sans-serif", boxSizing:'border-box' }} />
      )}
    </div>
  );

  if (loading) return <div style={{ textAlign:'center', padding:40, color:T3, fontSize:13 }}>Loading profile…</div>;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0, maxWidth:700 }}>
      <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:700, color:T1, margin:'0 0 18px' }}>My Profile</h2>

      {/* Avatar card */}
      <div style={{ background:'#fff', border:`1px solid ${BDR}`, borderRadius:14, padding:22, marginBottom:14, display:'flex', alignItems:'center', gap:20 }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:BLUE_SOFT, color:BLUE, fontSize:22, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          {user?.photoURL
            ? <img src={user.photoURL} alt="avatar" style={{width:64,height:64,borderRadius:'50%',objectFit:'cover'}} />
            : initials}
        </div>
        <div>
          <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:15, fontWeight:700, color:T1 }}>{form.full_name || user?.displayName || 'User'}</div>
          <div style={{ fontSize:12, color:T3, marginTop:2 }}>{user?.email}</div>
          <div style={{ fontSize:10, color:T3, marginTop:2 }}>Member since {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-US',{month:'long',year:'numeric'}) : '—'}</div>
        </div>
        <div style={{ marginLeft:'auto' }}>
          <span style={{ fontSize:10, fontWeight:700, padding:'3px 10px', borderRadius:99, background:SUCC_BG, color:SUCC }}>● Verified</span>
        </div>
      </div>

      <Section title="Personal Information">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <Field label="Full Name" fkey="full_name" placeholder="Your full name" />
          <Field label="Phone Number" fkey="phone" type="tel" placeholder="+91-98765-43210" />
          <Field label="Date of Birth" fkey="date_of_birth" type="date" placeholder="" />
          <Field label="Gender" fkey="gender" options={['Male','Female','Non-binary','Prefer not to say']} />
        </div>
        <Field label="Address" fkey="address" placeholder="City, State, Country" />
        <Field label="Occupation" fkey="occupation" placeholder="What do you do?" />
      </Section>

      <Section title="Account Information">
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>Email Address</label>
            <div style={{ padding:'9px 12px', background:BG, border:`1px solid ${BDR}`, borderRadius:8, fontSize:12, color:T3 }}>{user?.email}</div>
          </div>
          <div>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>Auth Provider</label>
            <div style={{ padding:'9px 12px', background:BG, border:`1px solid ${BDR}`, borderRadius:8, fontSize:12, color:T3 }}>{user?.providerData?.[0]?.providerId || 'Email/Password'}</div>
          </div>
        </div>
      </Section>

      <Section title="Account Security">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 0' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T1 }}>Sign Out</div>
            <div style={{ fontSize: 11, color: T3, marginTop: 2 }}>Securely log out of your CuraMind account</div>
          </div>
          <button 
            onClick={onSignOut}
            style={{ 
              padding: '9px 18px', 
              borderRadius: 8, 
              border: `1px solid ${ERR}`, 
              background: 'transparent', 
              color: ERR, 
              fontSize: 12, 
              fontWeight: 600, 
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.target.style.background = ERR_BG; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; }}
          >
            Sign Out
          </button>
        </div>
      </Section>

      {/* Save button */}
      <div style={{ display:'flex', gap:12, alignItems:'center', marginTop: 10 }}>
        <button onClick={handleSave} disabled={saving}
          style={{ padding:'11px 28px', border:'none', borderRadius:9, background:BLUE, color:'#fff', fontSize:13, fontWeight:600, cursor:saving?'not-allowed':'pointer', fontFamily:"'Inter',sans-serif" }}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {saved && <span style={{ fontSize:12, color:SUCC, fontWeight:500 }}>✓ Changes saved successfully</span>}
      </div>
    </div>
  );
}
