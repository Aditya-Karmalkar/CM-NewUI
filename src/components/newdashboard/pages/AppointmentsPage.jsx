import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';
import SimpleLeafletMap from '../../appointments/SimpleLeafletMap';

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

const STATUS_STYLES = {
  confirmed: { bg: SUCC_BG, color: SUCC, label: 'Confirmed' },
  pending:   { bg: WARN_BG, color: WARN, label: 'Pending' },
  cancelled: { bg: ERR_BG,  color: ERR,  label: 'Cancelled' },
};

export default function AppointmentsPage({ appointmentData }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [mapError, setMapError] = useState('');
  const [filter, setFilter] = useState('upcoming');
  const [form, setForm] = useState({ doctor_name:'', appointment_type:'', appointment_date:'', notes:'', location:'', status:'pending' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchAppointments(); }, []);
  useEffect(() => { 
    if (appointmentData) { 
      setForm({
        ...form, 
        appointment_type: appointmentData.appointment_type || appointmentData.preSelectedSpecialty || form.appointment_type, 
        notes: appointmentData.notes || appointmentData.autoFillNotes || form.notes
      }); 
      setShowAdd(true); 
    } 
  }, [appointmentData]);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data:{ session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase.from('appointments').select('*').eq('user_id', session.user.id).order('appointment_date', { ascending: true });
    setAppointments(data || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!form.doctor_name || !form.appointment_date) return;

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.from('appointments').insert({
        ...form,
        user_id: session.user.id,
        created_at: new Date().toISOString()
      });

      if (error) throw error;

      setShowAdd(false);
      setForm({ doctor_name: '', appointment_type: '', appointment_date: '', notes: '', location: '', status: 'pending' });
      await fetchAppointments();
    } catch (err) {
      console.error('Add appointment error:', err);
      alert('Could not schedule appointment.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async (id) => {
    await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id);
    await fetchAppointments();
  };

  const handleFacilitySelect = (facility) => {
    setSelectedFacility(facility);
    setForm(prev => ({
      ...prev,
      location: facility.name + (facility.vicinity ? ', ' + facility.vicinity : ''),
      notes: prev.notes ? `${prev.notes}\nAddress: ${facility.vicinity}` : `Address: ${facility.vicinity}`
    }));
  };

  const getNearbyFacilities = (facilityType) => {
    setMapError('');
    if (window.searchNearbyFacilities) {
      window.searchNearbyFacilities(facilityType);
    } else {
      setMapError('Map not initialized yet. Please wait a moment.');
    }
  };

  const now = new Date();
  const filtered = appointments.filter(a => {
    const d = new Date(a.appointment_date);
    if (filter === 'upcoming')  return d >= now && a.status !== 'cancelled';
    if (filter === 'past')      return d < now;
    if (filter === 'cancelled') return a.status === 'cancelled';
    return true;
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:700, color:T1, margin:0 }}>Appointments</h2>
          <p style={{ fontSize:12, color:T3, margin:'2px 0 0' }}>{appointments.filter(a=>new Date(a.appointment_date)>=now&&a.status!=='cancelled').length} upcoming</p>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
          <button onClick={()=>{ setShowMap(true); setSelectedFacility(null); setMapError(''); }}
            style={{ display:'flex', alignItems:'center', gap:7, background:'#fff', border:`1px solid ${BDR2}`, color:T1, borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
            <svg viewBox="0 0 24 24" style={{width:13,height:13,stroke:'currentColor',fill:'none',strokeWidth:2.5}}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            Find Facility
          </button>
          <button onClick={()=>setShowAdd(true)}
            style={{ display:'flex', alignItems:'center', gap:7, background:BLUE, color:'#fff', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
            <svg viewBox="0 0 24 24" style={{width:13,height:13,stroke:'currentColor',fill:'none',strokeWidth:2.5}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Schedule
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:4, background:'#fff', border:`1px solid ${BDR}`, borderRadius:99, padding:4, width:'fit-content' }}>
        {[['upcoming','Upcoming'],['past','Past'],['cancelled','Cancelled'],['all','All']].map(([v,l]) => (
          <button key={v} onClick={()=>setFilter(v)}
            style={{ padding:'6px 16px', borderRadius:99, border:'none', background:filter===v?BLUE:'transparent', color:filter===v?'#fff':T2, fontSize:11, fontWeight:filter===v?600:400, cursor:'pointer', transition:'all .15s' }}>
            {l}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign:'center', padding:40, color:T3 }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:40, background:'#fff', border:`1px solid ${BDR}`, borderRadius:14 }}>
          <div style={{ fontSize:32, marginBottom:8 }}>📅</div>
          <p style={{ fontSize:14, fontWeight:600, color:T1, margin:0 }}>No appointments</p>
          <p style={{ fontSize:12, color:T3, marginTop:4 }}>Schedule your first appointment to get started.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {filtered.map(appt => {
            const s = STATUS_STYLES[appt.status] || STATUS_STYLES.pending;
            const d = new Date(appt.appointment_date);
            return (
              <div key={appt.id} style={{ background:'#fff', border:`1px solid ${BDR}`, borderRadius:14, padding:20, display:'flex', alignItems:'center', gap:16 }}>
                {/* Date block */}
                <div style={{ width:52, height:52, borderRadius:12, background:BLUE_FAINT, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <div style={{ fontSize:20, fontWeight:700, color:BLUE, fontFamily:"'Poppins',sans-serif", lineHeight:1 }}>{d.getDate()}</div>
                  <div style={{ fontSize:9, fontWeight:700, color:BLUE, textTransform:'uppercase', letterSpacing:'0.5px' }}>{d.toLocaleString('default',{month:'short'})}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:T1 }}>{appt.doctor_name || 'Doctor Appointment'}</div>
                  <div style={{ fontSize:11, color:T2, marginTop:2 }}>{appt.appointment_type || 'Consultation'}{appt.location ? ` · ${appt.location}` : ''}</div>
                  <div style={{ fontSize:11, color:T3, marginTop:2 }}>{d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
                  {appt.notes && <div style={{ fontSize:11, color:T2, marginTop:4, fontStyle:'italic' }}>{appt.notes}</div>}
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
                  <span style={{ fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:99, background:s.bg, color:s.color }}>{s.label}</span>
                  {appt.status !== 'cancelled' && d >= now && (
                    <button onClick={()=>handleCancel(appt.id)}
                      style={{ fontSize:10, color:ERR, border:`1px solid ${ERR}`, borderRadius:6, padding:'3px 8px', background:'transparent', cursor:'pointer' }}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, width:460, maxWidth:'90vw', maxHeight:'90vh', overflowY:'auto' }}>
            <h3 style={{ fontFamily:"'Poppins',sans-serif", fontSize:15, fontWeight:700, color:T1, margin:'0 0 20px' }}>Schedule Appointment</h3>
            {[
              { label:"Doctor / Specialist *", key:'doctor_name', type:'text', placeholder:'Dr. Smith' },
              { label:"Type of Visit *", key:'appointment_type', type:'text', placeholder:'Cardiology / General' },
              { label:"Date & Time *", key:'appointment_date', type:'datetime-local', placeholder:'' },
              { label:"Location / Hospital", key:'location', type:'text', placeholder:'Apollo Hospital, Pune' },
              { label:"Notes", key:'notes', type:'text', placeholder:'Bring previous reports' },
            ].map(f=>(
              <div key={f.key} style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.placeholder}
                  style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none', fontFamily:"'Inter',sans-serif", boxSizing:'border-box' }} />
              </div>
            ))}
            <div style={{ display:'flex', gap:10, marginTop:6 }}>
              <button onClick={()=>setShowAdd(false)}
                style={{ flex:1, padding:'10px', border:`1px solid ${BDR2}`, borderRadius:8, background:'#fff', color:T2, fontSize:12, cursor:'pointer' }}>Cancel</button>
              <button onClick={handleAdd} disabled={saving||!form.doctor_name||!form.appointment_date}
                style={{ flex:1, padding:'10px', border:'none', borderRadius:8, background:BLUE, color:'#fff', fontSize:12, fontWeight:600, cursor:saving?'not-allowed':'pointer' }}>
                {saving?'Saving…':'Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Map Modal */}
      {showMap && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:24, width:800, maxWidth:'95vw', maxHeight:'90vh', overflowY:'auto', display:'flex', flexDirection:'column', gap:16, position:'relative' }}>
            <div>
              <h3 style={{ fontFamily:"'Poppins',sans-serif", fontSize:16, fontWeight:700, color:T1, margin:0 }}>Find Nearby Medical Facilities</h3>
              <p style={{ fontSize:12, color:T3, margin:'4px 0 0' }}>Search for hospitals, clinics, and pharmacies near your location.</p>
            </div>
            
            <div style={{ height:400, borderRadius:12, overflow:'hidden', border:`1px solid ${BDR}`, backgroundColor:'#f1f5f9' }}>
              <SimpleLeafletMap onFacilitySelect={handleFacilitySelect} selectedFacility={selectedFacility} />
            </div>

            <div style={{ display:'flex', gap:8 }}>
              {['all', 'hospital', 'clinic', 'pharmacy'].map(ft => (
                <button key={ft} onClick={() => getNearbyFacilities(ft)}
                  style={{ flex:1, padding:'10px', border:`1px solid ${BDR2}`, borderRadius:8, background:'#fff', color:T1, fontSize:12, fontWeight:600, cursor:'pointer', textTransform:'capitalize', transition:'all 0.2s' }}>
                  {ft === 'all' ? 'All Medical' : `${ft}s`}
                </button>
              ))}
            </div>

            {selectedFacility && (
              <div style={{ padding:16, border:`1px solid ${BDR}`, borderRadius:10, background:BG, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:T1 }}>{selectedFacility.name}</div>
                  <div style={{ fontSize:12, color:T2, marginTop:4 }}>{selectedFacility.vicinity || 'Address not available'}</div>
                </div>
                <button onClick={() => { setShowMap(false); setShowAdd(true); }}
                  style={{ padding:'8px 16px', background:BLUE, color:'#fff', border:'none', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                  Use This Location
                </button>
              </div>
            )}
            
            {mapError && (
              <div style={{ padding:12, background:ERR_BG, color:ERR, border:`1px solid ${ERR}`, borderRadius:8, fontSize:12, fontWeight:500 }}>
                {mapError}
              </div>
            )}
            
            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              <button onClick={()=>setShowMap(false)}
                style={{ padding:'10px 20px', border:`1px solid ${BDR2}`, borderRadius:8, background:'#fff', color:T2, fontSize:12, cursor:'pointer', fontWeight:600 }}>Close Map</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
