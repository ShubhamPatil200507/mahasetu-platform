import React, { useState } from 'react';
import { useMahaSetu } from '../context/MahaSetuContext';
import { CertificateVerificationModal } from './CertificateVerificationModal';
import { ArrowLeft, Printer, CheckCircle, ShieldCheck, QrCode } from 'lucide-react';

interface DossierDetailViewProps {
  onBack: () => void;
}

export const DossierDetailView: React.FC<DossierDetailViewProps> = ({ onBack }) => {
  const {
    selectedApp,
    currentRole,
    currentUser,
    language,
    t,
    approveApplication,
    rejectApplication,
    requestClarification
  } = useMahaSetu();

  const [officerRemarks, setOfficerRemarks] = useState('');
  const [officerName, setOfficerName] = useState(
    currentUser?.name || (language === 'mr' ? 'एस. के. कुलकर्णी (तहसीलदार)' : 'S. K. Kulkarni (Tahsildar)')
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  if (!selectedApp) {
    return (
      <div className="bg-white p-8 rounded-lg border border-slate-200 text-center">
        <p className="text-slate-500 font-medium text-xs">
          {language === 'mr' ? 'कोणताही अर्ज निवडलेला नाही.' : 'No application selected.'}
        </p>
        <button
          onClick={onBack}
          className="mt-3 px-3.5 py-1.5 bg-slate-900 text-white rounded text-xs font-semibold"
        >
          {t.backToList}
        </button>
      </div>
    );
  }

  const app = selectedApp;
  const isApproved = app.status === 'OFFICER_APPROVED';
  const isFlagged = app.status === 'FLAGGED_FOR_HUMAN_REVIEW';
  const isRejected = app.status === 'OFFICER_REJECTED';
  const confidence = app.aiHarmonization.confidenceScore;
  const isOfficer = currentRole === 'TALUKA_OFFICER' || currentRole === 'SILO_ARCHITECT';

  const handleApprove = async () => {
    setIsProcessing(true);
    await approveApplication(app.id, officerName, officerRemarks);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    if (!officerRemarks) {
      alert(language === 'mr' ? 'कृपया नाकारण्याचे कारण नोंदवा.' : 'Please enter an official rejection remark.');
      return;
    }
    setIsProcessing(true);
    await rejectApplication(app.id, officerName, officerRemarks);
    setIsProcessing(false);
  };

  const handleRequestClarification = async () => {
    if (!officerRemarks) {
      alert(language === 'mr' ? 'कृपया नागरिकाकडून आवश्यक असलेला खुलासा नोंदवा.' : 'Please specify what clarification the citizen should provide.');
      return;
    }
    setIsProcessing(true);
    await requestClarification(app.id, officerName, officerRemarks);
    setIsProcessing(false);
    alert(t.clarificationSentAlert);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* 1. Header Toolbar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 hover:bg-slate-100 rounded text-slate-600 transition-colors"
            title={t.backToList}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                {app.id}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {language === 'mr' && app.applicantNameMr ? app.applicantNameMr : app.applicantName}
              </span>
              {isApproved && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {t.statusApproved}
                </span>
              )}
              {isFlagged && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                  {t.statusUnderReview}
                </span>
              )}
              {isRejected && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200">
                  {t.statusRejected}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {language === 'mr' ? app.schemeNameMr : app.schemeNameEn} • {app.taluka}, {app.district}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded border border-slate-300 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>{t.printCertificate}</span>
          </button>
        </div>
      </div>

      {/* 2. Official Department Inquiries (Process) */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {t.dossierTitle}
          </h3>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {language === 'mr' ? 'थेट शासकीय पडताळणी' : 'Direct Verification'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Department 1: Revenue Department */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 font-bold text-slate-800">
              <span>{t.deptRevenue}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">{t.statusVerified}</span>
            </div>

            {app.revenueData ? (
              <div className="space-y-1">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.certRef}</span>
                  <span className="font-mono text-slate-900">{app.revenueData.incomeCertId}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.officialIncome}</span>
                  <span className="font-bold text-slate-900 text-sm">
                    ₹{app.revenueData.annualIncome.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.issuingOffice}</span>
                  <span className="text-slate-700">{app.revenueData.tahsildarOffice}</span>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 italic">{language === 'mr' ? 'माहिती उपलब्ध नाही.' : 'No record.'}</div>
            )}
          </div>

          {/* Department 2: Social Justice / BARTI */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 font-bold text-slate-800">
              <span>{t.deptSocial}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">{t.statusVerified}</span>
            </div>

            {app.socialWelfareData ? (
              <div className="space-y-1">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.bartiRef}</span>
                  <span className="font-mono text-slate-900">{app.socialWelfareData.bartiVerificationNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.casteCategory}</span>
                  <span className="font-bold text-slate-900">
                    {app.socialWelfareData.casteCategory} ({app.socialWelfareData.subCaste})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">{language === 'mr' ? 'छाननी स्थिती' : 'Scrutiny'}</span>
                  <span className="text-emerald-700 font-semibold">{app.socialWelfareData.bartiStatus}</span>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 italic">{language === 'mr' ? 'माहिती उपलब्ध नाही.' : 'No record.'}</div>
            )}
          </div>

          {/* Department 3: Land Records / Mahabhulekh */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 font-bold text-slate-800">
              <span>{t.deptLand}</span>
              <span className="text-[10px] text-emerald-700 font-semibold">{t.statusVerified}</span>
            </div>

            {app.landData ? (
              <div className="space-y-1">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.surveyGatNumber}</span>
                  <span className="font-mono text-slate-900">{app.landData.surveyGatNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.landArea}</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {app.landData.landAreaHectares} {language === 'mr' ? 'हेक्टर' : 'Ha'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.encumbrance}</span>
                  <span className="text-emerald-700 font-semibold">
                    {app.landData.encumbranceStatus === 'NIL' ? t.nilEncumbrance : app.landData.encumbranceStatus}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 italic">{language === 'mr' ? 'माहिती उपलब्ध नाही.' : 'No record.'}</div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Eligibility Summary (Result) */}
      <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            {t.evalTitle}
          </h3>
          <div className="text-right">
            <span className="text-xs text-slate-500 mr-1.5">{t.verificationRating}:</span>
            <span className={`font-bold text-sm ${confidence >= 90 ? 'text-emerald-700' : 'text-amber-700'}`}>
              {confidence}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <div className="text-[10px] uppercase font-medium text-slate-500">{t.checkNameMatch}</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{app.aiHarmonization.phoneticNameScore}%</div>
            <div className="text-[10px] text-emerald-700 font-medium">✓ {t.passed}</div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <div className="text-[10px] uppercase font-medium text-slate-500">{t.checkIncomeLimit}</div>
            <div className={`text-sm font-bold mt-0.5 ${app.aiHarmonization.incomeThresholdPassed ? 'text-emerald-700' : 'text-red-700'}`}>
              {app.aiHarmonization.incomeThresholdPassed ? t.passed : t.exceeded}
            </div>
            <div className="text-[10px] text-slate-500">₹{app.revenueData?.annualIncome.toLocaleString('en-IN')} (Max ₹{app.maxIncomeCeiling?.toLocaleString('en-IN')})</div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <div className="text-[10px] uppercase font-medium text-slate-500">{t.checkLandLimit}</div>
            <div className={`text-sm font-bold mt-0.5 ${app.aiHarmonization.landCeilingPassed ? 'text-emerald-700' : 'text-red-700'}`}>
              {app.aiHarmonization.landCeilingPassed ? t.passed : t.exceeded}
            </div>
            <div className="text-[10px] text-slate-500">{app.landData?.landAreaHectares || 0} Ha (Max {app.maxLandCeilingHectares || 2} Ha)</div>
          </div>

          <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
            <div className="text-[10px] uppercase font-medium text-slate-500">{t.checkCasteValidity}</div>
            <div className={`text-sm font-bold mt-0.5 ${app.aiHarmonization.casteValidityPassed ? 'text-emerald-700' : 'text-red-700'}`}>
              {app.aiHarmonization.casteValidityPassed ? t.passed : (language === 'mr' ? 'प्रलंबित' : 'Pending')}
            </div>
            <div className="text-[10px] text-slate-500">{app.socialWelfareData?.bartiStatus || 'Valid'}</div>
          </div>
        </div>

        {/* Note of discrepancy if any */}
        {app.aiHarmonization.anomalies.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {app.aiHarmonization.anomalies.map((anom, idx) => (
              <div key={idx} className="p-2.5 rounded border border-amber-200 bg-amber-50/60 text-xs">
                <span className="font-bold text-amber-900 block">
                  {language === 'mr' ? anom.messageMr : anom.messageEn}
                </span>
                <span className="text-[11px] text-amber-800">
                  {t.recommendedAction} {language === 'mr' ? anom.suggestedActionMr : anom.suggestedActionEn}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Taluka Officer Verification & Action Desk - ONLY SHOWN TO OFFICERS! */}
      {isOfficer && (
        <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-lg border border-slate-800 shadow-sm space-y-3 no-print">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {t.officerDeskTitle}
              </h3>
              <p className="text-[11px] text-slate-400">
                {t.officerDeskSub}
              </p>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded font-mono border border-slate-700">
              {language === 'mr' ? 'अधिकारी कार्यकक्षा' : 'Officer Desk'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                {t.officerNameLabel}
              </label>
              <input
                type="text"
                value={officerName}
                onChange={e => setOfficerName(e.target.value)}
                className="w-full text-xs px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-slate-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">
                {t.officerRemarksLabel}
              </label>
              <input
                type="text"
                value={officerRemarks}
                onChange={e => setOfficerRemarks(e.target.value)}
                placeholder={t.officerRemarksPlaceholder}
                className="w-full text-xs px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-slate-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="text-[11px] text-slate-400">
              {app.digitalSignatureRef ? `${t.certDscStamp} ${app.digitalSignatureRef}` : (language === 'mr' ? 'स्वाक्षरी प्रलंबित' : 'Pending signature')}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRequestClarification}
                disabled={isProcessing}
                className="text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded border border-slate-700 transition-colors"
              >
                {t.btnRequestClarification}
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing || isRejected}
                className="text-xs font-semibold bg-red-900/60 hover:bg-red-800 text-red-200 px-3 py-1.5 rounded border border-red-800 transition-colors"
              >
                {t.btnReject}
              </button>
              <button
                onClick={handleApprove}
                disabled={isProcessing || isApproved}
                className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded transition-colors disabled:opacity-50"
              >
                {t.btnApprove}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Official Verifiable Entitlement Certificate with WORKING QR CODE */}
      <div className="bg-white p-6 rounded-lg border border-slate-300 shadow-2xs space-y-4">
        <div className="flex items-start justify-between border-b border-slate-900 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#101b3b] text-amber-400 flex flex-col items-center justify-center p-1 border border-slate-300 flex-shrink-0">
              <span className="text-[8px] font-bold text-white leading-none">महाराष्ट्र</span>
              <div className="w-3.5 h-3.5 my-0.5 border border-amber-400 rounded-full flex items-center justify-center text-[7px] font-black">
                म
              </div>
              <span className="text-[6px] uppercase tracking-tighter text-amber-300">शासन</span>
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase">
                {t.certGovtHeader}
              </h2>
              <p className="text-xs text-slate-800 font-bold">
                {t.certDocTitle}
              </p>
              <p className="text-[10px] text-slate-500">
                {t.certIssuedUnder}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-900 block">
              {app.id}
            </span>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
              {language === 'mr' ? 'अधिकृत व प्रमाणित' : 'Verified & Certified'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2.5 p-2.5 bg-slate-50 rounded border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.certApplicantName}</span>
                <span className="font-bold text-slate-900">
                  {language === 'mr' && app.applicantNameMr ? app.applicantNameMr : app.applicantName}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.certUidMasked}</span>
                <span className="font-mono text-slate-800">{app.aadhaarMasked}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.certJurisdiction}</span>
                <span className="text-slate-800">{app.taluka}, {app.district}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.certSchemeName}</span>
                <span className="font-semibold text-slate-900">
                  {language === 'mr' ? app.schemeNameMr : app.schemeNameEn}
                </span>
              </div>
            </div>

            {/* Verified Summary */}
            <div className="grid grid-cols-3 gap-2 text-[11px] p-2 bg-slate-50 rounded border border-slate-200">
              <div>
                <span className="text-slate-400 block">{t.deptRevenue}</span>
                <span className="text-slate-900 font-bold">₹{app.revenueData?.annualIncome.toLocaleString('en-IN') || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{t.deptSocial}</span>
                <span className="text-slate-900 font-bold">{app.socialWelfareData?.bartiStatus || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{t.deptLand}</span>
                <span className="text-slate-900 font-bold">{app.landData?.landAreaHectares || '0'} {language === 'mr' ? 'हेक्टर' : 'Ha'}</span>
              </div>
            </div>

            <div className="p-2 bg-slate-100 rounded border border-slate-200 text-[10px] text-slate-700">
              <span className="font-bold text-slate-900">{t.certDscStamp} </span>
              <span className="font-mono text-slate-600">{app.digitalSignatureRef || 'MH-GOV-DSC-VERIFIED'}</span>
              <div className="text-slate-500 mt-0.5">{t.certSignedBy} {app.assignedOfficer}</div>
            </div>
          </div>

          {/* Dynamic Clickable QR Code with Verification Action */}
          <div
            onClick={() => setIsQrModalOpen(true)}
            className="flex flex-col items-center justify-center p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 hover:border-slate-800 text-center cursor-pointer group transition-all"
            title={language === 'mr' ? 'प्रमाणपत्र पडताळण्यासाठी क्लिक करा' : 'Click to Verify Document Online'}
          >
            <div className="p-2 bg-white rounded border border-slate-300 group-hover:shadow-md transition-shadow">
              <svg className="w-24 h-24 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="30" height="30" fill="#0F172A" rx="2" />
                <rect x="5" y="5" width="20" height="20" fill="white" rx="1" />
                <rect x="10" y="10" width="10" height="10" fill="#0F172A" />

                <rect x="70" width="30" height="30" fill="#0F172A" rx="2" />
                <rect x="75" y="5" width="20" height="20" fill="white" rx="1" />
                <rect x="80" y="10" width="10" height="10" fill="#0F172A" />

                <rect y="70" width="30" height="30" fill="#0F172A" rx="2" />
                <rect x="5" y="75" width="20" height="20" fill="white" rx="1" />
                <rect x="10" y="80" width="10" height="10" fill="#0F172A" />

                <rect x="35" y="5" width="8" height="8" fill="#0F172A" />
                <rect x="48" y="12" width="6" height="6" fill="#0F172A" />
                <rect x="35" y="22" width="10" height="6" fill="#0F172A" />
                <rect x="58" y="5" width="6" height="15" fill="#0F172A" />
                <rect x="12" y="38" width="15" height="6" fill="#0F172A" />
                <rect x="35" y="38" width="20" height="20" fill="#1E293B" rx="1" />
                <rect x="65" y="38" width="15" height="10" fill="#0F172A" />
                <rect x="85" y="42" width="10" height="18" fill="#0F172A" />
                <rect x="38" y="65" width="8" height="18" fill="#0F172A" />
                <rect x="52" y="68" width="14" height="10" fill="#0F172A" />
                <rect x="72" y="72" width="22" height="6" fill="#0F172A" />
                <rect x="78" y="82" width="12" height="12" fill="#0F172A" />
              </svg>
            </div>
            <div className="mt-2 text-xs font-bold text-blue-900 flex items-center gap-1 group-hover:underline">
              <QrCode className="w-3.5 h-3.5" />
              <span>{language === 'mr' ? 'पडताळणीसाठी क्लिक करा' : 'Click to Verify Online'}</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono mt-0.5">
              mahasetu.mah.gov.in/v/{app.id}
            </span>
          </div>
        </div>
      </div>

      {/* 6. Citizen SMS Notification */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-2 no-print">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          {t.smsLogTitle}
        </h4>
        <div className="space-y-1.5">
          {app.smsTrackingLogs.map((log, idx) => (
            <div
              key={idx}
              className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-start justify-between gap-2 text-xs"
            >
              <div>
                <div className="font-medium text-slate-800">
                  {language === 'mr' ? log.messageMr : log.messageEn}
                </div>
                <div className="text-[10px] text-slate-400">
                  {t.smsSentTo} {app.applicantPhone.slice(0, 2)}*****{app.applicantPhone.slice(-3)}
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                {new Date(log.timestamp).toLocaleTimeString(language === 'mr' ? 'mr-IN' : 'en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal that opens when QR code is clicked! */}
      <CertificateVerificationModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        application={app}
      />
    </div>
  );
};
