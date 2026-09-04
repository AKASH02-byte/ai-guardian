# AI Guardian — AI-Powered Continuous Cyber Risk Quantification & Investment Optimization Platform

[![SIH Problem Statement: SIH26105](https://img.shields.io/badge/SIH%20Problem%20Statement-SIH26105-blue.svg)](https://www.sih.gov.in/)
[![Team: BYTE](https://img.shields.io/badge/Team-BYTE%20(AU%2FSIH%2F26--108)-emerald.svg)](#team-byte)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688.svg)](https://fastapi.tiangolo.com/)
[![React + TypeScript](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript%20%7C%20Vite-61DAFB.svg)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **"Don't just tell me what is vulnerable. Tell me what it could cost, what I should fix first, and where I should spend my next ₹."**

---

## 1. Executive Summary & Problem Statement

Modern cybersecurity teams are overwhelmed by thousands of vulnerability alerts, static CVSS scores, and fragmented compliance dashboards that fail to communicate financial risk to business leadership.

**Smart India Hackathon 2026 Problem Statement:** `SIH26105`  
**Team Name:** `BYTE`  
**Team ID:** `AU/SIH/26-108`

**AI Guardian** bridges the gap between SecOps telemetry and executive capital allocation by answering four critical business questions:
1. **What cyber risks does the organization currently have?**
2. **How likely are those risks and what could they cost?**
3. **Which risks should be addressed first?** (Prioritization based on asset criticality, business valuation, and threat activity — not raw CVSS alone).
4. **Given a limited cybersecurity budget (e.g. ₹10 Lakhs), where should the organization invest to achieve maximum financial risk reduction?**

```
Cybersecurity Data (SIEM, EDR, CVEs)
    ↓
Continuous Risk Analysis
    ↓
Financial Risk Quantification (Expected Annual Loss in ₹)
    ↓
Integer 0-1 Knapsack Investment Optimization
    ↓
Explainable AI Recommendations & What-If Simulation
    ↓
Measurable Risk Reduction & C-Suite Reporting
```

---

## 2. Core Architecture

AI Guardian is built on a clean, decoupled service architecture:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + TS + Vite)                    │
│  - Executive Dashboard (Recharts Area/Bar Trend)                       │
│  - Risk Intelligence Matrix & Heatmap (Likelihood vs Impact)           │
│  - Asset Management & Criticality Registry                             │
│  - Business-Aware Vulnerability Prioritizer                            │
│  - Active Threat Intelligence Feed                                     │
│  - 0-1 Knapsack Investment Budget Optimizer                            │
│  - Interactive Real-Time What-If Simulator                             │
│  - Explainable AI Rationale & Factors                                  │
│  - Printable Board & Executive Risk Summary                            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP REST API (JSON)
┌───────────────────────────────────▼────────────────────────────────────┐
│                        BACKEND (FastAPI + Python)                      │
│  ├── API Route Handlers (/api/v1/*)                                    │
│  │     ├── Dashboard, Assets, Vulnerabilities, Threats                 │
│  │     ├── Controls, Investment Optimizer, Simulation, Reports         │
│  ├── Business Logic Services                                           │
│  │     ├── RiskEngine (Likelihood x Impact, EAL in ₹, 0-100 Score)     │
│  │     ├── InvestmentOptimizer (0-1 Knapsack Dynamic Programming)      │
│  │     ├── SimulationEngine (Interactive cumulative step mitigation)   │
│  │     └── MLRiskPredictor (scikit-learn RandomForest with importance) │
│  └── Data Layer                                                        │
│        ├── SQLAlchemy ORM (PostgreSQL ready / SQLite dev fallback)     │
│        └── Enterprise Seed Data (20 Assets, 20 CVEs, 8 Threats, etc.)  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Tooling & Bundler:** Vite
- **Styling:** Tailwind CSS (restrained enterprise cybersecurity palette, zero neon clutter)
- **Visualizations:** Recharts (30-day exposure trend, category distributions)
- **Icons:** Lucide React

### Backend
- **Framework:** Python 3.10+ / FastAPI
- **Data Validation:** Pydantic v2
- **ORM & Database:** SQLAlchemy 2.0 (SQLite for local zero-config, PostgreSQL for production)
- **Server:** Uvicorn ASGI

### Machine Learning & Optimization
- **Optimization:** Dynamic Programming 0-1 Knapsack Solver (Integer Linear Programming)
- **Machine Learning:** `scikit-learn` RandomForestRegressor with Feature Importance explainability
- **Data Manipulation:** `pandas`, `numpy`, `scipy`

---

## 4. Key Features

### A. Executive Dashboard
- Immediate financial visibility: **Current Cyber Risk (₹42.6L)**, **Expected Annual Loss (₹18.4L)**, **Security Posture (68/100)**, **Critical Risks (7)**, **Security Budget (₹10L)**.
- 30-day continuous risk exposure trend.
- NIST CSF domain maturity visualization (Govern, Identify, Protect, Detect, Respond, Recover).

### B. Business-Aware Risk & Vulnerability Prioritization
- Evaluates vulnerabilities using **CVSS + Exploit Availability + Internet Exposure + Asset Criticality + Data Sensitivity**.
- Eliminates "CVSS 9.0 on an isolated test server is treated worse than CVSS 7.5 on a public production core banking database".

### C. 0-1 Knapsack Investment Optimizer
- Given available budget constraint (e.g. ₹10,00,000):
  $$\text{Maximize } \sum x_i \cdot V_i \quad \text{subject to} \quad \sum x_i \cdot C_i \le B$$
- Selects optimal defense controls (MFA, EDR, Air-gapped Backups, WAF) to achieve maximum financial ROI and risk reduction.

### D. Interactive What-If Simulator
- Real-time simulation of security controls with instant API recalculation.
- Before/after step-by-step visual progression and residual risk calculation.

### E. Explainable AI Intelligence
- No generic hallucinating chatbots.
- Transparent "Why this recommendation?" explanations with quantified risk factors and model confidence ratings.

### F. Printable Executive & Board Summary Report
- Clean printable C-Suite briefing document (`window.print()`).

---

## 5. Getting Started & Installation

### Prerequisites
- Python 3.10 or higher
- Node.js 18+ & npm

### Clone the Repository
```bash
git clone <repository_url>
cd SIH
```

### Backend Setup
1. Create and activate a Python virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate       # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Initialize and seed the database with enterprise demo telemetry:
   ```bash
   python backend/seed.py
   ```
4. Start the FastAPI backend server:
   ```bash
   uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
   ```
   Backend API docs: `http://localhost:8000/docs`

### Frontend Setup
1. Navigate to frontend directory and install packages:
   ```bash
   cd frontend
   npm install
   ```
2. Start Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser at `http://localhost:5173`

---

## 6. Environment Configuration

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configurable parameters:
- `DATABASE_URL`: Defaults to `sqlite:///./aiguardian.db` (or set `postgresql://user:pass@localhost:5432/aiguardian`).
- `PORT`: 8000
- `CORS_ORIGINS`: Allowed client URLs (`http://localhost:5173`)

---

## 7. Mathematical & Quantitative Methodologies

### 1. Expected Annual Loss (EAL)
$$\text{EAL (₹)} = \text{Threat Likelihood (\%)} \times \text{Potential Financial Impact (₹)}$$

### 2. Business-Aware Vulnerability Priority Score
$$\text{Score} = \left( \text{CVSS} \times 3.5 + \text{ExploitBonus} + \text{ExposureBonus} \right) \times \frac{\text{AssetMultiplier}}{1.5}$$

### 3. Investment Optimization (0-1 Knapsack)
$$\text{Efficiency Ratio / ROI} = \frac{\text{Total Expected Risk Reduction (₹)}}{\text{Total Capital Investment (₹)}}$$

---

## 8. Hackathon 3-Minute Demo Flow

1. **Dashboard:** Start at the Executive Overview $\to$ Highlight **₹42.6L Current Risk** and **₹18.4L Expected Annual Loss**.
2. **Top Risk Inspection:** Click **Inspect** on *Ransomware on Production Core Database* $\to$ Review the root cause factors in the Slide-over Inspector Drawer.
3. **Investment Optimizer:** Navigate to **Investment Optimizer** $\to$ Enter ₹10,00,000 budget $\to$ Click **Optimize** $\to$ Review the algorithmically selected portfolio (MFA, EDR, Immutable Backup).
4. **What-If Simulation:** Navigate to **What-If Simulator** $\to$ Toggle controls interactively $\to$ Watch real-time residual risk decline to 56.6%.
5. **Reporting:** Navigate to **Reports** $\to$ Click **Print Executive Report** to display the Board presentation summary.

---

## 9. Team BYTE

- **Team ID:** AU/SIH/26-108
- **Smart India Hackathon 2026**
- **Domain:** Cybersecurity & GRC (Governance, Risk, and Compliance)

---

## 10. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
