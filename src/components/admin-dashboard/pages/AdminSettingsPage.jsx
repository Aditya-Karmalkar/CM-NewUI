import React from 'react';

const BLUE = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BG = '#f8fafc';
const BDR = '#edeef1';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';

const SettingGroup = ({ title, children }) => (
  <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 24, padding: 32, marginBottom: 24 }}>
     <h3 style={{ margin: '0 0 24px', fontSize: 18, fontWeight: 700, color: T1 }}>{title}</h3>
     <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {children}
     </div>
  </div>
);

const SettingRow = ({ label, description, action }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 20, borderBottom: `1px solid ${BDR}`, last: { borderBottom: 'none' } }}>
     <div style={{ flex: 1, paddingRight: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T1 }}>{label}</div>
        <div style={{ fontSize: 12, color: T3, marginTop: 4 }}>{description}</div>
     </div>
     {action}
  </div>
);

export default function AdminSettingsPage() {
  return (
    <div style={{ 
      maxWidth: 800, 
      margin: '0 auto', 
      paddingBottom: 60
    }}>
       <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 700, color: T1, margin: 0 }}>System Configuration</h1>
          <p style={{ fontSize: 14, color: T2, marginTop: 6 }}>Root-level platform constants and enterprise security infrastructure management.</p>
       </div>

       <SettingGroup title="Platform Constants">
          <SettingRow 
             label="Maintenance Mode" 
             description="Globally restrict access to all non-administrator users for platform updates." 
             action={<button style={{ background: BLUE_FAINT, color: BLUE, border: 'none', padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>Enable</button>} 
          />
          <SettingRow 
             label="AI Diagnostics Threshold" 
             description="Configure the sensitivity and confidence markers for clinical AI suggestions." 
             action={<button style={{ border: `1px solid ${BDR}`, background: 'transparent', color: T1, padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Modify Rules</button>} 
          />
          <SettingRow 
             label="Notification Relay" 
             description="Configure global SMTP and SMS relay nodes for critical patient alerts." 
             action={<button style={{ border: `1px solid ${BDR}`, background: 'transparent', color: T1, padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Manage API</button>} 
          />
       </SettingGroup>

       <SettingGroup title="Internal Governance">
          <SettingRow 
             label="Doctor Verification Level" 
             description="Set the strictness of automated vs manual credential verification for new practitioners." 
             action={<button style={{ background: BLUE_FAINT, color: BLUE, border: 'none', padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>Tier 2</button>} 
          />
          <SettingRow 
             label="Data Retention Period" 
             description="How long health records are stored before archival (Default: 7 years)." 
             action={<button style={{ border: `1px solid ${BDR}`, background: 'transparent', color: T1, padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Set Limits</button>} 
          />
          <SettingRow 
             label="Audit Trail Verbosity" 
             description="Define the level of detail logged in system security and access audits." 
             action={<button style={{ border: `1px solid ${BDR}`, background: 'transparent', color: T1, padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Detailed</button>} 
          />
       </SettingGroup>

       <SettingGroup title="Legal & Compliance">
          <SettingRow 
             label="Privacy Policy (v.2023.1)" 
             description="Updated Oct 12, 2023. Governs global platform data usage policies." 
             action={<button style={{ border: `1px solid ${BDR}`, background: 'transparent', color: T1, padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Edit Version</button>} 
          />
          <SettingRow 
             label="GDPR Residency" 
             description="Ensure clinical data replication compliance across enterprise regions." 
             action={<span style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 8, textTransform: 'uppercase' }}>Compliant</span>} 
          />
          <SettingRow 
             label="HIPAA Logging" 
             description="Enable exhaustive BAA tracking for every data touchpoint in the United States." 
             action={<span style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 8, textTransform: 'uppercase' }}>Enabled</span>} 
          />
       </SettingGroup>

       <SettingGroup title="Security Infrastructure">
          <SettingRow 
             label="SSO Integration" 
             description="Manage enterprise identity providers and Google/Microsoft OAuth protocols." 
             action={<button style={{ background: T1, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Configure Identity</button>} 
          />
          <SettingRow 
             label="Global Encryption" 
             description="Manage clinical data encryption rotation and secure key ownership." 
             action={<button style={{ border: `1px solid ${BDR}`, background: 'transparent', color: T1, padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Rotate Keys</button>} 
          />
          <SettingRow 
             label="Session Heartbeat" 
             description="Define maximum idle time before administrator session termination." 
             action={<button style={{ border: `1px solid ${BDR}`, background: 'transparent', color: T1, padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>15 Min</button>} 
          />
       </SettingGroup>
    </div>
  );
}
