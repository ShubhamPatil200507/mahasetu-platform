import React, { useState } from 'react';
import { useMahaSetu } from '../context/MahaSetuContext';
import { X, CheckCircle, Shield } from 'lucide-react';

interface CitizenSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CitizenSubmissionModal: React.FC<CitizenSubmissionModalProps> = ({
  isOpen,
  onClose
}) => {
  const { submitNewApplication, selectApplication, setActiveTab, currentUser, language, t } = useMahaSetu();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pipelineStep, setPipelineStep] = useState<string>('');

  // Default to logged in user details if citizen
  const defaultName = currentUser?.name || (language === 'mr' ? 'सुरेश म. चव्हाण' : 'Suresh M. Chavan');
  const defaultPhone = currentUser?.phone || '9822941029';

  // Form State
  const [applicantName, setApplicantName] = useState(defaultName);
  const [applicantPhone, setApplicantPhone] = useState(defaultPhone);
  const [aadhaarNumber, setAadhaarNumber] = useState('7819 2839 4910');
  const [district, setDistrict] = useState('Pune');
  const [taluka, setTaluka] = useState('Daund');
  const [village, setVillage] = useState('Kedgaon');
  const [schemeId, setSchemeId] = useState('SCHEME_SANJAY_GANDHI');
  const [selfDeclaredIncome, setSelfDeclaredIncome] = useState(48000);
  const [selfDeclaredLandHectares, setSelfDeclaredLandHectares] = useState(0.85);
  const [selfDeclaredCaste, setSelfDeclaredCaste] = useState(
    language === 'mr' ? 'अनुसूचित जाती (महार)' : 'SC (Mahar)'
  );

  // Sync with currentUser when modal opens
  React.useEffect(() => {
    if (isOpen && currentUser) {
      if (currentUser.name) {
        setApplicantName(language === 'mr' && currentUser.nameMr ? currentUser.nameMr : currentUser.name);
      }
      if (currentUser.phone) {
        setApplicantPhone(currentUser.phone);
      }
    }
  }, [isOpen, currentUser, language]);

  // DPDP Consent Checkboxes
  const [consentRevenue, setConsentRevenue] = useState(true);
  const [consentSocial, setConsentSocial] = useState(true);
  const [consentLand, setConsentLand] = useState(true);
  const [consentConfirmed, setConsentConfirmed] = useState(true);

  if (!isOpen) return null;

  const handleNextToConsent = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleAuthorizeAndExecute = async () => {
    setIsSubmitting(true);
    setStep(3);

    setPipelineStep(
      language === 'mr'
        ? 'नागरिक अर्ज व अधिकृत संमती नोंदवत आहे...'
        : 'Recording citizen application and digital consent authorization...'
    );
    await new Promise(r => setTimeout(r, 450));

    setPipelineStep(
      language === 'mr'
        ? 'महसूल, सामाजिक न्याय आणि भूमी अभिलेख विभागांकडून माहिती पडताळत आहे...'
        : 'Querying Revenue, Social Justice, and Land Records departments...'
    );
    await new Promise(r => setTimeout(r, 550));

    setPipelineStep(
      language === 'mr'
        ? 'पात्रता निकष व विभागीय माहितीची सुसंगतता पडताळत आहे...'
        : 'Evaluating eligibility criteria and records consistency...'
    );
    await new Promise(r => setTimeout(r, 500));

    setPipelineStep(
      language === 'mr'
        ? 'शासकीय नोंदवहीत अधिकृत नोंद प्रमाणित करत आहे...'
        : 'Certifying official entry in the state service registry...'
    );
    await new Promise(r => setTimeout(r, 450));

    const newApp = await submitNewApplication({
      applicantName,
      applicantPhone,
      aadhaarNumber,
      schemeId,
      district,
      taluka,
      village,
      selfDeclaredIncome: Number(selfDeclaredIncome),
      selfDeclaredLandHectares: Number(selfDeclaredLandHectares),
      selfDeclaredCaste
    });

    setIsSubmitting(false);
    selectApplication(newApp.id);
    setActiveTab('tracking');
    onClose();
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-[#101b3b] text-white px-5 py-3.5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold">
              {t.newAppTitle}
            </h3>
            <p className="text-xs text-slate-300">
              {t.newAppSub}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 text-xs text-center py-2">
          <div className={step >= 1 ? 'font-bold text-slate-900' : 'text-slate-400'}>
            {t.step1}
          </div>
          <div className={step >= 2 ? 'font-bold text-slate-900' : 'text-slate-400'}>
            {t.step2}
          </div>
          <div className={step >= 3 ? 'font-bold text-slate-900' : 'text-slate-400'}>
            {t.step3}
          </div>
        </div>

        {/* STEP 1: Citizen Details */}
        {step === 1 && (
          <form onSubmit={handleNextToConsent} className="p-5 space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={e => setApplicantName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {t.mobileNumber}
                </label>
                <input
                  type="tel"
                  required
                  value={applicantPhone}
                  onChange={e => setApplicantPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {t.aadhaarNumber}
                </label>
                <input
                  type="text"
                  required
                  value={aadhaarNumber}
                  onChange={e => setAadhaarNumber(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono focus:outline-none focus:border-slate-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {t.selectScheme}
                </label>
                <select
                  value={schemeId}
                  onChange={e => setSchemeId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:border-slate-500"
                >
                  <option value="SCHEME_SANJAY_GANDHI">{t.schemeSanjayGandhi}</option>
                  <option value="SCHEME_SWADHAR_HOSTEL">{t.schemeAmbedkarSwadhar}</option>
                  <option value="SCHEME_KRUSHI_SANMAN">{t.schemeKrushiSanman}</option>
                  <option value="SCHEME_EWS_EDUCATION">{t.schemeEwsEducation}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {t.district}
                </label>
                <select
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:border-slate-500"
                >
                  <option value="Pune">{language === 'mr' ? 'पुणे' : 'Pune'}</option>
                  <option value="Ahmednagar">{language === 'mr' ? 'अहमदनगर' : 'Ahmednagar'}</option>
                  <option value="Solapur">{language === 'mr' ? 'सोलापूर' : 'Solapur'}</option>
                  <option value="Nashik">{language === 'mr' ? 'नाशिक' : 'Nashik'}</option>
                  <option value="Kolhapur">{language === 'mr' ? 'कोल्हापूर' : 'Kolhapur'}</option>
                  <option value="Nagpur">{language === 'mr' ? 'नागपूर' : 'Nagpur'}</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {t.taluka} & {t.village}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={taluka}
                    onChange={e => setTaluka(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                    placeholder={t.taluka}
                  />
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs"
                    placeholder={t.village}
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {t.declaredIncome}
                </label>
                <input
                  type="number"
                  required
                  value={selfDeclaredIncome}
                  onChange={e => setSelfDeclaredIncome(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {t.declaredLand}
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={selfDeclaredLandHectares}
                  onChange={e => setSelfDeclaredLandHectares(Number(e.target.value))}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">
                  {t.casteCategoryInput}
                </label>
                <input
                  type="text"
                  required
                  value={selfDeclaredCaste}
                  onChange={e => setSelfDeclaredCaste(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs"
                  placeholder={language === 'mr' ? 'उदा. अनुसूचित जाती (महार), इतर मागासवर्ग (कुणबी), खुला प्रवर्ग' : 'e.g. SC (Mahar), OBC (Kunbi), Open'}
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                {language === 'mr' ? 'अधिकृत शासकीय डेटा गोपनीयता' : 'Official Government Data Protection'}
              </span>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded text-xs font-semibold transition-colors"
              >
                {t.proceedToConsent}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Citizen DPDP Consent Authorization */}
        {step === 2 && (
          <div className="p-5 space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-700 leading-relaxed">
              <span className="font-semibold block text-slate-900 mb-0.5">
                {t.consentNoticeTitle}
              </span>
              {t.consentNoticeDesc}
            </div>

            <div className="space-y-2 border border-slate-200 rounded p-3 bg-white">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentRevenue}
                  onChange={e => setConsentRevenue(e.target.checked)}
                  className="rounded text-slate-900"
                />
                <span className="text-slate-800 font-medium">{t.consentRevenueCheck}</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentSocial}
                  onChange={e => setConsentSocial(e.target.checked)}
                  className="rounded text-slate-900"
                />
                <span className="text-slate-800 font-medium">{t.consentSocialCheck}</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentLand}
                  onChange={e => setConsentLand(e.target.checked)}
                  className="rounded text-slate-900"
                />
                <span className="text-slate-800 font-medium">{t.consentLandCheck}</span>
              </label>
            </div>

            <label className="flex items-center gap-2 text-slate-700 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={consentConfirmed}
                onChange={e => setConsentConfirmed(e.target.checked)}
                className="rounded text-slate-900"
              />
              <span className="font-medium text-slate-900">{t.consentConfirmCheck}</span>
            </label>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-slate-600 hover:text-slate-900 px-3 py-1.5 font-medium"
              >
                {t.back}
              </button>
              <button
                type="button"
                disabled={!consentConfirmed}
                onClick={handleAuthorizeAndExecute}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {t.submitAndVerify}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Automated Verification Progress */}
        {step === 3 && (
          <div className="p-8 text-center space-y-4">
            <div className="w-10 h-10 mx-auto rounded-full border-2 border-slate-900 border-t-transparent animate-spin"></div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {t.submittingProgressTitle}
              </h4>
              <p className="text-xs text-slate-600 mt-2 font-medium">
                {pipelineStep}
              </p>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-slate-900 h-full w-full animate-pulse"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
