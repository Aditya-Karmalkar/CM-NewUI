import React, { useState, useEffect, useRef } from 'react';
import { sendHealthChatMessage, transcribeVoiceToText, AVAILABLE_MODELS } from '../../../services/bytezService';
import { auth } from '../../../firebase';
import ConsultationPrompt from '../../chat/ConsultationPrompt';
import UniqueLoading from '../../ui/morph-loading';
import ChatInterface from '../../ui/chat-interface';

const BLUE       = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BLUE_SOFT  = 'rgba(0,104,255,0.14)';
const BLUE_RING  = 'rgba(0,104,255,0.25)';
const BG         = '#f8fafc';
const BDR        = '#edeef1';
const BDR2       = '#e2e8f0';
const T1         = '#111111';
const T2         = '#595959';
const T3         = '#a0a0a0';

// Model selection hidden from UI for a cleaner patient experience
// We now allow users to select models. (Filtered for Bytez free-tier)
const DEFAULT_MODEL = 'Mistral Small (Direct)';

const QUICK = [
  "What are symptoms of high blood pressure?",
  "What's a healthy diet for diabetes?",
  "How much sleep do adults need?",
  "When should I see a doctor?",
];

const getInitialMessages = () => ([{
  id: 1, type: 'bot', role: 'assistant',
  content: "Hello. I am the CuraMind assistant. How can I support your care today?",
  timestamp: Date.now()
}]);

