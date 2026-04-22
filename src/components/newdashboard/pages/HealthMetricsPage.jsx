import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogDescription, DialogFooter, DialogTrigger, DialogClose, Button 
} from '../../ui/custom-dialog';
import { AlertTriangleIcon } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const BLUE       = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BG         = '#f8fafc';
const BDR        = '#edeef1';
const BDR2       = '#e2e8f0';
const T1         = '#111111';
const T2         = '#595959';
const T3         = '#a0a0a0';
const ERR        = '#ef4444';
const SUCC       = '#16a34a';
const WARN       = '#d97706';

const METRIC_CONFIG = {
  blood_pressure:{ label:'Blood Pressure', unit:'mmHg', color:ERR,    icon:'❤️', desc:'Systolic / Diastolic' },
  heart_rate:    { label:'Heart Rate',     unit:'bpm',  color:BLUE,   icon:'💙', desc:'Beats per minute' },
  blood_glucose: { label:'Blood Glucose',  unit:'mg/dL',color:WARN,   icon:'🩸', desc:'Blood sugar level' },
  weight:        { label:'Weight',         unit:'kg',   color:SUCC,   icon:'⚖️', desc:'Body weight' },
  sleep:         { label:'Sleep',          unit:'hrs',  color:'#7c3aed',icon:'😴', desc:'Sleep duration' },
};

