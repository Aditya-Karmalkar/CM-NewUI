import React from 'react';

const BLUE = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BG = '#f8fafc';
const BDR = '#edeef1';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';

const EventItem = ({ time, title, subtitle, duration, type }) => (
  <div style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: `1px solid ${BDR}` }}>
    <div style={{ width: 60, flexShrink: 0, textAlign: 'right' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: T1 }}>{time}</div>
      <div style={{ fontSize: 11, color: T3 }}>{duration}</div>
    </div>
    <div style={{ flex: 1, padding: '12px 16px', background: type === 'urgent' ? 'rgba(239,68,68,0.05)' : BLUE_FAINT, borderRadius: 12, borderLeft: `4px solid ${type === 'urgent' ? '#ef4444' : BLUE}` }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: T1 }}>{title}</div>
      <div style={{ fontSize: 12, color: T2, marginTop: 2 }}>{subtitle}</div>
    </div>
  </div>
);

export default function SchedulePage() {
  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const events = [
    { time: '09:30', duration: '45m', title: 'Marcus Johnson', subtitle: 'Post-Surgery Follow-up • Cardiology', type: 'urgent' },
    { time: '11:00', duration: '30m', title: 'Sarah Chen', subtitle: 'Diagnostic Consultation • Neurology', type: 'normal' },
    { time: '14:30', duration: '60m', title: 'Emily Rodriguez', subtitle: 'Standard Checkup • General Practice', type: 'normal' },
  ];

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 24, fontWeight: 700, color: T1, margin: 0 }}>Clinical Schedule</h1>
          <p style={{ fontSize: 13, color: T2, marginTop: 4 }}>Managing your upcoming appointments and consultations.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ border: `1px solid ${BDR}`, background: '#fff', padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, color: T2, cursor: 'pointer' }}>Month</button>
          <button style={{ border: `1px solid ${BDR}`, background: '#fff', padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, color: T2, cursor: 'pointer' }}>Week</button>
          <button style={{ border: 'none', background: BLUE, color: '#fff', padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Today</button>
        </div>
      </div>

      <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 20, padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: T1 }}>Wednesday, October 18</div>
          <div style={{ height: 4, width: 4, background: T3, borderRadius: '50%' }}></div>
          <div style={{ fontSize: 13, color: T3, fontWeight: 500 }}>8 Appointments</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {hours.map(hour => {
            const hourEvents = events.filter(e => e.time.startsWith(hour.split(':')[0]));
            return (
              <div key={hour} style={{ display: 'flex', borderTop: `1px solid ${BDR}`, minHeight: 80 }}>
                <div style={{ width: 60, padding: '12px 0', fontSize: 11, fontWeight: 600, color: T3, textAlign: 'right', paddingRight: 16 }}>{hour}</div>
                <div style={{ flex: 1, padding: 4, position: 'relative' }}>
                  {hourEvents.map((e, idx) => (
                    <div key={idx} style={{ 
                      background: e.type === 'urgent' ? '#fef2f2' : BLUE_FAINT,
                      borderLeft: `4px solid ${e.type === 'urgent' ? '#ef4444' : BLUE}`,
                      borderRadius: 8,
                      padding: '10px 14px',
                      margin: '4px 0',
                      cursor: 'pointer'
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: T1 }}>{e.title}</div>
                      <div style={{ fontSize: 11, color: T2 }}>{e.subtitle}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
