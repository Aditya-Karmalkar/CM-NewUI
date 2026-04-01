import React from 'react';

const BLUE = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BG = '#f8fafc';
const BDR = '#edeef1';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';

const SettingItem = ({ label, value, actionLabel }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${BDR}`, background: '#fff' }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: T1 }}>{label}</div>
      <div style={{ fontSize: 11, color: T3, marginTop: 2 }}>{value}</div>
    </div>
    <button style={{ border: `1px solid ${BDR}`, background: 'transparent', padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, color: T2, cursor: 'pointer' }}>{actionLabel}</button>
  </div>
);

export default function CredentialsPage() {
  return (
    <div style={{ maxWidth: 800, minHeight: '100.1%', paddingBottom: 40 }}>
       <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 700, color: T1, margin: 0 }}>System Administrator Profile</h1>
          <p style={{ fontSize: 14, color: T2, marginTop: 4 }}>Manage root access, enterprise API keys, and global security infrastructure.</p>
       </div>

       <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 24, padding: 32, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
             <div style={{ width: 80, height: 80, borderRadius: 24, background: BLUE, color: '#fff', fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>AD</div>
             <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: T1, margin: 0 }}>Admin Root</h3>
                <p style={{ fontSize: 14, color: T2, marginTop: 4 }}>admin@curamind.com • Verified Enterprise Account</p>
                <span style={{ display: 'inline-block', background: BLUE_FAINT, color: BLUE, fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 8, textTransform: 'uppercase', marginTop: 10 }}>Total Access Role</span>
             </div>
          </div>
       </div>

       <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 20, overflow: 'hidden' }}>
          <SettingItem label="Account Password" value="Last updated: 42 days ago" actionLabel="Update" />
          <SettingItem label="Enterprise API Key" value="curamind_pro_live_1092..." actionLabel="Reveal" />
          <SettingItem label="Two-Factor Authentication" value="Enabled via Authenticator App" actionLabel="Configure" />
          <SettingItem label="Root Access Token" value="System protected layer" actionLabel="Rotate" />
       </div>
    </div>
  );
}
