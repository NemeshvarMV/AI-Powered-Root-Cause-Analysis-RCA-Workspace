import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  HelpCircle,
  Network,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Plus,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  Check,
  X,
  Sliders,
  ChevronRight,
  Info,
} from 'lucide-react';
import {
  setRcaMethod,
  setRcaGenerating,
  setRcaData,
  setRcaError,
  updateFiveWhyStep,
  addFiveWhyStep,
  updateFishboneFactorStatus,
} from '../../store/rcaSlice';
import { openModal, addNotification } from '../../store/uiSlice';
import { apiClient } from '../../api/apiClient';

export default function RcaWorkspace() {
  const dispatch = useDispatch();
  const { currentInvestigation } = useSelector((state) => state.investigation);
  const {
    method,
    fiveWhys,
    fishboneFactors,
    potentialRootCauses,
    reasoningSummary,
    isGenerating,
    error,
  } = useSelector((state) => state.rca);

  const [activeSubTab, setActiveSubTab] = useState('five_whys'); // 'five_whys', 'fishbone', 'causes'

  // Calculate effective subtab based on selected methodology
  const effectiveSubTab =
    (method === '5whys' && activeSubTab === 'fishbone')
      ? 'five_whys'
      : (method === 'fishbone' && activeSubTab === 'five_whys')
      ? 'fishbone'
      : activeSubTab;

  useEffect(() => {
    if (method === '5whys' && activeSubTab === 'fishbone') {
      setActiveSubTab('five_whys');
    } else if (method === 'fishbone' && activeSubTab === 'five_whys') {
      setActiveSubTab('fishbone');
    }
  }, [method, activeSubTab]);

  const runRcaAnalysis = async () => {
    dispatch(setRcaGenerating(true));
    try {
      const context = {
        title: currentInvestigation.title,
        product_name: currentInvestigation.product_name,
        batch_number: currentInvestigation.batch_number,
        observed_deviation: currentInvestigation.observed_deviation,
        process_stage: currentInvestigation.process_stage,
        equipment_id: currentInvestigation.equipment_id,
        expected_specification: currentInvestigation.expected_specification,
        actual_result: currentInvestigation.actual_result,
        immediate_containment: currentInvestigation.immediate_containment,
      };

      let res;
      if (currentInvestigation.id) {
        res = await apiClient.generateRca(currentInvestigation.id, context, method);
      } else {
        res = await apiClient.previewRca(context, method);
      }

      dispatch(setRcaData(res));

      const usedMethod = res.method || method;
      let toastMessage = '';
      if (usedMethod === '5whys') {
        toastMessage = `Generated ${res.five_whys?.length || 0} 5-Why steps and ${res.potential_root_causes?.length || 0} potential root causes.`;
      } else if (usedMethod === 'fishbone') {
        toastMessage = `Generated ${res.fishbone_factors?.length || 0} 6M fishbone factors and ${res.potential_root_causes?.length || 0} potential root causes.`;
      } else {
        toastMessage = `Generated ${res.five_whys?.length || 0} 5-Why steps, ${res.fishbone_factors?.length || 0} 6M fishbone factors, and ${res.potential_root_causes?.length || 0} potential root causes.`;
      }

      dispatch(addNotification({
        type: 'success',
        title: 'RCA Analysis Generated',
        message: toastMessage,
      }));
    } catch (err) {
      dispatch(setRcaError(err.message));
      dispatch(addNotification({
        type: 'error',
        title: 'RCA Generation Failed',
        message: err.message,
      }));
    }
  };

  const getFishboneCategories = () => {
    const categories = ['Machine', 'Method', 'Material', 'Measurement', 'Man', 'Environment'];
    return categories.map((cat) => ({
      category: cat,
      factors: fishboneFactors.filter((f) => f.category.toLowerCase() === cat.toLowerCase()),
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Trigger Controls */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Network size={20} color="#38bdf8" />
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#f8fafc' }}>
                Root Cause Analysis Workspace (ICH Q9(R1))
              </h3>
            </div>
            <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '3px' }}>
              Investigate using structured 5 Whys questions, Ishikawa 6M fishbone analysis, and evidence-grounded hypotheses.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select
              value={method}
              onChange={(e) => {
                const newMethod = e.target.value;
                dispatch(setRcaMethod(newMethod));
                if (newMethod === '5whys' && activeSubTab === 'fishbone') {
                  setActiveSubTab('five_whys');
                } else if (newMethod === 'fishbone' && activeSubTab === 'five_whys') {
                  setActiveSubTab('fishbone');
                }
              }}
              className="form-select"
              style={{ width: '180px', padding: '7px 10px', fontSize: '12.5px' }}
            >
              <option value="both">Both (5 Whys and 6M)</option>
              <option value="5whys">5 Whys Only</option>
              <option value="fishbone">6M Only</option>
            </select>

            <button
              className="btn btn-ai"
              onClick={runRcaAnalysis}
              disabled={isGenerating}
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={15} className="spinner" />
                  <span>Analyzing with LangGraph...</span>
                </>
              ) : (
                <>
                  <Sparkles size={15} />
                  <span>Generate AI RCA</span>
                </>
              )}
            </button>
          </div>
        </div>

        {reasoningSummary && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              border: '1px solid rgba(56, 189, 248, 0.2)',
              fontSize: '12.5px',
              color: '#e2e8f0',
              lineHeight: 1.5,
            }}
          >
            <div style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Info size={14} /> AI Failure Mechanism Hypothesis
            </div>
            {reasoningSummary}
          </div>
        )}
      </div>

      {/* Methodology Navigation Subtabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
        {(method === 'both' || method === '5whys') && (
          <button
            onClick={() => setActiveSubTab('five_whys')}
            className={`btn ${effectiveSubTab === 'five_whys' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '12.5px', padding: '7px 14px' }}
          >
            <HelpCircle size={15} />
            <span>5 Whys Chain ({fiveWhys.length})</span>
          </button>
        )}

        {(method === 'both' || method === 'fishbone') && (
          <button
            onClick={() => setActiveSubTab('fishbone')}
            className={`btn ${effectiveSubTab === 'fishbone' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '12.5px', padding: '7px 14px' }}
          >
            <Sliders size={15} />
            <span>Fishbone Ishikawa 6M ({fishboneFactors.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveSubTab('causes')}
          className={`btn ${effectiveSubTab === 'causes' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ fontSize: '12.5px', padding: '7px 14px' }}
        >
          <ShieldCheck size={15} />
          <span>Potential Causes & Confirmation ({potentialRootCauses.length})</span>
        </button>
      </div>

      {/* Subtab 1: 5 Whys Chain */}
      {effectiveSubTab === 'five_whys' && (method === 'both' || method === '5whys') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {fiveWhys.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <HelpCircle size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
                No 5-Whys Steps Generated Yet
              </div>
              <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '4px', maxWidth: '400px', margin: '4px auto 16px' }}>
                Click "Generate AI RCA" above to automatically establish the structured question-answer chain grounded in the observed deviation.
              </p>
              <button className="btn btn-secondary" onClick={() => dispatch(addFiveWhyStep())}>
                <Plus size={15} /> <span>Add Manual Why Step</span>
              </button>
            </div>
          ) : (
            <>
              {fiveWhys.map((step, idx) => (
                <div
                  key={step.id || idx}
                  className="glass-card"
                  style={{
                    padding: '18px 20px',
                    borderLeft: step.is_confirmed
                      ? '4px solid #10b981'
                      : '4px solid #f59e0b',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          backgroundColor: step.is_confirmed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: step.is_confirmed ? '#34d399' : '#fbbf24',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        {step.step_number || idx + 1}
                      </span>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#f8fafc' }}>
                        Why Question {step.step_number || idx + 1}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() =>
                          dispatch(updateFiveWhyStep({
                            index: idx,
                            field: 'is_confirmed',
                            value: !step.is_confirmed,
                          }))
                        }
                        className={`badge ${step.is_confirmed ? 'badge-confirmed' : 'badge-review'}`}
                        style={{ cursor: 'pointer', border: 'none', padding: '4px 10px' }}
                      >
                        {step.is_confirmed ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                        <span>{step.is_confirmed ? 'Confirmed Finding' : 'Hypothetical / Unverified'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Question */}
                  <div style={{ marginBottom: '12px' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={step.question}
                      onChange={(e) =>
                        dispatch(updateFiveWhyStep({ index: idx, field: 'question', value: e.target.value }))
                      }
                      style={{ fontWeight: 600, color: '#38bdf8' }}
                      placeholder="Why question..."
                    />
                  </div>

                  {/* Answer / Finding */}
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                      Finding / Technical Answer:
                    </label>
                    <textarea
                      className="form-textarea"
                      rows={2}
                      value={step.answer}
                      onChange={(e) =>
                        dispatch(updateFiveWhyStep({ index: idx, field: 'answer', value: e.target.value }))
                      }
                      placeholder="Root cause finding for this step..."
                    />
                  </div>

                  {/* Evidence & Follow-up */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Supporting Evidence Reference:
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={step.supporting_evidence || ''}
                        onChange={(e) =>
                          dispatch(updateFiveWhyStep({ index: idx, field: 'supporting_evidence', value: e.target.value }))
                        }
                        placeholder="Log strip, HPLC chromatogram, calibration certificate..."
                        style={{ fontSize: '12.5px' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                        Follow-Up / Evidence Required:
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        value={step.follow_up_needed || ''}
                        onChange={(e) =>
                          dispatch(updateFiveWhyStep({ index: idx, field: 'follow_up_needed', value: e.target.value }))
                        }
                        placeholder="Physical teardown, secondary sensor audit..."
                        style={{ fontSize: '12.5px' }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                className="btn btn-secondary"
                onClick={() => dispatch(addFiveWhyStep())}
                style={{ alignSelf: 'flex-start', fontSize: '12.5px' }}
              >
                <Plus size={15} /> <span>Add Another Why Step</span>
              </button>
            </>
          )}
        </div>
      )}

      {/* Subtab 2: Fishbone Ishikawa 6M */}
      {effectiveSubTab === 'fishbone' && (method === 'both' || method === 'fishbone') && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {getFishboneCategories().map((catGroup) => (
            <div key={catGroup.category} className="glass-card" style={{ padding: '18px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                  paddingBottom: '10px',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: 'rgba(56, 189, 248, 0.15)',
                      color: '#38bdf8',
                      padding: '2px 7px',
                      borderRadius: '4px',
                    }}
                  >
                    6M
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc' }}>
                    {catGroup.category}
                  </span>
                </div>
                <span style={{ fontSize: '11.5px', color: '#64748b' }}>
                  {catGroup.factors.length} Factors
                </span>
              </div>

              {catGroup.factors.length === 0 ? (
                <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', padding: '10px 0' }}>
                  No factors flagged under this category.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {catGroup.factors.map((f, fIdx) => (
                    <div
                      key={f.id || fIdx}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>
                          {f.factor_title}
                        </span>
                        <select
                          value={f.status}
                          onChange={(e) =>
                            dispatch(updateFishboneFactorStatus({ id: f.id, index: fIdx, status: e.target.value }))
                          }
                          style={{
                            fontSize: '11px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#1e293b',
                            color: f.status === 'Key Factor' ? '#38bdf8' : f.status === 'Eliminated' ? '#64748b' : '#fbbf24',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          <option value="Potential">Potential</option>
                          <option value="Key Factor">Key Factor</option>
                          <option value="Investigated">Investigated</option>
                          <option value="Eliminated">Eliminated</option>
                        </select>
                      </div>

                      {f.factor_detail && (
                        <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.4, margin: '4px 0' }}>
                          {f.factor_detail}
                        </p>
                      )}

                      {f.evidence_link && (
                        <div style={{ fontSize: '11px', color: '#38bdf8', marginTop: '4px' }}>
                          Evidence Link: <span style={{ color: '#cbd5e1' }}>{f.evidence_link}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Subtab 3: Potential Root Causes & Human Confirmation */}
      {effectiveSubTab === 'causes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fbbf24',
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <ShieldCheck size={18} style={{ flexShrink: 0 }} />
            <span>
              <strong>Human Oversight Requirement:</strong> AI-generated root causes are hypotheses. An assignable root cause can only be marked "Investigator Confirmed" through a qualified person's explicit review with documentary justification.
            </span>
          </div>

          {potentialRootCauses.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
              <ShieldCheck size={36} color="#64748b" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
                No Root Cause Hypotheses Generated
              </div>
              <p style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '4px' }}>
                Click "Generate AI RCA" above to analyze the incident and propose grounded causes.
              </p>
            </div>
          ) : (
            potentialRootCauses.map((cause) => (
              <div key={cause.id || cause.cause_code} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#1e293b',
                        color: '#38bdf8',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                      }}
                    >
                      {cause.cause_code}
                    </span>
                    <span style={{ fontSize: '14.5px', fontWeight: 700, color: '#f8fafc' }}>
                      {cause.category ? `[${cause.category}] ` : ''}{cause.description}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      className={`badge ${
                        cause.status === 'Investigator Confirmed'
                          ? 'badge-confirmed'
                          : cause.status === 'Rejected'
                          ? 'badge-rejected'
                          : 'badge-review'
                      }`}
                    >
                      {cause.status}
                    </span>

                    {/* Human Confirmation Safeguard Action */}
                    <button
                      className="btn btn-secondary"
                      onClick={() =>
                        dispatch(openModal({
                          modal: 'confirm_cause',
                          data: cause,
                        }))
                      }
                      style={{ fontSize: '12px', padding: '6px 12px' }}
                    >
                      <UserCheck size={14} color="#10b981" />
                      <span>Investigator Decision</span>
                    </button>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '12px' }}>
                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#10b981', marginBottom: '4px' }}>
                      Supporting Evidence
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.4 }}>
                      {cause.supporting_evidence || 'No explicit supporting evidence cited in source.'}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(15, 23, 42, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#38bdf8', marginBottom: '4px' }}>
                      Recommended Verification Step
                    </div>
                    <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.4 }}>
                      {cause.recommended_verification || 'Physical calibration or audit required.'}
                    </div>
                  </div>
                </div>

                {cause.is_human_confirmed && (
                  <div
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#34d399',
                      fontSize: '11.5px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <CheckCircle2 size={14} />
                    <span>
                      Confirmed by: <strong>{cause.confirmed_by}</strong> on {cause.confirmed_at?.slice(0, 10)}. Notes: {cause.confirmation_notes}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
