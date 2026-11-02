import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sourceType: 'pdf', // 'pdf', 'text', 'email'
  file: null,
  fileName: '',
  textContent: '',
  emailSubject: '',
  emailBody: '',
  rawTextPreview: '',
  extractionStatus: 'idle', // 'idle', 'extracting', 'success', 'error'
  extractionStep: 0,        // 0: idle, 1: Received, 2: Extracting, 3: Validating, 4: Ready
  extractionError: null,
  warnings: [],
};

export const sourceSlice = createSlice({
  name: 'source',
  initialState,
  reducers: {
    setSourceType: (state, action) => {
      state.sourceType = action.payload;
    },
    setFileSelection: (state, action) => {
      state.fileName = action.payload.name;
    },
    setTextContent: (state, action) => {
      state.textContent = action.payload;
    },
    setEmailSubject: (state, action) => {
      state.emailSubject = action.payload;
    },
    setEmailBody: (state, action) => {
      state.emailBody = action.payload;
    },
    setExtractionStep: (state, action) => {
      state.extractionStep = action.payload;
    },
    startExtraction: (state) => {
      state.extractionStatus = 'extracting';
      state.extractionStep = 1;
      state.extractionError = null;
      state.warnings = [];
    },
    extractionSuccess: (state, action) => {
      state.extractionStatus = 'success';
      state.extractionStep = 4;
      state.rawTextPreview = action.payload.rawTextPreview || '';
      state.warnings = action.payload.warnings || [];
    },
    extractionFailure: (state, action) => {
      state.extractionStatus = 'error';
      state.extractionStep = 0;
      state.extractionError = action.payload;
    },
    resetSourceState: (state) => {
      return initialState;
    },
  },
});

export const {
  setSourceType,
  setFileSelection,
  setTextContent,
  setEmailSubject,
  setEmailBody,
  setExtractionStep,
  startExtraction,
  extractionSuccess,
  extractionFailure,
  resetSourceState,
} = sourceSlice.actions;

export default sourceSlice.reducer;
