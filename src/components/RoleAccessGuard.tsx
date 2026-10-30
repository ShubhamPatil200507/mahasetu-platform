import React from 'react';
import { useMahaSetu } from '../context/MahaSetuContext';
import { DEMO_PROFILES } from '../services/authService';
import type { UserRole } from '../types';
import { ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

interface RoleAccessGuardProps {
  requiredRole: UserRole;
  requiredRoleTitle: string;
  requiredRoleTitleMr: string;
  reasonEn: string;
  reasonMr: string;
}

export const RoleAccessGuard: React.FC<RoleAccessGuardProps> = ({
  requiredRole,
  requiredRoleTitle,
  requiredRoleTitleMr,
  reasonEn,
  reasonMr
}) => {
  const { currentUser, switchDemoUser, language } = useMahaSetu();
  const targetDemo = DEMO_PROFILES[requiredRole];

  return (
    <div className="bg-white rounded-lg border border-slate-300 shadow-2xs p-8 max-w-2xl mx-auto my-8 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900">
          {language === 'mr' ? 'अधिकृत प्रवेश मर्यादा' : 'Restricted Administrative Access'}
        </h3>
        <p className="text-xs font-semibold text-amber-800">
          {language === 'mr' ? requiredRoleTitleMr : requiredRoleTitle} {language === 'mr' ? 'अधिकार आवश्यक' : 'Authorization Required'}
        </p>
      </div>

      <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
        {language === 'mr' ? reasonMr : reasonEn}
      </p>

      {currentUser && (
        <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs text-slate-600 max-w-md mx-auto">
          <span className="font-medium text-slate-700">
            {language === 'mr' ? 'सध्याचे खाते: ' : 'Active Session: '}
          </span>
          <span className="font-semibold text-slate-900">{currentUser.name}</span>{' '}
          <span className="text-slate-500 font-mono">({currentUser.designation})</span>
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={() => switchDemoUser(requiredRole)}
          className="inline-flex items-center gap-2 bg-[#101b3b] hover:bg-[#1a2d61] text-white px-5 py-2.5 rounded text-xs font-semibold shadow-xs transition-colors"
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>
            {language === 'mr'
              ? `डेमो ${targetDemo.nameMr} खात्यावर स्विच करा`
              : `Switch to Demo ${targetDemo.name} (${targetDemo.designation})`}
          </span>
          <ArrowRight className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>
    </div>
  );
};
