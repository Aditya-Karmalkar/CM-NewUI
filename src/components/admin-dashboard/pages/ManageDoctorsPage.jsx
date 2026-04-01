import React from 'react';
import { supabase } from '../../../supabase';

const BLUE = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BG = '#f8fafc';
const BDR = '#edeef1';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';

const DoctorRow = ({ name, id, specialism, status, patients }) => (
  <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 18, padding: '16px 20px', display: 'flex', alignItems: 'center', marginBottom: 12 }}>
    <div style={{ width: 44, height: 44, borderRadius: 12, background: BLUE_FAINT, color: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, flexShrink: 0 }}>
      {name[3]}
    </div>
    <div style={{ flex: 1.5, marginLeft: 16 }}>
      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T1 }}>{name}</h4>
      <div style={{ fontSize: 11, color: T3, marginTop: 2 }}>ID: {id} • Specialist: {specialism}</div>
    </div>
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: T3, textTransform: 'uppercase', marginBottom: 4 }}>Patients</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: T2 }}>{patients}</div>
    </div>
    <div style={{ flex: 1, textAlign: 'right', marginRight: 24 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: T3, textTransform: 'uppercase', marginBottom: 4 }}>Status</div>
      <div style={{ fontSize: 11, fontWeight: 800, color: status === 'Active' ? '#16a34a' : BLUE, background: status === 'Active' ? 'rgba(22,163,74,0.1)' : BLUE_FAINT, padding: '2px 8px', borderRadius: 6, display: 'inline-block' }}>{status}</div>
    </div>
    <div style={{ display: 'flex', gap: 10 }}>
       <button style={{ border: `1px solid ${BDR}`, background: 'transparent', padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, color: T2, cursor: 'pointer' }}>Manage Access</button>
       <button style={{ background: T1, color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>View Credentials</button>
    </div>
  </div>
);

export default function ManageDoctorsPage() {
  const [doctors, setDoctors] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  
  const testDoctor = { name: "Dr. Gregor House", id: "DR-TEST", specialism: "Infectious Disease", status: "Active", patients: 84 };

  React.useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('user_type', 'doctor');
        
        if (error) throw error;
        
        // Map database records to the UI structure
        const mapped = data.map(u => ({
          name: u.full_name || 'Anonymous Practitioner',
          id: u.id.slice(0, 8).toUpperCase(), 
          specialism: u.specialization || 'Clinical Staff',
          status: u.is_verified ? 'Active' : 'Pending',
          patients: u.patient_count || 0
        }));

        setDoctors([testDoctor, ...mapped]);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setDoctors([testDoctor]); 
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div style={{ maxWidth: 1000, paddingBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 700, color: T1, margin: 0 }}>Clinical Onboarding</h1>
          <p style={{ fontSize: 14, color: T2, marginTop: 4 }}>Verify and manage healthcare provider credentials and platform access.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
           <input placeholder="Search providers..." style={{ padding: '12px 20px', borderRadius: 14, border: `1px solid ${BDR}`, background: '#fff', fontSize: 13, minWidth: 280 }} />
           <button style={{ background: BLUE, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 14, fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: '0 8px 16px rgba(0,104,255,0.15)' }}>Invite Practitioner</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: T2 }}>Analyzing clinical staff records...</div>
        ) : (
          doctors.map(d => <DoctorRow key={d.id} {...d} />)
        )}
      </div>
    </div>
  );
}
