import React from 'react';
import { useDispatch } from 'react-redux';
import { Shield, Lock, FileText, CheckCircle2, ArrowLeft, Database, EyeOff, Server, Clock } from 'lucide-react';
import { setActiveView } from '../../store/uiSlice';

export default function PrivacyPolicyView() {
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
          Document ID: <span style={{ color: '#cbd5e1', fontFamily: 'monospace' }}>POL-QA-PRIV-004</span> | Effective Date: October 2026
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
            Quality & Data Governance
          </span>
          <span style={{ fontSize: '12px', color: '#94a3b8' }}>ICH Q9(R1) • 21 CFR Part 11 • GxP</span>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.02em' }}>
          Data Privacy & GxP Information Governance Policy
        </h1>
        <p style={{ fontSize: '13.5px', color: '#cbd5e1', marginTop: '6px', lineHeight: 1.5 }}>
          This policy outlines the protocols, technical safeguards, and regulatory standards governing the processing, transmission, and isolation of pharmaceutical manufacturing deviations, batch records, analytical data, and audit logs within the AIVOA Root Cause Analysis platform.
        </p>
      </div>

      {/* Key Guarantees Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <EyeOff size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>Zero Model Training</h3>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
            Proprietary manufacturing texts, batch analytical data, and deviation records are never used to train, retrain, or improve foundational AI models.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Lock size={18} color="#10b981" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>Encrypted & Isolated</h3>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
            Data is encrypted in transit via TLS 1.3 and at rest with AES-256 encryption. Client tenant databases maintain cryptographic isolation.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Clock size={18} color="#f59e0b" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>21 CFR Part 11 Audit Trail</h3>
          </div>
          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5 }}>
            All intake parsing, hypothesis evaluations, investigator cause confirmations, and CAPA signoffs generate immutable, time-stamped audit logs.
          </p>
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="glass-card" style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            1. Scope and Applicability
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
            This policy applies to all electronic records, unstructured source documents (including Batch Manufacturing Records, Certificate of Analysis PDFs, shift handovers, and laboratory equipment logs), structured deviation parameters, and corrective action workflows processed through the AIVOA platform. The system operates strictly as an enterprise Quality Management Support tool in adherence to Good Manufacturing Practice (cGMP) regulations including 21 CFR Part 210/211 and EU GMP Volume 4.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            2. Categories of Information Processed
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '8px' }}>
            The platform processes technical quality data strictly for deviation evaluation and risk categorization:
          </p>
          <ul style={{ paddingLeft: '20px', fontSize: '12.5px', color: '#94a3b8', lineHeight: 1.6 }}>
            <li><strong>Batch and Manufacturing Metadata:</strong> Product chemical nomenclature, active pharmaceutical ingredient (API) batch identifiers, processing stage, equipment tags, and room environmental telemetry.</li>
            <li><strong>Analytical and Quality Deviation Metrics:</strong> Out-of-Specification (OOS) assay values, HPLC chromatographic peak retention times, impurity profiles, particulate measurements, and moisture content test results.</li>
            <li><strong>Investigator Attribution Data:</strong> Qualified person names, role titles, confirmation rationales, electronic signatures, and review timestamps.</li>
          </ul>
        </div>

        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            3. AI Orchestration & Ephemeral Inference Architecture
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
            Automated entity extraction and hypothesis generation (5 Whys and Ishikawa 6M categorization) are executed via private, enterprise-tier API instances with contractual zero-retention mandates. Input prompts and contextual deviations are processed in-memory during orchestration and purged immediately following graph completion. Neither AIVOA nor third-party infrastructure providers store, review, or use proprietary manufacturing data for model optimization.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            4. Access Control, Data Retention & Regulatory Archival
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
            Access to deviation investigations is governed by strict Role-Based Access Controls (RBAC). Records are retained in accordance with applicable cGMP statutory retention mandates (e.g., batch expiration plus one year or minimum statutory requirements per Quality Agreement). Database backups are automated, verified, and subject to routine disaster recovery restoration drills.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
            5. Quality Unit Contact & Compliance Inquiries
          </h2>
          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6 }}>
            Inquiries concerning data integrity audits, validation package availability, or regulatory inspection assistance may be directed to our Quality Assurance & Data Governance office at <span style={{ color: '#38bdf8', fontFamily: 'monospace' }}>quality-assurance@aivoa.ai</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
