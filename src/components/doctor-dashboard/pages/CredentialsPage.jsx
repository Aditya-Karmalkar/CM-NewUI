import React from 'react';
import { supabase } from '../../../supabase';

const BLUE = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BG = '#f8fafc';
const BDR = '#edeef1';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';
const SUCC = '#16a34a';

const CredentialCard = ({ title, issuer, date, icon }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: '#fff', border: `1px solid ${BDR}`, borderRadius: 14 }}>
    <div style={{ width: 40, height: 40, borderRadius: 10, background: BLUE_FAINT, color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: T1 }}>{title}</div>
      <div style={{ fontSize: 11, color: T3, marginTop: 2 }}>{issuer} • Issued {date}</div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: SUCC, fontSize: 11, fontWeight: 700 }}>
       <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
       Verified
    </div>
  </div>
);

export default function CredentialsPage() {
  const [doc, setDoc] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Special case for "Test" doctor
      if (session.user.email?.includes('test@')) {
        setDoc({
          name: "Dr. Test Clinician, MD",
          initials: "DT",
          role: "Chief of Internal Medicine • CuraMind Health Network",
          bio: "Dr. Test Clinician is a board-certified internist with over 15 years of experience in diagnostic intelligence and predictive healthcare. Specializing in cardiology and neurological health trends, he has been at the forefront of integrating AI insights into clinical practice at the CuraMind Network.",
          specializations: ['Internal Medicine', 'Diagnostic AI', 'Cardiology', 'Predictive Care', 'Metabolic Health']
        });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (data) {
        setDoc({
          name: data.full_name || "New Practitioner",
          initials: (data.full_name || "NP").split(' ').map(n => n[0]).join('').toUpperCase(),
          role: data.role || "Medical Professional • CuraMind Network",
          bio: data.bio || "Practitioner profile pending verification. Dedicated to high-fidelity clinical intelligence and patient-centric care.",
          specializations: data.specializations || ['General Medicine']
        });
      }
      setLoading(false);
    };

    loadProfile();
  }, []);

  if (loading) return <div style={{ padding: 40, color: T3 }}>Synchronizing clinical credentials...</div>;

  const currentDoc = doc || {
    name: "Dr. Test Clinician, MD",
    initials: "DT",
    role: "Chief of Internal Medicine • CuraMind Health Network",
    bio: "Profile data loading...",
    specializations: []
  };

  return (
    <div style={{ maxWidth: 850 }}>
      {/* Header Profile */}
      <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 24, padding: '32px', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 80, background: `linear-gradient(90deg, ${BLUE} 0%, #004dc4 100%)`, opacity: 0.1 }}></div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, position: 'relative', zIndex: 1, marginTop: 20 }}>
          <div style={{ width: 100, height: 100, borderRadius: 24, border: '4px solid #fff', background: BLUE, color: '#fff', fontSize: 32, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
            {currentDoc.initials}
          </div>
          <div style={{ flex: 1, paddingBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: T1, margin: 0 }}>{currentDoc.name}</h1>
              <div style={{ background: 'rgba(22,163,74,0.1)', color: SUCC, fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: 0.5 }}>Board Certified</div>
            </div>
            <p style={{ fontSize: 14, color: T2, marginTop: 4, fontWeight: 500 }}>{currentDoc.role}</p>
          </div>
          <button style={{ background: BLUE, color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 12, fontWeight: 600, fontSize: 13, cursor: 'pointer', marginBottom: 10 }}>Edit Profile</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
        {/* Left: Bio & Certifications */}
        <div>
          <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 20, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: T1, margin: '0 0 16px' }}>Professional Biography</h3>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: T2, margin: 0 }}>
              {currentDoc.bio}
            </p>
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 700, color: T1, marginBottom: 16, marginLeft: 4 }}>Verified Credentials</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <CredentialCard 
              title="Medical License (MC-102931)" issuer="National Medical Board" date="Jan 2018" 
              icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>} 
            />
            <CredentialCard 
              title="Doctor of Medicine (MD)" issuer="Stanford School of Medicine" date="May 2008" 
              icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>} 
            />
            <CredentialCard 
              title="Board Certification in Internal Medicine" issuer="ABIM" date="Aug 2012" 
              icon={<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>} 
            />
          </div>
        </div>

        {/* Right: Specializations & Affiliations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: T1, margin: '0 0 16px' }}>Primary Specializations</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {currentDoc.specializations.map(tag => (
                <span key={tag} style={{ background: BG2, color: T1, fontSize: 11, fontWeight: 600, padding: '6px 12px', borderRadius: 8, border: `1px solid ${BDR}` }}>{tag}</span>
              ))}
            </div>
          </div>

          <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 20, padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: T1, margin: '0 0 16px' }}>Network Affiliations</h3>
            <div style={{ spaceY: 16 }}>
              {[
                { name: 'CuraMind University Hospital', role: 'Chief Resident' },
                { name: 'Global Health Alliance', role: 'Innovation Fellow' },
                { name: 'Predictive Med Society', role: 'Active Member' }
              ].map(aff => (
                <div key={aff.name} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: BLUE }}></div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: T1 }}>{aff.name}</div>
                    <div style={{ fontSize: 10, color: T3, fontWeight: 500 }}>{aff.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const BG2 = '#f1f3f6';
