import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  capaActions: [],
  guidanceNotes: '',
  isGenerating: false,
  error: null,
};

export const capaSlice = createSlice({
  name: 'capa',
  initialState,
  reducers: {
    setCapaGenerating: (state, action) => {
      state.isGenerating = action.payload;
      if (action.payload) state.error = null;
    },
    setCapaData: (state, action) => {
      state.capaActions = action.payload.actions || [];
      state.guidanceNotes = action.payload.guidance_notes || '';
      state.isGenerating = false;
      state.error = null;
    },
    setCapaActions: (state, action) => {
      state.capaActions = action.payload || [];
    },
    setCapaReviewDecision: (state, action) => {
      const { id, actionCode, decision, owner, dueDate, description, rationale, plan, notes } = action.payload;
      const actionItem = state.capaActions.find(
        (a) => (id && a.id === id) || (actionCode && a.action_code === actionCode)
      );
      if (actionItem) {
        actionItem.review_decision = decision;
        if (decision === 'Accepted' || decision === 'Modified') {
          actionItem.status = 'Accepted';
        } else if (decision === 'Rejected') {
          actionItem.status = 'Rejected';
        }
        if (owner) actionItem.proposed_owner = owner;
        if (dueDate) actionItem.target_due_date = dueDate;
        if (description) actionItem.description = description;
        if (rationale) actionItem.rationale = rationale;
        if (plan) actionItem.effectiveness_check_plan = plan;
        if (notes) actionItem.review_notes = notes;
      }
    },
    addManualCapaAction: (state, action) => {
      state.capaActions.push(action.payload);
    },
    resetCapaState: () => initialState,
  },
});

export const {
  setCapaGenerating,
  setCapaData,
  setCapaActions,
  setCapaReviewDecision,
  addManualCapaAction,
  resetCapaState,
} = capaSlice.actions;

export default capaSlice.reducer;
