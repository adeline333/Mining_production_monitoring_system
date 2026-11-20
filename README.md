# Mining Production Monitoring System

<div align="center">

# [CLICK HERE TO OPEN THE LIVE APPLICATION DEMO](https://miningproductionmonitoring.netlify.app/)

### Production URL: [https://miningproductionmonitoring.netlify.app/](https://miningproductionmonitoring.netlify.app/)

[![Live Demo](https://img.shields.io/badge/LIVE%20DEMO-OPEN%20WEB%20APP-2563EB?style=for-the-badge&logo=netlify&logoColor=white)](https://miningproductionmonitoring.netlify.app/)
[![API Status](https://img.shields.io/badge/API-ONLINE%20ON%20RENDER-10B981?style=for-the-badge&logo=render&logoColor=white)](https://mining-production-monitoring-system.onrender.com/api)

---

### Instant Demo Login Credentials
*Click any account on the login screen to autofill and enter immediately:*

| Role | Email | Password |
| :--- | :--- | :--- |
| **System Administrator** | `admin@mining.com` | `admin123` |
| **Shift Supervisor** | `supervisor@mining.com` | `super123` |
| **Field Operator** | `operator@mining.com` | `field123` |

---

</div>

A full-stack, enterprise-grade web application engineered to monitor, streamline, and optimize daily operations across mining sites. The platform provides real-time visibility into ore extraction, equipment fleet health, workplace safety incidents, shift allocations, and reporting workflows with comprehensive Role-Based Access Control (RBAC).

---

## Deployed Environments and Endpoints

- **Live Web Application:** [https://miningproductionmonitoring.netlify.app/](https://miningproductionmonitoring.netlify.app/)
- **Live REST API Backend:** [https://mining-production-monitoring-system.onrender.com/api](https://mining-production-monitoring-system.onrender.com/api)

---

## Demo Access and Role Details

The application includes pre-configured demo accounts to test role-specific dashboards and permissions. Demo accounts operate in a protected, read-only mode for destructive actions:

| Role | Email | Password | Permissions and Dashboard Access |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@mining.com` | `admin123` | Full system access, user administration, equipment management, reports, approvals |
| **Shift Supervisor** | `supervisor@mining.com` | `super123` | Production review & approval, equipment monitoring, incident oversight, reporting |
| **Field Operator** | `operator@mining.com` | `field123` | Daily production record entry, incident reporting, operational logging |
| *(Alternative Operator)* | `field@mining.com` | `field123` | Secondary verified field operator account |

> **Note:** If an unauthorized or unregistered user attempts to sign in, the login portal seamlessly routes to an **Account Assistance & Access Request** page (`/contact-admin`) to request provisioning from the administrator.

---

## Core System Modules

### 1. Real-Time Operations Dashboard
- High-level KPIs: Total extracted tonnage, active equipment count, ongoing maintenance, and incident summaries.
- Visual breakdown of mineral production yields by grade and mining location.
- Live system activity feed detailing recent approvals, equipment logs, and production updates.

### 2. Extraction and Production Tracking
- Granular production entry: Date, tonnage quantity, mineral type, location/pit ID, assigned shift, and operator.
- Formal review workflow: Shift supervisors review and transition entries across `Pending`, `Approved`, and `Rejected` statuses.
- Production volume calculations, working hours audit, and operational remarks.

### 3. Heavy Equipment and Fleet Management
- Machinery catalog: Excavators, Drills, Haulage Trucks, Front Loaders, and auxiliary fleet.
- Operational status lifecycle: `Operational`, `UnderMaintenance`, `Broken`, and `Idle`.
- Predictive maintenance tracking with recorded last maintenance and scheduled next service dates.
- Direct equipment assignment to operators and technicians.

### 4. Safety and Incident Logging
- HSE (Health, Safety, and Environment) issue tracking across categories: `Safety`, `Equipment`, `Environmental`, and `Production`.
- Severity classification: `Low`, `Medium`, `High`, and `Critical`.
- Incident lifecycle management (`Open` -> `InProgress` -> `Resolved` -> `Closed`) with corrective action logs and resolving personnel accountability.

### 5. Mineral Catalog and Shift Rosters
- Mineral inventory tracking (such as Gold, Copper, Diamond) with grade specifications (High Grade, Average Grade, Low Grade).
- Structured shift scheduling across three operating windows: Morning, Afternoon, and Night shifts.

### 6. Automated Reporting and Analytics
- Generation of consolidated Production Summaries and Equipment Utilization reports across custom date ranges.
- Integrated report viewer with formatted print/export capabilities and `Draft`, `Generated`, and `Approved` lifecycles.

### 7. User Administration and Security
- User directory with status toggling (Active / Inactive) and credential management.
- Multi-tier role permissions: `Admin`, `Supervisor`, `Technician`, `FieldOperator`, and `Auditor`.

---

## Technology Stack

### Frontend
- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 7](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/) (Single Page Application with client-side routing)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Visual Analytics:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)

### Backend
- **Runtime Environment:** [Node.js](https://nodejs.org/)
- **Server Framework:** [Express.js 4](https://expressjs.com/)
- **Database & ODM:** [MongoDB Atlas](https://www.mongodb.com/) via [Mongoose 8](https://mongoosejs.com/)
- **Security & Utilities:** Cross-Origin Resource Sharing (CORS), Dotenv environment configuration, custom RBAC authorization middleware
- **Serverless Adapter:** Vercel serverless entrypoint (`/api/index.js`) for serverless deployments

---

## Repository Architecture

```text
Mining_production_monitoring_system/
├── backend/
│   ├── api/
│   │   └── index.js              # Serverless entrypoint (for Vercel deployment)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js       # MongoDB Mongoose connection handler
│   │   ├── controllers/          # Business logic handlers
│   │   │   ├── authController.js
│   │   │   ├── equipmentController.js
│   │   │   ├── IncidentController.js
│   │   │   ├── mineralController.js
│   │   │   ├── productionController.js
│   │   │   ├── reportController.js
│   │   │   ├── shiftController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   └── auth.js           # Auth verification, RBAC & demo account guards
│   │   ├── models/               # Mongoose database schemas
│   │   │   ├── Equipment.js
│   │   │   ├── Incident.js
│   │   │   ├── Mineral.js
│   │   │   ├── ProductionRecord.js
│   │   │   ├── Report.js
│   │   │   ├── Shift.js
│   │   │   └── User.js
│   │   └── routes/               # Express API route endpoints
│   ├── package.json
│   └── server.js                 # Primary Express server initialization
│
├── frontend/
│   ├── public/
│   │   └── _redirects            # Netlify client-side routing rewrites
│   ├── src/
│   │   ├── assets/               # Static icons and graphics
│   │   ├── components/
│   │   │   ├── common/           # Layout, Sidebar, Navbar, ProtectedRoute
│   │   │   └── production/       # Reusable production forms & summary cards
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state and persistent session store
│   │   ├── pages/                # Primary application views
│   │   │   ├── ContactAdmin.jsx  # Account creation support & assistance
│   │   │   ├── Dashboard.jsx     # Executive monitoring dashboard
│   │   │   ├── Equipment.jsx     # Fleet management view
│   │   │   ├── Incidents.jsx     # Health & safety log view
│   │   │   ├── Login.jsx         # Sign in portal with 1-click demo fillers
│   │   │   ├── Minerals.jsx&Shifts.jsx
│   │   │   ├── Production.jsx    # Production logging & approvals
│   │   │   ├── Reports.jsx       # Report generation
│   │   │   ├── ReportViewer.jsx  # Printable report viewer
│   │   │   ├── Settings.jsx      # Profile details and password updates
│   │   │   └── Users.jsx         # Admin user directory
│   │   ├── services/             # Axios API service clients
│   │   ├── App.jsx               # Route definitions & 404 handler
│   │   └── main.jsx              # React DOM mounting
│   ├── netlify.toml              # Netlify build & rewrite rules
│   ├── package.json
│   └── vite.config.js
│
├── netlify.toml                  # Root Netlify configuration
├── vercel.json                   # Root Vercel serverless routing
└── README.md
```

---

## REST API Reference

All backend endpoints are prefixed with `/api`.

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | Public / Admin |
| `POST` | `/api/auth/login` | Authenticate credentials & retrieve session | Public |
| `GET` | `/api/auth/profile/:id` | Retrieve user profile (excluding password) | Authenticated |
| `PUT` | `/api/auth/profile/:id` | Update display name and email | Authenticated |
| `PUT` | `/api/auth/change-password/:id` | Update account password | Authenticated |

### Production Tracking (`/api/production`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/production` | List production records | Authenticated |
| `POST` | `/api/production` | Create new production record | FieldOperator, Supervisor |
| `GET` | `/api/production/statistics` | Aggregated tonnage & performance metrics | Supervisor, Admin, Auditor |
| `GET` | `/api/production/:id` | Get single production entry details | Authenticated |
| `PUT` | `/api/production/:id` | Update production entry | FieldOperator, Supervisor |
| `DELETE` | `/api/production/:id` | Remove production entry | Supervisor, Admin |
| `PUT` | `/api/production/:id/approve` | Transition record status to Approved | Supervisor |

### Equipment Management (`/api/equipment`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/equipment` | List all machinery and operational status | Authenticated |
| `POST` | `/api/equipment` | Register new equipment unit | Admin, Supervisor |
| `GET` | `/api/equipment/statistics` | Status counts and maintenance metrics | Admin, Supervisor, Auditor |
| `GET` | `/api/equipment/:id` | Get single equipment specifications | Authenticated |
| `PUT` | `/api/equipment/:id` | Update equipment specifications | Admin, Supervisor, Technician |
| `PUT` | `/api/equipment/:id/status` | Update status (Operational, Broken, etc.) | Admin, Supervisor, Technician |
| `PUT` | `/api/equipment/:id/usage` | Log maintenance and hour meters | Technician, Supervisor |
| `DELETE` | `/api/equipment/:id` | Delete equipment unit | Admin |

### Incidents and Safety (`/api/incidents`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/incidents` | List safety and equipment incident logs | Authenticated |
| `POST` | `/api/incidents` | Log a new incident | Technician, FieldOperator, Auditor |
| `GET` | `/api/incidents/statistics` | Severity distribution and resolution metrics | Admin, Supervisor, Auditor |
| `GET` | `/api/incidents/:id` | Get detailed incident report | Authenticated |
| `PUT` | `/api/incidents/:id` | Update incident description and severity | Admin, Supervisor |
| `PUT` | `/api/incidents/:id/status` | Update resolution status & action taken | Admin, Supervisor, Technician |
| `DELETE` | `/api/incidents/:id` | Remove incident record | Admin |

### Minerals and Shifts (`/api/minerals` & `/api/shifts`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/minerals` | List registered minerals and ore grades | Authenticated |
| `POST` | `/api/minerals` | Add a new mineral type | Admin, Supervisor |
| `PUT` | `/api/minerals/:id` | Update mineral specifications | Admin, Supervisor |
| `DELETE` | `/api/minerals/:id` | Remove mineral entry | Admin |
| `GET` | `/api/shifts` | List operational work shifts | Authenticated |
| `POST` | `/api/shifts` | Create a work shift schedule | Admin |
| `PUT` | `/api/shifts/:id` | Update shift hours or activation | Admin |
| `DELETE` | `/api/shifts/:id` | Delete shift schedule | Admin |

### Reports (`/api/reports`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reports` | List generated reports | Authenticated |
| `POST` | `/api/reports` | Create custom report document | Supervisor, Admin, Auditor |
| `POST` | `/api/reports/generate/production` | Compile date-range production summary | Supervisor, Admin, Auditor |
| `POST` | `/api/reports/generate/equipment` | Compile equipment health summary | Supervisor, Admin, Auditor |
| `PUT` | `/api/reports/:id/approve` | Sign off and approve report | Admin, Supervisor |
| `DELETE` | `/api/reports/:id` | Delete report | Admin |

### Users (`/api/users`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | List all system user accounts | Admin |
| `GET` | `/api/users/:id` | Get user details | Admin |
| `PUT` | `/api/users/:id` | Update user role and contact information | Admin |
| `PUT` | `/api/users/:id/toggle-status` | Toggle user active/inactive status | Admin |
| `DELETE` | `/api/users/:id` | Remove user account | Admin |

---

## Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.x or later recommended)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (Local instance or free MongoDB Atlas URI)

### 1. Clone Repository
```bash
git clone https://github.com/adeline333/Mining_production_monitoring_system.git
cd Mining_production_monitoring_system
```

### 2. Configure & Run Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
```

Start the backend API server:
```bash
# Production start
npm start

# Development with automatic restart
npm run dev
```
The backend API will run on `http://localhost:5000`.

### 3. Configure & Run Frontend
In a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory (or use default fallback):
```env
VITE_API_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev
```
Open your browser and navigate to the local URL (typically `http://localhost:5173`).

---

## Security and Access Control Features

1. **Role-Based Routing:** Every client route is guarded by `<ProtectedRoute allowedRoles={[...]} />`. Unauthenticated requests redirect to `/login`; unauthorized roles receive a standard Access Denied view.
2. **Demo Mode Safeguards:** Middleware (`preventDemoModification`) intercepts write operations (`POST`, `PUT`, `DELETE`) for registered demo accounts (`admin@mining.com`, `supervisor@mining.com`, `operator@mining.com`, `field@mining.com`), ensuring that public demo testing cannot tamper with baseline database records.
3. **SPA Redirect Resilience:** Configured `_redirects` and `netlify.toml` ensure that single-page application navigation, page reloads, and direct deep-links never result in 404 errors.

---

## License
This project is proprietary and developed for industrial mining production monitoring and fleet operations.

