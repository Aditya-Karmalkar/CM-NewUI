# CuraMind — AI-Powered Health Management Platform

CuraMind is a premium, full-stack health management platform that combines high-fidelity design with AI-driven insights. It offers a unified experience for medication tracking, appointment scheduling, emergency profile management, and virtual health assistance.

---

## ✨ Features

| Feature | Description |
|---|---|
| **AI Health Assistant** | Advanced animated chat interface powered by **Bytez API** (Qwen, Llama, Mistral, Gemma, Phi models). |
| **Unified Health Dashboard** | High-fidelity medical dashboard with interactive charts, vitals tracking, and modular status views. |
| **Medication Manager** | Smart tracking system for active medications, dosages, and daily intake compliance. |
| **Appointment Scheduler** | Integrated booking system with **Leaflet maps** for facility discovery and internal calendar management. |
| **Emergency Profile** | Critical health data (Blood Type, Allergies, Contacts) accessible via public QR code for first responders. |
| **Virtual first-Aid Coach**| Step-by-step guidance for emergency scenarios integrated directly into the assistant. |
| **Health Records** | Secure management and overview of uploaded medical documents and lab reports. |
| **Smooth Experience** | **Lenis Smooth Scroll** and **Framer Motion** for a fluid, premium-grade browsing feel. |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **React Router v7**
- **Tailwind CSS** + **shadcn/ui** for the design system
- **Lenis** for high-performance smooth scrolling
- **Framer Motion** & **GSAP** for medical-grade animations
- **Chart.js** & **Recharts** for health data visualization
- **Leaflet** for facility discovery (Hospital/Pharmacy finder)
- **Lucide React** for premium iconography

### Backend & Services
- **Supabase** — PostgreSQL database, authentication, and secure storage
- **Firebase** — Additional authentication provider (Google OAuth, Emails)
- **Bytez API** — Multi-model LLM inference for the health assistant

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- **pnpm** (preferred package manager)

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd CM-New-main

# Install dependencies
pnpm install
```

### Running Locally
```bash
pnpm start
```
Opens [http://localhost:3000](http://localhost:3000) in development mode.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── newdashboard/   # Core unified dashboard (Vitals, Appointments, Assistant...)
│   │   └── pages/      # Individual dashboard sub-views
│   ├── landing/        # High-fidelity landing page components
│   ├── ui/             # Shadcn/ui & custom premium UI primitives
│   └── emergency/      # QR Profile & Public Emergency views
├── hooks/
│   ├── useLenis.js     # Smooth scroll configuration
│   └── useTheme.js     # Dark/Light mode management
├── context/            # React context (Settings, Toast)
└── supabase.js         # Backend client configuration
```

---

## 🌐 Netlify Deployment
The project includes a `netlify.toml` for zero-config deployment:
1. Link your repo to Netlify.
2. Add your `.env` variables in the Netlify Dashboard.
3. Build & Deploy (Automatic).

---

## 📜 License
Standard MIT License. See [LICENSE](./LICENSE) for full details.
