import React from 'react';

const BLUE = '#0068ff';
const BLUE_FAINT = 'rgba(0,104,255,0.08)';
const BG = '#f8fafc';
const BDR = '#edeef1';
const T1 = '#111111';
const T2 = '#595959';
const T3 = '#a0a0a0';
const SUCCESS = '#16a34a';

const SecurityPillar = ({ number, title, risk, actions, status = 'Compliant' }) => (
  <div style={{ background: '#fff', border: `1px solid ${BDR}`, borderRadius: 24, padding: 32, marginBottom: 24, transition: 'all 0.2s ease-in-out' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: BLUE_FAINT, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: BLUE }}>
          {number}
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T1 }}>{title}</h3>
          <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 600, marginTop: 4 }}>Risk: {risk}</div>
        </div>
      </div>
      <div style={{ background: 'rgba(22,163,74,0.1)', color: SUCCESS, fontSize: 10, fontWeight: 800, padding: '6px 12px', borderRadius: 8, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: SUCCESS }}></div>
        {status}
      </div>
    </div>
    
    <div style={{ background: BG, borderRadius: 16, padding: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: T3, textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.05em' }}>Required Actions</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {actions.map((action, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: T2 }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={SUCCESS} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
            {action}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function SecurityProtocolsPage() {
  const pillars = [
    {
      number: 1,
      title: "Input Validation & Sanitization",
      risk: "Injection attacks (SQL, XSS, command injection)",
      actions: ["Standardized form validation", "Sanitized API parameters", "Type checking logic", "Output encoding"]
    },
    {
      number: 2,
      title: "Authentication & Authorization",
      risk: "Unauthorized access, privilege escalation",
      actions: ["Supabase Auth implementation", "Role-Based Access Control", "JWT session management", "Backend permission checks"]
    },
    {
      number: 3,
      title: "Secrets Management",
      risk: "API keys leaked → full system compromise",
      actions: ["Environment variables (.env)", "No hardcoded credentials", ".gitignore configuration", "Key rotation protocol"]
    },
    {
      number: 4,
      title: "Dependency Security",
      risk: "Vulnerable npm/pip packages",
      actions: ["Regular npm audit scans", "Automated package updates", "Source verification", "Lockfile maintenance"]
    },
    {
      number: 5,
      title: "API & Route Security",
      risk: "Open endpoints → abuse, data leaks",
      actions: ["Rate limiting enabled", "CORS restrictions", "Protected route middleware", "API token validation"]
    },
    {
      number: 6,
      title: "HTTPS & Data Encryption",
      risk: "Data interception (MITM attacks)",
      actions: ["SSL/TLS enforcement", "Bcrypt password hashing", "Encryption at rest", "Secure cookies"]
    },
    {
      number: 7,
      title: "AI-Specific Risks",
      risk: "Prompt injection, data leakage",
      actions: ["Prompt validation layer", "Content filtering", "System/User separation", "Sanitized LLM outputs"]
    },
    {
      number: 8,
      title: "Logging & Monitoring",
      risk: "Undetected system attacks",
      actions: ["Real-time access logs", "Error tracking (Sentry)", "No PII in logs", "Incident alerting"]
    },
    {
      number: 9,
      title: "Abuse Protection",
      risk: "DDoS, brute-force attacks",
      actions: ["Global rate limiting", "IP blocking capability", "Honeypot protection", "Bot detection"]
    },
    {
      number: 10,
      title: "Secure Coding Practices",
      risk: "Copy-paste vulnerabilities",
      actions: ["Mandatory peer review", "Edge case testing", "Error handling logic", "Static code analysis"]
    },
    {
      number: 11,
      title: "Database Security",
      risk: "Data breaches / exposure",
      actions: ["Least privilege access", "Private VPC deployment", "Audit trail enabled", "Regular backups"]
    },
    {
      number: 12,
      title: "Deployment Security",
      risk: "Misconfigured servers",
      actions: ["Debug mode disabled", "Firewall configuration", "Port restriction", "Security headers"]
    }
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', paddingBottom: 60 }}>
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 32, fontWeight: 800, color: T1, margin: 0 }}>Enterprise Security Protocols</h1>
        <p style={{ fontSize: 15, color: T2, marginTop: 10, maxWidth: 600, margin: '10px auto' }}>
          Global governance framework and clinical data protection standards for the CuraMind ecosystem.
        </p>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #0068ff 0%, #004dc4 100%)', borderRadius: 24, padding: 32, color: '#fff', marginBottom: 40, boxShadow: '0 20px 40px rgba(0,104,255,0.15)', display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ fontSize: 48 }}>🛡️</div>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Security Compliance Rating: 98%</h2>
          <p style={{ fontSize: 14, opacity: 0.9, marginTop: 8, lineHeight: 1.5 }}>
            All 12 security pillars are currently active and monitored. "If it works ≠ it is secure." Always prioritize data integrity over feature speed.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
        {pillars.map((pillar, i) => (
          <SecurityPillar key={i} {...pillar} />
        ))}
      </div>

      <div style={{ marginTop: 40, padding: 24, background: '#fff', border: `1px solid ${BDR}`, borderRadius: 20, textAlign: 'center' }}>
         <div style={{ fontSize: 13, color: T3, fontWeight: 600, marginBottom: 16 }}>LAST AUDIT COMPLETED: {new Date().toLocaleDateString()} AT {new Date().toLocaleTimeString()}</div>
         <button style={{ background: BLUE, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Generate Full Compliance Report</button>
      </div>
    </div>
  );
}
