import React, { createContext, useContext, useState } from 'react';
import type {
  CitizenApplication,
  UserRole,
  Language,
  LedgerBlock,
  SecurityAuditLog,
  ConsentToken,
  RevenueRecord,
  SocialWelfareRecord,
  LandRecord
} from '../types';
import { DEMO_PROFILES, DEMO_PERSONAS, createCitizenProfile, authenticateUser, type UserProfile, type DemoPersona } from '../services/authService';
import {
  INITIAL_APPLICATIONS,
  INITIAL_LEDGER_BLOCKS,
  INITIAL_SECURITY_LOGS,
  MOCK_REVENUE_DB,
  MOCK_SOCIAL_WELFARE_DB,
  MOCK_LAND_RECORDS_DB
} from '../services/mockDepartmentDatabases';
import {
  sha256,
  calculateBlockHash,
  verifyLedgerChainIntegrity,
  maskAadhaar,
  generateConsentSignature,
  generateOfficerDscStamp
} from '../services/cryptoEngine';
import { harmonizeAndValidateApplication } from '../services/aiHarmonizer';
import { TRANSLATIONS } from '../locales/translations';

interface MahaSetuContextType {
  applications: CitizenApplication[];
  selectedApp: CitizenApplication | null;
  selectedAppId: string | null;
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  currentRole: UserRole;
  language: Language;
  t: typeof TRANSLATIONS.en;
  ledgerBlocks: LedgerBlock[];
  securityLogs: SecurityAuditLog[];
  activeTab: string;
  isVerifyingLedger: boolean;
  ledgerVerificationResult: {
    checked: boolean;
    isValid: boolean;
    messageEn: string;
    messageMr: string;
    blockIndex?: number;
    expectedHash?: string;
    actualHash?: string;
  } | null;
  searchQuery: string;
  filterStatus: string;
  filterScheme: string;
  isDemoMode: boolean;
  demoPersonas: DemoPersona[];

  // Actions
  login: (role: UserRole, credentialInput?: string) => Promise<boolean>;
  loginAsCitizen: (name: string, phone: string, nameMr?: string) => Promise<boolean>;
  loginAsDemoPersona: (personaId: string) => Promise<boolean>;
  logout: () => void;
  switchDemoUser: (role: UserRole | string) => void;
  setIsDemoMode: (val: boolean) => void;
  setRole: (role: UserRole) => void;
  setLanguage: (lang: Language) => void;
  setActiveTab: (tab: string) => void;
  selectApplication: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterScheme: (scheme: string) => void;

  submitNewApplication: (formData: {
    applicantName: string;
    applicantPhone: string;
    aadhaarNumber: string;
    schemeId: string;
    district: string;
    taluka: string;
    village: string;
    selfDeclaredIncome: number;
    selfDeclaredLandHectares: number;
    selfDeclaredCaste: string;
  }) => Promise<CitizenApplication>;

  approveApplication: (id: string, officerName: string, remarks: string) => Promise<void>;
  rejectApplication: (id: string, officerName: string, remarks: string) => Promise<void>;
  requestClarification: (id: string, officerName: string, remarks: string) => Promise<void>;
  revokeConsent: (id: string) => Promise<void>;
  verifyLedger: () => Promise<void>;
}

const MahaSetuContext = createContext<MahaSetuContextType | undefined>(undefined);

