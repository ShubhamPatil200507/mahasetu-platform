import React from 'react';
import { useMahaSetu } from '../context/MahaSetuContext';
import { Search, FileText, PlusCircle, CheckCircle, ShieldCheck } from 'lucide-react';

interface ApplicationTrackerProps {
  onOpenDossier: (appId: string) => void;
  onOpenNewAppModal?: () => void;
}

export const ApplicationTracker: React.FC<ApplicationTrackerProps> = ({ onOpenDossier, onOpenNewAppModal }) => {
  const {
    applications,
    currentUser,
    currentRole,
    language,
    t,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterScheme,
    setFilterScheme
  } = useMahaSetu();

  const isCitizen = currentRole === 'CITIZEN_OPERATOR';

  // Strict data isolation: when citizen adds himself he sees ONLY his data!
  const baseApps = isCitizen
    ? applications.filter(app => {
        if (currentUser?.phone && app.applicantPhone === currentUser.phone) return true;
        if (currentUser?.name && app.applicantName.toLowerCase() === currentUser.name.toLowerCase()) return true;
        if (currentUser?.id && ((app as any).userId === currentUser.id || (app as any).createdById === currentUser.id)) return true;
        return false;
      })
    : applications;

  // Filter applications
  const filteredApps = baseApps.filter(app => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      app.id.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      (app.applicantNameMr && app.applicantNameMr.toLowerCase().includes(q)) ||
      app.taluka.toLowerCase().includes(q) ||
      app.district.toLowerCase().includes(q);

    const matchesStatus =
      filterStatus === 'ALL' ||
      (filterStatus === 'APPROVED' && app.status === 'OFFICER_APPROVED') ||
      (filterStatus === 'REVIEW' && app.status === 'FLAGGED_FOR_HUMAN_REVIEW');

    const matchesScheme =
      filterScheme === 'ALL' || app.schemeId === filterScheme;

    return matchesSearch && matchesStatus && matchesScheme;
  });

  const totalApps = baseApps.length;
  const approvedCount = baseApps.filter(a => a.status === 'OFFICER_APPROVED').length;
  const flaggedCount = baseApps.filter(a => a.status === 'FLAGGED_FOR_HUMAN_REVIEW').length;

  return (
    <div className="space-y-5">
      {/* 1. Operational Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">
            {isCitizen ? (language === 'mr' ? 'माझे एकूण अर्ज' : 'My Applications') : t.metricTotalApps}
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{totalApps}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {isCitizen ? (language === 'mr' ? 'आपल्या खात्यावर नोंदवलेले' : 'Registered on your account') : t.metricTotalAppsSub}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">
            {isCitizen ? (language === 'mr' ? 'मंजूर लाभ' : 'Approved') : t.metricApproved}
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{approvedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {isCitizen ? (language === 'mr' ? 'डिजिटल प्रमाणपत्र तयार' : 'Certificate Ready') : t.metricApprovedSub}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">
            {isCitizen ? (language === 'mr' ? 'पडताळणी सुरू' : 'In Verification') : t.metricUnderReview}
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{flaggedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {isCitizen ? (language === 'mr' ? 'विभागीय छाननी प्रगतीत' : 'Under Officer Scrutiny') : t.metricUnderReviewSub}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500 font-medium">{t.metricConnectedDepts}</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">3 <span className="text-xs font-normal text-slate-500">{language === 'mr' ? 'विभाग' : 'Depts'}</span></div>
          <div className="text-[11px] text-slate-400 mt-0.5">{t.metricConnectedDeptsSub}</div>
        </div>
      </div>

      {/* Citizen Empty State: When a citizen has not added an application yet */}
      {isCitizen && baseApps.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-300 p-8 text-center space-y-4 shadow-2xs my-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7 text-slate-700" />
          </div>

          <div className="space-y-1.5 max-w-lg mx-auto">
            <h3 className="text-base font-bold text-slate-900">
              {language === 'mr' ? 'आपल्या खात्यावर सध्या कोणताही अर्ज उपलब्ध नाही' : 'No Applications Submitted Yet'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'mr'
                ? 'महाराष्ट्र शासनाच्या कल्याणकारी योजनांचा थेट लाभ मिळवण्यासाठी आणि महसूल, जात व जमीन अभिलेखांची त्वरित एकात्मिक पडताळणी करण्यासाठी नवीन अर्ज दाखल करा.'
                : 'Apply for welfare schemes to get verified directly against Revenue, Social Welfare, and Land registries without manual paperwork.'}
            </p>
          </div>

          <div className="pt-2">
            {onOpenNewAppModal && (
              <button
                onClick={onOpenNewAppModal}
                className="inline-flex items-center gap-2 bg-[#101b3b] hover:bg-[#1a2d61] text-white px-5 py-2.5 rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>{language === 'mr' ? '+ नवीन अर्ज दाखल करा' : '+ Submit New Application'}</span>
              </button>
            )}
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 max-w-md mx-auto text-[11px] text-slate-500 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              {language === 'mr'
                ? 'DPDP कायदा २०२३: अर्ज दाखल केल्यावर केवळ आपलाच अर्ज व प्रमाणित दस्तऐवज येथे सुरक्षितपणे दिसतील.'
                : 'DPDP Act 2023: Upon filing, only your authorized application will be accessible in your account.'}
            </span>
          </div>
        </div>
      ) : (
        <>
          {/* 2. Search & Filter Bar */}
          <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-2xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:outline-none focus:border-slate-400 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-slate-700 focus:outline-none focus:border-slate-400"
              >
                <option value="ALL">{t.allStatuses}</option>
                <option value="APPROVED">{t.approvedOnly} ({approvedCount})</option>
                <option value="REVIEW">{t.reviewOnly} ({flaggedCount})</option>
              </select>

              <select
                value={filterScheme}
                onChange={e => setFilterScheme(e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-2 text-slate-700 focus:outline-none focus:border-slate-400 max-w-[220px] truncate"
              >
                <option value="ALL">{t.allSchemes}</option>
                <option value="SCHEME_SANJAY_GANDHI">{t.schemeSanjayGandhi}</option>
                <option value="SCHEME_SWADHAR_HOSTEL">{t.schemeAmbedkarSwadhar}</option>
                <option value="SCHEME_KRUSHI_SANMAN">{t.schemeKrushiSanman}</option>
              </select>
            </div>
          </div>

          {/* 3. Applications Table / List */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs divide-y divide-slate-200 overflow-hidden">
            {filteredApps.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-xs">
                {t.noApplicationsFound}
              </div>
            ) : (
              filteredApps.map(app => {
                const isApproved = app.status === 'OFFICER_APPROVED';
                const isFlagged = app.status === 'FLAGGED_FOR_HUMAN_REVIEW';
                const confidence = app.aiHarmonization.confidenceScore;

                return (
                  <div
                    key={app.id}
                    onClick={() => onOpenDossier(app.id)}
                    className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                      {/* Left Column: Core Identity */}
                      <div className="space-y-1 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                            {app.id}
                          </span>

                          {isApproved && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {t.statusApproved}
                            </span>
                          )}

                          {isFlagged && (
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              {t.statusUnderReview}
                            </span>
                          )}

                          <span className="text-[11px] text-slate-400">
                            {new Date(app.submissionDate).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN')}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-2 pt-0.5">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {language === 'mr' && app.applicantNameMr ? app.applicantNameMr : app.applicantName}
                          </h3>
                          {language !== 'mr' && app.applicantNameMr && (
                            <span className="text-xs text-slate-500">
                              ({app.applicantNameMr})
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-mono">
                            • {language === 'mr' ? 'आधार' : 'UID'}: {app.aadhaarMasked}
                          </span>
                          <span className="text-xs text-slate-500">
                            • {app.taluka}, {app.district}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 font-medium">
                          {language === 'mr' ? app.schemeNameMr : app.schemeNameEn}
                        </p>
                      </div>

                      {/* Middle Column: Eligibility & Department Match */}
                      <div className="flex items-center gap-4 bg-slate-50 px-3.5 py-2 rounded border border-slate-200">
                        <div>
                          <div className="text-[10px] uppercase font-medium text-slate-400">
                            {t.verificationRating}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span
                              className={`text-sm font-bold ${
                                confidence >= 90
                                  ? 'text-emerald-700'
                                  : confidence >= 70
                                  ? 'text-amber-700'
                                  : 'text-red-700'
                              }`}
                            >
                              {confidence}%
                            </span>
                            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  confidence >= 90
                                    ? 'bg-emerald-600'
                                    : confidence >= 70
                                    ? 'bg-amber-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="border-l border-slate-200 pl-3">
                          <div className="text-[10px] uppercase font-medium text-slate-400">
                            {t.registryMatch}
                          </div>
                          <div className="text-xs font-medium text-slate-700 mt-0.5">
                            {app.aiHarmonization.anomalies.length === 0 ? (
                              <span className="text-emerald-700">{t.consistent}</span>
                            ) : (
                              <span className="text-amber-700">{app.aiHarmonization.anomalies.length} {t.flaggedCount}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Action */}
                      <div className="flex items-center justify-end w-full lg:w-auto">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            onOpenDossier(app.id);
                          }}
                          className="text-xs font-semibold text-slate-800 hover:text-slate-900 bg-white hover:bg-slate-100 px-3.5 py-2 rounded border border-slate-300 transition-colors"
                        >
                          {t.viewDetails}
                        </button>
                      </div>
                    </div>

                    {/* Brief Administrative Summary */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-start gap-1.5">
                      <span className="font-medium text-slate-700">{t.statusNote}</span>
                      <span>
                        {language === 'mr'
                          ? app.aiHarmonization.reasoningSummaryMr
                          : app.aiHarmonization.reasoningSummaryEn}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};
