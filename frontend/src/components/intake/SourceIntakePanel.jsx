import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FileText,
  Upload,
  Mail,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  FileCheck,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  setSourceType,
  setTextContent,
  setEmailSubject,
  setEmailBody,
  setFileSelection,
  startExtraction,
  extractionSuccess,
  extractionFailure,
  setExtractionStep,
} from '../../store/sourceSlice';
import {
  populateFromAiExtraction,
  resetInvestigationForm,
} from '../../store/investigationSlice';
import { setEvidenceItems } from '../../store/evidenceSlice';
import { setRcaData } from '../../store/rcaSlice';
import { setCapaData } from '../../store/capaSlice';
import { setActiveView, setActiveTab, addNotification, openModal } from '../../store/uiSlice';
import { apiClient } from '../../api/apiClient';
import { TEXT_PRESETS, EMAIL_PRESETS } from '../../data/mockPresets';

export default function SourceIntakePanel() {
  const dispatch = useDispatch();
  const {
    sourceType,
    fileName,
    textContent,
    emailSubject,
    emailBody,
    extractionStatus,
    extractionStep,
    extractionError,
    warnings,
    rawTextPreview,
  } = useSelector((state) => state.source);

  const { isDirty, manuallyEditedFields } = useSelector((state) => state.investigation);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleSelectTextPreset = (id) => {
    const item = TEXT_PRESETS.find((p) => p.id === id);
    if (item) {
      dispatch(setSourceType('text'));
      dispatch(setTextContent(item.content));
      dispatch(addNotification({
        type: 'info',
        message: `Loaded mock data: ${item.label}`,
      }));
    }
  };

  const handleSelectEmailPreset = (id) => {
    const item = EMAIL_PRESETS.find((p) => p.id === id);
    if (item) {
      dispatch(setSourceType('email'));
      dispatch(setEmailSubject(item.subject));
      dispatch(setEmailBody(item.body));
      dispatch(addNotification({
        type: 'info',
        message: `Loaded mock data: ${item.label}`,
      }));
    }
  };

  const handleFileChange = (e) => {

    const file = e.target.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        dispatch(addNotification({ type: 'error', message: 'Only valid .pdf files are supported.' }));
        return;
      }
      setSelectedFile(file);
      dispatch(setFileSelection({ name: file.name }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        dispatch(addNotification({ type: 'error', message: 'Only valid .pdf files are supported.' }));
        return;
      }
      setSelectedFile(file);
      dispatch(setFileSelection({ name: file.name }));
    }
  };

  const runExtraction = async () => {
    // Check if user previously edited fields
    if (isDirty && manuallyEditedFields.length > 0) {
      const confirmOverwrite = window.confirm(
        'Warning: You have manually edited fields in the investigation form. Rerunning extraction will re-populate fields from the source document. Do you wish to proceed?'
      );
      if (!confirmOverwrite) return;
    }

    dispatch(startExtraction());

    try {
      // Step 1: Source Preparation
      dispatch(setExtractionStep(1));
      await new Promise((r) => setTimeout(r, 400));

      // Step 2: Call LangGraph Backend Extraction
      dispatch(setExtractionStep(2));
      let res;
      if (sourceType === 'pdf') {
        if (!selectedFile) {
          throw new Error('Please select or upload a PDF document first.');
        }
        res = await apiClient.extractIncident({ file: selectedFile, sourceType: 'pdf' });
      } else if (sourceType === 'email') {
        if (!emailBody.trim()) {
          throw new Error('Please enter the email body content.');
        }
        res = await apiClient.extractIncident({
          sourceType: 'email',
          content: emailBody,
          subject: emailSubject,
        });
      } else {
        if (!textContent.trim()) {
          throw new Error('Please enter the incident description or lab observations.');
        }
        res = await apiClient.extractIncident({
          sourceType: 'text',
          content: textContent,
        });
      }

      // Step 3: Validate Fields
      dispatch(setExtractionStep(3));
      await new Promise((r) => setTimeout(r, 300));

      // Step 4: Populate Form & store data
      dispatch(extractionSuccess({
        rawTextPreview: res.raw_text_preview,
        warnings: res.warnings || [],
      }));

      // Populate editable investigation form
      dispatch(populateFromAiExtraction(res.extracted_data));

      // If missing info returned, seed evidence gaps
      if (res.extracted_data.missing_information?.length) {
        const gaps = res.extracted_data.missing_information.map((item, idx) => ({
          id: `temp-gap-${idx}`,
          item_description: item,
          why_it_matters: 'Required under cGMP (ICH Q7) to verify critical parameters and confirm root cause.',
          status: 'Missing',
        }));
        dispatch(setEvidenceItems(gaps));
      }

      dispatch(addNotification({
        type: 'success',
        title: 'AI Extraction Complete',
        message: 'Investigation form automatically populated with evidence citations.',
      }));

      // Navigate to investigation workspace
      dispatch(setActiveView('workspace'));
      dispatch(setActiveTab('details'));
    } catch (err) {
      dispatch(extractionFailure(err.message));
      dispatch(addNotification({
        type: 'error',
        title: 'Extraction Error',
        message: err.message,
      }));
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Page Title Banner */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <Sparkles size={22} color="#38bdf8" />
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc' }}>
            New Incident Intake & AI Extraction
          </h2>
        </div>
        <p style={{ fontSize: '13.5px', color: '#94a3b8' }}>
          Submit an incident or investigation document (PDF, laboratory text notes, or email notice).
          AI automatically extracts structured pharmaceutical quality parameters and populates the RCA workspace.
        </p>
      </div>

      {/* Main Intake Container */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        {/* Source Mode Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '16px',
            marginBottom: '20px',
          }}
        >
          <button
            onClick={() => dispatch(setSourceType('pdf'))}
            className={`btn ${sourceType === 'pdf' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '13px' }}
          >
            <Upload size={16} />
            <span>Upload Deviation PDF</span>
          </button>

          <button
            onClick={() => dispatch(setSourceType('text'))}
            className={`btn ${sourceType === 'text' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '13px' }}
          >
            <FileText size={16} />
            <span>Pasted Text / Lab Notes</span>
          </button>

          <button
            onClick={() => dispatch(setSourceType('email'))}
            className={`btn ${sourceType === 'email' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '13px' }}
          >
            <Mail size={16} />
            <span>Email Report Intake</span>
          </button>

          {/* Preset Selectors for Sample Incident Templates */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Sample Templates:</span>
            {sourceType === 'text' && (
              <select
                onChange={(e) => handleSelectTextPreset(e.target.value)}
                defaultValue=""
                style={{
                  fontSize: '11.5px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#1e293b',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  cursor: 'pointer',
                  maxWidth: '220px',
                }}
              >
                <option value="" disabled>Load Incident Template...</option>
                {TEXT_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            )}

            {sourceType === 'email' && (
              <select
                onChange={(e) => handleSelectEmailPreset(e.target.value)}
                defaultValue=""
                style={{
                  fontSize: '11.5px',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#1e293b',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  cursor: 'pointer',
                  maxWidth: '220px',
                }}
              >
                <option value="" disabled>Load Incident Email Template...</option>
                {EMAIL_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            )}

            {sourceType === 'pdf' && (
              <span
                style={{
                  fontSize: '11px',
                  color: '#10b981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                }}
              >
                10 PDFs ready in /sample_data
              </span>
            )}
          </div>

        </div>

        {/* Tab 1: PDF Upload */}
        {sourceType === 'pdf' && (
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? '#38bdf8' : 'rgba(255, 255, 255, 0.15)'}`,
                borderRadius: '12px',
                padding: '44px 20px',
                textAlign: 'center',
                backgroundColor: dragOver ? 'rgba(56, 189, 248, 0.05)' : 'rgba(15, 23, 42, 0.4)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
              />

              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                  color: '#38bdf8',
                }}
              >
                <Upload size={26} />
              </div>

              <div style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc', marginBottom: '6px' }}>
                {selectedFile ? selectedFile.name : 'Choose or drop a Quality Incident PDF'}
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                Supports pharmaceutical deviation reports, OOS laboratory packages, and inspection notices (Max 10MB)
              </div>

              {selectedFile && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '16px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    fontSize: '12.5px',
                    fontWeight: 500,
                  }}
                >
                  <FileCheck size={16} />
                  <span>File Ready: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: '12px', fontSize: '11.5px', color: '#64748b' }}>
              Tip: You can use the generated synthetic file located in <code style={{ color: '#94a3b8' }}>sample_data/sample_oos_impurity_incident.pdf</code>.
            </div>
          </div>
        )}

        {/* Tab 2: Pasted Text */}
        {sourceType === 'text' && (
          <div>
            <div className="form-group">
              <label className="form-label">
                <span>Incident Description & Investigation Notes</span>
                <span style={{ fontSize: '11px', color: '#64748b' }}>
                  {textContent.length} characters
                </span>
              </label>
              <textarea
                className="form-textarea"
                rows={10}
                placeholder="Paste the deviation summary, batch manufacturing observations, or analytical QC report here..."
                value={textContent}
                onChange={(e) => dispatch(setTextContent(e.target.value))}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Email Input */}
        {sourceType === 'email' && (
          <div>
            <div className="form-group">
              <label className="form-label">Email Subject</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. [URGENT QA ESCALATION] Out-of-Specification Impurity D on Batch ATC-2026-B09"
                value={emailSubject}
                onChange={(e) => dispatch(setEmailSubject(e.target.value))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Body Content</label>
              <textarea
                className="form-textarea"
                rows={9}
                placeholder="Paste the full email notification body received from QA, manufacturing, or regulatory affairs..."
                value={emailBody}
                onChange={(e) => dispatch(setEmailBody(e.target.value))}
                style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}
              />
            </div>
          </div>
        )}

        {/* Extraction Action Bar */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '12px' }}>
            <ShieldAlert size={15} color="#38bdf8" />
            <span>Content is processed locally through LangGraph orchestration and Groq.</span>
          </div>

          <button
            className="btn btn-ai"
            onClick={runExtraction}
            disabled={extractionStatus === 'extracting'}
            style={{ padding: '10px 22px', fontSize: '14px' }}
          >
            {extractionStatus === 'extracting' ? (
              <>
                <RefreshCw size={16} className="spinner" />
                <span>Extracting via LangGraph...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Run AI Extraction & Populate RCA Form</span>
              </>
            )}
          </button>
        </div>

        {/* Extraction Progress Stepper */}
        {extractionStatus === 'extracting' && (
          <div
            style={{
              marginTop: '20px',
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
            }}
          >
            <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#38bdf8', marginBottom: '10px' }}>
              LangGraph Orchestration Pipeline
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[
                { step: 1, label: 'Source Normalized' },
                { step: 2, label: 'Groq Extraction' },
                { step: 3, label: 'Pydantic Validation' },
                { step: 4, label: 'Form Ready' },
              ].map((s) => {
                const isCurrent = extractionStep === s.step;
                const isPassed = extractionStep > s.step;
                return (
                  <div
                    key={s.step}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: '6px',
                      backgroundColor: isPassed
                        ? 'rgba(16, 185, 129, 0.15)'
                        : isCurrent
                        ? 'rgba(56, 189, 248, 0.15)'
                        : 'rgba(255, 255, 255, 0.03)',
                      color: isPassed ? '#34d399' : isCurrent ? '#38bdf8' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {isPassed ? <CheckCircle2 size={13} /> : <span>{s.step}.</span>}
                    <span>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Extraction Error Display */}
        {extractionError && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '13px',
            }}
          >
            <AlertCircle size={18} />
            <span>{extractionError}</span>
          </div>
        )}
      </div>

      {/* Raw Preview Card if Available */}
      {rawTextPreview && (
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>Source Text Extracted Preview</span>
            <button
              className="btn btn-secondary"
              onClick={() => dispatch(setActiveView('workspace'))}
              style={{ fontSize: '12px', padding: '5px 12px' }}
            >
              <span>Go to Investigation Form</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <pre
            style={{
              fontSize: '11.5px',
              color: '#94a3b8',
              backgroundColor: '#0a0f1d',
              padding: '12px',
              borderRadius: '6px',
              maxHeight: '160px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            {rawTextPreview}
          </pre>
        </div>
      )}
    </div>
  );
}
