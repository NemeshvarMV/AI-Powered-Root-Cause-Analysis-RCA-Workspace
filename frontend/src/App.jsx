import React from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import NotificationToast from './components/layout/NotificationToast';
import DashboardView from './components/dashboard/DashboardView';
import SourceIntakePanel from './components/intake/SourceIntakePanel';
import WorkspaceView from './components/investigation/WorkspaceView';
import SavedInvestigationsView from './components/investigation/SavedInvestigationsView';
import CapaManager from './components/capa/CapaManager';
import PrivacyPolicyView from './components/legal/PrivacyPolicyView';
import TermsConditionsView from './components/legal/TermsConditionsView';
import Footer from './components/layout/Footer';
import CauseConfirmationModal from './components/modals/CauseConfirmationModal';
import CapaReviewModal from './components/modals/CapaReviewModal';
import InvestigationReviewModal from './components/modals/InvestigationReviewModal';

export default function App() {
  const { activeView, activeModal } = useSelector((state) => state.ui);

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Application Area */}
      <div className="main-content-area">
        <TopBar />

        <main className="scrollable-page-content">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'new_investigation' && <SourceIntakePanel />}
          {activeView === 'workspace' && <WorkspaceView />}
          {activeView === 'investigations' && <SavedInvestigationsView />}
          {activeView === 'capa_tracking' && (
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <CapaManager />
            </div>
          )}
          {activeView === 'privacy_policy' && <PrivacyPolicyView />}
          {activeView === 'terms_conditions' && <TermsConditionsView />}

          <Footer />
        </main>
      </div>

      {/* Modal Dialogs */}
      {activeModal === 'confirm_cause' && <CauseConfirmationModal />}
      {activeModal === 'edit_capa' && <CapaReviewModal />}
      {(activeModal === 'review_signoff' || activeModal === 'save_confirmation') && (
        <InvestigationReviewModal />
      )}

      {/* Floating Notifications */}
      <NotificationToast />
    </div>
  );
}
