import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  method: 'both', // 'both', '5whys', 'fishbone'
  fiveWhys: [],
  fishboneFactors: [],
  potentialRootCauses: [],
  reasoningSummary: '',
  isGenerating: false,
  error: null,
};

export const rcaSlice = createSlice({
  name: 'rca',
  initialState,
  reducers: {
    setRcaMethod: (state, action) => {
      state.method = action.payload;
    },
    setRcaGenerating: (state, action) => {
      state.isGenerating = action.payload;
      if (action.payload) state.error = null;
    },
    setRcaData: (state, action) => {
      const { five_whys, fishbone_factors, potential_root_causes, reasoning_summary, method } = action.payload;
      let targetMethod = method;
      if (!targetMethod) {
        const hasWhys = Array.isArray(five_whys) && five_whys.length > 0;
        const hasFactors = Array.isArray(fishbone_factors) && fishbone_factors.length > 0;
        if (hasWhys && !hasFactors) {
          targetMethod = '5whys';
        } else if (!hasWhys && hasFactors) {
          targetMethod = 'fishbone';
        } else if (hasWhys && hasFactors) {
          targetMethod = 'both';
        }
      }
      if (targetMethod) {
        state.method = targetMethod;
      }
      state.fiveWhys = five_whys || [];
      state.fishboneFactors = fishbone_factors || [];
      state.potentialRootCauses = potential_root_causes || [];
      state.reasoningSummary = reasoning_summary || '';
      state.isGenerating = false;
      state.error = null;
    },
    setRcaError: (state, action) => {
      state.error = action.payload;
      state.isGenerating = false;
    },
    updateFiveWhyStep: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.fiveWhys[index]) {
        state.fiveWhys[index][field] = value;
      }
    },
    addFiveWhyStep: (state) => {
      const nextStep = state.fiveWhys.length + 1;
      state.fiveWhys.push({
        step_number: nextStep,
        question: `Why (Step ${nextStep})?`,
        answer: '',
        supporting_evidence: '',
        is_confirmed: false,
        evidence_status: 'Hypothetical',
        follow_up_needed: '',
      });
    },
    updateFishboneFactorStatus: (state, action) => {
      const { id, index, status } = action.payload;
      if (id) {
        const factor = state.fishboneFactors.find((f) => f.id === id);
        if (factor) factor.status = status;
      } else if (index !== undefined && state.fishboneFactors[index]) {
        state.fishboneFactors[index].status = status;
      }
    },
    confirmRootCauseInStore: (state, action) => {
      const { causeId, status, reviewerName, notes } = action.payload;
      const cause = state.potentialRootCauses.find((c) => c.id === causeId || c.cause_code === causeId);
      if (cause) {
        cause.status = status;
        cause.is_human_confirmed = (status === 'Investigator Confirmed');
        cause.confirmed_by = reviewerName;
        cause.confirmation_notes = notes;
        cause.confirmed_at = new Date().toISOString();
      }
    },
    resetRcaState: () => initialState,
  },
});

export const {
  setRcaMethod,
  setRcaGenerating,
  setRcaData,
  setRcaError,
  updateFiveWhyStep,
  addFiveWhyStep,
  updateFishboneFactorStatus,
  confirmRootCauseInStore,
  resetRcaState,
} = rcaSlice.actions;

export default rcaSlice.reducer;
