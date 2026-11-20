# Mining Production Monitoring System

<div align="center">

# [Open Live Demo](https://miningproductionmonitoring.netlify.app/)

**Live Application:** [https://miningproductionmonitoring.netlify.app/](https://miningproductionmonitoring.netlify.app/)

---

### Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@mining.com` | `admin123` |
| **Supervisor** | `supervisor@mining.com` | `super123` |
| **Field Operator** | `operator@mining.com` | `field123` |

---

</div>

## Overview
A web-based monitoring platform for mining site operations, providing real-time tracking of mineral extraction, heavy equipment fleet status, workplace safety incidents, and shift management with role-based access control.

## Key Features
- **Operations Dashboard:** Real-time visibility into production tonnage, equipment operational states, and site activity.
- **Production Records:** Log mineral output by pit location, shift, and mineral type with supervisor approval workflow.
- **Equipment Fleet Management:** Track machinery status (Operational, Under Maintenance, Broken, Idle) and service schedules.
- **Safety & Incident Logging:** HSE incident logging with severity levels (Low, Medium, High, Critical) and resolution tracking.
- **Minerals & Shifts:** Manage mineral types (Copper, Gold, Diamond) and work shift allocations (Morning, Afternoon, Night).
- **Reports & Analytics:** Generate consolidated production and equipment summaries for review and printing.
- **User Administration:** Admin control over user accounts and role permissions (Admin, Supervisor, Technician, Field Operator, Auditor).

## Architecture and Tech Stack

```text
Mining_production_monitoring_system/
├── backend/                              # Express.js REST API (Node.js, MongoDB Atlas, Mongoose 8)
│   ├── api/                              # Serverless entrypoint (Vercel deployment)
│   ├── src/
│   │   ├── config/                       # database.js (MongoDB Mongoose connection)
│   │   ├── controllers/                  # Business logic (Auth, Production, Equipment, Incidents, Reports, Shifts, Users)
│   │   ├── middleware/                   # Authentication, RBAC authorize, demo account read-only guard
│   │   ├── models/                       # Mongoose schemas (User, ProductionRecord, Equipment, Incident, Mineral, Shift, Report)
│   │   └── routes/                       # Express routes (/auth, /production, /equipment, /incidents, /reports, /minerals, /shifts, /users)
│   ├── package.json
│   └── server.js                         # Server entrypoint and Express configuration
├── frontend/                             # React 19 SPA (Vite + Tailwind CSS v4)
│   ├── public/                           # Static assets and _redirects (Netlify SPA routing rules)
│   ├── src/
│   │   ├── assets/                       # Static SVGs and icons
│   │   ├── components/                   # DashboardLayout, Sidebar, Navbar, ProtectedRoute, production components
│   │   ├── context/                      # AuthContext (authentication state and session persistence)
│   │   ├── pages/                        # Dashboard, Production, Equipment, Incidents, Reports, Users, Settings, Login, ContactAdmin
│   │   ├── services/                     # Axios API clients (authService, productionService, equipmentService, etc.)
│   │   ├── App.jsx                       # Route definitions and 404 handler
│   │   └── main.jsx                      # React DOM root mounting
│   ├── netlify.toml                      # Netlify build and rewrite configuration
│   ├── package.json
│   └── vite.config.js
├── netlify.toml                          # Root Netlify configuration
└── vercel.json                           # Root Vercel serverless configuration
```

- **Frontend:** React 19, Vite, Tailwind CSS v4, Lucide React, Recharts, Axios, React Router v7
- **Backend:** Node.js, Express.js 4, Mongoose 8
- **Database:** MongoDB Atlas
- **Hosting & Infrastructure:** Netlify (Frontend SPA), Render (REST API Backend)

## Local Setup

### 1. Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

## License
Proprietary - Developed for industrial mining operations monitoring.
