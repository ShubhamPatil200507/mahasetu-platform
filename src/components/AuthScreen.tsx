import React, { useState } from 'react';
import { useMahaSetu } from '../context/MahaSetuContext';
import { DEMO_PERSONAS, DEMO_PROFILES } from '../services/authService';
import type { UserRole } from '../types';
import { Globe, Shield, CheckCircle2, UserCheck, Key, Lock, Phone, User, Sparkles, ArrowRight } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const { login, loginAsCitizen, loginAsDemoPersona, language, setLanguage, t } = useMahaSetu();

  // Mode: 'CITIZEN' | 'OFFICIAL'
  const [authMode, setAuthMode] = useState<'CITIZEN' | 'OFFICIAL'>('CITIZEN');

  // Citizen Form State
  const [citizenName, setCitizenName] = useState(language === 'mr' ? 'सुरेश म. चव्हाण' : 'Suresh M. Chavan');
  const [citizenPhone, setCitizenPhone] = useState('9822941029');
  const [citizenOtp, setCitizenOtp] = useState('782910');
  const [otpSent, setOtpSent] = useState(false);

  // Officer Form State
  const [officerEmail, setOfficerEmail] = useState('sk.kulkarni@mahadit.gov.in');
  const [officerPasscode, setOfficerPasscode] = useState('Tahsildar@2026');

  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // 1-click Demo Persona login
  const handleDemoPersonaLogin = async (personaId: string) => {
    setIsAuthenticating(true);
    setAuthError(null);
    await new Promise(r => setTimeout(r, 300));
    const success = await loginAsDemoPersona(personaId);
    setIsAuthenticating(false);
    if (success && onLoginSuccess) {
      onLoginSuccess();
    }
  };

  // Citizen Login Form
  const handleCitizenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenPhone || citizenPhone.length < 10) {
      setAuthError(language === 'mr' ? 'कृपया वैध १०-अंकी मोबाईल क्रमांक टाका.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!citizenName.trim()) {
      setAuthError(language === 'mr' ? 'कृपया आपले नाव टाका.' : 'Please enter your name.');
      return;
    }

    setIsAuthenticating(true);
    setAuthError(null);
    await new Promise(r => setTimeout(r, 400));

    const success = await loginAsCitizen(citizenName.trim(), citizenPhone.trim());
    setIsAuthenticating(false);

    if (success && onLoginSuccess) {
      onLoginSuccess();
    }
  };

  // Officer Login Form
  const handleOfficerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError(null);
    await new Promise(r => setTimeout(r, 400));

    // Determine officer role from email/credentials
    let role: UserRole = 'TALUKA_OFFICER';
    if (officerEmail.includes('cag')) {
      role = 'AUDITOR_SECURITY';
    } else if (officerEmail.includes('dit') || officerEmail.includes('patil')) {
      role = 'SILO_ARCHITECT';
    }

    const success = await login(role, officerPasscode);
    setIsAuthenticating(false);

    if (success && onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans text-slate-900">
      {/* 1. Official Header Topline */}
      <header className="bg-[#101b3b] text-slate-300 border-b border-slate-800">
        <div className="h-1 w-full flex">
          <div className="h-full w-1/3 bg-[#FF9933]"></div>
          <div className="h-full w-1/3 bg-white"></div>
          <div className="h-full w-1/3 bg-[#138808]"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">
              {t.govtOfMaharashtra}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400 hidden sm:inline">
              {t.deptOfIT}
            </span>
          </div>

          <button
            onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
            className="flex items-center gap-1.5 text-xs text-slate-200 hover:text-white bg-slate-800/80 px-2.5 py-1 rounded transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-300" />
            <span className="font-medium">{language === 'en' ? 'मराठी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* 2. Main Login Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col justify-center space-y-6">
        {/* Branding & Portal Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded bg-[#101b3b] text-amber-400 flex flex-col items-center justify-center p-1 border border-slate-300 shadow-xs">
            <span className="text-[9px] font-bold text-white leading-none">महाराष्ट्र</span>
            <div className="w-4 h-4 my-0.5 border border-amber-400 rounded-full flex items-center justify-center text-[8px] font-black">
              म
            </div>
            <span className="text-[7px] uppercase tracking-tighter text-amber-300">शासन</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {t.portalName}
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-xl mx-auto">
              {language === 'mr'
                ? 'महाराष्ट्र शासन • लोकसेवा हक्क वितरण व पडताळणी महामार्ग'
                : 'Government of Maharashtra • Integrated Citizen Service Delivery & Verification Gateway'}
            </p>
          </div>
        </div>

        {/* 3. Primary Official Login Card */}
        <div className="bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden">
          {/* Segmented Auth Mode Switcher */}
          <div className="grid grid-cols-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('CITIZEN');
                setAuthError(null);
              }}
              className={`py-3.5 px-4 text-center transition-colors flex items-center justify-center gap-2 ${
                authMode === 'CITIZEN'
                  ? 'bg-white font-bold text-slate-900 border-b-2 border-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4 text-slate-700" />
              <span>{language === 'mr' ? 'नागरिक / आपले सरकार केंद्र लॉगिन' : 'Citizen / Seva Kendra Login'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('OFFICIAL');
                setAuthError(null);
              }}
              className={`py-3.5 px-4 text-center transition-colors flex items-center justify-center gap-2 ${
                authMode === 'OFFICIAL'
                  ? 'bg-white font-bold text-slate-900 border-b-2 border-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-4 h-4 text-slate-700" />
              <span>{language === 'mr' ? 'शासकीय अधिकारी लॉगिन' : 'Government Official Login'}</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {authError && (
              <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                {authError}
              </div>
            )}

            {authMode === 'CITIZEN' ? (
              /* CITIZEN LOGIN FORM */
              <form onSubmit={handleCitizenSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {language === 'mr' ? 'आपले संपूर्ण नाव' : 'Full Name of Citizen'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={citizenName}
                        onChange={e => setCitizenName(e.target.value)}
                        placeholder={language === 'mr' ? 'उदा. सुरेश म. चव्हाण' : 'e.g. Suresh M. Chavan'}
                        className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:border-slate-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {language === 'mr' ? 'नोंदणीकृत मोबाईल क्रमांक' : 'Registered Mobile Number'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        maxLength={10}
                        value={citizenPhone}
                        onChange={e => setCitizenPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9822941029"
                        className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white focus:outline-none focus:border-slate-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-700">
                      {language === 'mr' ? '६-अंकी ओटीपी (OTP)' : '6-Digit Mobile OTP'}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpSent(true);
                        setCitizenOtp('782910');
                      }}
                      className="text-[11px] text-blue-900 font-semibold hover:underline"
                    >
                      {otpSent
                        ? (language === 'mr' ? 'पुन्हा ओटीपी पाठवला (782910)' : 'OTP Resent (782910)')
                        : (language === 'mr' ? 'ओटीपी मिळवा' : 'Get OTP')}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      value={citizenOtp}
                      onChange={e => setCitizenOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="782910"
                      className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono tracking-widest focus:bg-white focus:outline-none focus:border-slate-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full bg-[#101b3b] hover:bg-[#1a2d61] text-white py-2.5 px-4 rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{isAuthenticating ? (language === 'mr' ? 'पडताळत आहे...' : 'Verifying...') : (language === 'mr' ? 'नागरिक म्हणून प्रवेश करा' : 'Sign In to Citizen Account')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              /* OFFICER LOGIN FORM */
              <form onSubmit={handleOfficerSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {language === 'mr' ? 'शासकीय ईमेल / अधिकारी ओळख' : 'Official Email / Officer ID'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={officerEmail}
                        onChange={e => setOfficerEmail(e.target.value)}
                        placeholder="sk.kulkarni@mahadit.gov.in"
                        className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:bg-white focus:outline-none focus:border-slate-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      {language === 'mr' ? 'डिजिटल टोकन / सुरक्षा पासकोड' : 'DSC Token / Passcode'}
                    </label>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        value={officerPasscode}
                        onChange={e => setOfficerPasscode(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded font-mono focus:bg-white focus:outline-none focus:border-slate-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800">{language === 'mr' ? 'अधिकृत सूचना: ' : 'Administrative Note: '}</span>
                  <span>
                    {language === 'mr'
                      ? 'तहसीलदार कार्यालयातील वर्ग-३ डिजिटल स्वाक्षरी टोकन अथवा अधिकृत सुरक्षा ओळखपत्र आवश्यक आहे.'
                      : 'Class-3 Digital Signature Certificate (DSC) Token or State Gateway credentials required.'}
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isAuthenticating}
                    className="w-full bg-[#101b3b] hover:bg-[#1a2d61] text-white py-2.5 px-4 rounded-lg font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <span>{isAuthenticating ? (language === 'mr' ? 'पडताळत आहे...' : 'Verifying...') : (language === 'mr' ? 'अधिकारी कक्षात प्रवेश करा' : 'Sign In to Official Desk')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* 4. CLEARLY DISTINCT DEMONSTRATION SECTION */}
        <div className="bg-white rounded-xl border border-amber-300/80 shadow-xs overflow-hidden">
          <div className="bg-amber-50/70 border-b border-amber-200 px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                {language === 'mr' ? 'प्रशासकीय चाचणी व प्रात्यक्षिक खाती (Demo Showcase)' : 'Demonstration Personas (1-Click Evaluation Access)'}
              </h2>
            </div>
            <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded">
              {language === 'mr' ? 'मूल्यांकनासाठी' : 'Evaluation Mode'}
            </span>
          </div>

          <div className="p-4 bg-amber-50/30">
            <p className="text-xs text-slate-600 mb-3">
              {language === 'mr'
                ? 'प्रणालीतील विविध प्रशासकीय प्रक्रिया तपासण्यासाठी खालीलपैकी कोणत्याही खात्यावर क्लिक करा:'
                : 'Select an official persona below for instant 1-click evaluation of end-to-end workflows:'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DEMO_PERSONAS.map(persona => (
                <button
                  key={persona.id}
                  type="button"
                  onClick={() => handleDemoPersonaLogin(persona.id)}
                  disabled={isAuthenticating}
                  className="p-3 bg-white hover:bg-amber-50/60 rounded-lg border border-slate-200 hover:border-amber-400 text-left transition-all shadow-2xs group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold text-xs text-slate-900 group-hover:text-amber-900 transition-colors">
                        {language === 'mr' ? persona.titleMr : persona.titleEn}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 flex-shrink-0">
                        {language === 'mr' ? persona.roleBadgeMr : persona.roleBadgeEn}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-tight">
                      {language === 'mr' ? persona.descMr : persona.descEn}
                    </p>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-amber-800 font-bold group-hover:underline">
                    <span>{language === 'mr' ? 'थेट प्रवेश करा' : 'Sign in directly'}</span>
                    <ArrowRight className="w-3 h-3 text-amber-700" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* 5. Official Footer */}
      <footer className="bg-[#101b3b] text-slate-400 py-4 text-xs border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-1">
          <div>{t.footerCopyright}</div>
          <div className="text-[11px] text-slate-500">{t.footerTagline}</div>
        </div>
      </footer>
    </div>
  );
};
