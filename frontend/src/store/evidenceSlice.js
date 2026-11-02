import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  evidenceItems: [],
  isUpdating: false,
  error: null,
};

export const evidenceSlice = createSlice({
  name: 'evidence',
  initialState,
  reducers: {
    setEvidenceItems: (state, action) => {
      state.evidenceItems = action.payload || [];
    },
    updateEvidenceItemStatus: (state, action) => {
      const { id, status, review_notes } = action.payload;
      const item = state.evidenceItems.find((e) => e.id === id);
      if (item) {
        if (status) item.status = status;
        if (review_notes !== undefined) item.review_notes = review_notes;
      }
    },
    addEvidenceItem: (state, action) => {
      state.evidenceItems.push(action.payload);
    },
    resetEvidenceState: () => initialState,
  },
});

export const {
  setEvidenceItems,
  updateEvidenceItemStatus,
  addEvidenceItem,
  resetEvidenceState,
} = evidenceSlice.actions;

export default evidenceSlice.reducer;
