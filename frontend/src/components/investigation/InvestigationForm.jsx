import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Sparkles,
  Edit3,
  RotateCcw,
  Check,
  Search,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { setFormField } from '../../store/investigationSlice';
import { setActiveTab } from '../../store/uiSlice';

export default function InvestigationForm() {
  const dispatch = useDispatch();
  const { currentInvestigation, aiPopulatedFields, manuallyEditedFields } = useSelector(
    (state) => state.investigation
  );

  const isAiExtracted = (field) => aiPopulatedFields.includes(field);
  const isManuallyEdited = (field) => manuallyEditedFields.includes(field);

  const handleChange = (field, value) => {
    dispatch(setFormField({ field, value }));
  };

  const renderFieldBadge = (field) => {
    if (isManuallyEdited(field)) {
      return (
        <span
          style={{
            fontSize: '9.5px',
            fontWeight: 600,
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            border: '1px solid rgba(245, 158, 11, 0.3)',
          }}
        >
          User Edited
        </span>
      );
    }
    if (isAiExtracted(field)) {
      return <span className="field-ai-badge"><Sparkles size={9} /> AI Extracted</span>;
    }
    return null;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Investigation Details Card */}
      <div className="glass-card" style={{ padding: '24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '14px',
            marginBottom: '20px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f8fafc' }}>
              Structured Quality Incident Details
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
              Extracted fields are fully editable by the investigator. Fields with blue indicators are AI-populated.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {aiPopulatedFields.length > 0 && (
              <div
                style={{
                  fontSize: '11.5px',
                  color: '#38bdf8',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <Sparkles size={12} />
                <span>{aiPopulatedFields.length} Fields Extracted by AI</span>
              </div>
            )}
          </div>
        </div>

        {/* Title & Ref */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">
              <span>Investigation Title</span>
              {renderFieldBadge('title')}
            </label>
            <input
              type="text"
              className={`form-input ${isAiExtracted('title') && !isManuallyEdited('title') ? 'field-ai-highlight' : ''}`}
              value={currentInvestigation.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g. OOS Impurity D on Finished Atorvastatin Calcium API"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Incident / Deviation Number</span>
              {renderFieldBadge('incident_number')}
            </label>
            <input
              type="text"
              className={`form-input ${isAiExtracted('incident_number') && !isManuallyEdited('incident_number') ? 'field-ai-highlight' : ''}`}
              value={currentInvestigation.incident_number || ''}
              onChange={(e) => handleChange('incident_number', e.target.value)}
              placeholder="e.g. DEV-2026-0841"
            />
          </div>
        </div>

        {/* Product, Batch, Stage, Equipment */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">
              <span>Product / API Name</span>
              {renderFieldBadge('product_name')}
            </label>
            <input
              type="text"
              className={`form-input ${isAiExtracted('product_name') && !isManuallyEdited('product_name') ? 'field-ai-highlight' : ''}`}
              value={currentInvestigation.product_name || ''}
              onChange={(e) => handleChange('product_name', e.target.value)}
              placeholder="e.g. Atorvastatin Calcium Trihydrate"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Batch / Lot Number</span>
              {renderFieldBadge('batch_number')}
            </label>
            <input
              type="text"
              className={`form-input ${isAiExtracted('batch_number') && !isManuallyEdited('batch_number') ? 'field-ai-highlight' : ''}`}
              value={currentInvestigation.batch_number || ''}
              onChange={(e) => handleChange('batch_number', e.target.value)}
              placeholder="e.g. ATC-2026-B09"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Manufacturing Stage</span>
              {renderFieldBadge('process_stage')}
            </label>
            <input
              type="text"
              className={`form-input ${isAiExtracted('process_stage') && !isManuallyEdited('process_stage') ? 'field-ai-highlight' : ''}`}
              value={currentInvestigation.process_stage || ''}
              onChange={(e) => handleChange('process_stage', e.target.value)}
              placeholder="e.g. Crystallization & Drying"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Equipment / Tag ID</span>
              {renderFieldBadge('equipment_id')}
            </label>
            <input
              type="text"
              className={`form-input ${isAiExtracted('equipment_id') && !isManuallyEdited('equipment_id') ? 'field-ai-highlight' : ''}`}
              value={currentInvestigation.equipment_id || ''}
              onChange={(e) => handleChange('equipment_id', e.target.value)}
              placeholder="e.g. ANFD-02 / CRYS-RX-04"
            />
          </div>
        </div>

        {/* Deviation Specifics */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">
              <span>Observed Quality Deviation</span>
              {renderFieldBadge('observed_deviation')}
            </label>
            <textarea
              className={`form-textarea ${isAiExtracted('observed_deviation') && !isManuallyEdited('observed_deviation') ? 'field-ai-highlight' : ''}`}
              rows={3}
              value={currentInvestigation.observed_deviation || ''}
              onChange={(e) => handleChange('observed_deviation', e.target.value)}
              placeholder="Specific non-conformance, degradation, or OOS observation..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Expected Specification</span>
              {renderFieldBadge('expected_specification')}
            </label>
            <input
              type="text"
              className={`form-input ${isAiExtracted('expected_specification') && !isManuallyEdited('expected_specification') ? 'field-ai-highlight' : ''}`}
              value={currentInvestigation.expected_specification || ''}
              onChange={(e) => handleChange('expected_specification', e.target.value)}
              placeholder="e.g. NMT 0.15% (w/w)"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Actual Observed Result</span>
              {renderFieldBadge('actual_result')}
            </label>
            <input
              type="text"
              className={`form-input ${isAiExtracted('actual_result') && !isManuallyEdited('actual_result') ? 'field-ai-highlight' : ''}`}
              value={currentInvestigation.actual_result || ''}
              onChange={(e) => handleChange('actual_result', e.target.value)}
              placeholder="e.g. 0.28% (w/w)"
            />
          </div>
        </div>

        {/* Immediate Containment & Raw Material Lot */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">
              <span>Immediate Containment Actions</span>
              {renderFieldBadge('immediate_containment')}
            </label>
            <textarea
              className={`form-textarea ${isAiExtracted('immediate_containment') && !isManuallyEdited('immediate_containment') ? 'field-ai-highlight' : ''}`}
              rows={2}
              value={currentInvestigation.immediate_containment || ''}
              onChange={(e) => handleChange('immediate_containment', e.target.value)}
              placeholder="Quarantine status, drums tagged, equipment lockouts..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Raw Material / Solvent Lot ID</span>
              {renderFieldBadge('material_lot_id')}
            </label>
            <input
              type="text"
              className={`form-input ${isAiExtracted('material_lot_id') && !isManuallyEdited('material_lot_id') ? 'field-ai-highlight' : ''}`}
              value={currentInvestigation.material_lot_id || ''}
              onChange={(e) => handleChange('material_lot_id', e.target.value)}
              placeholder="e.g. RAW-ETH-4029"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
