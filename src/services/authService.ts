import type { UserRole } from '../types';

export interface UserProfile {
  id: string;
  name: string;
  nameMr: string;
  email: string;
  phone: string;
  role: UserRole;
  designation: string;
  designationMr: string;
  departmentOffice: string;
  departmentOfficeMr: string;
  badgeNumber: string;
  avatarInitials: string;
  authMethod: 'OTP' | 'DSC_TOKEN' | 'SECURITY_KEY' | 'GATEWAY_MFA';
  authMethodLabelEn: string;
  authMethodLabelMr: string;
  demoCredentialHint: string;
  demoCredentialValue: string;
  allowedTabs: ('tracking' | 'review' | 'ledger' | 'silos')[];
  defaultTab: 'tracking' | 'review' | 'ledger' | 'silos';
  securityClearanceLevel: string;
}

export interface RolePowerDefinition {
  role: UserRole;
  titleEn: string;
  titleMr: string;
  authorityEn: string;
  authorityMr: string;
  grantedPowersEn: string[];
  grantedPowersMr: string[];
  restrictedEn: string[];
  restrictedMr: string[];
}

export const ROLE_POWERS: Record<UserRole, RolePowerDefinition> = {
  CITIZEN_OPERATOR: {
    role: 'CITIZEN_OPERATOR',
    titleEn: 'Citizen / CSC Operator',
    titleMr: 'नागरिक / आपले सरकार केंद्र चालक',
    authorityEn: 'Maharashtra Right to Public Services Act & DPDP Act 2023 (Citizen Tier)',
    authorityMr: 'महाराष्ट्र लोकसेवा हक्क कायदा व DPDP कायदा २०२३ (नागरिक सेवा स्तर)',
    grantedPowersEn: [
      'File and submit new welfare scheme applications',
      'Authorize purpose-limited digital consent under DPDP Act 2023',
      'Statutory right to withdraw or revoke active consent anytime',
      'Track real-time departmental inquiry status',
      'Download and print official verified Entitlement Certificates with QR code'
    ],
    grantedPowersMr: [
      'कल्याणकारी योजनांसाठी नवीन अर्ज दाखल करणे',
      'DPDP कायदा २०२३ अंतर्गत विशिष्ट उद्देशासाठी डिजिटल संमती देणे',
      'दिलेली संमती कोणत्याही क्षणी मागे घेण्याचा कायदेशीर अधिकार',
      'अर्जाच्या पडताळणीची सद्यस्थिती तपासणे',
      'QR कोडसह अधिकृत डिजिटल लाभ प्रमाणपत्र डाऊनलोड व प्रिंट करणे'
    ],
    restrictedEn: [
      'Cannot approve or reject welfare claims (reserved for Gazetted Officers)',
      'Cannot affix officer Digital Signature Certificates (DSC)',
      'Cannot inspect other citizens confidential files',
      'Cannot alter departmental records or system registers'
    ],
    restrictedMr: [
      'अर्ज मंजूर किंवा नाकारण्याचे अधिकार नाहीत (केवळ राजपत्रित अधिकाऱ्यांना अधिकार)',
      'अधिकारी डिजिटल स्वाक्षरी (DSC) वापरण्याचे अधिकार नाहीत',
      'इतर नागरिकांची गोपनीय माहिती पाहता येत नाही',
      'शासकीय नोंदी किंवा लेजरमध्ये बदल करता येत नाही'
    ]
  },
  TALUKA_OFFICER: {
    role: 'TALUKA_OFFICER',
    titleEn: 'Taluka Verification Officer (Tahsildar)',
    titleMr: 'तालुका पडताळणी अधिकारी (तहसीलदार)',
    authorityEn: 'Maharashtra Land Revenue Code & Gazetted Scrutiny Officer Authority (Level II)',
    authorityMr: 'महाराष्ट्र जमीन महसूल संहिता व उपविभागीय राजपत्रित छाननी अधिकार (स्तर-२)',
    grantedPowersEn: [
      'Exclusive authority to access the Taluka Frontline Verification Desk',
      'Reconcile multi-department discrepancies (Revenue, BARTI, Mahabhulekh)',
      'Dispatch official SMS clarification notices to citizen applicants',
      'Affix legally binding Class-3 Digital Signature Certificate (DSC) electronic seals',
      'Formally approve eligible citizen dossiers or reject non-compliant applications'
    ],
    grantedPowersMr: [
      'तालुका पडताळणी कक्ष चालवण्याचे विशेष प्रशासकीय अधिकार',
      'महसूल, बार्टी आणि महाभूलेख नोंदींमधील विसंगतींचे निवारण करणे',
      'नागरिकांच्या मोबाईलवर अधिकृत खुलासा मागवणारे एसएमएस पाठवणे',
      'वर्ग-३ डिजिटल स्वाक्षरीने (DSC) अधिकृत इलेक्ट्रॉनिक शिक्का मारणे',
      'पात्र अर्ज अधिकृतपणे मंजूर करणे किंवा अपात्र अर्ज कारणासह नाकारणे'
    ],
    restrictedEn: [
      'Cannot file citizen applications on their own behalf',
      'Cannot delete or modify historical audit action entries',
      'Cannot alter IT gateway parameters or database schemas'
    ],
    restrictedMr: [
      'स्वतःच्या लाभासाठी नागरिक अर्ज दाखल करता येत नाही',
      'नोंदवहीतील भूतकाळातील कोणत्याही नोंदी हटवता किंवा बदलता येत नाहीत',
      'माहिती तंत्रज्ञान गेटवे किंवा डेटाबेस संरचनेत बदल करता येत नाही'
    ]
  },
  AUDITOR_SECURITY: {
    role: 'AUDITOR_SECURITY',
    titleEn: 'CAG & State Security Auditor',
    titleMr: 'लेखापरीक्षक व सुरक्षा अधिकारी (CAG)',
    authorityEn: 'Comptroller & Auditor General (CAG) Mandate & State Public Audit Rules',
    authorityMr: 'भारताचे नियंत्रक व महालेखापरीक्षक (CAG) व राज्य प्रशासकीय लेखापरीक्षण नियम',
    grantedPowersEn: [
      'Independent, read-only oversight across all state service records',
      'Inspect permanent chronological register of all citizen and officer actions',
      'Execute mathematical integrity checks to ensure untampered records',
      'Inspect administrative access trails and security logs',
      'Export official compliance reports for CAG and state assembly scrutiny'
    ],
    grantedPowersMr: [
      'सर्व शासकीय सेवा नोंदींवर स्वतंत्र व निपक्षपाती लेखापरीक्षण अधिकार',
      'नागरिक व अधिकारी यांच्या सर्व कृतींची अखंड नोंदवही तपासणे',
      'नोंदींमध्ये कोणतीही छेडछाड झाली नसल्याची गणितीय पडताळणी करणे',
      'प्रशासकीय वापर इतिहास व सुरक्षा नोंदींची तपासणी करणे',
      'विधानसभा व CAG अनुपालनासाठी अधिकृत अहवाल डाऊनलोड करणे'
    ],
    restrictedEn: [
      'Strictly read-only authority: cannot approve or reject welfare claims',
      'Cannot modify citizen dossiers or grant/revoke DPDP consent',
      'Cannot perform frontline executive actions'
    ],
    restrictedMr: [
      'केवळ तपासणी अधिकार: अर्ज मंजूर किंवा नाकारता येत नाही',
      'नागरिकांच्या अर्जात किंवा संमतीमध्ये बदल करता येत नाही',
      'थेट कार्यकारी प्रशासकीय निर्णय घेता येत नाहीत'
    ]
  },
  SILO_ARCHITECT: {
    role: 'SILO_ARCHITECT',
    titleEn: 'Portal Administrator (DIT Gateway Lead)',
    titleMr: 'राज्य पोर्टल मुख्य प्रशासक (माहिती तंत्रज्ञान संचालनालय)',
    authorityEn: 'Directorate of Information Technology (DIT) Enterprise Infrastructure Mandate',
    authorityMr: 'माहिती व तंत्रज्ञान संचालनालय (DIT) राज्य पायाभूत सुविधा नियम',
    grantedPowersEn: [
      'Oversee state departmental integration (Revenue, Social Justice, Land Records)',
      'Execute live on-demand inquiry queries to test departmental connectivity',
      'Monitor registry status, record counts, and synchronization health',
      'Manage administrative gateway health and operational parameters'
    ],
    grantedPowersMr: [
      'शासकीय विभागांमधील आंतर-प्रणाली जोडणीचे व्यवस्थापन करणे',
      'थेट चौकशी करून विभागीय कनेक्टिव्हिटीची चाचणी घेणे',
      'संलग्न विभागांची सद्यस्थिती व नोंदींची उपलब्धता तपासणे',
      'प्रणालीची अखंडता व प्रशासकीय पॅरामीटर्स नियंत्रित करणे'
    ],
    restrictedEn: [
      'Strict separation of powers: Cannot approve welfare claims as a judicial/revenue officer',
      'Cannot override Tahsildar statutory scrutiny determinations'
    ],
    restrictedMr: [
      'अधिकार विभाजन: महसूल अधिकाऱ्यांप्रमाणे थेट लाभ मंजूर करण्याचे अधिकार नाहीत',
      'तहसीलदारांच्या वैधानिक छाननी निर्णयावर अतिक्रमण करता येत नाही'
    ]
  }
};

