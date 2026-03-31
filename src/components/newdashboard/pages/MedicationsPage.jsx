import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter, 
  DialogTrigger,
  DialogClose,
  Button 
} from '../../ui/custom-dialog';
import { AlertTriangleIcon } from 'lucide-react';

const BLUE       = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BLUE_SOFT  = 'rgba(0,104,255,0.14)';
const BG         = '#f8fafc';
const BG2        = '#f1f3f6';
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

const FREQ_COLORS = { morning:'#0068ff', afternoon:'#d97706', evening:'#7c3aed', night:'#111111' };
const FREQ_BG    = { morning:BLUE_FAINT, afternoon:WARN_BG, evening:'#f5f3ff', night:BG2 };

export default function MedicationsPage() {
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name:'', dosage:'', frequency:'daily', time_of_day:'morning', instructions:'', start_date:'' });
  const [saving, setSaving] = useState(false);
  const [stoppingId, setStoppingId] = useState(null);

  useEffect(() => { fetchMeds(); }, []);

  const fetchMeds = async () => {
    setLoading(true);
    const { data:{ session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase.from('medications').select('*').eq('user_id', session.user.id).eq('is_active', true).order('created_at', { ascending: false });
    setMeds(data || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!form.name || !form.dosage) return;

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.from('medications').insert([{
        ...form,
        user_id: session.user.id,
        is_active: true
      }]);

      if (error) throw error;

      setShowAdd(false);
      setForm({ name: '', dosage: '', frequency: 'daily', time_of_day: 'morning', instructions: '', start_date: '' });
      await fetchMeds();
    } catch (err) {
      console.error('Add medication error:', err);
      alert('Could not save medication.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await supabase.from('medications').update({ is_active: false }).eq('id', id);
    await fetchMeds();
  };

  const filtered = meds.filter(m => m.name?.toLowerCase().includes(search.toLowerCase()));

  const pill = (label, col, bg) => (
    <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:99, background:bg, color:col }}>{label}</span>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:700, color:T1, margin:0 }}>Medications</h2>
          <p style={{ fontSize:12, color:T3, margin:'2px 0 0' }}>{meds.length} active prescription{meds.length!==1?'s':''}</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:7, background:BLUE, color:'#fff', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'Inter',sans-serif" }}>
          <svg viewBox="0 0 24 24" style={{width:13,height:13,stroke:'currentColor',fill:'none',strokeWidth:2.5}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Medication
        </button>
      </div>

      {/* Search */}
      <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:`1px solid ${BDR2}`, borderRadius:99, padding:'8px 16px', maxWidth:320 }}>
        <svg viewBox="0 0 24 24" style={{width:13,height:13,stroke:T3,fill:'none',strokeWidth:2}}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search medications…"
          style={{ border:'none', background:'transparent', fontSize:12, color:T1, outline:'none', fontFamily:"'Inter',sans-serif", flex:1 }} />
      </div>

      {/* Meds grid */}
      {loading ? (
        <div style={{ textAlign:'center', padding:40, color:T3, fontSize:13 }}>Loading medications…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:40, background:'#fff', border:`1px solid ${BDR}`, borderRadius:14 }}>
          <div style={{ fontSize:32, marginBottom:12 }}>💊</div>
          <p style={{ fontSize:14, fontWeight:600, color:T1, margin:0 }}>No medications found</p>
          <p style={{ fontSize:12, color:T3, marginTop:4 }}>Add your first medication to track it.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:14 }}>
          {filtered.map(med => (
            <div key={med.id} style={{ background:'#fff', border:`1px solid ${BDR}`, borderRadius:14, padding:20 }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:FREQ_BG[med.time_of_day]||BLUE_FAINT, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg viewBox="0 0 24 24" style={{width:18,height:18,stroke:FREQ_COLORS[med.time_of_day]||BLUE,fill:'none',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'}}>
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:T1 }}>{med.name}</div>
                  <div style={{ fontSize:11, color:T3, marginTop:2 }}>{med.dosage} · {med.frequency}</div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <button 
                      style={{ border:'none', background:ERR_BG, color:ERR, borderRadius:6, padding:'4px 12px', fontSize:10, cursor:'pointer', fontWeight:600 }}
                      onClick={() => setStoppingId(med.id)}
                    >
                      Stop
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <div className="flex items-start space-x-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangleIcon className="h-6 w-6 text-red-600" />
                      </div>
                      <DialogHeader>
                        <DialogTitle>Stop Medication</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to stop taking <strong>{med.name}</strong>? 
                          This will move it to your inactive medications list. 
                          This action can be undone later.
                        </DialogDescription>
                      </DialogHeader>
                    </div>
                    <DialogFooter className="mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button variant="destructive" onClick={() => handleDelete(med.id)}>
                        Stop Medication
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <div style={{ background:BG, borderRadius:8, padding:'8px 10px' }}>
                  <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.8px', textTransform:'uppercase', color:T3, marginBottom:3 }}>Time</div>
                  <div style={{ fontSize:12, fontWeight:600, color:T1, textTransform:'capitalize' }}>{med.time_of_day || 'Morning'}</div>
                </div>
                <div style={{ background:BG, borderRadius:8, padding:'8px 10px' }}>
                  <div style={{ fontSize:9, fontWeight:600, letterSpacing:'0.8px', textTransform:'uppercase', color:T3, marginBottom:3 }}>Status</div>
                  {pill('Active', SUCC, SUCC_BG)}
                </div>
              </div>

              {med.instructions && (
                <div style={{ marginTop:10, fontSize:11, color:T2, background:BG, borderRadius:8, padding:'8px 10px' }}>
                  📋 {med.instructions}
                </div>
              )}

              {med.start_date && (
                <div style={{ marginTop:8, fontSize:10, color:T3 }}>
                  Started: {new Date(med.start_date).toLocaleDateString('en-US', {day:'numeric',month:'short',year:'numeric'})}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, width:460, maxWidth:'90vw', maxHeight:'90vh', overflowY:'auto' }}>
            <h3 style={{ fontFamily:"'Poppins',sans-serif", fontSize:15, fontWeight:700, color:T1, margin:'0 0 20px' }}>Add Medication</h3>

            {[
              { label:'Medication Name *', key:'name', type:'text', placeholder:'e.g. Amlodipine 5mg' },
              { label:'Dosage *', key:'dosage', type:'text', placeholder:'e.g. 5mg' },
              { label:'Instructions', key:'instructions', type:'text', placeholder:'e.g. Take with water after meals' },
              { label:'Start Date', key:'start_date', type:'date', placeholder:'' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.placeholder}
                  style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none', fontFamily:"'Inter',sans-serif", boxSizing:'border-box' }} />
              </div>
            ))}

            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>Frequency</label>
              <select value={form.frequency} onChange={e=>setForm({...form,frequency:e.target.value})}
                style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none', fontFamily:"'Inter',sans-serif" }}>
                {['daily','twice_daily','weekly','as_needed'].map(o=><option key={o} value={o}>{o.replace('_',' ')}</option>)}
              </select>
            </div>

            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>Time of Day</label>
              <div style={{ display:'flex', gap:8 }}>
                {['morning','afternoon','evening','night'].map(t => (
                  <button key={t} onClick={()=>setForm({...form,time_of_day:t})}
                    style={{ flex:1, padding:'7px 0', borderRadius:8, border:`1px solid ${form.time_of_day===t?BLUE:BDR2}`, background:form.time_of_day===t?BLUE_FAINT:'#fff', color:form.time_of_day===t?BLUE:T2, fontSize:11, fontWeight:500, cursor:'pointer', textTransform:'capitalize' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setShowAdd(false)}
                style={{ flex:1, padding:'10px', border:`1px solid ${BDR2}`, borderRadius:8, background:'#fff', color:T2, fontSize:12, cursor:'pointer' }}>
                Cancel
              </button>
              <button onClick={handleAdd} disabled={saving||!form.name||!form.dosage}
                style={{ flex:1, padding:'10px', border:'none', borderRadius:8, background:saving||!form.name?BDR:BLUE, color:'#fff', fontSize:12, fontWeight:600, cursor:saving?'not-allowed':'pointer' }}>
                {saving ? 'Saving…' : 'Add Medication'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
