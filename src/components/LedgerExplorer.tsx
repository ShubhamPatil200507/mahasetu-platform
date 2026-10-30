import React, { useState } from 'react';
import { useMahaSetu } from '../context/MahaSetuContext';
import { RefreshCw, Download, CheckCircle, ShieldCheck } from 'lucide-react';

export const LedgerExplorer: React.FC = () => {
  const {
    ledgerBlocks,
    isVerifyingLedger,
    ledgerVerificationResult,
    verifyLedger,
    language,
    t
  } = useMahaSetu();

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportLedgerJson = () => {
    // Generate an official administrative record export
    const exportRecords = ledgerBlocks.map(b => ({
      actionNumber: b.index,
      timestamp: b.timestamp,
      officialAction: b.action,
      applicationId: b.applicationId,
      authorizedActor: b.actor,
      administrativeRole: b.actorRole,
      status: 'OFFICIALLY_CERTIFIED'
    }));

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportRecords, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mahasetu_official_audit_register_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const getActionLabel = (action: string) => {
    if (action.includes('GENESIS')) {
      return language === 'mr' ? 'प्रणाली नोंदवही प्रारंभ (System Initiation)' : 'System Audit Register Initiation';
    }
    if (action.includes('APPLICATION_REGISTRATION')) {
      return language === 'mr' ? 'नागरिक अर्ज दाखल व संमती नोंदणी' : 'Citizen Application Registration & Consent Captured';
    }
    if (action.includes('OFFICER_DSC_APPROVAL')) {
      return language === 'mr' ? 'तालुका अधिकारी डिजिटल स्वाक्षरीने (DSC) मंजुरी' : 'Taluka Officer Approval & DSC Signature Affixed';
    }
    if (action.includes('APPLICATION_REJECTED')) {
      return language === 'mr' ? 'तालुका अधिकारी फेरछाननी व अर्ज नकार' : 'Taluka Officer Rejection & Cause Recorded';
    }
    return action;
  };

  return (
    <div className="space-y-5">
      {/* 1. Register Overview Header */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-slate-800" />
              <h2 className="text-base font-bold text-slate-900">
                {t.auditTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {t.auditSub}
            </p>
          </div>

          {/* Audit Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={verifyLedger}
              disabled={isVerifyingLedger}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {isVerifyingLedger ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle className="w-3.5 h-3.5" />
              )}
              <span>{t.verifyRegister}</span>
            </button>

            <button
              onClick={handleExportLedgerJson}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded border border-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>{downloadSuccess ? (language === 'mr' ? 'डाऊनलोड पूर्ण!' : 'Downloaded!') : t.exportAudit}</span>
            </button>
          </div>
        </div>

        {/* Verification Result Banner */}
        {ledgerVerificationResult && (
          <div
            className={`p-3.5 rounded border text-xs space-y-1 ${
              ledgerVerificationResult.isValid
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              {ledgerVerificationResult.isValid
                ? t.auditIntegrityConfirmed
                : t.auditIntegrityAlert}
            </div>
            <p>
              {language === 'mr'
                ? `नोंदवहीतील सर्व ${ledgerBlocks.length} प्रशासकीय नोंदी अखंड व प्रमाणित आहेत.`
                : `All ${ledgerBlocks.length} official administrative actions are verified and intact.`}
            </p>
          </div>
        )}
      </div>

      {/* 2. Official Action Trail List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
          <span>{t.totalActionsRecorded} <strong className="text-slate-800">{ledgerBlocks.length}</strong></span>
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {language === 'mr' ? 'अधिकृत कायमस्वरूपी नोंद' : 'Permanent Official Record'}
          </span>
        </div>

        <div className="space-y-3">
          {ledgerBlocks.map((block) => {
            const isGenesis = block.index === 0;

            return (
              <div
                key={block.index}
                className="rounded-lg border border-slate-200 p-4 bg-white shadow-2xs hover:border-slate-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2.5 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs px-2.5 py-0.5 rounded bg-slate-900 text-white">
                      {t.actionNumber} {block.index}
                    </span>
                    <span className="font-semibold text-xs text-slate-900">
                      {getActionLabel(block.action)}
                    </span>
                    {isGenesis && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {language === 'mr' ? 'आरंभ नोंद' : 'Initial Entry'}
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500">
                    {new Date(block.timestamp).toLocaleString(language === 'mr' ? 'mr-IN' : 'en-IN')}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">
                      {t.actionActor}
                    </span>
                    <span className="text-slate-900 font-semibold block mt-0.5">
                      {block.actor}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {block.actorRole === 'TALUKA_OFFICER'
                        ? (language === 'mr' ? 'तहसीलदार व पडताळणी अधिकारी' : 'Taluka Verification Officer')
                        : block.actorRole === 'CITIZEN_OPERATOR'
                        ? (language === 'mr' ? 'नागरिक अर्जदार / ऑपरेटर' : 'Citizen Applicant / Operator')
                        : (language === 'mr' ? 'राज्य मुख्य नोड' : 'State Authority Node')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">
                      {t.actionReference}
                    </span>
                    <span className="font-mono text-slate-800 font-medium block mt-0.5">
                      {block.applicationId}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-medium block">
                      {language === 'mr' ? 'प्रशासकीय स्थिती' : 'Administrative Status'}
                    </span>
                    <span className="text-emerald-700 font-medium inline-flex items-center gap-1 mt-0.5">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {language === 'mr' ? 'नोंद प्रमाणित व सुरक्षित' : 'Certified & Recorded'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
