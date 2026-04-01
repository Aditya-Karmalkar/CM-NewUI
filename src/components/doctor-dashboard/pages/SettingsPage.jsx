import React, { useState } from 'react';

const BLUE = '#0068ff';
const BDR = '#edeef1';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';

const SettingsSection = ({ title, children }) => (
  <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 20, padding: 24, marginBottom: 24 }}>
    <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 700, color: T1 }}>{title}</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {children}
    </div>
  </div>
);

const SettingItem = ({ label, description, rightContent }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: `1px solid ${BDR}`, last: { borderBottom: 'none' } }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 700, color: T1 }}>{label}</div>
      <div style={{ fontSize: 11, color: T3, marginTop: 2 }}>{description}</div>
    </div>
    {rightContent}
  </div>
);

const Toggle = ({ enabled, onToggle }) => (
  <div 
    onClick={onToggle}
    style={{ 
      width: 44, height: 24, background: enabled ? BLUE : '#cbd5e1', borderRadius: 12, position: 'relative', 
      cursor: 'pointer', transition: 'background 0.3s' 
    }}
  >
    <div style={{ 
      width: 18, height: 18, background: '#fff', borderRadius: '50%', position: 'absolute', 
      left: enabled ? 23 : 3, top: 3, transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' 
    }}></div>
  </div>
);

export default function SettingsPage() {
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [labIntegration, setLabIntegration] = useState(false);

  const handleSave = () => {
    alert("Practice settings updated successfully.");
  };

  return (
    <div style={{ maxWidth: 800 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: T1, margin: 0 }}>Practice Settings</h1>
          <p style={{ fontSize: 13, color: T2, marginTop: 4 }}>Configure your professional environment and clinical preferences.</p>
        </div>
        <button onClick={handleSave} style={{ background: BLUE, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,104,255,0.15)' }}>Save Changes</button>
      </div>

      <SettingsSection title="Professional Verification">
        <SettingItem 
          label="Medical License (MC-102931)" 
          description="Status: Verified • National Medical Board" 
          rightContent={<span style={{ background: 'rgba(22,163,74,0.08)', color: '#16a34a', fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 8 }}>Verified</span>} 
        />
        <SettingItem 
          label="Profile Visibility" 
          description="Publicly listed for patient consultations." 
          rightContent={<Toggle enabled={true} onToggle={() => {}} />} 
        />
      </SettingsSection>

      <SettingsSection title="Practice Preferences">
        <SettingItem 
          label="AI Diagnostic Insights" 
          description="Enable intelligent suggestions during patient assessments." 
          rightContent={<Toggle enabled={aiSuggestions} onToggle={() => setAiSuggestions(!aiSuggestions)} />} 
        />
        <SettingItem 
          label="Electronic Signature" 
          description="Securely sign prescriptions and clinical reports." 
          rightContent={<button style={{ border: `1px solid ${BDR}`, background: 'transparent', padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700, color: T1, cursor: 'pointer' }}>Manage</button>} 
        />
      </SettingsSection>

      <SettingsSection title="Integrations & Security">
         <SettingItem 
          label="Laboratory API" 
          description="Connected to national blood work networks." 
          rightContent={<Toggle enabled={labIntegration} onToggle={() => setLabIntegration(!labIntegration)} />} 
        />
         <SettingItem 
          label="Two-Factor Authentication" 
          description="Secure your clinical portal with secondary verification." 
          rightContent={<Toggle enabled={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />} 
        />
      </SettingsSection>
    </div>
  );
}
