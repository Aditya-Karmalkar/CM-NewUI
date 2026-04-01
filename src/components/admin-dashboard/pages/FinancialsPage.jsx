import React from 'react';

const BLUE = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BG = '#f8fafc';
const BDR = '#edeef1';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';

const PlanCard = ({ name, users, revenue, growth }) => (
  <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 20, padding: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
       <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T1, textTransform: 'uppercase' }}>{name} Plan</h4>
       <span style={{ fontSize: 11, fontWeight: 800, color: '#16a34a' }}>{growth}</span>
    </div>
    <div style={{ fontSize: 24, fontWeight: 700, color: T1 }}>{revenue}</div>
    <div style={{ fontSize: 12, color: T3, marginTop: 4 }}>Total Subscriptions: {users}</div>
    <button style={{ width: '100%', marginTop: 20, background: BLUE_FAINT, color: BLUE, border: 'none', padding: '10px', borderRadius: 10, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Manage Pricing</button>
  </div>
);

export default function FinancialsPage() {
  return (
    <div style={{ maxWidth: 1000, minHeight: '100.1%', paddingBottom: 40 }}>
       <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 28, fontWeight: 700, color: T1, margin: 0 }}>Business Operations</h1>
          <p style={{ fontSize: 14, color: T2, marginTop: 6 }}>Revenue streams, subscription tier performance, and global financials.</p>
       </div>

       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginBottom: 32 }}>
          <PlanCard name="Basic" users="14,204" revenue="$28.4k" growth="+12%" />
          <PlanCard name="Premium" users="4,102" revenue="$12.3k" growth="+5.2%" />
          <PlanCard name="Enterprise" users="84" revenue="$9.8k" growth="+0.8%" />
       </div>

       <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 24, padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: T1, marginBottom: 24 }}>Recent Platform Transactions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
             {[
               { id: 'TX-43210', user: 'Dr. James Wilson', type: 'Payout', amount: '-$1,200.00', status: 'Completed' },
               { id: 'TX-43209', user: 'John Patient', type: 'Subscription', amount: '+$19.99', status: 'Success' },
               { id: 'TX-43208', user: 'Sarah Chen', type: 'Subscription', amount: '+$19.99', status: 'Success' },
               { id: 'TX-43207', user: 'Hospital Center', type: 'Enterprise', amount: '+$850.00', status: 'Pending' },
               { id: 'TX-43206', user: 'Admin System', type: 'Service Fee', amount: '-$42.01', status: 'Success' },
             ].map(tx => (
                <div key={tx.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: `1px solid ${BDR}` }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: tx.type === 'Payout' ? '#ef4444' : '#16a34a' }}></div>
                      <div>
                         <div style={{ fontSize: 14, fontWeight: 700, color: T1 }}>{tx.user}</div>
                         <div style={{ fontSize: 11, color: T3 }}>{tx.id} • {tx.type}</div>
                      </div>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: tx.amount.startsWith('+') ? '#16a34a' : T1 }}>{tx.amount}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: T3, textTransform: 'uppercase' }}>{tx.status}</div>
                   </div>
                </div>
             ))}
          </div>
          <button style={{ width: '100%', marginTop: 24, background: 'transparent', border: `1px solid ${BDR}`, color: T2, padding: '12px', borderRadius: 14, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Generate Tax Report</button>
       </div>
    </div>
  );
}
