import { createSlice } from '@reduxjs/toolkit';

const emptyInvestigation = {
  id: null,
  incident_number: '',
  title: '',
  incident_description: '',
  product_name: '',
  batch_number: '',
  incident_date: '',
  discovery_date: '',
  process_stage: '',
  observed_deviation: '',
  expected_specification: '',
  actual_result: '',
  immediate_containment: '',
  equipment_id: '',
  material_lot_id: '',
  process_parameters: {},
  status: 'Draft', // 'Draft', 'AI_Analyzed', 'Under_Human_Review', 'Reviewed', 'Saved'
  reviewer_name: '',
  reviewer_decision: '',
  reviewer_comments: '',
  reviewed_at: null,
  created_at: null,
  updated_at: null,
  source_documents: [],
  evidence_items: [],
  root_causes: [],
  capa_actions: [],
  five_whys: [],
  fishbone_factors: [],
  review_events: [],
};

const initialState = {
  currentInvestigation: { ...emptyInvestigation },
  aiPopulatedFields: [],    // e.g. ['product_name', 'batch_number']
  manuallyEditedFields: [], // e.g. ['observed_deviation']
  isDirty: false,
  isSaving: false,
  saveError: null,
  investigationList: [],
  listLoading: false,
  listError: null,
};

export const investigationSlice = createSlice({
  name: 'investigation',
  initialState,
  reducers: {
    setFormField: (state, action) => {
      const { field, value } = action.payload;
      state.currentInvestigation[field] = value;
      state.isDirty = true;
      if (!state.manuallyEditedFields.includes(field)) {
        state.manuallyEditedFields.push(field);
      }
    },
    populateFromAiExtraction: (state, action) => {
      const extracted = action.payload;
      const populatedKeys = [];

      for (const [key, val] of Object.entries(extracted)) {
        if (val !== null && val !== undefined && val !== '') {
          // If key exists on investigation
          if (key in state.currentInvestigation) {
            state.currentInvestigation[key] = val;
            populatedKeys.push(key);
          }
        }
      }

      state.aiPopulatedFields = populatedKeys;
      state.currentInvestigation.status = 'AI_Analyzed';
      state.isDirty = true;
    },
    loadInvestigationDetail: (state, action) => {
      state.currentInvestigation = { ...emptyInvestigation, ...action.payload };
      state.aiPopulatedFields = [];
      state.manuallyEditedFields = [];
      state.isDirty = false;
    },
    resetInvestigationForm: (state) => {
      state.currentInvestigation = { ...emptyInvestigation };
      state.aiPopulatedFields = [];
      state.manuallyEditedFields = [];
      state.isDirty = false;
      state.saveError = null;
    },
    setSavingState: (state, action) => {
      state.isSaving = action.payload;
    },
    setSaveError: (state, action) => {
      state.saveError = action.payload;
      state.isSaving = false;
    },
    setInvestigationList: (state, action) => {
      state.investigationList = action.payload;
      state.listLoading = false;
      state.listError = null;
    },
    setListLoading: (state, action) => {
      state.listLoading = action.payload;
    },
    setListError: (state, action) => {
      state.listError = action.payload;
      state.listLoading = false;
    },
    updateLifecycleStatus: (state, action) => {
      const { status, reviewer_name, reviewer_decision, reviewer_comments } = action.payload;
      state.currentInvestigation.status = status;
      if (reviewer_name) state.currentInvestigation.reviewer_name = reviewer_name;
      if (reviewer_decision) state.currentInvestigation.reviewer_decision = reviewer_decision;
      if (reviewer_comments) state.currentInvestigation.reviewer_comments = reviewer_comments;
      state.currentInvestigation.reviewed_at = new Date().toISOString();
      state.isDirty = false;
    },
  },
});

export const {
  setFormField,
  populateFromAiExtraction,
  loadInvestigationDetail,
  resetInvestigationForm,
  setSavingState,
  setSaveError,
  setInvestigationList,
  setListLoading,
  setListError,
  updateLifecycleStatus,
} = investigationSlice.actions;

export default investigationSlice.reducer;
