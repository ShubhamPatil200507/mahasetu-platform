import React from 'react';
import type { CitizenApplication } from '../types';
import { useMahaSetu } from '../context/MahaSetuContext';
import { CheckCircle2, X, Printer, ShieldCheck } from 'lucide-react';

interface CertificateVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: CitizenApplication;
}

export const CertificateVerificationModal: React.FC<CertificateVerificationModalProps> = ({
  isOpen,
  onClose,
  application
}) => {
  const { language } = useMahaSetu();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-300 overflow-hidden my-6">
        {/* Header Strip */}
        <div className="bg-[#101b3b] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-slate-900 text-amber-400 flex flex-col items-center justify-center p-0.5 border border-slate-700">
              <span className="text-[7px] font-bold text-white">महाराष्ट्र</span>
              <span className="text-[6px] text-amber-400">शासन</span>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                {language === 'mr' ? 'शासकीय दस्तऐवज पडताळणी पोर्टल' : 'Official Document Verification Portal'}
              </h3>
              <p className="text-[10px] text-slate-300 font-mono">
                mahasetu.mah.gov.in/v/{application.id}
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

        {/* Verification Success Banner */}
        <div className="bg-emerald-50 border-b border-emerald-200 p-4 text-center space-y-1">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-emerald-900">
            {language === 'mr' ? 'अधिकृत व प्रमाणित शासकीय दस्तऐवज' : 'Document Verified & Certified Authentic'}
          </h4>
          <p className="text-xs text-emerald-700">
            {language === 'mr'
              ? 'महाराष्ट्र शासन • माहिती व तंत्रज्ञान संचालनालय द्वारे वैध घोषित'
              : 'Certified Valid by Directorate of Information Technology, Govt. of Maharashtra'}
          </p>
        </div>

        {/* Certificate Details */}
        <div className="p-5 space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-medium block">
                {language === 'mr' ? 'प्रमाणपत्र क्रमांक' : 'Certificate ID'}
              </span>
              <span className="font-mono font-bold text-slate-900">{application.id}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-medium block">
                {language === 'mr' ? 'निर्गमित दिनांक' : 'Issue Date'}
              </span>
              <span className="text-slate-800 font-medium">
                {new Date(application.updatedDate).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-medium block">
                {language === 'mr' ? 'लाभार्थीचे नाव' : 'Beneficiary Name'}
              </span>
              <span className="font-bold text-slate-900">
                {language === 'mr' && application.applicantNameMr ? application.applicantNameMr : application.applicantName}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-medium block">
                {language === 'mr' ? 'आधार क्रमांक' : 'Masked Aadhaar'}
              </span>
              <span className="font-mono text-slate-800">{application.aadhaarMasked}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-medium block">
                {language === 'mr' ? 'मंजूर योजना' : 'Approved Scheme'}
              </span>
              <span className="font-semibold text-slate-900 text-xs">
                {language === 'mr' ? application.schemeNameMr : application.schemeNameEn}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200 text-[11px]">
              <div>
                <span className="text-slate-400 block">{language === 'mr' ? 'उत्पन्न' : 'Income'}</span>
                <span className="font-bold text-slate-900">₹{application.revenueData?.annualIncome.toLocaleString('en-IN') || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{language === 'mr' ? 'जात संवर्ग' : 'Category'}</span>
                <span className="font-bold text-slate-900">{application.socialWelfareData?.casteCategory || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">{language === 'mr' ? 'जमीन' : 'Land'}</span>
                <span className="font-bold text-slate-900">{application.landData?.landAreaHectares || '0'} Ha</span>
              </div>
            </div>
          </div>

          {/* Official DSC Signature */}
          <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-[11px]">
              <div className="font-bold text-slate-900">
                {language === 'mr' ? 'डिजिटल स्वाक्षरी प्रमाणपत्र (DSC) शिक्का' : 'Digital Signature Certificate (DSC) Seal'}
              </div>
              <div className="text-slate-600 font-mono text-[10px] break-all">
                {application.digitalSignatureRef || 'MH-GOV-DSC-VERIFIED::7A981C4F209B741E00918'}
              </div>
              <div className="text-slate-500 text-[10px]">
                {language === 'mr' ? 'प्रमाणित अधिकारी: ' : 'Certified by: '}{application.assignedOfficer}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 px-3.5 py-1.5 rounded border border-slate-300 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>{language === 'mr' ? 'पावती छापा' : 'Print Receipt'}</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors"
          >
            {language === 'mr' ? 'बंद करा' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