export const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  CITIZEN_OPERATOR: {
    id: 'usr_csc_4120',
    name: 'Suresh M. Chavan',
    nameMr: 'सुरेश म. चव्हाण',
    email: 'suresh.chavan@csc.mahasetu.gov.in',
    phone: '9822941029',
    role: 'CITIZEN_OPERATOR',
    designation: 'Citizen / Seva Kendra',
    designationMr: 'नागरिक / आपले सरकार केंद्र',
    departmentOffice: 'Taluka Daund, Dist. Pune',
    departmentOfficeMr: 'तालुका दौंड, जि. पुणे',
    badgeNumber: 'MH-CSC-2026-4120',
    avatarInitials: 'SC',
    authMethod: 'OTP',
    authMethodLabelEn: 'Mobile OTP Verification',
    authMethodLabelMr: 'मोबाईल ओटीपी पडताळणी',
    demoCredentialHint: 'Enter 6-digit OTP sent to registered mobile',
    demoCredentialValue: '782910',
    allowedTabs: ['tracking'],
    defaultTab: 'tracking',
    securityClearanceLevel: 'Citizen Service Delivery'
  },
  TALUKA_OFFICER: {
    id: 'usr_rev_8491',
    name: 'S. K. Kulkarni',
    nameMr: 'एस. के. कुलकर्णी',
    email: 'sk.kulkarni@mahadit.gov.in',
    phone: '9422019283',
    role: 'TALUKA_OFFICER',
    designation: 'Tahsildar (Scrutiny Officer)',
    designationMr: 'तहसीलदार (छाननी अधिकारी)',
    departmentOffice: 'Office of the Tahsildar, Taluka Daund, Pune',
    departmentOfficeMr: 'तहसीलदार कार्यालय, तालुका दौंड, जि. पुणे',
    badgeNumber: 'MH-REV-OFF-8491',
    avatarInitials: 'SK',
    authMethod: 'DSC_TOKEN',
    authMethodLabelEn: 'Digital Signature Certificate (DSC) Token',
    authMethodLabelMr: 'डिजिटल स्वाक्षरी प्रमाणपत्र (DSC) टोकन',
    demoCredentialHint: 'Class-3 DSC Token PIN or Officer Password',
    demoCredentialValue: 'Tahsildar@2026',
    allowedTabs: ['review', 'tracking'],
    defaultTab: 'review',
    securityClearanceLevel: 'Executive Officer Level II'
  },
  AUDITOR_SECURITY: {
    id: 'usr_cag_3901',
    name: 'Dr. Anuradha Deshmukh',
    nameMr: 'डॉ. अनुराधा देशमुख',
    email: 'anuradha.deshmukh@cag.gov.in',
    phone: '9820019201',
    role: 'AUDITOR_SECURITY',
    designation: 'State Audit Officer',
    designationMr: 'राज्य लेखापरीक्षण अधिकारी',
    departmentOffice: 'Comptroller & Auditor General (CAG) Directorate, Maharashtra',
    departmentOfficeMr: 'भारताचे नियंत्रक व महालेखापरीक्षक (CAG) संचालनालय, महाराष्ट्र',
    badgeNumber: 'CAG-MH-SEC-3901',
    avatarInitials: 'AD',
    authMethod: 'SECURITY_KEY',
    authMethodLabelEn: 'Official Auditor Security Passcode',
    authMethodLabelMr: 'लेखापरीक्षक सुरक्षा पासकोड',
    demoCredentialHint: 'CAG Directorate Security Token PIN',
    demoCredentialValue: '773901',
    allowedTabs: ['ledger'],
    defaultTab: 'ledger',
    securityClearanceLevel: 'Independent Oversight Authority'
  },
  SILO_ARCHITECT: {
    id: 'usr_dit_001',
    name: 'Vikramaditya Patil',
    nameMr: 'विक्रमादित्य पाटील',
    email: 'v.patil@maharashtra.gov.in',
    phone: '9819920192',
    role: 'SILO_ARCHITECT',
    designation: 'State Portal Administrator',
    designationMr: 'राज्य पोर्टल मुख्य प्रशासक',
    departmentOffice: 'Directorate of Information Technology (DIT), Mantralaya, Mumbai',
    departmentOfficeMr: 'माहिती व तंत्रज्ञान संचालनालय (DIT), मंत्रालय, मुंबई',
    badgeNumber: 'DIT-GATEWAY-001',
    avatarInitials: 'VP',
    authMethod: 'GATEWAY_MFA',
    authMethodLabelEn: 'Administrator Master Access Passcode',
    authMethodLabelMr: 'प्रशासक मुख्य सुरक्षा पासकोड',
    demoCredentialHint: 'DIT Root Administrative Gateway Key',
    demoCredentialValue: 'DIT-ROOT-9011',
    allowedTabs: ['silos', 'ledger'],
    defaultTab: 'silos',
    securityClearanceLevel: 'State Infrastructure Management'
  }
};

