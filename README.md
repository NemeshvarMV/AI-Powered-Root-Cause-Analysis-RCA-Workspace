# AIVOA.AI — Root Cause Analysis Workspace

[![Stack: React + Redux](https://img.shields.io/badge/Frontend-React_18_+_Redux_Toolkit-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Stack: Python + FastAPI](https://img.shields.io/badge/Backend-Python_3.12_+_FastAPI-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![AI: LangGraph + Groq](https://img.shields.io/badge/AI_Orchestration-LangGraph_+_Groq-F55036?logo=groq&logoColor=white)](https://langchain-ai.github.io/langgraph/)
[![Database: PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_14+-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Compliance: ICH Q7 / Q9(R1) / Q10](https://img.shields.io/badge/Compliance-ICH_Q7_|_Q9(R1)_|_Q10-10B981)](#pharmaceutical-domain-grounding)
[![Tests: 19 Passed](https://img.shields.io/badge/Automated_Tests-19_Passed_(100%25)-brightgreen)](#running-automated-tests)

A complete, enterprise-grade **AI-Powered Root Cause Analysis (RCA) and CAPA Module** designed specifically for pharmaceutical manufacturing of Active Pharmaceutical Ingredients (APIs).

---

## Technical Documentation Index

Comprehensive architectural, workflow, and engineering documentation is available in the [`docs/`](docs/) directory:

| Document | Description |
|---|---|
| **[Project Overview](docs/PROJECT_OVERVIEW.md)** ([PDF](docs/PROJECT_OVERVIEW.pdf)) | Problem statement, objectives, user personas, scope, and feature matrix. |
| **[System Architecture](docs/SYSTEM_ARCHITECTURE.md)** | Three-tier architecture, component responsibilities, end-to-end sequence diagram, and integration boundaries. |
| **[Frontend Architecture](docs/FRONTEND.md)** | React 18, Redux Toolkit slices, 4-step wizard, design system tokens, and API client integration. |
| **[Backend Architecture](docs/BACKEND.md)** | FastAPI application structure, endpoints, services, defensive PDF validation, and error handling. |
| **[AI Pipeline & LangGraph](docs/AI_PIPELINE.md)** | LangGraph `StateGraph`, node execution, Groq `llama-3.3-70b-versatile`, prompts, and deterministic fallback parser. |
| **[RCA Workflow](docs/RCA_WORKFLOW.md)** | Multi-modal intake, 5 Whys, 6M Fishbone, methodology isolation, cause confirmation, and evidence gap tracking. |
| **[CAPA Workflow](docs/CAPA_WORKFLOW.md)** | Corrective actions vs. Preventive actions (ICH Q10), causal linkage, effectiveness checks, and review lifecycle. |
| **[Database Architecture](docs/DATABASE.md)** | Relational schema across 8 GxP tables, columns, constraints, foreign keys, ER diagram, and atomic transactions. |
| **[REST API Reference](docs/API_REFERENCE.md)** | Exhaustive endpoint documentation with request/response schemas, query parameters, and status codes. |
| **[Security & Governance](docs/SECURITY.md)** | Secrets management, defensive byte validation, zero model retention, Part 11 audit trails, and risk roadmap. |
| **[Automated Testing Report](docs/TESTING.md)** | Automated test suite execution, 19 verified passing tests, coverage matrix, and testing commands. |
| **[Setup & Deployment Guide](docs/SETUP_AND_DEPLOYMENT.md)** | Prerequisites, local installation, environment variables, production build, Nginx reverse proxy, and troubleshooting. |
| **[Developer Guide](docs/DEVELOPMENT_GUIDE.md)** | Repository structure, coding conventions, adding endpoints, extending LangGraph nodes, and safe modifications. |
| **[Known Issues & Roadmap](docs/KNOWN_ISSUES.md)** | Feature status matrix (verified vs. unverified), current limitations, and engineering priority roadmap. |
| **[Video 1: Demo Walkthrough Script](docs/DEMO_VIDEO_SCRIPT.md)** | Spoken script and on-screen action guide for the 5–8 minute product demonstration video. |
| **[Video 2: Code Walkthrough Script](docs/CODE_WALKTHROUGH_SCRIPT.md)** | Spoken script and technical screen guide for the 5–10 minute implementation walkthrough video. |

---

## Table of Contents
1. [Project Overview & Mission](#project-overview--mission)
2. [End-to-End Quality Workflow](#end-to-end-quality-workflow)
3. [Technology Stack](#technology-stack)
4. [Architecture & Project Structure](#architecture--project-structure)
5. [Prerequisites & Environment Setup](#prerequisites--environment-setup)
6. [Database Setup & Schema](#database-setup--schema)
7. [Running the Application](#running-the-application)
8. [Groq AI & Model Configuration](#groq-ai--model-configuration)
9. [Running Automated Tests](#running-automated-tests)
10. [Sample Incident & Demonstration Guide](#sample-incident--demonstration-guide)
11. [REST API Contract Summary](#rest-api-contract-summary)
12. [Human Oversight & Safeguards](#human-oversight--safeguards)
13. [Demonstration Video Scripts](#demonstration-video-scripts)
14. [Troubleshooting & Known Limitations](#troubleshooting--known-limitations)

---

## Project Overview & Mission

In pharmaceutical API production, quality deviations—such as Out-of-Specification (OOS) analytical test results, yield discrepancies, or equipment anomalies—demand rigorous investigation under cGMP regulations. Traditional investigation workflows suffer from fragmented data entry, delayed cause identification, and inconsistent CAPA definitions.

**AIVOA.AI** eliminates manual transcription while preserving absolute regulatory compliance:
- **Multi-Source Intake:** Ingests official PDF deviation reports, pasted laboratory observations, or escalation email notices.
- **AI-First Extraction:** LangGraph orchestrates Groq LLM inference to extract structured fields and automatically populate an editable investigation form.
- **Root Cause Analysis (RCA):** Generates structured 5 Whys question-answer chains and Ishikawa 6M fishbone categorizations.
- **Actionable Evidence Gaps:** Automatically flags missing records, sensor logs, and raw material CoAs required under cGMP.
- **Risk-Grounded CAPA:** Recommends corrective containment actions and preventive systemic improvements.
- **Human Oversight Safeguard:** AI findings remain suggestions. Only qualified investigators can confirm root causes or approve CAPA plans.

---

## End-to-End Quality Workflow

```mermaid
flowchart LR
    A[Source Document Intake<br/>PDF / Text / Email] --> B[LangGraph Extraction<br/>Groq Llama 3.3 70B]
    B --> C[Editable RCA Form<br/>Visual AI Indicators]
    C --> D[Root Cause Analysis<br/>5 Whys & Fishbone 6M]
    D --> E[Missing Evidence Gaps<br/>Actionable Checklist]
    E --> F[CAPA Recommendations<br/>Corrective & Preventive]
    F --> G[Human Review & Signoff<br/>PostgreSQL Persistence]
```

---

## Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React + Redux Toolkit | 18.x / 2.x | Reactive UI, state management, controlled inputs, and AI indicators |
| **Styling** | Vanilla Modern CSS | CSS3 / Glassmorphism | Dark enterprise design system, Inter typography, responsive layouts |
| **Backend** | Python + FastAPI | 3.12 / 0.161.x | Asynchronous RESTful API endpoints and business logic |
| **AI Orchestration**| LangGraph | 1.2.x | Typed `StateGraph` workflow, conditional routing, validation |
| **AI Inference** | Groq API | SDK 0.37.x | High-speed LLM inference (`llama-3.3-70b-versatile`, `gemma2-9b-it`) |
| **Database** | PostgreSQL | 18.x | Relational persistence, transactional cascades, foreign keys |
| **PDF Extraction**| PyPDF | 6.21.x | Memory-safe text extraction from untrusted PDF binaries |
| **Testing** | Pytest + HTTPX | 9.x / 0.28.x | Automated backend unit and integration test suite |

---

## Architecture & Project Structure

```
AI-Powered Root Cause Analysis/
├── backend/
│   ├── app/
│   │   ├── api/v1/
│   │   │   ├── api_router.py           # Unified router aggregation
│   │   │   └── endpoints/
│   │   │       ├── health.py           # Health check & engine diagnostics
│   │   │       ├── extractions.py      # PDF, text, email extraction endpoint
│   │   │       ├── investigations.py   # Transactional CRUD & human review
│   │   │       ├── rca.py              # 5 Whys, 6M generation & human confirmation
│   │   │       ├── capa.py             # Corrective & preventive recommendations
│   │   │       └── evidence.py         # Missing evidence tracker & status updates
│   │   ├── core/
│   │   │   ├── config.py               # Pydantic Settings & environment variables
│   │   │   └── database.py             # SQLAlchemy engine, session maker, init_db()
│   │   ├── models/                     # SQLAlchemy 2.0 relational models (8 tables)
│   │   │   ├── investigation.py        # Parent quality investigation entity
│   │   │   ├── source_document.py      # Raw intake document metadata & text
│   │   │   ├── evidence_item.py        # Evidence gap item & verification state
│   │   │   ├── root_cause.py           # Proposed & confirmed root causes
│   │   │   ├── capa_action.py          # Corrective & preventive actions
│   │   │   ├── five_whys.py            # 5 Whys question-answer chain steps
│   │   │   ├── fishbone.py             # Ishikawa 6M categorization factors
│   │   │   └── review_event.py         # ALCOA+ audit trail & review history
│   │   ├── schemas/                    # Pydantic v2 request/response models
│   │   │   ├── extraction.py
│   │   │   ├── investigation.py
│   │   │   ├── rca.py
│   │   │   ├── capa.py
│   │   │   └── evidence.py
│   │   ├── services/
│   │   │   ├── extraction_service.py   # Unified intake pipeline
│   │   │   ├── rca_service.py          # RCA orchestration & cause confirmation
│   │   │   ├── capa_service.py         # CAPA generation & review actions
│   │   │   ├── pdf_service.py          # Secure PDF text extraction
│   │   │   ├── llm_factory.py          # Groq client factory & availability detector
│   │   │   └── seed_demo_data.py       # Baseline pharmaceutical API demo seed
│   │   ├── workflows/
│   │   │   ├── rca_graph.py            # LangGraph StateGraph orchestration
│   │   │   ├── state.py                # Typed RcaWorkflowState definition
│   │   │   └── prompts.py              # Grounded ICH Q7/Q9(R1) prompts
│   │   └── main.py                     # FastAPI application entry point
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/apiClient.js            # Unified frontend HTTP API service
│   │   ├── components/
│   │   │   ├── layout/                 # Sidebar, TopBar, NotificationToast
│   │   │   ├── dashboard/              # DashboardView (metrics & directory)
│   │   │   ├── intake/                 # SourceIntakePanel (PDF, text, email)
│   │   │   ├── investigation/          # InvestigationForm & WorkspaceView
│   │   │   ├── rca/                    # RcaWorkspace (5 Whys, Fishbone, Causes)
│   │   │   ├── evidence/               # EvidenceGapTracker
│   │   │   ├── capa/                   # CapaManager
│   │   │   ├── modals/                 # Human confirmation & review modals
│   │   │   └── review/                 # AuditTrailViewer
│   │   ├── store/                      # Redux Toolkit slices (6 domain slices)
│   │   ├── App.jsx                     # Root component layout & view router
│   │   └── index.css                   # Enterprise design system CSS
│   ├── package.json
│   └── vite.config.js                  # Vite dev server with proxy to backend
├── sample_data/
│   ├── sample_oos_impurity_incident.pdf  # Generated realistic pharmaceutical PDF
│   ├── sample_incident_text.txt          # Pasted incident report text
│   └── sample_incident_email.txt         # QA escalation email format
├── docs/
│   ├── DEMO_VIDEO_SCRIPT.md            # Product Demonstration Script (5-8 min)
│   └── CODE_WALKTHROUGH_SCRIPT.md      # Code Explanation Script (5-10 min)
├── tests/
│   ├── conftest.py                     # Pytest fixtures & isolated in-memory DB
│   └── test_api_and_services.py        # 13 automated test cases
├── .env.example                        # Environment template with placeholders
├── pytest.ini                          # Pytest configuration
└── README.md
```

---

## Prerequisites & Environment Setup

1. **Python:** Python 3.12+ (or via `uv`)
2. **Node.js:** Node.js v18+ and npm
3. **Database:** PostgreSQL Server 14+ running locally or in Docker
4. **AI Inference (Optional for offline demo):** A free Groq API key from [https://console.groq.com/keys](https://console.groq.com/keys).

### Installation
Clone or navigate to the project directory:
```bash
# Install Python backend dependencies using uv
uv sync

# Or using pip in your virtual environment:
pip install -r backend/requirements.txt

# Install frontend dependencies
cd frontend
npm install
cd ..
```

---

## Database Setup & Schema

1. Ensure PostgreSQL is running. By default, connect with user `postgres` on port 5432.
2. Create the target database `aivoa_rca` if it doesn't already exist:
   ```powershell
   # Windows PowerShell
   & 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -U postgres -c "CREATE DATABASE aivoa_rca;"
   ```
3. Initialize the database schema and seed the demonstration investigation:
   ```bash
   uv run python -m backend.app.services.seed_demo_data
   ```
   This creates all 8 relational tables:
   - `investigations`
   - `source_documents`
   - `evidence_items`
   - `five_whys_steps`
   - `fishbone_factors`
   - `root_causes`
   - `capa_actions`
   - `review_events`

---

## Running the Application

### 1. Start the Backend API Server
In the root directory:
```bash
uv run uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will start at `http://127.0.0.1:8000`.  
Interactive Swagger documentation is available at `http://127.0.0.1:8000/docs`.

### 2. Start the Frontend Dev Server
In a separate terminal:
```bash
cd frontend
npm run dev
```
The Vite development server will start at `http://127.0.0.1:5173`.  
Open your browser and navigate to `http://127.0.0.1:5173`.

---

## Groq AI & Model Configuration

Create a `.env` file in the root directory (copied from `.env.example`):
```env
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/aivoa_rca
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

### Supported Models
- `llama-3.3-70b-versatile` (Recommended default: exceptional reasoning and JSON formatting)
- `gemma2-9b-it` (High-speed option)
- `llama-3.1-8b-instant` (Fast extraction option)

> **Resilient Offline Architecture:** If `GROQ_API_KEY` is not provided or the network is offline, the backend activates its deterministic domain-grounded extraction and RCA engine based on the pharmaceutical incident model. This guarantees that evaluation, testing, and UI demonstrations function 100% out of the box without crashing.

---

## Running Automated Tests

Run the full pytest suite from the project root:
```bash
uv run pytest -v
```

### Test Coverage Results
```
tests/test_api_and_services.py::test_health_check PASSED                 [  7%]
tests/test_api_and_services.py::test_pdf_extraction_empty_bytes PASSED   [ 15%]
tests/test_api_and_services.py::test_pdf_extraction_invalid_magic_bytes PASSED [ 23%]
tests/test_api_and_services.py::test_pdf_upload_endpoint_valid PASSED    [ 30%]
tests/test_api_and_services.py::test_pdf_upload_invalid_extension PASSED [ 38%]
tests/test_api_and_services.py::test_text_intake_success PASSED          [ 46%]
tests/test_api_and_services.py::test_email_intake_success PASSED         [ 53%]
tests/test_api_and_services.py::test_empty_content_validation PASSED     [ 61%]
tests/test_api_and_services.py::test_langgraph_workflow_execution PASSED [ 69%]
tests/test_api_and_services.py::test_rca_preview_generation PASSED       [ 76%]
tests/test_api_and_services.py::test_capa_preview_generation PASSED      [ 84%]
tests/test_api_and_services.py::test_investigation_lifecycle_and_safeguards PASSED [ 92%]
tests/test_api_and_services.py::test_not_found_investigation PASSED      [100%]

============================= 13 passed in 0.36s ==============================
```

---

## Sample Incident & Demonstration Guide

The repository includes a synthetic, realistic pharmaceutical API quality deviation:
- **Incident Reference:** `DEV-2026-0841`
- **Product:** Atorvastatin Calcium Trihydrate API (USP/EP Grade)
- **Batch Number:** `ATC-2026-B09`
- **Deviation:** Analytical QC release testing detected Out-of-Specification (OOS) Related Substance Impurity D at **0.28% (w/w)** against specification **<= 0.15% (w/w)**.
- **Root Cause Mechanism:** Agitated Nutsche Filter-Dryer ANFD-02 heating jacket pneumatic control valve V-104 failed to throttle closed due to particulate diaphragm fouling, causing an unmonitored thermal spike to 58°C (target was 40°C ± 2°C) and accelerating thermal hydrolysis.

### Test Files Repository in `sample_data/` (30 Unique Datasets):

#### 1. Official PDF Deviation Reports (10 Unique PDFs)
Generated using ReportLab conforming to cGMP deviation reporting layouts, with tables, analytical parameters, and signatures:
1. `incident_pdf_01_atorvastatin_impurity_d.pdf`: Atorvastatin Calcium API — Impurity D thermal degradation during vacuum drying.
2. `incident_pdf_02_losartan_residual_solvent.pdf`: Losartan Potassium API — Residual Methylene Chloride (DCM) OOS from chiller failure.
3. `incident_pdf_03_semaglutide_dimer_formation.pdf`: Semaglutide Peptide API — High Molecular Weight Impurities (Dimer) from buffer pH drift.
4. `incident_pdf_04_paracetamol_discoloration.pdf`: Acetaminophen API — Absorbance/color failure from carbon filter bypass gasket leak.
5. `incident_pdf_05_metformin_particulate_matter.pdf`: Metformin HCl API — 316L SS metallic wire particles from fluid bed agitator friction.
6. `incident_pdf_06_montelukast_polymorphic_failure.pdf`: Montelukast Sodium API — XRPD polymorphic form failure from anti-solvent crash cooling.
7. `incident_pdf_07_ciprofloxacin_water_content_oos.pdf`: Ciprofloxacin HCl API — Karl Fischer water content OOS from clogged centrifuge wash nozzle.
8. `incident_pdf_08_apixaban_particle_size_drift.pdf`: Apixaban Micronized API — Particle size d90 coarse drift from jet mill pressure rupture.
9. `incident_pdf_09_rosuvastatin_enantiomeric_purity.pdf`: Rosuvastatin Calcium API — Chiral enantiomer drop from sulfur-poisoned catalyst.
10. `incident_pdf_10_azithromycin_heavy_metals_palladium.pdf`: Azithromycin Dihydrate API — ICP-MS Palladium metal OOS from scavenger column channeling.

#### 2. Pasted Text / Lab & Shift Notes (10 Unique Text Files)
Realistic analytical lab investigation logs, shift handover notes, and supervisor forensic reports:
1. `incident_text_01_omeprazole_sulfone_degradation.txt`: Omeprazole API — Sulfone degradation from nitrogen blanket loss in centrifuge.
2. `incident_text_02_ibuprofen_bulk_density_deviation.txt`: Ibuprofen DC Grade — Bulk density failure from wet mill over-shearing.
3. `incident_text_03_amoxicillin_coupling_yield_loss.txt`: Amoxicillin Trihydrate — Yield collapse from Penicillin Acylase enzyme thermal deactivation.
4. `incident_text_04_gabapentin_chloride_exhaustion.txt`: Gabapentin USP — Inorganic chloride failure from anion-exchange resin breakthrough.
5. `incident_text_05_levothyroxine_photooxidation_drift.txt`: Levothyroxine Sodium — Potency loss from clear tubing photo-oxidation.
6. `incident_text_06_doxycycline_epimer_increase.txt`: Doxycycline Hyclate — 4-Epidoxycycline epimer increase during extended slurry hold.
7. `incident_text_07_clopidogrel_optical_rotation_drop.txt`: Clopidogrel Bisulfate — Specific optical rotation drop from cooling brine overshoot.
8. `incident_text_08_sitagliptin_genotoxic_alkyl_halide.txt`: Sitagliptin Phosphate — Trace alkylating genotoxin from truncated cake displacement wash.
9. `incident_text_09_propofol_homogenization_droplet_growth.txt`: Propofol Crude Oil — Emulsion droplet diameter OOS from microfluidizer cavitation wear.
10. `incident_text_10_valacyclovir_guanine_hydrolysis.txt`: Valacyclovir HCl — Guanine byproduct formation from rapid exothermic acid addition.

#### 3. Urgent Email QA Escalation Notices (10 Unique Email Files)
Realistic QA Manager, QC Chemist, and Regulatory Affairs email escalations with Subject, From, To, Date, and detailed findings:
1. `incident_email_01_semaglutide_bioburden_alert.txt`: Semaglutide API — Pre-crystallization bioburden alert on UF/DF skid.
2. `incident_email_02_atorvastatin_hplc_oos_escalation.txt`: Atorvastatin Calcium — Confirmed OOS Pyrrole Impurity H on commercial launch lot.
3. `incident_email_03_losartan_nitrosamine_trace_screening.txt`: Losartan Potassium — Trace NMBA nitrosamine screening alert in recovered solvent.
4. `incident_email_04_pantoprazole_desiccant_seal_compromise.txt`: Pantoprazole Sodium — High humidity ingress from heat induction seal compromise.
5. `incident_email_05_empagliflozin_solvate_loss.txt`: Empagliflozin API — Cocrystal solvate stoichiometry loss during vacuum tray drying.
6. `incident_email_06_sertraline_mandelate_chiral_inversion.txt`: Sertraline HCl — Agitator stoppage during mandelic acid resolution causing chiral inversion.
7. `incident_email_07_amoxicillin_agitator_shear_drop.txt`: Amoxicillin Trihydrate — Agitator VFD frequency reduction causing crystal habit change.
8. `incident_email_08_tacrolimus_tautomer_spike_alert.txt`: Tacrolimus API — Tautomer II equilibrium shift from evaporator vacuum loss.
9. `incident_email_09_remdesivir_cyano_intermediate_oos.txt`: Remdesivir Intermediate — Bis-cyano byproduct from cryogenic cooling solenoid failure.
10. `incident_email_10_ritonavir_polymorphic_form_ii_nucleation.txt`: Ritonavir API — Spontaneous nucleation of insoluble Form II polymorph on holding tank.


---

## REST API Contract Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health check, PostgreSQL status, and Groq engine mode |
| `POST`| `/api/v1/extractions` | Ingests PDF file upload, text, or email and runs LangGraph extraction |
| `POST`| `/api/v1/investigations` | Creates and persists reviewed investigation and related children |
| `GET` | `/api/v1/investigations` | Lists investigations with search and status filtering |
| `GET` | `/api/v1/investigations/{id}`| Retrieves deep investigation with 5 Whys, Fishbone, Evidence, and CAPA |
| `PUT` | `/api/v1/investigations/{id}`| Updates editable investigation fields |
| `POST`| `/api/v1/investigations/{id}/review` | Formal human review signoff and lifecycle status update |
| `DELETE`| `/api/v1/investigations/{id}`| Cascading deletion of investigation |
| `POST`| `/api/v1/investigations/{id}/rca` | Generates 5 Whys and Fishbone RCA for existing record |
| `POST`| `/api/v1/rca-preview` | In-memory RCA generation before database persistence |
| `POST`| `/api/v1/investigations/{id}/rca/causes/{cid}/confirm` | Human investigator root cause confirmation safeguard |
| `POST`| `/api/v1/investigations/{id}/capa` | Generates Corrective & Preventive action recommendations |
| `PUT` | `/api/v1/investigations/{id}/capa/{cid}` | Human review decision (Accept, Reject, Modify) on CAPA |
| `PUT` | `/api/v1/investigations/{id}/evidence/{eid}` | Updates evidence gap status (Requested, Received, Reviewed) |

---

## Human Oversight & Safeguards

In accordance with ICH Q9(R1) and regulatory quality systems:
1. **No Auto-Confirmation:** The AI is strictly prohibited from marking any potential root cause as `Investigator Confirmed`. Initial AI statuses are constrained to `Proposed` or `Under Investigation`.
2. **Explicit Qualification Action:** Only an investigator workflow action requiring reviewer identity and documentary justification can transition a cause to `Investigator Confirmed`.
3. **Data Provenance Tracking:** All fields populated by AI are visibly highlighted with blue indicator badges. If a user modifies an AI value, the badge dynamically transitions to an amber `User Edited` tag.
4. **CAPA Accountability:** Recommendations require explicit acceptance, designated human ownership, target completion dates, and effectiveness check criteria.
5. **ALCOA+ Audit Trail:** All extraction runs, manual edits, status transitions, and signoff events are logged chronologically in the `review_events` table.

---

## Demonstration Video Scripts

Two fully scripted recording guides are provided in the repository:
1. **[Product Demonstration Script (5–8 minutes)](docs/DEMO_VIDEO_SCRIPT.md):** Focuses on user experience, multi-source intake, real-time extraction, automatic form population, 5 Whys/Fishbone, evidence gap tracking, CAPA review, and database persistence.
2. **[Technical Code Explanation Script (5–10 minutes)](docs/CODE_WALKTHROUGH_SCRIPT.md):** Detailed walkthrough of FastAPI endpoints, LangGraph state machine, Groq integration, Redux Toolkit slices, and database models.

---

## Troubleshooting & Known Limitations

- **PDF Text Extraction:** Scanned image PDFs without embedded text layers require an OCR pre-processor. The application clearly reports `OCR required` rather than fabricating output.
- **PostgreSQL Port:** Default port is `5432`. If your PostgreSQL instance runs on a different port, update `DATABASE_URL` in `.env`.
- **CORS Configuration:** If accessing the frontend from a non-standard port or hostname, add it to `CORS_ORIGINS` in `.env`.

---

## Submission & Privacy Notice
*This software is part of the AIVOA.AI Candidate Assignment. In accordance with assignment instructions, do not publish this project, source code, demo recordings, or sample materials to any public repository.*
