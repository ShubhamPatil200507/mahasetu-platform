import React from 'react';
import { useMahaSetu } from '../context/MahaSetuContext';
import { X, Shield } from 'lucide-react';

interface SecurityPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityPrivacyModal: React.FC<SecurityPrivacyModalProps> = ({
  isOpen,
  onClose
}) => {
  const { applications, securityLogs, revokeConsent, language, t } = useMahaSetu();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#101b3b] text-white px-5 py-3.5 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-sm font-bold">
              {t.consentVaultTitle}
            </h3>
            <p className="text-xs text-slate-300">
              {t.consentVaultSub}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-5 overflow-y-auto text-xs">
          {/* 1. DPDP Compliance Principles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">{t.purposeLimitTitle}</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t.purposeLimitDesc}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">{t.dataMinTitle}</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t.dataMinDesc}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">{t.rightToRevokeTitle}</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {t.rightToRevokeDesc}
              </p>
            </div>
          </div>

          {/* 2. Active Consent Tokens Table */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {t.activeTokensTitle}
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">{t.consentRef}</th>
                    <th className="p-2.5">{t.colName}</th>
                    <th className="p-2.5">{t.consentPurpose}</th>
                    <th className="p-2.5">{t.consentGrantedOn}</th>
                    <th className="p-2.5">{t.consentStatus}</th>
                    <th className="p-2.5 text-right">{language === 'mr' ? 'कृती' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {applications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono text-slate-800">{app.consent.consentId}</td>
                      <td className="p-2.5 font-medium text-slate-900">
                        {language === 'mr' && app.applicantNameMr ? app.applicantNameMr : app.applicantName}
                      </td>
                      <td className="p-2.5 text-slate-700 max-w-xs truncate">
                        {language === 'mr' ? app.schemeNameMr : app.schemeNameEn}
                      </td>
                      <td className="p-2.5 text-slate-500">
                        {new Date(app.consent.grantedAt).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN')}
                      </td>
                      <td className="p-2.5">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            app.consent.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-red-50 text-red-800'
                          }`}
                        >
                          {app.consent.status === 'ACTIVE' ? (language === 'mr' ? 'सक्रिय' : 'Active') : (language === 'mr' ? 'मागे घेतली' : 'Revoked')}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        {app.consent.status === 'ACTIVE' && (
                          <button
                            onClick={() => revokeConsent(app.id)}
                            className="text-[10px] font-semibold text-red-700 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded border border-red-200 transition-colors"
                          >
                            {t.actionRevoke}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Security & Access Trail */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              {t.securityTrailTitle}
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">{t.actionNumber}</th>
                    <th className="p-2.5">{t.logTime}</th>
                    <th className="p-2.5">{t.logOfficer}</th>
                    <th className="p-2.5">{t.logAction}</th>
                    <th className="p-2.5">{t.colStatus}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {securityLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-800 font-mono">{log.id}</td>
                      <td className="p-2.5 text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString(language === 'mr' ? 'mr-IN' : 'en-IN')}
                      </td>
                      <td className="p-2.5 font-medium text-slate-800">{log.actor}</td>
                      <td className="p-2.5 text-slate-700">
                        {language === 'mr'
                          ? (log.action.includes('CONSENT') ? 'नागरिक संमती नोंदवली' : 'विभागीय माहिती पडताळणी')
                          : log.action.replace(/_/g, ' ')}
                      </td>
                      <td className="p-2.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                          {language === 'mr' ? 'प्रमाणित' : 'Verified'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 flex-shrink-0">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <Shield className="w-4 h-4 text-emerald-700" />
            {language === 'mr' ? 'नागरिक डेटा गोपनीयता व संरक्षण (DPDP कायदा २०२३)' : 'DPDP Act 2023 Digital Citizen Data Rights'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