export interface DemoPersona {
  id: string;
  role: UserRole;
  titleEn: string;
  titleMr: string;
  roleBadgeEn: string;
  roleBadgeMr: string;
  descEn: string;
  descMr: string;
  profile: UserProfile;
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'suresh_chavan',
    role: 'CITIZEN_OPERATOR',
    titleEn: 'Suresh M. Chavan',
    titleMr: 'सुरेश म. चव्हाण',
    roleBadgeEn: 'New Citizen (Add Application)',
    roleBadgeMr: 'नवीन नागरिक (स्वतः अर्ज करा)',
    descEn: 'Fresh citizen session — click "+ New Application" to register and view only your data',
    descMr: 'कोरा नागरिक खाता — "+ नवीन अर्ज" वर क्लिक करून स्वतःचा अर्ज भरा व केवळ स्वतःचा डेटा पहा',
    profile: DEMO_PROFILES.CITIZEN_OPERATOR
  },
  {
    id: 'ganesh_shinde',
    role: 'CITIZEN_OPERATOR',
    titleEn: 'Ganesh T. Shinde',
    titleMr: 'गणेश तु. शिंदे',
    roleBadgeEn: 'Existing Beneficiary',
    roleBadgeMr: 'विद्यमान मंजूर लाभार्थी',
    descEn: 'Citizen with approved welfare claim — view verified certificate & working QR code',
    descMr: 'मंजूर अर्ज असलेला नागरिक — प्रमाणित लाभ प्रमाणपत्र व तपासणी QR कोड पहा',
    profile: {
      ...DEMO_PROFILES.CITIZEN_OPERATOR,
      id: 'usr_cit_84920',
      name: 'Ganesh Tukaram Shinde',
      nameMr: 'गणेश तुकाराम शिंदे',
      phone: '9822184920',
      designation: 'Beneficiary',
      designationMr: 'कल्याणकारी लाभार्थी',
      departmentOffice: 'Taluka Daund, District Pune',
      departmentOfficeMr: 'तालुका दौंड, जिल्हा पुणे',
      avatarInitials: 'GS'
    }
  },
  {
    id: 'tahsildar_kulkarni',
    role: 'TALUKA_OFFICER',
    titleEn: 'S. K. Kulkarni (Tahsildar)',
    titleMr: 'एस. के. कुलकर्णी (तहसीलदार)',
    roleBadgeEn: 'Taluka Officer Desk',
    roleBadgeMr: 'तहसीलदार पडताळणी कक्ष',
    descEn: 'Frontline officer — cross-verify applicant data, approve with Class-3 DSC or request clarification',
    descMr: 'छाननी अधिकारी — विसंगतींची पडताळणी करा, DSC द्वारे स्वाक्षरी करा किंवा खुलासा मागवा',
    profile: DEMO_PROFILES.TALUKA_OFFICER
  },
  {
    id: 'auditor_deshmukh',
    role: 'AUDITOR_SECURITY',
    titleEn: 'Dr. Anuradha Deshmukh',
    titleMr: 'डॉ. अनुराधा देशमुख',
    roleBadgeEn: 'State Auditor',
    roleBadgeMr: 'राज्य लेखापरीक्षक',
    descEn: 'State Auditor — independent read-only verification of the official actions register',
    descMr: 'लेखापरीक्षक — शासकीय डिजिटल नोंदवहीची तपासणी व अनुपालन अहवाल',
    profile: DEMO_PROFILES.AUDITOR_SECURITY
  },
  {
    id: 'admin_patil',
    role: 'SILO_ARCHITECT',
    titleEn: 'Vikramaditya Patil',
    titleMr: 'विक्रमादित्य पाटील',
    roleBadgeEn: 'Portal Administrator',
    roleBadgeMr: 'प्रणाली मुख्य प्रशासक',
    descEn: 'DIT Lead — monitor Revenue, Social Justice & Land Records connectors and latency',
    descMr: 'माहिती तंत्रज्ञान प्रमुख — महसूल, सामाजिक न्याय व भूमी अभिलेख जोडणी व वेग निरीक्षण',
    profile: DEMO_PROFILES.SILO_ARCHITECT
  }
];

