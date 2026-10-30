import React, { useState } from 'react';
import { useMahaSetu } from '../context/MahaSetuContext';
import {
  DEPARTMENT_API_REGISTRY,
  MOCK_REVENUE_DB,
  MOCK_SOCIAL_WELFARE_DB,
  MOCK_LAND_RECORDS_DB
} from '../services/mockDepartmentDatabases';
import { CheckCircle, Building2, Search } from 'lucide-react';

export const DepartmentSilosView: React.FC = () => {
  const { language, t } = useMahaSetu();
  const [activeDeptTab, setActiveDeptTab] = useState<'REVENUE' | 'SOCIAL_WELFARE' | 'LAND_RECORDS'>('REVENUE');
  const [testAadhaarHash, setTestAadhaarHash] = useState('a3f81e9d01b4c93817a5e98214fbc910');
  const [isQuerying, setIsQuerying] = useState(false);
  const [inquiryCompleted, setInquiryCompleted] = useState(false);

  const activeStatus = DEPARTMENT_API_REGISTRY.find(d => d.department === activeDeptTab)!;

  const handleRunConnectorQuery = () => {
    setIsQuerying(true);
    setTimeout(() => {
      setIsQuerying(false);
      setInquiryCompleted(true);
      setTimeout(() => setInquiryCompleted(false), 3000);
    }, 400);
  };

  const getDeptDesc = (dept: string) => {
    if (dept === 'REVENUE') return t.deptRevenueDesc;
    if (dept === 'SOCIAL_WELFARE') return t.deptSocialDesc;
    return t.deptLandDesc;
  };

  const activeRecordRevenue = MOCK_REVENUE_DB[testAadhaarHash];
  const activeRecordSocial = MOCK_SOCIAL_WELFARE_DB[testAadhaarHash];
  const activeRecordLand = MOCK_LAND_RECORDS_DB[testAadhaarHash];

  return (
    <div className="space-y-5">
      {/* 1. Header Overview */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-slate-900">
              {t.silosTitle}
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            {t.onlineBadge}
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          {t.silosSub}
        </p>
      </div>

      {/* 2. Department Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {DEPARTMENT_API_REGISTRY.map(dept => {
          const isActive = activeDeptTab === dept.department;
          return (
            <div
              key={dept.department}
              onClick={() => setActiveDeptTab(dept.department)}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                isActive
                  ? 'border-slate-800 bg-slate-50 shadow-2xs'
                  : 'border-slate-200 bg-white hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                <span className="font-bold text-slate-900">
                  {dept.department === 'REVENUE' ? t.deptRevenue : dept.department === 'SOCIAL_WELFARE' ? t.deptSocial : t.deptLand}
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {language === 'mr' ? 'सक्रिय' : 'Active'}
                </span>
              </div>

              <div className="mt-2.5 space-y-1 text-xs">
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {getDeptDesc(dept.department)}
                </p>
                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
                  <span>{language === 'mr' ? 'एकूण नोंदी:' : 'Total Records:'}</span>
                  <strong className="text-slate-800">{dept.totalRecordsInLocalSilo.toLocaleString(language === 'mr' ? 'mr-IN' : 'en-IN')}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Selected Department Registry Deep Dive (Process & Result View) */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'mr' ? activeStatus.nameMr : activeStatus.nameEn}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {getDeptDesc(activeDeptTab)}
            </p>
          </div>

          <button
            onClick={handleRunConnectorQuery}
            disabled={isQuerying}
            className="text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded transition-colors flex items-center gap-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{isQuerying ? (language === 'mr' ? 'पडताळणी सुरू...' : 'Retrieving...') : t.runInquiry}</span>
          </button>
        </div>

        {/* Live Citizen Inquiry Selector */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">{t.selectApplicantForInquiry}</span>
            <select
              value={testAadhaarHash}
              onChange={e => setTestAadhaarHash(e.target.value)}
              className="text-xs bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-medium"
            >
              <option value="a3f81e9d01b4c93817a5e98214fbc910">{language === 'mr' ? 'गणेश शिंदे (दौंड, पुणे)' : 'Ganesh Shinde (Daund, Pune)'}</option>
              <option value="b7e21a8c90f3d45291e0a81726fca819">{language === 'mr' ? 'सुनिता पाटील (कर्जत, अहमदनगर)' : 'Sunita Patil (Karjat, Ahmednagar)'}</option>
              <option value="c1d49e8a72b0f19384e9102837fba921">{language === 'mr' ? 'रमेश जाधव (बार्शी, सोलापूर)' : 'Ramesh Jadhav (Barshi, Solapur)'}</option>
              <option value="d9c81b2a30e4f59182a7b81920fcb128">{language === 'mr' ? 'अनिकेत चव्हाण (हवेली, पुणे)' : 'Aniket Chavan (Haveli, Pune)'}</option>
            </select>
          </div>

          {inquiryCompleted && (
            <div className="text-emerald-700 font-semibold text-xs flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{t.inquiryComplete}</span>
            </div>
          )}
        </div>

        {/* Retrieved Official Record Card (Result) */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
            <span className="font-bold text-slate-900 uppercase">
              {language === 'mr' ? 'प्राप्त अधिकृत शासकीय नोंद' : 'Retrieved Official Government Record'}
            </span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              {t.statusVerified}
            </span>
          </div>

          {activeDeptTab === 'REVENUE' && activeRecordRevenue && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.certRef}</span>
                <span className="font-mono text-slate-900 font-medium">{activeRecordRevenue.incomeCertId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.colName}</span>
                <span className="font-semibold text-slate-900">{activeRecordRevenue.applicantName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.officialIncome}</span>
                <span className="font-bold text-emerald-800 text-sm">₹{activeRecordRevenue.annualIncome.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.issuingOffice}</span>
                <span className="text-slate-800">{activeRecordRevenue.tahsildarOffice}</span>
              </div>
            </div>
          )}

          {activeDeptTab === 'SOCIAL_WELFARE' && activeRecordSocial && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.bartiRef}</span>
                <span className="font-mono text-slate-900 font-medium">{activeRecordSocial.casteCertId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.colName}</span>
                <span className="font-semibold text-slate-900">{activeRecordSocial.applicantName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.casteCategory}</span>
                <span className="font-bold text-slate-900">{activeRecordSocial.casteCategory} ({activeRecordSocial.subCaste})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.colStatus}</span>
                <span className="text-emerald-700 font-semibold">{activeRecordSocial.bartiStatus}</span>
              </div>
            </div>
          )}

          {activeDeptTab === 'LAND_RECORDS' && activeRecordLand && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.surveyGatNumber}</span>
                <span className="font-mono text-slate-900 font-medium">{activeRecordLand.surveyGatNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.colName}</span>
                <span className="font-semibold text-slate-900">{activeRecordLand.applicantName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.landArea}</span>
                <span className="font-bold text-slate-900">{activeRecordLand.landAreaHectares} {language === 'mr' ? 'हेक्टर' : 'Ha'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-medium block">{t.encumbrance}</span>
                <span className="text-emerald-700 font-semibold">{activeRecordLand.encumbranceStatus === 'NIL' ? t.nilEncumbrance : activeRecordLand.encumbranceStatus}</span>
              </div>
            </div>
          )}
        </div>

        {/* Registry Snapshot Table */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {t.recordsTableTitle}
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                {activeDeptTab === 'REVENUE' && (
                  <tr>
                    <th className="p-2.5">{t.colCertNo}</th>
                    <th className="p-2.5">{t.colName}</th>
                    <th className="p-2.5">{t.officialIncome}</th>
                    <th className="p-2.5">{t.colOffice}</th>
                    <th className="p-2.5">{t.colStatus}</th>
                  </tr>
                )}
                {activeDeptTab === 'SOCIAL_WELFARE' && (
                  <tr>
                    <th className="p-2.5">{t.colCertNo}</th>
                    <th className="p-2.5">{t.colName}</th>
                    <th className="p-2.5">{t.casteCategory}</th>
                    <th className="p-2.5">{t.subCaste}</th>
                    <th className="p-2.5">{t.colStatus}</th>
                  </tr>
                )}
                {activeDeptTab === 'LAND_RECORDS' && (
                  <tr>
                    <th className="p-2.5">{t.colCertNo}</th>
                    <th className="p-2.5">{t.colName}</th>
                    <th className="p-2.5">{t.landArea}</th>
                    <th className="p-2.5">{t.villageKhata}</th>
                    <th className="p-2.5">{t.encumbrance}</th>
                  </tr>
                )}
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {activeDeptTab === 'REVENUE' &&
                  Object.entries(MOCK_REVENUE_DB).map(([hash, rec]) => (
                    <tr
                      key={hash}
                      className={testAadhaarHash === hash ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50'}
                    >
                      <td className="p-2.5 font-mono text-slate-800">{rec.incomeCertId}</td>
                      <td className="p-2.5 font-medium text-slate-900">{rec.applicantName}</td>
                      <td className="p-2.5 font-semibold text-slate-900">₹{rec.annualIncome.toLocaleString('en-IN')}</td>
                      <td className="p-2.5 text-slate-600">{rec.tahsildarOffice}</td>
                      <td className="p-2.5 text-emerald-700 font-medium">{t.statusVerified}</td>
                    </tr>
                  ))}

                {activeDeptTab === 'SOCIAL_WELFARE' &&
                  Object.entries(MOCK_SOCIAL_WELFARE_DB).map(([hash, rec]) => (
                    <tr
                      key={hash}
                      className={testAadhaarHash === hash ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50'}
                    >
                      <td className="p-2.5 font-mono text-slate-800">{rec.casteCertId}</td>
                      <td className="p-2.5 font-medium text-slate-900">{rec.applicantName}</td>
                      <td className="p-2.5 font-semibold text-slate-900">{rec.casteCategory}</td>
                      <td className="p-2.5 text-slate-600">{rec.subCaste}</td>
                      <td className="p-2.5 text-emerald-700 font-medium">{rec.bartiStatus}</td>
                    </tr>
                  ))}

                {activeDeptTab === 'LAND_RECORDS' &&
                  Object.entries(MOCK_LAND_RECORDS_DB).map(([hash, rec]) => (
                    <tr
                      key={hash}
                      className={testAadhaarHash === hash ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50'}
                    >
                      <td className="p-2.5 font-mono text-slate-800">{rec.surveyGatNumber}</td>
                      <td className="p-2.5 font-medium text-slate-900">{rec.applicantName}</td>
                      <td className="p-2.5 font-semibold text-slate-900">{rec.landAreaHectares} {language === 'mr' ? 'हेक्टर' : 'Ha'}</td>
                      <td className="p-2.5 text-slate-600">{rec.khataNumber}</td>
                      <td className="p-2.5 text-slate-700">{rec.encumbranceStatus === 'NIL' ? t.nilEncumbrance : rec.encumbranceStatus}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