export default function HealthMetricsPage() {
  const [metrics, setMetrics] = useState({ blood_pressure:[], heart_rate:[], blood_glucose:[], weight:[], sleep:[] });
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [activeMetric, setActiveMetric] = useState('heart_rate');
  const [form, setForm] = useState({ metric_type:'heart_rate', value:'', systolic:'', diastolic:'', notes:'' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchMetrics(); }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data, error } = await supabase.from('health_metrics')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (data && data.length > 0) {
        console.log('DEBUG: First metric object structure:', data[0]);
        
        // Use a flexible filter that checks both 'metric_type' and 'type' just in case
        const getM = (t) => data.filter(m => (m.metric_type === t || m.type === t));
        
        setMetrics({
          blood_pressure: getM('blood_pressure'),
          heart_rate:     getM('heart_rate'),
          blood_glucose:  getM('blood_glucose'),
          weight:         getM('weight'),
          sleep:          getM('sleep'),
        });
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (form.metric_type === 'blood_pressure') {
      if (!form.systolic || !form.diastolic) return;
    } else {
      if (!form.value) return;
    }

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const payload = { 
        metric_type: form.metric_type, 
        user_id: session.user.id, 
        notes: form.notes || null
      };

      if (form.metric_type === 'blood_pressure') {
        payload.systolic = parseInt(form.systolic, 10);
        payload.diastolic = parseInt(form.diastolic, 10);
        payload.value = parseInt(form.systolic, 10);
      } else {
        payload.value = parseFloat(form.value);
      }

      console.log('Inserting Metric Payload:', payload);
      const { error } = await supabase.from('health_metrics').insert([payload]);
      
      if (error && error.message.includes("metric_type")) {
        console.warn("Retrying with 'type' column instead of 'metric_type'");
        const altPayload = { ...payload, type: payload.metric_type };
        delete altPayload.metric_type;
        const { error: altError } = await supabase.from('health_metrics').insert([altPayload]);
        if (altError) throw altError;
      } else if (error) {
        throw error;
      }

      setShowAdd(false);
      setForm({ metric_type: 'heart_rate', value: '', systolic: '', diastolic: '', notes: '' });
      await fetchMetrics();
      // Switch to the newly added metric view if it's different
      setActiveMetric(form.metric_type);
    } catch (err) {
      console.error('Error adding metric:', err);
      alert('Failed to save metric. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('health_metrics').delete().eq('id', id);
      if (error) throw error;
      await fetchMetrics();
    } catch (err) {
      console.error('Delete metric error:', err);
      alert('Could not delete reading.');
    }
  };

  const makeChartData = (data, config) => ({
    labels: [...data].reverse().slice(-20).map(d=>new Date(d.created_at).toLocaleDateString('en-US',{month:'short',day:'numeric'})),
    datasets:[{ label:config.label, data:[...data].reverse().slice(-20).map(d=>d.value||d.systolic), borderColor:config.color, backgroundColor:config.color+'18', tension:0.4, fill:true, pointRadius:3 }]
  });

  const chartOpts = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{display:false} }, scales:{ x:{grid:{display:false},ticks:{font:{size:9},color:T3}}, y:{grid:{color:'rgba(0,0,0,0.04)'},ticks:{font:{size:9},color:T3}} } };

  const active = metrics[activeMetric];
  const config = METRIC_CONFIG[activeMetric];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'flex', alignItems:'center' }}>
        <div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:700, color:T1, margin:0 }}>Health Metrics</h2>
          <p style={{ fontSize:12, color:T3, margin:'2px 0 0' }}>Track and analyze your vital signs</p>
        </div>
        <button onClick={()=>setShowAdd(true)}
          style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:7, background:BLUE, color:'#fff', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
          <svg viewBox="0 0 24 24" style={{width:13,height:13,stroke:'currentColor',fill:'none',strokeWidth:2.5}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Log Metric
        </button>
      </div>

      {/* Quick stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
        {Object.entries(METRIC_CONFIG).map(([key, cfg]) => {
          const data = metrics[key];
          const latest = data[0];
          return (
            <button key={key} onClick={()=>setActiveMetric(key)}
              style={{ background:'#fff', border:`1.5px solid ${activeMetric===key?BLUE:BDR}`, borderRadius:12, padding:16, cursor:'pointer', textAlign:'left', transition:'border-color .15s', position:'relative' }}>
              <div style={{ fontSize:20, marginBottom:8 }}>{cfg.icon}</div>
              <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:700, color:cfg.color, lineHeight:1 }}>
                {latest ? (key==='blood_pressure'?`${latest.systolic}/${latest.diastolic}`:latest.value) : '--'}
              </div>
              <div style={{ fontSize:9, color:T3, marginTop:2 }}>{cfg.unit}</div>
              <div style={{ fontSize:10, fontWeight:500, color:T2, marginTop:4 }}>{cfg.label}</div>
              {activeMetric===key && <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:BLUE, borderRadius:'0 0 12px 12px' }}></div>}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div style={{ background:'#fff', border:`1px solid ${BDR}`, borderRadius:14, padding:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
          <span style={{ fontSize:20 }}>{config.icon}</span>
          <div>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:600, color:T1 }}>{config.label} Trend</div>
            <div style={{ fontSize:11, color:T3 }}>{config.desc} · Last 20 readings</div>
          </div>
          {active.length > 0 && (
            <div style={{ marginLeft:'auto', fontFamily:"'Poppins',sans-serif", fontSize:22, fontWeight:700, color:config.color }}>
              {active[0].value || active[0].systolic}{active[0].diastolic?`/${active[0].diastolic}`:''} <span style={{ fontSize:11, color:T3, fontWeight:400 }}>{config.unit}</span>
            </div>
          )}
        </div>
        {active.length > 1 ? (
          <div style={{ height:220 }}>
            <Line data={makeChartData(active, config)} options={chartOpts} />
          </div>
        ) : (
          <div style={{ height:220, display:'flex', alignItems:'center', justifyContent:'center', color:T3, fontSize:13 }}>
            Not enough data — log at least 2 readings to see a chart.
          </div>
        )}
      </div>

      {/* Recent readings */}
      <div style={{ background:'#fff', border:`1px solid ${BDR}`, borderRadius:14, padding:20 }}>
        <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:600, color:T1, marginBottom:14 }}>Recent Readings — {config.label}</div>
        {active.length === 0 ? (
          <div style={{ textAlign:'center', padding:24, color:T3, fontSize:12 }}>No readings yet. Log your first measurement.</div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {active.slice(0,10).map((m,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', background:BG, borderRadius:8, border:`1px solid ${BDR}` }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:config.color, flexShrink:0 }}></div>
                <span style={{ fontFamily:"'Poppins',sans-serif", fontSize:16, fontWeight:700, color:config.color }}>
                  {m.value || m.systolic}{m.diastolic?`/${m.diastolic}`:''} <span style={{ fontSize:10, color:T3, fontWeight:400 }}>{config.unit}</span>
                </span>
                <span style={{ fontSize:11, color:T3, marginLeft:'auto' }}>{new Date(m.created_at).toLocaleString('en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</span>
                {m.notes && <span style={{ fontSize:11, color:T2, fontStyle:'italic' }}>{m.notes}</span>}
                
                <Dialog>
                  <DialogTrigger asChild>
                    <button 
                      style={{ border:'none', background:'transparent', color:ERR, cursor:'pointer', padding:4, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:4, transition:'background 0.2s' }}
                      title="Delete reading"
                    >
                      <svg viewBox="0 0 24 24" style={{width:14,height:14,stroke:'currentColor',fill:'none',strokeWidth:2.5}}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <div className="flex items-start space-x-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                        <AlertTriangleIcon className="h-6 w-6 text-red-600" />
                      </div>
                      <DialogHeader>
                        <DialogTitle>Delete Reading</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete this {config.label} entry? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                    </div>
                    <DialogFooter className="mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button variant="destructive" onClick={() => handleDelete(m.id)}>
                        Delete Permanently
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, width:420, maxWidth:'90vw' }}>
            <h3 style={{ fontFamily:"'Poppins',sans-serif", fontSize:15, fontWeight:700, color:T1, margin:'0 0 18px' }}>Log Health Metric</h3>
            <div style={{ marginBottom:14 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>Metric Type</label>
              <select value={form.metric_type} onChange={e=>setForm({...form,metric_type:e.target.value})}
                style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none' }}>
                {Object.entries(METRIC_CONFIG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            {form.metric_type==='blood_pressure' ? (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>Systolic (mmHg)</label>
                  <input type="number" value={form.systolic} onChange={e=>setForm({...form,systolic:e.target.value})} placeholder="e.g. 120"
                    style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none', boxSizing:'border-box' }} />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>Diastolic (mmHg)</label>
                  <input type="number" value={form.diastolic} onChange={e=>setForm({...form,diastolic:e.target.value})} placeholder="e.g. 80"
                    style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none', boxSizing:'border-box' }} />
                </div>
              </div>
            ) : (
              <div style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>Value ({METRIC_CONFIG[form.metric_type]?.unit})</label>
                <input type="number" value={form.value} onChange={e=>setForm({...form,value:e.target.value})} placeholder="Enter value"
                  style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none', boxSizing:'border-box' }} />
              </div>
            )}
            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>Notes (optional)</label>
              <input type="text" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="e.g. After exercise"
                style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none', boxSizing:'border-box' }} />
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setShowAdd(false)}
                style={{ flex:1, padding:'10px', border:`1px solid ${BDR2}`, borderRadius:8, background:'#fff', color:T2, fontSize:12, cursor:'pointer' }}>Cancel</button>
              <button onClick={handleAdd} disabled={saving}
                style={{ flex:1, padding:'10px', border:'none', borderRadius:8, background:BLUE, color:'#fff', fontSize:12, fontWeight:600, cursor:saving?'not-allowed':'pointer' }}>
                {saving?'Saving…':'Log Metric'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
