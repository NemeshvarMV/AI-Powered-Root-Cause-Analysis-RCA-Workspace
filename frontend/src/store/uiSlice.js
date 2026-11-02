import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeView: 'dashboard', // 'dashboard', 'new_investigation', 'workspace', 'investigations', 'capa_tracking', 'privacy_policy', 'terms_conditions'
  sidebarCollapsed: false,
  activeTab: 'details',    // 'details', 'rca', 'evidence', 'capa', 'audit'
  notifications: [],
  activeModal: null,       // 'review_signoff', 'confirm_cause', 'edit_capa', 'audit_trail', 'overwrite_warning'
  modalPayload: null,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActiveView: (state, action) => {
      state.activeView = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    openModal: (state, action) => {
      state.activeModal = action.payload.modal;
      state.modalPayload = action.payload.data || null;
    },
    closeModal: (state) => {
      state.activeModal = null;
      state.modalPayload = null;
    },
    addNotification: (state, action) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        type: action.payload.type || 'info', // 'success', 'warning', 'error', 'info'
        title: action.payload.title,
        message: action.payload.message,
        timestamp: new Date().toISOString(),
      });
    },
    dismissNotification: (state, action) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setActiveView,
  setActiveTab,
  toggleSidebar,
  openModal,
  closeModal,
  addNotification,
  dismissNotification,
  clearNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
