import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './uiSlice';
import sourceReducer from './sourceSlice';
import investigationReducer from './investigationSlice';
import rcaReducer from './rcaSlice';
import evidenceReducer from './evidenceSlice';
import capaReducer from './capaSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    source: sourceReducer,
    investigation: investigationReducer,
    rca: rcaReducer,
    evidence: evidenceReducer,
    capa: capaReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