export function createCitizenProfile(name: string, phone: string, nameMr?: string): UserProfile {
  const initials = name
    .split(' ')
    .map(p => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'CT';

  return {
    id: `usr_cit_${phone.slice(-4)}_${Date.now().toString().slice(-4)}`,
    name: name.trim(),
    nameMr: nameMr || name.trim(),
    email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '.') || 'citizen'}@citizen.maha.gov.in`,
    phone: phone.trim(),
    role: 'CITIZEN_OPERATOR',
    designation: 'Citizen / Applicant',
    designationMr: 'नागरिक / अर्जदार',
    departmentOffice: 'Maharashtra Public Services Gateway',
    departmentOfficeMr: 'महाराष्ट्र लोकसेवा वितरण महामार्ग',
    badgeNumber: `CIT-MH-${phone.slice(-4)}`,
    avatarInitials: initials,
    authMethod: 'OTP',
    authMethodLabelEn: 'Mobile OTP Verification',
    authMethodLabelMr: 'मोबाईल ओटीपी पडताळणी',
    demoCredentialHint: 'Enter 6-digit OTP',
    demoCredentialValue: '123456',
    allowedTabs: ['tracking'],
    defaultTab: 'tracking',
    securityClearanceLevel: 'Citizen Public Access'
  };
}

export function authenticateUser(role: UserRole, credentialInput?: string): { success: boolean; profile: UserProfile; token: string } {
  const profile = DEMO_PROFILES[role];
  const token = `MH_AUTH_${role}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  return {
    success: true,
    profile,
    token
  };
}