export default function ChatPage() {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState(getInitialMessages());
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [isRecording, setIsRecording] = useState(false);
  const endRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const renderFormattedText = (text) => {
    if (!text) return null;
    let html = text
      .replace(/</g, "&lt;").replace(/>/g, "&gt;") // basic sanitize
      .replace(/###\s*(.*)/g, '<br/><strong style="display:block; margin-top:10px; margin-bottom:4px; font-size:14px; color:#111827;">$1</strong>') // headers
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #111827;">$1</strong>') // bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // italic
      .replace(/\n-\s*(.*?)/g, '<br/><span style="margin-left:8px; color:#374151">• $1</span>') // lists
      .replace(/\n/g, '<br/>'); // newlines
    
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages]);
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      if (u) {
        setUserId(u.uid);
        const saved = localStorage.getItem(`curamind_chat_${u.uid}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setSessions(parsed);
          if (parsed.length > 0) {
            setCurrentSessionId(parsed[0].id);
            setMessages(parsed[0].messages);
          }
        }
      }
    });
    return unsub;
  }, []);

  const startNewSession = () => {
    setCurrentSessionId(null);
    setMessages(getInitialMessages());
  };

  const selectSession = (id) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setCurrentSessionId(id);
      setMessages(session.messages);
    }
  };

  const deleteSession = (e, id) => {
    e.stopPropagation();
    setSessions(prev => {
      const nextState = prev.filter(s => s.id !== id);
      localStorage.setItem(`curamind_chat_${userId || 'anon'}`, JSON.stringify(nextState));
      return nextState;
    });
    if (currentSessionId === id) {
      startNewSession();
    }
  };

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');
    setLoading(true);

    const userMsg = { id: Date.now(), type: 'user', role: 'user', content: msg, timestamp: Date.now() };
    const botId = Date.now() + 1;
    const botMsg = { id: botId, type: 'bot', role: 'assistant', content: '', timestamp: Date.now(), isStreaming: true };
    
    let activeSessionId = currentSessionId;
    let isNew = false;
    let sessionTitle = '';

    if (!activeSessionId) {
      activeSessionId = Date.now().toString();
      sessionTitle = msg.substring(0, 24) + (msg.length > 24 ? '...' : '');
      isNew = true;
      setCurrentSessionId(activeSessionId);
    }
    
    const newMessages = [...messages, userMsg, botMsg];
    setMessages(newMessages);

    setSessions(prev => {
      let nextState;
      if (isNew) {
        nextState = [{ id: activeSessionId, title: sessionTitle, sub: 'Virtual Assistant', time: 'Just now', messages: newMessages }, ...prev];
      } else {
        nextState = prev.map(s => s.id === activeSessionId ? { ...s, messages: newMessages } : s);
      }
      localStorage.setItem(`curamind_chat_${userId || 'anon'}`, JSON.stringify(nextState));
      return nextState;
    });

    try {
      const history = messages
        .filter(m => m.type !== 'system')
        .map(m => ({ role: m.role || (m.type === 'bot' ? 'assistant' : 'user'), content: m.content }));
      history.push({ role: 'user', content: msg });

      const { output, consultationInfo } = await sendHealthChatMessage(history, selectedModel, userId);
      
      setMessages(prev => {
        const updated = prev.map(m => m.id === botId ? { ...m, content: output || 'Sorry, an error occurred.', isStreaming: false, consultationInfo } : m);
        setSessions(prevS => {
           const nextState = prevS.map(s => s.id === activeSessionId ? { ...s, messages: updated } : s);
           localStorage.setItem(`curamind_chat_${userId || 'anon'}`, JSON.stringify(nextState));
           return nextState;
        });
        return updated;
      });
    } catch {
      setMessages(prev => {
        const updated = prev.map(m => m.id === botId ? { ...m, content: 'Technical difficulties. Please try again.', isStreaming: false } : m);
        setSessions(prevS => {
           const nextState = prevS.map(s => s.id === activeSessionId ? { ...s, messages: updated } : s);
           localStorage.setItem(`curamind_chat_${userId || 'anon'}`, JSON.stringify(nextState));
           return nextState;
        });
        return updated;
      });
    } finally { setLoading(false); }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = e => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach(track => track.stop());
          
          setLoading(true);
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64data = reader.result;
            const transcript = await transcribeVoiceToText(base64data);
            setLoading(false);
            if (transcript) {
               setInput(prev => prev + (prev ? ' ' : '') + transcript.trim());
            } else {
               alert("Voice transcription failed or couldn't detect speech.");
            }
          };
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Mic access error:", err);
        alert("Please allow microphone access to use voice typing.");
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic implementation for UI mock: append filename token to query to give LLM context
      setInput(prev => prev + (prev ? ' ' : '') + `[Attached: ${file.name}] `);
    }
  };

  return (
    <div style={{ display:'flex', height:'calc(100vh - 58px)', overflow:'hidden', background:'#fff', borderRadius:14, border:`1px solid ${BDR}` }}>
      {/* Messages col */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Topbar */}
        <div style={{ padding:'12px 20px', borderBottom:`1px solid ${BDR}`, display:'flex', alignItems:'center', gap:12, background:'#fff', flexShrink:0 }}>
          <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:13, fontWeight:600, color:T1 }}>Virtual Assistant</div>
          <select 
            value={selectedModel} 
            onChange={e => setSelectedModel(e.target.value)}
            style={{ marginLeft:12, padding:'4px 8px', fontSize:12, borderRadius:6, border:`1px solid ${BDR2}`, background:BG, color:T2, outline:'none', cursor:'pointer' }}
          >
            {Object.keys(AVAILABLE_MODELS).map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:8 }}>
            <button onClick={startNewSession} title="New Chat"
              style={{ border:'none', background:BLUE_SOFT, color:BLUE, fontWeight:600, fontSize:12, padding:'6px 12px', borderRadius:6, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
              <svg viewBox="0 0 24 24" style={{width:14,height:14,stroke:'currentColor',fill:'none',strokeWidth:2,strokeLinecap:'round'}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Chat
            </button>
            <button onClick={() => setHistoryOpen(!historyOpen)} title="Toggle History"
              style={{ border:'none', background:'transparent', cursor:'pointer', color:T3, padding:6 }}>
              <svg viewBox="0 0 24 24" style={{width:14,height:14,stroke:'currentColor',fill:'none',strokeWidth:2,strokeLinecap:'round'}}>
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-4.36L1 10"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex:1, overflow:'hidden', position: 'relative' }}>
          <ChatInterface 
            config={{
              leftPerson: { name: 'CuraMind', avatar: 'https://res.cloudinary.com/dctgknnt7/image/upload/v1758823069/10_qujlpy.jpg' },
              rightPerson: { name: 'You', avatar: 'https://res.cloudinary.com/dctgknnt7/image/upload/v1758731402/2_hme6yu.jpg' },
              messages: messages.map(m => ({
                id: m.id,
                sender: m.type === 'bot' ? 'left' : 'right',
                type: m.consultationInfo ? 'consultation' : 'text',
                content: m.content,
                loader: { enabled: m.isStreaming, duration: 800 },
                consultationInfo: m.consultationInfo,
                onCloseConsultation: () => {
                  setMessages(prev => prev.map(msg => msg.id === m.id ? { ...msg, consultationInfo: null } : msg));
                }
              }))
            }}
            renderCustomMessage={(m) => (
              <ConsultationPrompt 
                consultationInfo={m.consultationInfo} 
                darkMode={false}
                onClose={m.onCloseConsultation} 
              />
            )}
            uiConfig={{
              containerHeight: '100%',
              backgroundColor: '#ffffff',
              loader: { dotColor: BLUE },
              leftChat: {
                backgroundColor: BG,
                textColor: T1,
                borderColor: BDR,
                showBorder: true,
                nameColor: BLUE
              },
              rightChat: {
                backgroundColor: BLUE,
                textColor: '#ffffff',
                borderColor: BLUE,
                showBorder: false,
                nameColor: '#93c5fd'
              }
            }}
          />
          
          {/* Overlay loading for "Reviewing..." state */}
          {loading && (
            <div style={{ 
              position: 'absolute', 
              bottom: 20, 
              left: 20, 
              display:'flex', 
              alignItems:'center', 
              gap:8, 
              color:T3, 
              fontSize:12,
              background: 'rgba(255,255,255,0.9)',
              padding: '6px 12px',
              borderRadius: 99,
              border: `1px solid ${BDR}`,
              zIndex: 20
            }}>
              <div style={{ display:'flex', gap:4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width:6, height:6, borderRadius:'50%', background:BLUE, animation:`bounce 1s ${i*0.15}s infinite` }}></div>)}
              </div>
              Analyzing symptoms...
            </div>
          )}
        </div>

        {/* Quick questions */}
        <div style={{ padding:'8px 24px 0', display:'flex', gap:8, flexWrap:'wrap', flexShrink:0 }}>
          {QUICK.map(q => (
            <button key={q} onClick={() => send(q)}
              style={{ fontSize:11, fontWeight:500, padding:'5px 12px', borderRadius:99, border:`1px solid ${BDR2}`, background:BG, color:T2, cursor:'pointer', whiteSpace:'nowrap' }}>
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding:'12px 24px 16px', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, background:BG, border:`1px solid ${BDR2}`, borderRadius:99, padding:'8px 14px' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ background:'transparent', border:'none', cursor:'pointer', color:T3, display:'flex', alignItems:'center', justifyContent:'center', padding:4, transition:'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = BLUE}
              onMouseLeave={e => e.currentTarget.style.color = T3}
              title="Upload file"
            >
              <svg viewBox="0 0 24 24" style={{width:18,height:18,stroke:'currentColor',fill:'none',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'}}>
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileUpload} 
              accept="image/*,.pdf,.doc,.docx,.txt"
            />

            <button
              onClick={toggleRecording}
              style={{ background: isRecording ? '#fee2e2' : 'transparent', border:'none', cursor:'pointer', color: isRecording ? '#ef4444' : T3, display:'flex', alignItems:'center', justifyContent:'center', padding:4, borderRadius:'50%', transition:'all 0.2s' }}
              onMouseEnter={e => !isRecording && (e.currentTarget.style.color = BLUE)}
              onMouseLeave={e => !isRecording && (e.currentTarget.style.color = T3)}
              title={isRecording ? "Stop recording" : "Voice typing"}
            >
              {isRecording && <span style={{ position:'absolute', width: 24, height: 24, borderRadius:'50%', border:'2px solid #ef4444', animation:'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite', opacity:0.7 }}></span>}
              <svg viewBox="0 0 24 24" style={{width:18,height:18,stroke:'currentColor',fill:'none',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round', position:'relative', zIndex:1}}>
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="22"/>
              </svg>
            </button>

            <input
              type="text"
              placeholder={isRecording ? "Listening..." : "Ask about your health, symptoms, or wellness…"}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==='Enter' && !e.shiftKey && send()}
              disabled={loading}
              style={{ flex:1, border:'none', background:'transparent', fontSize:13, color:T1, outline:'none', fontFamily:"'Inter',sans-serif" }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{ width:32, height:32, borderRadius:'50%', background:input.trim()&&!loading?BLUE:'#e5e7eb', border:'none', cursor:input.trim()&&!loading?'pointer':'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background .15s' }}>
              <svg viewBox="0 0 24 24" style={{width:14,height:14,stroke:'#fff',fill:'none',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round'}}>
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" stroke="none"/>
              </svg>
            </button>
          </div>
          <p style={{ textAlign:'center', fontSize:10, color:T3, marginTop:6 }}>
            Responses are for informational purposes and do not substitute for professional medical advice.
          </p>
        </div>
      </div>

      {/* History panel */}
      {historyOpen && (
        <div style={{ width:280, borderLeft:`1px solid ${BDR}`, display:'flex', flexDirection:'column', flexShrink:0, background:'#fafafa' }}>
          <div style={{ padding:'14px 16px', borderBottom:`1px solid ${BDR}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:'#fff' }}>
            <div style={{ fontFamily:"'Poppins',sans-serif", fontSize:12, fontWeight:600, color:T1 }}>History</div>
            <span style={{ fontSize:10, color:T3 }}>{sessions.length} sessions</span>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:'12px' }}>
            {sessions.map(c => (
              <div key={c.id} onClick={() => selectSession(c.id)} style={{ padding:'10px 12px', borderRadius:8, background:currentSessionId === c.id ? '#fff' : 'transparent', border:`1px solid ${currentSessionId === c.id ? BLUE_SOFT : 'transparent'}`, boxShadow: currentSessionId === c.id ? '0 1px 3px rgba(0,0,0,0.05)' : 'none', marginBottom:4, cursor:'pointer', transition:'all 0.2s', position: 'relative', display: 'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:currentSessionId === c.id ? BLUE : T1, marginBottom:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.title}</div>
                  <div style={{ fontSize:11, color:T3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.sub}</div>
                  <div style={{ fontSize:10, color:T3, marginTop:4 }}>{c.time}</div>
                </div>
                <button onClick={(e) => deleteSession(e, c.id)} style={{ background:'transparent', border:'none', cursor:'pointer', color: T3, padding: 4, borderRadius: 4, marginLeft: 8 }} title="Delete Session" className="session-del-btn">
                  <svg viewBox="0 0 24 24" style={{width:14,height:14,stroke:'currentColor',fill:'none',strokeWidth:2}}><polyline points="3 6 5 6 21 6"/><path d="M19 6L18.1 20a2 2 0 01-2 1.9H7.9a2 2 0 01-2-1.9L5 6"/></svg>
                </button>
              </div>
            ))}
            {sessions.length === 0 && (
              <div style={{ textAlign:'center', marginTop:40, color:T3, fontSize:12 }}>No previous sessions.</div>
            )}
          </div>
          <div style={{ padding:'12px 16px', borderTop:`1px solid ${BDR}`, background:'#fff' }}>
            <button onClick={() => { setSessions([]); localStorage.removeItem(`curamind_chat_${userId || 'anon'}`); startNewSession(); }} style={{ width:'100%', background:'transparent', border:`1px solid ${BDR2}`, borderRadius:8, padding:'8px', fontSize:12, color:T2, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6, transition:'background 0.2s' }} onMouseEnter={e=>e.target.style.background='#fee2e2'} onMouseLeave={e=>e.target.style.background='transparent'}>
              <svg viewBox="0 0 24 24" style={{width:12,height:12,stroke:'currentColor',fill:'none',strokeWidth:2,strokeLinecap:'round'}}><polyline points="3 6 5 6 21 6"/><path d="M19 6L18.1 20a2 2 0 01-2 1.9H7.9a2 2 0 01-2-1.9L5 6"/><path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2"/></svg>
              Clear history
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes blink { 50% { opacity:0; } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-4px); } }
        @keyframes ping { 75%, 100% { transform: scale(1.5); opacity: 0; } }
        .session-del-btn:hover { color: #ef4444 !important; background: #fee2e2 !important; }
      `}</style>
    </div>
  );
}
