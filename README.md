# ProjectPartner — Smart Student–Mentor Project Collaboration Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18.x-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-v4.x-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

> A modern, responsive, full-stack web application designed for college software engineering capstones and research initiatives. ProjectPartner bridges the disconnect between student ambition and mentor guidance through algorithmic skill-matching, team building, and milestone governance.

---

## 🌟 Key Features

- **Dual Role Ecosystem:** Distinct, purpose-built workspaces for **Students** (skill profiles, application tracking, milestone delivery) and **Mentors** (project studio, candidate ranking, team governance).
- **Rule-Based Skill-Matching Engine:** Transparent mathematical matching algorithm:
  $$\text{Match Percentage} = \left(\frac{|\text{Student Skills} \cap \text{Project Required Skills}|}{|\text{Project Required Skills}|}\right) \times 100$$
- **Interactive Live Skill Simulator:** Built-in on the landing page for immediate demonstration of the matching algorithm during college project presentations and viva examinations.
- **Enterprise-Grade UI/UX:** Built with a modern **Deep Indigo & Royal Purple** startup theme (`#4F46E5` / `#7C3AED` / `#2563EB`), glassmorphic panels, status pills, and responsive layout.
- **Full-Stack Diagnostics:** Real-time health check indicator on the top navigation bar showing backend connectivity and database status.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Lucide React Icons, Modern CSS Design System |
| **Backend** | Node.js, Express.js (ES Modules), RESTful API |
| **Database** | MongoDB with Mongoose ODM (Supports Local MongoDB and MongoDB Atlas) |
| **Security** | Salted Bcrypt Password Hashing, Signed JSON Web Tokens (JWT), Role-Based Access Control |
| **Development** | Concurrently, Morgan Logger, Vite Proxy |

---

## 📂 Project Directory Structure

```
Projectpartner/
├── client/                      # React + Vite Frontend
│   ├── public/                  # Favicon and static files
│   ├── src/
│   │   ├── components/          # Reusable UI elements (Navbar, Footer, Badges, Cards)
│   │   ├── pages/
│   │   │   ├── public/          # LandingPage, Login, Register
│   │   │   ├── student/         # StudentDashboard, Applications, Workspace
│   │   │   ├── mentor/          # MentorDashboard, ProjectStudio, Review
│   │   │   └── admin/           # AdminDashboard, System Governance
│   │   ├── index.css            # Complete design tokens, responsive utilities & theme
│   │   ├── App.jsx              # Client router with role definitions
│   │   └── main.jsx             # React entry point
│   ├── package.json
│   └── vite.config.js           # Vite dev server with /api proxy
│
├── server/                      # Express Backend API
│   ├── config/                  # Database connection pool (db.js)
│   ├── server.js                # Express app entry & health diagnostics
│   ├── .env.example             # Documented environment template
│   ├── .env                     # Local configuration
│   └── package.json
│
├── package.json                 # Root script runner (concurrently)
└── README.md
```

---

## 🚀 How to Run the Application

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance running at `mongodb://localhost:27017` OR MongoDB Atlas connection string)

### 1. Quick Start (Run Both Frontend & Backend Concurrently)
From the root `Projectpartner` directory:
```bash
npm run dev
```
This runs:
- **Server:** `http://localhost:5000` (API & Health Check)
- **Client:** `http://localhost:5173` (React Vite App)

### 2. Independent Execution (Optional)

**To run the Backend Server:**
```bash
cd server
npm run dev
```

**To run the Frontend Client:**
```bash
cd client
npm run dev
```

---

## 📡 API Health Check & Diagnostics

When the server is running, you can verify backend and database status at:
```http
GET http://localhost:5000/api/health
```

Sample Response:
```json
{
  "status": "success",
  "platform": "ProjectPartner API",
  "version": "1.0.0",
  "timestamp": "2026-11-11T06:18:26.697Z",
  "database": "connected",
  "message": "ProjectPartner Backend Service is operational"
}
```

---

## 📋 Development Roadmap Status

- [x] **Phase 1: Project Setup & Responsive Landing Page** *(Completed)*
  - Monorepo folder scaffolding
  - Express server with health diagnostic endpoint and CORS
  - React 18 + Vite frontend with responsive navigation and footer
  - Startup-grade Landing Page with Interactive Skill Match Simulator
  - Full-stack live API health indicator
  - Login & Register dual-role portals
- [ ] **Phase 2: Authentication & Role-Based Access Control (RBAC)** *(Next)*
- [ ] **Phase 3: Student & Mentor Profile Management**
- [ ] **Phase 4: Mentor Project Creation Studio**
- [ ] **Phase 5: Student Project Discovery & Multi-filter Search**
- [ ] **Phase 6: Student Application Submission**
- [ ] **Phase 7: Mentor Application Review Desk**
- [ ] **Phase 8: Team Formation & Assembly**
- [ ] **Phase 9: Live Skill-Matching Engine**
- [ ] **Phase 10: Milestones, Tasks & Progress Tracking**
- [ ] **Phase 11: Real-time Notifications & Mentor Feedback**
- [ ] **Phase 12: Admin Dashboard & Moderation**
- [ ] **Phase 13: End-to-End Testing & Viva Seed Data**
