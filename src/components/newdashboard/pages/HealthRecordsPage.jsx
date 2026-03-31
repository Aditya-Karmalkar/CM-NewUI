import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';

const BLUE    = '#0068ff';
const BLUE_FAINT='rgba(0,104,255,0.08)';
const BG      = '#f8fafc';
const BDR     = '#edeef1';
const BDR2    = '#e2e8f0';
const T1      = '#111111';
const T2      = '#595959';
const T3      = '#a0a0a0';
const SUCC    = '#16a34a';
const SUCC_BG = '#f0fdf4';
const ERR     = '#ef4444';
const ERR_BG  = '#fef2f2';
const WARN    = '#d97706';
const WARN_BG = '#fffbeb';

const FILE_TYPES = {
  pdf:   { icon:'📄', color:ERR,  bg:ERR_BG },
  jpg:   { icon:'🖼', color:BLUE, bg:BLUE_FAINT },
  jpeg:  { icon:'🖼', color:BLUE, bg:BLUE_FAINT },
  png:   { icon:'🖼', color:BLUE, bg:BLUE_FAINT },
  dicom: { icon:'🩻', color:'#7c3aed', bg:'#f5f3ff' },
  other: { icon:'📋', color:T2,   bg:BG },
};

export default function HealthRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const fileRef = React.useRef();

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    setLoading(true);
    const { data:{ session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase.from('health_records').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });
    setRecords(data || []);
    setLoading(false);
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { data:{ session } } = await supabase.auth.getSession();
    const path = `${session.user.id}/${Date.now()}_${file.name}`;
    const { error: upErr } = await supabase.storage.from('health-records').upload(path, file);
    if (!upErr) {
      const { data: { publicUrl } } = supabase.storage.from('health-records').getPublicUrl(path);
      await supabase.from('health_records').insert({
        user_id: session.user.id, file_name: file.name, file_url: publicUrl,
        file_size: file.size, file_type: file.type, category: 'general',
      });
      await fetchRecords();
    }
    setUploading(false);
  };

  const handleDelete = async (id) => {
    await supabase.from('health_records').delete().eq('id', id);
    await fetchRecords();
  };

  const ext = (name) => (name||'').split('.').pop().toLowerCase();
  const fileType = (name) => FILE_TYPES[ext(name)] || FILE_TYPES.other;
  const fmt = (bytes) => bytes > 1e6 ? `${(bytes/1e6).toFixed(1)} MB` : `${Math.round(bytes/1024)} KB`;

  const CATEGORIES = ['all','labs','imaging','prescriptions','reports','general'];
  const filtered = records.filter(r => {
    const matchSearch = r.file_name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category==='all' || r.category===category;
    return matchSearch && matchCat;
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        <div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif", fontSize:18, fontWeight:700, color:T1, margin:0 }}>Health Records</h2>
          <p style={{ fontSize:12, color:T3, margin:'2px 0 0' }}>{records.length} document{records.length!==1?'s':''} stored</p>
        </div>
        <button onClick={()=>fileRef.current?.click()} disabled={uploading}
          style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:7, background:BLUE, color:'#fff', border:'none', borderRadius:8, padding:'9px 16px', fontSize:12, fontWeight:600, cursor:'pointer' }}>
          <svg viewBox="0 0 24 24" style={{width:13,height:13,stroke:'currentColor',fill:'none',strokeWidth:2,strokeLinecap:'round'}}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
        <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.dicom" style={{display:'none'}} onChange={handleUpload} />
      </div>

      {/* Search + filter */}
      <div style={{ display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'#fff', border:`1px solid ${BDR2}`, borderRadius:99, padding:'7px 14px', flex:1, minWidth:200 }}>
          <svg viewBox="0 0 24 24" style={{width:13,height:13,stroke:T3,fill:'none',strokeWidth:2}}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search records…"
            style={{ border:'none', background:'transparent', fontSize:12, color:T1, outline:'none', flex:1 }} />
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {CATEGORIES.map(c=>(
            <button key={c} onClick={()=>setCategory(c)}
              style={{ padding:'6px 12px', borderRadius:99, border:`1px solid ${category===c?BLUE:BDR2}`, background:category===c?BLUE_FAINT:'#fff', color:category===c?BLUE:T2, fontSize:11, cursor:'pointer', textTransform:'capitalize' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Upload drop area */}
      <button onClick={()=>fileRef.current?.click()} disabled={uploading}
        style={{ width:'100%', background:'transparent', border:`1.5px dashed ${BDR2}`, borderRadius:12, padding:'16px', fontSize:12, color:T3, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'border-color .15s, color .15s' }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor=BLUE;e.currentTarget.style.color=BLUE;}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor=BDR2;e.currentTarget.style.color=T3;}}>
        <svg viewBox="0 0 24 24" style={{width:16,height:16,stroke:'currentColor',fill:'none',strokeWidth:2,strokeLinecap:'round'}}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Upload document (PDF, JPG, PNG)
      </button>

      {/* Records list */}
      {loading ? (
        <div style={{ textAlign:'center', padding:40, color:T3 }}>Loading records…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:48, background:'#fff', border:`1px solid ${BDR}`, borderRadius:14 }}>
          <div style={{ fontSize:36, marginBottom:8 }}>📂</div>
          <p style={{ fontSize:14, fontWeight:600, color:T1, margin:0 }}>No records found</p>
          <p style={{ fontSize:12, color:T3, marginTop:4 }}>Upload your first health document.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(rec => {
            const ft = fileType(rec.file_name);
            return (
              <div key={rec.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'#fff', border:`1px solid ${BDR}`, borderRadius:12 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:ft.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>
                  {ft.icon}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:500, color:T1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{rec.file_name}</div>
                  <div style={{ fontSize:10, color:T3, marginTop:2 }}>
                    {rec.file_size ? fmt(rec.file_size) : ''}{rec.file_size&&rec.created_at?' · ':''}{rec.created_at?new Date(rec.created_at).toLocaleDateString('en-US',{day:'numeric',month:'short',year:'numeric'}):''}
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  {rec.file_url && (
                    <a href={rec.file_url} target="_blank" rel="noreferrer"
                      style={{ padding:'5px 10px', borderRadius:6, border:`1px solid ${BDR2}`, background:BG, color:BLUE, fontSize:11, fontWeight:500, textDecoration:'none', cursor:'pointer' }}>
                      View
                    </a>
                  )}
                  <button onClick={()=>handleDelete(rec.id)}
                    style={{ padding:'5px 10px', borderRadius:6, border:`1px solid ${ERR}`, background:ERR_BG, color:ERR, fontSize:11, cursor:'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
