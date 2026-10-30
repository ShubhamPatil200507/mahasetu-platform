import React, { useState } from 'react';
import { useMahaSetu } from '../context/MahaSetuContext';
import { DEMO_PROFILES, DEMO_PERSONAS } from '../services/authService';
import { ChevronDown, Globe, LogOut, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenNewAppModal: () => void;
  onOpenSecurityModal: () => void;
  onOpenAuthScreen?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewAppModal,
  onOpenSecurityModal,
  onOpenAuthScreen
}) => {
  const {
    currentRole,
    currentUser,
    switchDemoUser,
    logout,
    language,
    setLanguage,
    t,
    activeTab,
    setActiveTab,
    isDemoMode,
    demoPersonas
  } = useMahaSetu();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoSwitcherOpen, setDemoSwitcherOpen] = useState(false);

  const profile = currentUser || DEMO_PROFILES[currentRole];

  // Natural navigation tabs with zero role-jargon
  const getNavTabs = () => {
    switch (currentRole) {
      case 'CITIZEN_OPERATOR':
        return [
          { id: 'tracking', label: language === 'mr' ? 'माझे अर्ज' : 'My Applications' }
        ];
      case 'TALUKA_OFFICER':
        return [
          { id: 'review', label: language === 'mr' ? 'पडताळणी कक्ष' : 'Verification Desk' },
          { id: 'tracking', label: language === 'mr' ? 'सर्व अर्ज' : 'All Applications' }
        ];
      case 'AUDITOR_SECURITY':
        return [
          { id: 'ledger', label: language === 'mr' ? 'शासकीय नोंदवही' : 'Actions Register' }
        ];
      case 'SILO_ARCHITECT':
        return [
          { id: 'silos', label: language === 'mr' ? 'संलग्न विभाग' : 'Connected Registries' },
          { id: 'ledger', label: language === 'mr' ? 'नोंदवही' : 'Actions Register' }
        ];
      default:
        return [{ id: 'tracking', label: language === 'mr' ? 'माझे अर्ज' : 'My Applications' }];
    }
  };

  const navTabs = getNavTabs();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      {/* 1. Official Tricolor Accent Strip */}
      <div className="h-1 w-full flex">
        <div className="h-full w-1/3 bg-[#FF9933]"></div>
        <div className="h-full w-1/3 bg-white"></div>
        <div className="h-full w-1/3 bg-[#138808]"></div>
      </div>

      {/* 2. Official Portal Header Topline */}
      <div className="bg-[#101b3b] text-slate-300 text-xs px-4 sm:px-8 py-2 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200 tracking-wide text-xs">
            {t.govtOfMaharashtra}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 text-xs hidden sm:inline">
            {t.deptOfIT}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-slate-300 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>
              {language === 'mr' ? profile.designationMr : profile.designation}
            </span>
          </div>

          <button
            onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
            className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 px-2.5 py-1 rounded transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-medium">{language === 'en' ? 'मराठी' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* 3. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#101b3b] text-amber-400 flex flex-col items-center justify-center p-1 border border-slate-300 flex-shrink-0 shadow-xs">
              <span className="text-[8px] font-bold text-white leading-none">महाराष्ट्र</span>
              <div className="w-3.5 h-3.5 my-0.5 border border-amber-400 rounded-full flex items-center justify-center text-[7px] font-black">
                म
              </div>
              <span className="text-[6px] uppercase tracking-tighter text-amber-300">शासन</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-900">
                  {t.portalName}
                </h1>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {t.portalTitleBadge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-normal">
                {language === 'mr' ? profile.departmentOfficeMr : profile.departmentOffice}
              </p>
            </div>
          </div>

          {/* Right Action Area */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            {/* Distinct Demo Mode Switcher (only shown in Demo Mode) */}
            {isDemoMode && (
              <div className="relative">
                <button
                  onClick={() => setDemoSwitcherOpen(!demoSwitcherOpen)}
                  className="flex items-center gap-1.5 text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 px-2.5 py-1.5 rounded-lg border border-amber-300 transition-colors shadow-2xs font-medium"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{language === 'mr' ? 'प्रात्यक्षिक खाती (Demo)' : 'Demo Personas'}</span>
                  <ChevronDown className="w-3 h-3 text-amber-700" />
                </button>

                {demoSwitcherOpen && (
                  <div className="absolute right-0 mt-1 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-3.5 py-2 border-b border-slate-100 bg-slate-50">
                      <div className="text-[10px] font-bold uppercase text-slate-400">
                        {language === 'mr' ? 'चाचणी व प्रात्यक्षिक खाती' : 'Demonstration Accounts'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {language === 'mr' ? 'कोणत्याही खात्यावर १-क्लिक मध्ये स्विच करा' : '1-click switch between official personas'}
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                      {demoPersonas.map(persona => {
                        const isCurrent = currentUser?.id === persona.profile.id || currentRole === persona.role;
                        return (
                          <button
                            key={persona.id}
                            onClick={() => {
                              switchDemoUser(persona.id);
                              setDemoSwitcherOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-2.5 hover:bg-slate-50 transition-colors flex items-start justify-between gap-2 ${
                              isCurrent ? 'bg-amber-50/60 font-bold border-l-2 border-amber-600' : ''
                            }`}
                          >
                            <div>
                              <div className="text-xs text-slate-900 font-semibold">
                                {language === 'mr' ? persona.titleMr : persona.titleEn}
                              </div>
                              <div className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
                                {language === 'mr' ? persona.descMr : persona.descEn}
                              </div>
                            </div>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 flex-shrink-0">
                              {language === 'mr' ? persona.roleBadgeMr : persona.roleBadgeEn}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 text-xs bg-slate-50 hover:bg-slate-100 text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-300 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {profile.avatarInitials}
                </div>

                <div className="text-left hidden sm:block">
                  <div className="font-bold text-slate-900 text-xs">
                    {language === 'mr' ? profile.nameMr : profile.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {language === 'mr' ? profile.designationMr : profile.designation}
                  </div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-0.5" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                  <div className="px-3.5 py-2.5 border-b border-slate-100">
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      {t.activeSession}
                    </div>
                    <div className="text-xs font-bold text-slate-900 mt-0.5">
                      {language === 'mr' ? profile.nameMr : profile.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {language === 'mr' ? profile.designationMr : profile.designation}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {profile.phone} • {profile.departmentOffice}
                    </div>
                  </div>

                  <div className="p-2 border-t border-slate-100 bg-slate-50">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        if (onOpenAuthScreen) onOpenAuthScreen();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-red-700 hover:text-red-900 bg-white hover:bg-red-50 py-1.5 rounded-lg border border-red-200 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t.signOut}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Citizen Consent Rights Modal Trigger */}
            <button
              onClick={onOpenSecurityModal}
              className="text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded border border-slate-300 transition-colors"
            >
              {t.privacyVault}
            </button>

            {/* + New Application Button - ONLY for Citizen Operator! */}
            {currentRole === 'CITIZEN_OPERATOR' && (
              <button
                onClick={onOpenNewAppModal}
                className="text-xs font-bold bg-[#101b3b] hover:bg-[#1a2d61] text-white px-3.5 py-2 rounded shadow-xs transition-colors"
              >
                + {t.newApplication}
              </button>
            )}
          </div>
        </div>

        {/* 4. Natural Tab Navigation Strip (Zero Role Jargon) */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <nav className="flex items-center gap-1.5">
            {navTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="text-[11px] text-slate-500 hidden sm:block">
            {t.integratedRegistriesNote}
          </div>
        </div>
      </div>
    </header>
  );
};
