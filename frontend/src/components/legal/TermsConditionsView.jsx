import React from 'react';
import { useDispatch } from 'react-redux';
import { ShieldCheck, UserCheck, FileCheck, AlertTriangle, ArrowLeft, Scale, Award, BookOpen } from 'lucide-react';
import { setActiveView } from '../../store/uiSlice';

export default function TermsConditionsView() {
  const dispatch = useDispatch();

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          className="btn btn-secondary"
          onClick={() => dispatch(setActiveView('dashboard'))}
          style={{ fontSize: '13px', padding: '6px 14px' }}
        >
          <ArrowLeft size={15} />
          <span>Back to Dashboard</span>
        </button>
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          Document ID: <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>TOC-QA-SaaS-002</span> | Version: 2.4
        </div>
      </div>

      {/* Hero Banner */}
      <div
        className="glass-card"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: 'rgba(56, 189, 248, 0.2)',
              color: '#38bdf8',
            }}
          >
            Regulatory & Operational Terms
          </span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>ICH Q10 • Quality Agreement</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Terms & Conditions of Service
        </h1>
        <p style={{ fontSize: '13.5px', color: '#cbd5e1', marginTop: '6px', lineHeight: 1.5 }}>
          These terms govern access to and usage of the AIVOA Pharmaceutical Root Cause Analysis (RCA) and Corrective & Preventive Action (CAPA) software suite, establishing regulatory boundaries, human oversight requirements, and intellectual property protections.
        </p>
      </div>

      {/* Core Principles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <UserCheck size={18} color="#10b981" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>Human Oversight Mandate</h3>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
            All AI-generated 5 Whys, fishbone categorizations, and CAPA proposals are advisory. Qualified human investigator signoff is mandatory prior to batch release or filing.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Award size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>100% Client Ownership</h3>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
            Clients retain sole, unencumbered ownership of all uploaded batch manufacturing records, deviations, analytical reports, investigator rationales, and CAPA decisions.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Scale size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>Audit Readiness</h3>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
            Complete audit trail exports, change histories, and verification checklists are maintainable and exportable for regulatory inspections (FDA, EMA, MHRA).
          </p>
        </div>
      </div>

      {/* Terms Body */}
      <div className="glass-card" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            1. Authorized Quality Use & Personnel Qualification
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
            The software is licensed exclusively for use by authorized pharmaceutical manufacturers, contract manufacturing organizations (CMOs), and analytical testing laboratories. Users logging into the system to review deviations, confirm root causes, or approve CAPA plans must possess appropriate training and credentials commensurate with Good Manufacturing Practice (cGMP) regulations.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            2. Strict Human Oversight & Advisory AI Scope (ICH Q9(R1))
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
            In accordance with International Council for Harmonisation (ICH) Q9(R1) Quality Risk Management guidelines, all artificial intelligence outputs generated by the LangGraph orchestration engine—including entity extraction, 5 Whys question chains, Ishikawa 6M factor classifications, and recommended CAPA interventions—are classified as <strong>advisory investigative hypotheses</strong>. Under no circumstances may AI recommendations be deemed "Investigator Confirmed" without formal human review, empirical verification, and qualified electronic signoff.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            3. Data Integrity & 21 CFR Part 11 Electronic Records
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
            The system provides technical controls to support compliance with Title 21 of the Code of Federal Regulations, Part 11 (21 CFR Part 11) and EU Annex 11. All review events, status transitions, cause confirmations, and data modifications are logged with computer-generated, time-stamped audit trails that cannot be modified or deleted by end users.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            4. Service Availability, Backups & Disaster Recovery
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
            AIVOA maintains a 99.9% uptime service level objective for enterprise cloud tiers, excluding planned maintenance windows communicated in advance. Automated database backups, point-in-time recovery, and multi-region replication are standard provisions to safeguard continuous deviation tracking.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            5. Limitation of Regulatory Liability
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
            While AIVOA assists in structuring and accelerating pharmaceutical investigations, final decision-making regarding batch quarantine, release, rejection, rework, or recall rests solely with the customer's designated Quality Unit. AIVOA disclaims liability for commercial batch disposition decisions, regulatory inspection outcomes, or product quality deviations.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            6. Inquiries & Quality Agreements
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
            For customized Quality Technical Agreements (QTAs), validation master plans, or vendor audit questionnaires, please contact <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>legal-quality@aivoa.ai</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
