import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';

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

export default function HealthGoalsPage() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title:'', description:'', category:'fitness', target_value:'', current_value:'', unit:'', deadline:'' });
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchGoals(); }, []);

  const fetchGoals = async () => {
    setLoading(true);
    const { data:{ session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase.from('health_goals').select('*').eq('user_id', session.user.id).eq('is_active', true).order('created_at', { ascending: false });
    setGoals(data || []);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!form.title || !form.target_value) return;

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.from('health_goals').insert([{
        ...form,
        user_id: session.user.id,
        is_active: true,
        target_value: Number(form.target_value),
        current_value: Number(form.current_value) || 0
      }]);

      if (error) throw error;

      setShowAdd(false);
      setForm({ title: '', description: '', category: 'fitness', target_value: '', current_value: '', unit: '', deadline: '' });
      await fetchGoals();
    } catch (err) {
      console.error('Add goal error:', err);
      alert('Could not save goal.');
    } finally {
      setSaving(false);
    }
  };

  const updateProgress = async (id, newVal) => {
    await supabase.from('health_goals').update({ current_value: Number(newVal) }).eq('id', id);
    await fetchGoals();
  };

  const CATS = { fitness:'🏃', nutrition:'🥗', sleep:'😴', weight:'⚖️', mental:'🧠', medication:'💊', other:'🎯' };
  const CAT_COLORS = { fitness:BLUE, nutrition:SUCC, sleep:'#7c3aed', weight:WARN, mental:'#ec4899', medication:ERR, other:T2 };

  const pct = (g) => Math.min(Math.round((Number(g.current_value)/Number(g.target_value))*100), 100) || 0;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'flex', alignItems:'center' }}>
        <div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:700, color:T1, margin:0 }}>Health Goals</h2>
          <p style={{ fontSize:12, color:T3, margin:'2px 0 0' }}>{goals.length} active goal{goals.length!==1?'s':''}</p>
        </div>
        <button onClick={()=>setShowAdd(true)}
          style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:7, background:BLUE, color:'#fff', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
          <svg viewBox="0 0 24 24" style={{width:13,height:13,stroke:'currentColor',fill:'none',strokeWidth:2.5}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add Goal
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:40, color:T3 }}>Loading…</div>
      ) : goals.length === 0 ? (
        <div style={{ textAlign:'center', padding:48, background:'#fff', border:`1px solid ${BDR}`, borderRadius:14 }}>
          <div style={{ fontSize:36, marginBottom:12 }}>🎯</div>
          <p style={{ fontSize:14, fontWeight:600, color:T1, margin:0 }}>No health goals yet</p>
          <p style={{ fontSize:12, color:T3, marginTop:4 }}>Set your first goal to start tracking progress.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:14 }}>
          {goals.map(goal => {
            const p = pct(goal);
            const color = CAT_COLORS[goal.category] || BLUE;
            return (
              <div key={goal.id} style={{ background:'#fff', border:`1px solid ${BDR}`, borderRadius:14, padding:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:BLUE_FAINT, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
                    {CATS[goal.category] || '🎯'}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:T1 }}>{goal.title}</div>
                    <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:99, background:BLUE_FAINT, color:BLUE, textTransform:'capitalize' }}>{goal.category}</span>
                  </div>
                  <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:700, color:color }}>{p}%</div>
                </div>

                {goal.description && <p style={{ fontSize:11, color:T2, marginBottom:12, lineHeight:1.5 }}>{goal.description}</p>}

                <div style={{ marginBottom:10 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:11, color:T2 }}>Progress</span>
                    <span style={{ fontSize:11, color:T3 }}>{goal.current_value} / {goal.target_value} {goal.unit}</span>
                  </div>
                  <div style={{ height:8, background:BG, borderRadius:99, overflow:'hidden' }}>
                    <div style={{ height:8, borderRadius:99, background:color, width:`${p}%`, transition:'width .4s ease' }}></div>
                  </div>
                </div>

                {/* Quick update */}
                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                  <input type="number" defaultValue={goal.current_value} onBlur={e=>updateProgress(goal.id, e.target.value)}
                    style={{ flex:1, padding:'7px 10px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none', fontFamily:"'Inter',sans-serif" }} />
                  <span style={{ fontSize:11, color:T3 }}>{goal.unit}</span>
                  <span style={{ fontSize:10, color:T3 }}>(blur to save)</span>
                </div>

                {goal.deadline && (
                  <div style={{ marginTop:8, fontSize:10, color:T3 }}>
                    🗓 Due: {new Date(goal.deadline).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'})}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAdd && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div style={{ background:'#fff', borderRadius:16, padding:28, width:460, maxWidth:'90vw', maxHeight:'90vh', overflowY:'auto' }}>
            <h3 style={{ fontFamily:"'Poppins',sans-serif", fontSize:15, fontWeight:700, color:T1, margin:'0 0 20px' }}>Add Health Goal</h3>
            {[
              { label:'Goal Title *', key:'title', type:'text', placeholder:'e.g. Walk 10,000 steps daily' },
              { label:'Description', key:'description', type:'text', placeholder:'Brief description of your goal' },
              { label:'Target Value *', key:'target_value', type:'number', placeholder:'e.g. 10000' },
              { label:'Current Value', key:'current_value', type:'number', placeholder:'e.g. 5000' },
              { label:'Unit', key:'unit', type:'text', placeholder:'e.g. steps, kg, hrs' },
              { label:'Deadline', key:'deadline', type:'date', placeholder:'' },
            ].map(f=>(
              <div key={f.key} style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} placeholder={f.placeholder}
                  style={{ width:'100%', padding:'9px 12px', border:`1px solid ${BDR2}`, borderRadius:8, fontSize:12, color:T1, outline:'none', fontFamily:"'Inter',sans-serif", boxSizing:'border-box' }} />
              </div>
            ))}
            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600, color:T2, marginBottom:5 }}>Category</label>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {Object.keys(CATS).map(c=>(
                  <button key={c} onClick={()=>setForm({...form,category:c})}
                    style={{ padding:'6px 12px', borderRadius:99, border:`1px solid ${form.category===c?BLUE:BDR2}`, background:form.category===c?BLUE_FAINT:'#fff', color:form.category===c?BLUE:T2, fontSize:11, cursor:'pointer', textTransform:'capitalize' }}>
                    {CATS[c]} {c}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setShowAdd(false)}
                style={{ flex:1, padding:'10px', border:`1px solid ${BDR2}`, borderRadius:8, background:'#fff', color:T2, fontSize:12, cursor:'pointer' }}>Cancel</button>
              <button onClick={handleAdd} disabled={saving||!form.title||!form.target_value}
                style={{ flex:1, padding:'10px', border:'none', borderRadius:8, background:BLUE, color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                {saving?'Saving…':'Add Goal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
