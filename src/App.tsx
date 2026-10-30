import React, { useState } from 'react';
import { MahaSetuProvider, useMahaSetu } from './context/MahaSetuContext';
import { Header } from './components/Header';
import { AuthScreen } from './components/AuthScreen';
import { RoleAccessGuard } from './components/RoleAccessGuard';
import { ApplicationTracker } from './components/ApplicationTracker';
import { DossierDetailView } from './components/DossierDetailView';
import { LedgerExplorer } from './components/LedgerExplorer';
import { DepartmentSilosView } from './components/DepartmentSilosView';
import { CitizenSubmissionModal } from './components/CitizenSubmissionModal';
import { SecurityPrivacyModal } from './components/SecurityPrivacyModal';

const MainLayout: React.FC = () => {
  const { activeTab, selectApplication, isAuthenticated, currentRole, currentUser, language, t } = useMahaSetu();

  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [viewingDossier, setViewingDossier] = useState(false);

  // If user is unauthenticated, show official authentication portal
  if (!isAuthenticated || !currentUser) {
    return <AuthScreen />;
  }

  const handleOpenDossier = (appId: string) => {
    selectApplication(appId);
    setViewingDossier(true);
  };

  const handleBackFromDossier = () => {
    setViewingDossier(false);
  };

  const canAccessReview = currentRole === 'TALUKA_OFFICER' || currentRole === 'SILO_ARCHITECT';
  const canAccessLedger = currentRole === 'AUDITOR_SECURITY' || currentRole === 'SILO_ARCHITECT';
  const canAccessSilos = currentRole === 'SILO_ARCHITECT';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* 1. Header with strict role-based navigation */}
      <Header
        onOpenNewAppModal={() => setIsNewAppModalOpen(true)}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
      />

      {/* 2. Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-5 space-y-5">
        {/* Section 1: Citizen Applications (My Applications) */}
        {activeTab === 'tracking' && (
          <div>
            {viewingDossier ? (
              <DossierDetailView onBack={handleBackFromDossier} />
            ) : (
              <ApplicationTracker
                onOpenDossier={handleOpenDossier}
                onOpenNewAppModal={() => setIsNewAppModalOpen(true)}
              />
            )}
          </div>
        )}

        {/* Section 2: Taluka Verification Desk */}
        {activeTab === 'review' && (
          <div>
            {canAccessReview ? (
              <div className="space-y-4">
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-2xs">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{t.officerDeskTitle}</h2>
                    <p className="text-xs text-slate-500">{t.officerDeskSub}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 flex-shrink-0">
                    {language === 'mr' ? 'डिजिटल स्वाक्षरी (DSC) सक्षम' : 'DSC Enabled'}
                  </span>
                </div>

                {viewingDossier ? (
                  <DossierDetailView onBack={handleBackFromDossier} />
                ) : (
                  <ApplicationTracker
                    onOpenDossier={handleOpenDossier}
                    onOpenNewAppModal={() => setIsNewAppModalOpen(true)}
                  />
                )}
              </div>
            ) : (
              <RoleAccessGuard
                requiredRole="TALUKA_OFFICER"
                requiredRoleTitle={t.roleOfficer}
                requiredRoleTitleMr={t.roleOfficer}
                reasonEn={t.accessRestrictedOfficerReason}
                reasonMr={t.accessRestrictedOfficerReason}
              />
            )}
          </div>
        )}

        {/* Section 3: Official Actions Register (Auditor) */}
        {activeTab === 'ledger' && (
          <div>
            {canAccessLedger ? (
              <LedgerExplorer />
            ) : (
              <RoleAccessGuard
                requiredRole="AUDITOR_SECURITY"
                requiredRoleTitle={t.roleAuditor}
                requiredRoleTitleMr={t.roleAuditor}
                reasonEn={t.accessRestrictedAuditorReason}
                reasonMr={t.accessRestrictedAuditorReason}
              />
            )}
          </div>
        )}

        {/* Section 4: Connected Department Registries (Portal Admin) */}
        {activeTab === 'silos' && (
          <div>
            {canAccessSilos ? (
              <DepartmentSilosView />
            ) : (
              <RoleAccessGuard
                requiredRole="SILO_ARCHITECT"
                requiredRoleTitle={t.roleArchitect}
                requiredRoleTitleMr={t.roleArchitect}
                reasonEn={t.accessRestrictedAdminReason}
                reasonMr={t.accessRestrictedAdminReason}
              />
            )}
          </div>
        )}
      </main>

      {/* 3. Official Government Footer */}
      <footer className="bg-[#101b3b] text-slate-300 border-t border-slate-800 mt-10 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-slate-900 text-amber-400 flex flex-col items-center justify-center p-0.5 border border-slate-700">
                <span className="text-[7px] font-bold text-white">महाराष्ट्र</span>
                <span className="text-[6px] text-amber-400">शासन</span>
              </div>
              <div>
                <span className="font-bold text-white block text-sm">
                  {t.portalName}
                </span>
                <span className="text-slate-400 text-xs">
                  {t.govtOfMaharashtra} • {t.deptOfIT}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span>{language === 'mr' ? 'DPDP कायदा २०२३' : 'DPDP Act 2023'}</span>
              <span>•</span>
              <span>{language === 'mr' ? 'अधिकृत शासकीय नोंदवही' : 'Official Actions Register'}</span>
              <span>•</span>
              <span>{language === 'mr' ? 'थेट विभागीय पडताळणी' : 'Direct Departmental Verification'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
            <div>
              {t.footerCopyright}
            </div>
            <div className="text-slate-400">
              {t.footerTagline}
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CitizenSubmissionModal
        isOpen={isNewAppModalOpen}
        onClose={() => setIsNewAppModalOpen(false)}
      />

      <SecurityPrivacyModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MahaSetuProvider>
      <MainLayout />
    </MahaSetuProvider>
  );
};

export default App;