export const MahaSetuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<CitizenApplication[]>(INITIAL_APPLICATIONS);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('CITIZEN_OPERATOR');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_PROFILES.CITIZEN_OPERATOR);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [language, setLanguage] = useState<Language>('en');
  const [ledgerBlocks, setLedgerBlocks] = useState<LedgerBlock[]>(INITIAL_LEDGER_BLOCKS);
  const [securityLogs, setSecurityLogs] = useState<SecurityAuditLog[]>(INITIAL_SECURITY_LOGS);
  const [activeTab, setActiveTab] = useState<string>('tracking');
  const [isVerifyingLedger, setIsVerifyingLedger] = useState<boolean>(false);
  const [ledgerVerificationResult, setLedgerVerificationResult] = useState<{
    checked: boolean;
    isValid: boolean;
    messageEn: string;
    messageMr: string;
    blockIndex?: number;
    expectedHash?: string;
    actualHash?: string;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterScheme, setFilterScheme] = useState<string>('ALL');

  const t = TRANSLATIONS[language];
  const selectedApp = applications.find(a => a.id === selectedAppId) || null;

  // Submit a new application end-to-end
  const submitNewApplication = async (formData: {
    applicantName: string;
    applicantPhone: string;
    aadhaarNumber: string;
    schemeId: string;
    district: string;
    taluka: string;
    village: string;
    selfDeclaredIncome: number;
    selfDeclaredLandHectares: number;
    selfDeclaredCaste: string;
  }): Promise<CitizenApplication> => {
    const rawAadhaar = formData.aadhaarNumber.replace(/\D/g, '');
    const aadhaarHash = await sha256(`MH-UID-${rawAadhaar}`);
    const maskedAadhaar = maskAadhaar(rawAadhaar);
    const appId = `MH-2026-SEVA-${Math.floor(10000 + Math.random() * 90000)}`;
    const timestamp = new Date().toISOString();

    let schemeNameEn = 'Sanjay Gandhi Niradhar Anudan Yojana';
    let schemeNameMr = 'संजय गांधी निराधार अनुदान योजना';
    let maxIncomeCeiling = 68000;
    let maxLandCeilingHectares = 2.0;
    let requiredCasteCategory = 'ANY';

    if (formData.schemeId === 'SCHEME_SWADHAR_HOSTEL') {
      schemeNameEn = 'Dr. Babasaheb Ambedkar Swadhar Yojana (Hostel & Education)';
      schemeNameMr = 'डॉ. बाबासाहेब आंबेडकर स्वाधार योजना (वसतीगृह व शिक्षण)';
      maxIncomeCeiling = 68000;
      requiredCasteCategory = 'OBC';
    } else if (formData.schemeId === 'SCHEME_KRUSHI_SANMAN') {
      schemeNameEn = 'Krushi Sanman & Small Marginal Farmer Subsidy';
      schemeNameMr = 'कृषी सन्मान व अल्प-अल्पभूधारक शेतकरी सहाय्य';
      maxIncomeCeiling = 120000;
      maxLandCeilingHectares = 2.0;
    } else if (formData.schemeId === 'SCHEME_EWS_EDUCATION') {
      schemeNameEn = 'Economically Weaker Section (EWS) Higher Education Subsidy';
      schemeNameMr = 'आर्थिक दुर्बल घटक (EWS) उच्च शिक्षण सहाय्य';
      maxIncomeCeiling = 800000;
      requiredCasteCategory = 'EWS';
    }

    const digitalSig = await generateConsentSignature(
      aadhaarHash,
      `Verification for ${schemeNameEn}`,
      timestamp
    );

    const consent: ConsentToken = {
      consentId: `CONSENT-MH-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      applicantAadhaarHash: aadhaarHash,
      purpose: `Verification for ${schemeNameEn} per DPDP Act 2023`,
      scope: { revenueIncome: true, socialCaste: true, landHolding: true },
      grantedAt: timestamp,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      signatureAlgorithm: 'MS-ECDSA-P256',
      digitalSignature: digitalSig,
      ipAddress: '103.21.144.18 (Aaple Sarkar Seva Kendra)'
    };

    const existingRevenue = MOCK_REVENUE_DB[aadhaarHash];
    const existingSocial = MOCK_SOCIAL_WELFARE_DB[aadhaarHash];
    const existingLand = MOCK_LAND_RECORDS_DB[aadhaarHash];

    const revenueData: RevenueRecord = existingRevenue || {
      incomeCertId: `REV/MH/${formData.district.slice(0, 3).toUpperCase()}/2026/${Math.floor(100000 + Math.random() * 900000)}`,
      applicantName: formData.applicantName,
      annualIncome: formData.selfDeclaredIncome,
      tahsildarOffice: `Tahsildar Office, ${formData.taluka}`,
      taluka: formData.taluka,
      district: formData.district,
      issuedDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      validityStatus: 'VALID',
      domicileNumber: `DOM/${formData.district.slice(0, 3).toUpperCase()}/2025/${Math.floor(10000 + Math.random() * 90000)}`,
      rationCardNumber: `APL-MH-27-${Math.floor(100000 + Math.random() * 900000)}`
    };

    const socialWelfareData: SocialWelfareRecord = existingSocial || {
      casteCertId: `BARTI/${formData.district.slice(0, 3).toUpperCase()}/${formData.selfDeclaredCaste.slice(0, 3).toUpperCase()}/2024/${Math.floor(10000 + Math.random() * 90000)}`,
      applicantName: formData.applicantName,
      casteCategory: (formData.selfDeclaredCaste.toUpperCase().includes('SC') ? 'SC' : formData.selfDeclaredCaste.toUpperCase().includes('ST') ? 'ST' : formData.selfDeclaredCaste.toUpperCase().includes('OBC') ? 'OBC' : 'OPEN') as any,
      subCaste: formData.selfDeclaredCaste,
      bartiVerificationNumber: `VER-BARTI-MH-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      bartiStatus: 'VERIFIED',
      schemeEntitlement: schemeNameEn
    };

    const landData: LandRecord = existingLand || {
      surveyGatNumber: `Gat No. ${Math.floor(10 + Math.random() * 300)}/${Math.floor(1 + Math.random() * 4)}`,
      applicantName: formData.applicantName,
      landAreaHectares: formData.selfDeclaredLandHectares,
      irrigationType: 'Jirayat (Dry)',
      khataNumber: `KH-${formData.taluka.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      villageName: formData.village,
      taluka: formData.taluka,
      district: formData.district,
      mutationEntryNumber: `MUT-2025-${Math.floor(100 + Math.random() * 900)}`,
      encumbranceStatus: 'NIL'
    };

    const tempApp: Partial<CitizenApplication> = {
      applicantName: formData.applicantName,
      selfDeclaredIncome: formData.selfDeclaredIncome,
      maxIncomeCeiling,
      selfDeclaredLandHectares: formData.selfDeclaredLandHectares,
      maxLandCeilingHectares,
      taluka: formData.taluka,
      district: formData.district
    };

    const aiHarmonization = harmonizeAndValidateApplication(
      tempApp,
      revenueData,
      socialWelfareData,
      landData
    );

    const status = aiHarmonization.humanReviewRequired
      ? 'FLAGGED_FOR_HUMAN_REVIEW'
      : 'OFFICER_APPROVED';

    const newApp: CitizenApplication = {
      id: appId,
      schemeId: formData.schemeId,
      schemeNameEn,
      schemeNameMr,
      maxIncomeCeiling,
      maxLandCeilingHectares,
      requiredCasteCategory,
      applicantName: formData.applicantName,
      applicantPhone: formData.applicantPhone,
      aadhaarMasked: maskedAadhaar,
      aadhaarHash,
      district: formData.district,
      taluka: formData.taluka,
      village: formData.village,
      selfDeclaredIncome: formData.selfDeclaredIncome,
      selfDeclaredLandHectares: formData.selfDeclaredLandHectares,
      selfDeclaredCaste: formData.selfDeclaredCaste,
      consent,
      revenueData,
      socialWelfareData,
      landData,
      aiHarmonization,
      status,
      submissionDate: timestamp,
      updatedDate: timestamp,
      assignedOfficer: aiHarmonization.humanReviewRequired ? `Verification Desk, Taluka ${formData.taluka}` : 'State Automated Service Gateway',
      officerRemarks: aiHarmonization.humanReviewRequired
        ? 'Referred for Taluka officer review due to cross-registry variance.'
        : 'Automated verification completed with high consistency across registries.',
      digitalSignatureRef: status === 'OFFICER_APPROVED' ? `MH-GOV-DSC-SHA256::${(await sha256(appId)).slice(0, 20).toUpperCase()}` : undefined,
      smsTrackingLogs: [
        {
          timestamp,
          messageEn: `MahaSetu: Application ${appId} registered for ${schemeNameEn}. Consent recorded.`,
          messageMr: `महासेतू: ${schemeNameMr} साठी अर्ज ${appId} नोंदवला गेला. संमती नोंदवली.`,
          status: 'DELIVERED'
        },
        {
          timestamp,
          messageEn: status === 'OFFICER_APPROVED'
            ? `MahaSetu: Registries verified. Application ${appId} approved.`
            : `MahaSetu: Application ${appId} referred to Taluka desk for verification.`,
          messageMr: status === 'OFFICER_APPROVED'
            ? `महासेतू: विभागीय माहिती पडताळली. अर्ज ${appId} मंजूर झाला.`
            : `महासेतू: अर्ज ${appId} तालुका पडताळणी कक्षाकडे पाठवला आहे.`,
          status: 'DELIVERED'
        }
      ]
    };
    (newApp as any).userId = currentUser?.id;
    (newApp as any).createdById = currentUser?.id;

    setApplications(prev => [newApp, ...prev]);
    setSelectedAppId(newApp.id);

    const lastBlock = ledgerBlocks[ledgerBlocks.length - 1];
    const dataHash = await sha256(JSON.stringify({
      id: newApp.id,
      name: newApp.applicantName,
      consentId: consent.consentId,
      confidenceScore: aiHarmonization.confidenceScore,
      status: newApp.status
    }));

    const nextIndex = lastBlock.index + 1;
    const nonce = Math.floor(10000 + Math.random() * 90000);
    const blockHash = await calculateBlockHash(
      nextIndex,
      timestamp,
      lastBlock.hash,
      dataHash,
      formData.applicantName,
      'APPLICATION_REGISTRATION_AND_CONSENT',
      nonce
    );

    const newBlock: LedgerBlock = {
      index: nextIndex,
      timestamp,
      action: 'APPLICATION_REGISTRATION_AND_CONSENT',
      applicationId: newApp.id,
      actor: `${formData.applicantName} (Citizen)`,
      actorRole: 'CITIZEN_OPERATOR',
      dataHash,
      previousHash: lastBlock.hash,
      nonce,
      hash: blockHash
    };

    setLedgerBlocks(prev => [...prev, newBlock]);

    const secLog: SecurityAuditLog = {
      id: `SEC-LOG-${String(securityLogs.length + 1).padStart(3, '0')}`,
      timestamp,
      actor: 'Seva-Kendra-Operator',
      role: 'CITIZEN_OPERATOR',
      action: 'CITIZEN_CONSENT_CAPTURED',
      resourceId: newApp.id,
      ipAddress: '103.21.144.18',
      status: 'SUCCESS',
      details: `Citizen submitted application for ${schemeNameEn}. Verification confidence: ${aiHarmonization.confidenceScore}%.`,
      hash: dataHash.slice(0, 32)
    };
    setSecurityLogs(prev => [secLog, ...prev]);

    return newApp;
  };

  const approveApplication = async (id: string, officerName: string, remarks: string) => {
    const timestamp = new Date().toISOString();
    const dscStamp = await generateOfficerDscStamp(
      officerName,
      'TALUKA_VERIFICATION_OFFICER',
      id,
      'APPROVED',
      timestamp
    );

    setApplications(prev =>
      prev.map(app => {
        if (app.id !== id) return app;
        return {
          ...app,
          status: 'OFFICER_APPROVED',
          assignedOfficer: officerName,
          officerRemarks: remarks || 'Officer verified dossier with physical reconciliation and affixed DSC electronic signature.',
          digitalSignatureRef: dscStamp,
          updatedDate: timestamp,
          smsTrackingLogs: [
            ...app.smsTrackingLogs,
            {
              timestamp,
              messageEn: `MahaSetu: Application ${app.id} approved by Officer ${officerName}. Verified receipt generated.`,
              messageMr: `महासेतू: अर्ज ${app.id} अधिकारी ${officerName} यांच्याकडून मंजूर. पावती उपलब्ध.`,
              status: 'DELIVERED'
            }
          ]
        };
      })
    );

    const lastBlock = ledgerBlocks[ledgerBlocks.length - 1];
    const dataHash = await sha256(`${id}|APPROVED|${officerName}|${dscStamp}`);
    const nextIndex = lastBlock.index + 1;
    const nonce = Math.floor(10000 + Math.random() * 90000);
    const blockHash = await calculateBlockHash(
      nextIndex,
      timestamp,
      lastBlock.hash,
      dataHash,
      officerName,
      'OFFICER_DSC_APPROVAL',
      nonce
    );

    const newBlock: LedgerBlock = {
      index: nextIndex,
      timestamp,
      action: 'OFFICER_DSC_APPROVAL',
      applicationId: id,
      actor: officerName,
      actorRole: 'TALUKA_OFFICER',
      dataHash,
      previousHash: lastBlock.hash,
      nonce,
      hash: blockHash
    };

    setLedgerBlocks(prev => [...prev, newBlock]);

    const secLog: SecurityAuditLog = {
      id: `SEC-LOG-${String(securityLogs.length + 1).padStart(3, '0')}`,
      timestamp,
      actor: officerName,
      role: 'TALUKA_OFFICER',
      action: 'OFFICER_APPROVAL_SIGNED',
      resourceId: id,
      ipAddress: '10.14.8.42 (Taluka Office)',
      status: 'SUCCESS',
      details: `Officer affixed DSC signature: ${dscStamp.slice(0, 25)}...`,
      hash: dataHash.slice(0, 32)
    };
    setSecurityLogs(prev => [secLog, ...prev]);
  };

  const rejectApplication = async (id: string, officerName: string, remarks: string) => {
    const timestamp = new Date().toISOString();

    setApplications(prev =>
      prev.map(app => {
        if (app.id !== id) return app;
        return {
          ...app,
          status: 'OFFICER_REJECTED',
          assignedOfficer: officerName,
          officerRemarks: remarks || 'Rejected due to registry discrepancies or threshold variance.',
          updatedDate: timestamp,
          smsTrackingLogs: [
            ...app.smsTrackingLogs,
            {
              timestamp,
              messageEn: `MahaSetu: Application ${app.id} rejected. Reason: ${remarks.slice(0, 50)}...`,
              messageMr: `महासेतू: अर्ज ${app.id} नाकारण्यात आला. कारण: ${remarks.slice(0, 50)}...`,
              status: 'DELIVERED'
            }
          ]
        };
      })
    );

    const lastBlock = ledgerBlocks[ledgerBlocks.length - 1];
    const dataHash = await sha256(`${id}|REJECTED|${officerName}|${remarks}`);
    const nextIndex = lastBlock.index + 1;
    const nonce = Math.floor(10000 + Math.random() * 90000);
    const blockHash = await calculateBlockHash(
      nextIndex,
      timestamp,
      lastBlock.hash,
      dataHash,
      officerName,
      'APPLICATION_OFFICER_REJECTED',
      nonce
    );

    setLedgerBlocks(prev => [
      ...prev,
      {
        index: nextIndex,
        timestamp,
        action: 'APPLICATION_OFFICER_REJECTED',
        applicationId: id,
        actor: officerName,
        actorRole: 'TALUKA_OFFICER',
        dataHash,
        previousHash: lastBlock.hash,
        nonce,
        hash: blockHash
      }
    ]);
  };

  const requestClarification = async (id: string, officerName: string, remarks: string) => {
    const timestamp = new Date().toISOString();
    setApplications(prev =>
      prev.map(app => {
        if (app.id !== id) return app;
        return {
          ...app,
          assignedOfficer: officerName,
          officerRemarks: `CLARIFICATION REQUESTED: ${remarks}`,
          updatedDate: timestamp,
          smsTrackingLogs: [
            ...app.smsTrackingLogs,
            {
              timestamp,
              messageEn: `MahaSetu Notice: Taluka Officer requests document clarification for ${app.id}: ${remarks}`,
              messageMr: `महासेतू नोटीस: अर्ज ${app.id} साठी तालुका अधिकाऱ्यांनी कागदपत्र खुलासा मागितला आहे: ${remarks}`,
              status: 'DELIVERED'
            }
          ]
        };
      })
    );
  };

  const revokeConsent = async (id: string) => {
    const timestamp = new Date().toISOString();
    setApplications(prev =>
      prev.map(app => {
        if (app.id !== id) return app;
        return {
          ...app,
          consent: {
            ...app.consent,
            status: 'REVOKED'
          },
          updatedDate: timestamp
        };
      })
    );

    const lastBlock = ledgerBlocks[ledgerBlocks.length - 1];
    const dataHash = await sha256(`${id}|CONSENT_REVOKED|${timestamp}`);
    const nextIndex = lastBlock.index + 1;
    const nonce = Math.floor(10000 + Math.random() * 90000);
    const blockHash = await calculateBlockHash(
      nextIndex,
      timestamp,
      lastBlock.hash,
      dataHash,
      'Citizen Requester',
      'CITIZEN_CONSENT_REVOKED',
      nonce
    );

    setLedgerBlocks(prev => [
      ...prev,
      {
        index: nextIndex,
        timestamp,
        action: 'CITIZEN_CONSENT_REVOKED',
        applicationId: id,
        actor: 'Citizen Requester',
        actorRole: 'CITIZEN_OPERATOR',
        dataHash,
        previousHash: lastBlock.hash,
        nonce,
        hash: blockHash
      }
    ]);
  };

  const verifyLedger = async () => {
    setIsVerifyingLedger(true);
    await new Promise(r => setTimeout(r, 450));

    const check = await verifyLedgerChainIntegrity(ledgerBlocks);
    setIsVerifyingLedger(false);

    if (check.isValid) {
      setLedgerVerificationResult({
        checked: true,
        isValid: true,
        messageEn: `Cryptographic audit SUCCESS: All ${ledgerBlocks.length} blocks verified. SHA-256 chain links intact and untampered.`,
        messageMr: `क्रिप्टोग्राफिक लेखापरीक्षण यशस्वी: सर्व ${ledgerBlocks.length} ब्लॉक तपासले. SHA-256 हॅश साखळी अखंड आहे.`
      });
    } else {
      setLedgerVerificationResult({
        checked: true,
        isValid: false,
        messageEn: `Integrity Alert: Verification mismatch at Block #${check.tamperedBlockIndex}.`,
        messageMr: `सुरक्षा इशारा: ब्लॉक #${check.tamperedBlockIndex} येथे विसंगती आढळली.`,
        blockIndex: check.tamperedBlockIndex,
        expectedHash: check.expectedHash,
        actualHash: check.actualHash
      });
    }
  };

  const handleSetRole = (role: UserRole) => {
    setCurrentRole(role);
    const profile = DEMO_PROFILES[role];
    setCurrentUser(profile);
    setActiveTab(profile.defaultTab);
  };

  const login = async (role: UserRole, credentialInput?: string): Promise<boolean> => {
    const auth = authenticateUser(role, credentialInput);
    if (auth.success) {
      setCurrentUser(auth.profile);
      setCurrentRole(role);
      setIsAuthenticated(true);
      setActiveTab(auth.profile.defaultTab);
      // If role is officer or auditor, select first application
      if (role !== 'CITIZEN_OPERATOR' && applications.length > 0) {
        setSelectedAppId(applications[0].id);
      }
      return true;
    }
    return false;
  };

  const loginAsCitizen = async (name: string, phone: string, nameMr?: string): Promise<boolean> => {
    const profile = createCitizenProfile(name, phone, nameMr);
    setCurrentUser(profile);
    setCurrentRole('CITIZEN_OPERATOR');
    setIsAuthenticated(true);
    setIsDemoMode(false);
    setActiveTab('tracking');
    // Check if citizen has existing application
    const existing = applications.find(a => a.applicantPhone === phone);
    setSelectedAppId(existing ? existing.id : null);
    return true;
  };

  const loginAsDemoPersona = async (personaId: string): Promise<boolean> => {
    const persona = DEMO_PERSONAS.find(p => p.id === personaId) || DEMO_PERSONAS[0];
    setCurrentUser(persona.profile);
    setCurrentRole(persona.role);
    setIsAuthenticated(true);
    setIsDemoMode(true);
    setActiveTab(persona.profile.defaultTab);
    if (persona.role === 'CITIZEN_OPERATOR') {
      const existing = applications.find(a => a.applicantPhone === persona.profile.phone);
      setSelectedAppId(existing ? existing.id : null);
    } else if (applications.length > 0) {
      setSelectedAppId(applications[0].id);
    }
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setSelectedAppId(null);
  };

  const switchDemoUser = (roleOrPersonaId: UserRole | string) => {
    const persona = DEMO_PERSONAS.find(p => p.id === roleOrPersonaId || p.role === roleOrPersonaId);
    if (persona) {
      setCurrentUser(persona.profile);
      setCurrentRole(persona.role);
      setIsAuthenticated(true);
      setIsDemoMode(true);
      setActiveTab(persona.profile.defaultTab);
      if (persona.role === 'CITIZEN_OPERATOR') {
        const existing = applications.find(a => a.applicantPhone === persona.profile.phone);
        setSelectedAppId(existing ? existing.id : null);
      } else if (applications.length > 0) {
        setSelectedAppId(applications[0].id);
      }
      return;
    }
    const profile = DEMO_PROFILES[roleOrPersonaId as UserRole] || DEMO_PROFILES.CITIZEN_OPERATOR;
    setCurrentUser(profile);
    setCurrentRole(roleOrPersonaId as UserRole);
    setIsAuthenticated(true);
    setIsDemoMode(true);
    setActiveTab(profile.defaultTab);
  };

  return (
    <MahaSetuContext.Provider
      value={{
        applications,
        selectedApp,
        selectedAppId,
        currentRole,
        currentUser,
        isAuthenticated,
        isDemoMode,
        demoPersonas: DEMO_PERSONAS,
        language,
        t,
        ledgerBlocks,
        securityLogs,
        activeTab,
        isVerifyingLedger,
        ledgerVerificationResult,
        searchQuery,
        filterStatus,
        filterScheme,
        login,
        loginAsCitizen,
        loginAsDemoPersona,
        logout,
        switchDemoUser,
        setIsDemoMode,
        setRole: handleSetRole,
        setLanguage,
        setActiveTab,
        selectApplication: setSelectedAppId,
        setSearchQuery,
        setFilterStatus,
        setFilterScheme,
        submitNewApplication,
        approveApplication,
        rejectApplication,
        requestClarification,
        revokeConsent,
        verifyLedger
      }}
    >
      {children}
    </MahaSetuContext.Provider>
  );
};

export const useMahaSetu = () => {
  const context = useContext(MahaSetuContext);
  if (!context) {
    throw new Error('useMahaSetu must be used within a MahaSetuProvider');
  }
  return context;
};
