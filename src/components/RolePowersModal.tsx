import React, { useState } from 'react';
import { useMahaSetu } from '../context/MahaSetuContext';
import { ROLE_POWERS } from '../services/authService';
import type { UserRole } from '../types';
import { X, Check, Ban, ShieldCheck, Scale, ArrowRight } from 'lucide-react';

interface RolePowersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RolePowersModal: React.FC<RolePowersModalProps> = ({ isOpen, onClose }) => {
  const { currentRole, switchDemoUser, language } = useMahaSetu();
  const [activeTabRole, setActiveTabRole] = useState<UserRole>(currentRole);

  if (!isOpen) return null;

  const activePowers = ROLE_POWERS[activeTabRole];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#101b3b] text-white px-5 py-3.5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold">
                {language === 'mr' ? 'प्रशासकीय अधिकार, कार्यकक्षा व मर्यादा' : 'Administrative Roles & Statutory Powers'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {language === 'mr' ? 'शासकीय जबाबदाऱ्यांचे विभाजन व लोकसेवा हक्क अधिकार' : 'Separation of Powers & Statutory Service Delivery Mandates'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-50 border-b border-slate-200 divide-x divide-slate-200 text-xs flex-shrink-0">
          {(['CITIZEN_OPERATOR', 'TALUKA_OFFICER', 'AUDITOR_SECURITY', 'SILO_ARCHITECT'] as UserRole[]).map(r => {
            const def = ROLE_POWERS[r];
            const isSelected = activeTabRole === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setActiveTabRole(r)}
                className={`p-3 text-left transition-colors ${
                  isSelected
                    ? 'bg-white font-bold text-slate-900 border-b-2 border-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <div className="text-[10px] text-slate-400 uppercase font-medium">
                  {r === 'CITIZEN_OPERATOR' ? 'Tier 1' : r === 'TALUKA_OFFICER' ? 'Gazetted' : r === 'AUDITOR_SECURITY' ? 'Oversight' : 'Admin'}
                </div>
                <div className="font-semibold text-xs mt-0.5 truncate">
                  {language === 'mr' ? def.titleMr : def.titleEn}
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs flex-1">
          {/* Statutory Authority Header */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {language === 'mr' ? 'वैधानिक अधिकार व कार्यकक्षा' : 'Statutory Legal Authority'}
            </span>
            <div className="font-bold text-slate-900 text-sm">
              {language === 'mr' ? activePowers.titleMr : activePowers.titleEn}
            </div>
            <p className="text-xs text-slate-600 font-medium">
              {language === 'mr' ? activePowers.authorityMr : activePowers.authorityEn}
            </p>
          </div>

          {/* Granted Powers */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{language === 'mr' ? 'अधिकृत प्रशासकीय अधिकार (Granted Powers)' : 'Granted Administrative Powers'}</span>
            </div>
            <div className="space-y-1.5">
              {(language === 'mr' ? activePowers.grantedPowersMr : activePowers.grantedPowersEn).map((power, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-emerald-50/50 rounded border border-emerald-100 text-slate-800">
                  <Check className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{power}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Restrictions (Separation of Powers) */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
              <Ban className="w-3.5 h-3.5 text-red-600" />
              <span>{language === 'mr' ? 'प्रशासकीय निर्बंध व मर्यादा (Separation of Powers)' : 'Statutory Restrictions (Separation of Powers)'}</span>
            </div>
            <div className="space-y-1.5">
              {(language === 'mr' ? activePowers.restrictedMr : activePowers.restrictedEn).map((res, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-red-50/40 rounded border border-red-100 text-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1.5"></span>
                  <span className="leading-relaxed">{res}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 flex-shrink-0">
          <button
            onClick={() => {
              switchDemoUser(activeTabRole);
              onClose();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-[#101b3b] hover:bg-[#1a2d61] text-white px-4 py-2 rounded transition-colors"
          >
            <span>{language === 'mr' ? 'या भूमिकेचे अधिकार वापरून पहा' : 'Switch to this Role to Test Powers'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded text-xs font-semibold border border-slate-300 transition-colors"
          >
            {language === 'mr' ? 'बंद करा' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
