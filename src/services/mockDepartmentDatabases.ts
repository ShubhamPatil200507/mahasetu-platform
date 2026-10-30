import type {
  CitizenApplication,
  RevenueRecord,
  SocialWelfareRecord,
  LandRecord,
  DepartmentApiStatus,
  LedgerBlock,
  SecurityAuditLog
} from '../types';

/**
 * 1. REVENUE DEPARTMENT OF MAHARASHTRA (महसूल विभाग)
 * Legacy SQL DB Snapshot: Tahsildar Portal v4.2
 */
export const MOCK_REVENUE_DB: Record<string, RevenueRecord> = {
  // Ganesh Tukaram Shinde
  'a3f81e9d01b4c93817a5e98214fbc910': {
    incomeCertId: 'REV/MH/PUN/2026/049182',
    applicantName: 'Ganesh Tukaram Shinde',
    annualIncome: 45000,
    tahsildarOffice: 'Tahsildar Office, Daund',
    taluka: 'Daund',
    district: 'Pune',
    issuedDate: '2026-02-14',
    validityStatus: 'VALID',
    domicileNumber: 'DOM/PUN/2024/91820',
    rationCardNumber: 'BPL-MH-27-091829'
  },
  // Sunita Ramdas Patil - Has Discrepancy!
  'b7e21a8c90f3d45291e0a81726fca819': {
    incomeCertId: 'REV/MH/AHM/2025/119283',
    applicantName: 'Sunita Patil',
    annualIncome: 92000,
    tahsildarOffice: 'Tahsildar Office, Karjat',
    taluka: 'Karjat',
    district: 'Ahmednagar',
    issuedDate: '2025-11-20',
    validityStatus: 'VALID',
    domicileNumber: 'DOM/AHM/2023/48192',
    rationCardNumber: 'APL-MH-14-381920'
  },
  // Ramesh Vithal Jadhav
  'c1d49e8a72b0f19384e9102837fba921': {
    incomeCertId: 'REV/MH/SOL/2026/009182',
    applicantName: 'Ramesh Vitthal Jadhav',
    annualIncome: 55000,
    tahsildarOffice: 'Tahsildar Office, Barshi',
    taluka: 'Barshi',
    district: 'Solapur',
    issuedDate: '2026-01-10',
    validityStatus: 'VALID',
    domicileNumber: 'DOM/SOL/2022/19283',
    rationCardNumber: 'BPL-MH-31-019283'
  },
  // Aniket Shantaram Chavan
  'd9c81b2a30e4f59182a7b81920fcb128': {
    incomeCertId: 'REV/MH/PUN/2026/077192',
    applicantName: 'Aniket S. Chavan',
    annualIncome: 140000,
    tahsildarOffice: 'Tahsildar Office, Haveli',
    taluka: 'Haveli',
    district: 'Pune',
    issuedDate: '2026-03-01',
    validityStatus: 'VALID',
    domicileNumber: 'DOM/PUN/2025/77192',
    rationCardNumber: 'APL-MH-27-771920'
  }
};

/**
 * 2. SOCIAL WELFARE DEPARTMENT (सामाजिक न्याय व विशेष सहाय्य विभाग / BARTI)
 * Legacy DB: Dr. Babasaheb Ambedkar Research & Training Institute (BARTI)
 */
export const MOCK_SOCIAL_WELFARE_DB: Record<string, SocialWelfareRecord> = {
  'a3f81e9d01b4c93817a5e98214fbc910': {
    casteCertId: 'BARTI/PUN/SC/2023/09182',
    applicantName: 'Ganesh Tukaram Shinde',
    casteCategory: 'SC',
    subCaste: 'Mahar',
    bartiVerificationNumber: 'VER-BARTI-MH-2023-88219',
    bartiStatus: 'VERIFIED',
    divyangId: 'UDID-MH-PUN-09182-2021',
    disabilityPercentage: 45,
    schemeEntitlement: 'Sanjay Gandhi Niradhar Anudan & Divyang Allowance'
  },
  'b7e21a8c90f3d45291e0a81726fca819': {
    casteCertId: 'BARTI/AHM/OBC/2024/49102',
    applicantName: 'Sunita Ramdas Patil',
    casteCategory: 'OBC',
    subCaste: 'Kunbi Maratha',
    bartiVerificationNumber: 'VER-BARTI-MH-2024-11928',
    bartiStatus: 'VERIFIED',
    schemeEntitlement: 'Dr. Babasaheb Ambedkar Swadhar Hostel Subsidy'
  },
  'c1d49e8a72b0f19384e9102837fba921': {
    casteCertId: 'BARTI/SOL/OPEN/2021/11029',
    applicantName: 'Ramesh Vithal Jadhav',
    casteCategory: 'OPEN',
    subCaste: 'Maratha',
    bartiVerificationNumber: 'EWS-ELIG-MH-2025-09182',
    bartiStatus: 'VERIFIED',
    schemeEntitlement: 'Krushi Sanman & Dryland Farmer Assistance'
  },
  'd9c81b2a30e4f59182a7b81920fcb128': {
    casteCertId: 'BARTI/PUN/EWS/2025/33918',
    applicantName: 'Aniket Shantaram Chavan',
    casteCategory: 'EWS',
    subCaste: 'Maratha',
    bartiVerificationNumber: 'VER-BARTI-MH-2025-49182',
    bartiStatus: 'VERIFIED',
    schemeEntitlement: 'Rajshree Shahu Maharaj Fee Reimbursement'
  }
};

/**
 * 3. RURAL DEVELOPMENT & LAND RECORDS / MAHABHULEKH (भूमी अभिलेख व ग्रामविकास)
 * Legacy 7/12 Land Parcel extract DB
 */
export const MOCK_LAND_RECORDS_DB: Record<string, LandRecord> = {
  'a3f81e9d01b4c93817a5e98214fbc910': {
    surveyGatNumber: 'Gat No. 142/2',
    applicantName: 'Ganesh T. Shinde',
    landAreaHectares: 0.15,
    irrigationType: 'Jirayat (Dry)',
    khataNumber: 'KH-DAUND-8819',
    villageName: 'Kedgaon',
    taluka: 'Daund',
    district: 'Pune',
    mutationEntryNumber: 'MUT-2022-771',
    encumbranceStatus: 'NIL'
  },
  'b7e21a8c90f3d45291e0a81726fca819': {
    surveyGatNumber: 'Gat No. 89/1-A',
    applicantName: 'Sunita Ramdas Patil',
    landAreaHectares: 1.45,
    irrigationType: 'Bagayat (Irrigated)',
    khataNumber: 'KH-KARJAT-1928',
    villageName: 'Mirajgaon',
    taluka: 'Karjat',
    district: 'Ahmednagar',
    mutationEntryNumber: 'MUT-2024-918',
    encumbranceStatus: 'BANK_MORTGAGE'
  },
  'c1d49e8a72b0f19384e9102837fba921': {
    surveyGatNumber: 'Gat No. 312/4',
    applicantName: 'Ramesh Vitthal Jadhav',
    landAreaHectares: 1.80,
    irrigationType: 'Jirayat (Dry)',
    khataNumber: 'KH-BARSHI-4910',
    villageName: 'Pangri',
    taluka: 'Barshi',
    district: 'Solapur',
    mutationEntryNumber: 'MUT-2023-412',
    encumbranceStatus: 'NIL'
  },
  'd9c81b2a30e4f59182a7b81920fcb128': {
    surveyGatNumber: 'Gat No. 204/1',
    applicantName: 'Aniket Shantaram Chavan',
    landAreaHectares: 0.85,
    irrigationType: 'Bagayat (Irrigated)',
    khataNumber: 'KH-HAVELI-3918',
    villageName: 'Wagholi',
    taluka: 'Haveli',
    district: 'Pune',
    mutationEntryNumber: 'MUT-2025-102',
    encumbranceStatus: 'NIL'
  }
};

export const DEPARTMENT_API_REGISTRY: DepartmentApiStatus[] = [
  {
    department: 'REVENUE',
    nameEn: 'Revenue Department (Income & Domicile Registry)',
    nameMr: 'महसूल विभाग (उत्पन्न व अधिवास नोंदणी)',
    endpoint: 'https://revenue.mah.gov.in/api/v2/registry/tahsildar',
    status: 'ONLINE',
    responseTimeMs: 38,
    totalRecordsInLocalSilo: 1428590,
    authStandard: 'mTLS + OAuth2 Token Exchange'
  },
  {
    department: 'SOCIAL_WELFARE',
    nameEn: 'Social Welfare & BARTI (Caste & Welfare Verification)',
    nameMr: 'सामाजिक न्याय व बार्टी (जात व कल्याण पडताळणी)',
    endpoint: 'https://sjsa.maharashtra.gov.in/api/v1/barti',
    status: 'ONLINE',
    responseTimeMs: 44,
    totalRecordsInLocalSilo: 981240,
    authStandard: 'Gov-OIDC + AES-256 JWE'
  },
  {
    department: 'LAND_RECORDS',
    nameEn: 'Rural Development & Mahabhulekh (7/12 & Khata Registry)',
    nameMr: 'ग्रामविकास व महाभूलेख (७/१२ व खाते नोंदणी)',
    endpoint: 'https://mahabhulekh.maharashtra.gov.in/api/v3/land-extract',
    status: 'ONLINE',
    responseTimeMs: 52,
    totalRecordsInLocalSilo: 2190340,
    authStandard: 'HMAC-SHA256 Signed Gateway'
  }
];

export const INITIAL_APPLICATIONS: CitizenApplication[] = [
  {
    id: 'MH-2026-SEVA-84920',
    schemeId: 'SCHEME_SANJAY_GANDHI',
    schemeNameEn: 'Sanjay Gandhi Niradhar Anudan Yojana (Social Assistance)',
    schemeNameMr: 'संजय गांधी निराधार अनुदान योजना (सामाजिक सहाय्य)',
    maxIncomeCeiling: 68000,
    maxLandCeilingHectares: 2.0,
    requiredCasteCategory: 'ANY',

    applicantName: 'Ganesh Tukaram Shinde',
    applicantNameMr: 'गणेश तुकाराम शिंदे',
    applicantPhone: '9822184920',
    aadhaarMasked: 'XXXX-XXXX-4921',
    aadhaarHash: 'a3f81e9d01b4c93817a5e98214fbc910',
    district: 'Pune',
    taluka: 'Daund',
    village: 'Kedgaon',
    selfDeclaredIncome: 45000,
    selfDeclaredLandHectares: 0.15,
    selfDeclaredCaste: 'SC (Mahar)',

    consent: {
      consentId: 'CONSENT-MH-2026-90412',
      applicantAadhaarHash: 'a3f81e9d01b4c93817a5e98214fbc910',
      purpose: 'Verification for Sanjay Gandhi Niradhar Entitlement per DPDP Act 2023',
      scope: { revenueIncome: true, socialCaste: true, landHolding: true },
      grantedAt: '2026-03-12T09:14:00Z',
      expiresAt: '2026-04-12T09:14:00Z',
      status: 'ACTIVE',
      signatureAlgorithm: 'MS-ECDSA-P256',
      digitalSignature: 'MS-ECDSA-P256:7f9a812bc814e9102c9182a45019ef',
      ipAddress: '103.21.144.12 (Seva Kendra Daund)'
    },

    revenueData: MOCK_REVENUE_DB['a3f81e9d01b4c93817a5e98214fbc910'],
    socialWelfareData: MOCK_SOCIAL_WELFARE_DB['a3f81e9d01b4c93817a5e98214fbc910'],
    landData: MOCK_LAND_RECORDS_DB['a3f81e9d01b4c93817a5e98214fbc910'],

    aiHarmonization: {
      confidenceScore: 96,
      phoneticNameScore: 95,
      schemaConformity: true,
      incomeThresholdPassed: true,
      landCeilingPassed: true,
      casteValidityPassed: true,
      anomalies: [
        {
          code: 'MINOR_NAME_ABBREVIATION',
          field: 'applicantName',
          severity: 'INFO',
          messageEn: 'Minor initial format in Land records ("Ganesh T. Shinde" vs "Ganesh Tukaram Shinde"). Confidence 95%.',
          messageMr: 'भूमी अभिलेखात वडिलांच्या नावाचे संक्षिप्त रूप ("Ganesh T. Shinde"). साम्य ९५%.',
          sourceDepartments: ['LAND_RECORDS'],
          suggestedActionEn: 'Acceptable under MahaSetu phonetic tolerance rules.',
          suggestedActionMr: 'महासेतू ध्वन्यात्मक नियमांनुसार स्वीकार्य.'
        }
      ],
      humanReviewRequired: false,
      autoApprovalEligible: true,
      reasoningSummaryEn: 'All 3 departmental records harmonized seamlessly. Income (₹45,000) within ₹68,000 ceiling. BARTI verified SC status. Auto-approval eligible.',
      reasoningSummaryMr: 'तीन्ही विभागांमधील नोंदी सुसंगत. उत्पन्न (₹४५,०००) हे मर्यादेत. बार्टी द्वारे जात प्रमाणित. स्वयंचलित मंजुरीस पात्र.',
      evaluationTimestamp: '2026-03-12T09:14:05Z',
      modelEngine: 'State Automated Identity & Registry Verification Engine'
    },

    status: 'OFFICER_APPROVED',
    submissionDate: '2026-03-12T09:14:00Z',
    updatedDate: '2026-03-12T09:14:15Z',
    assignedOfficer: 'S. K. Kulkarni (Desk Officer, Taluka Daund)',
    officerRemarks: 'Auto-verified with high confidence score (96%). Digital certificate generated.',
    digitalSignatureRef: 'MH-GOV-DSC-SHA256::7A981C4F209B741E00918',
    smsTrackingLogs: [
      {
        timestamp: '2026-03-12T09:14:01Z',
        messageEn: 'MahaSetu: Consent recorded for MH-2026-SEVA-84920. Querying Revenue, Social Welfare & Land records.',
        messageMr: 'महासेतू: MH-2026-SEVA-84920 साठी संमती नोंदवली. विभागांकडून पडताळणी सुरू आहे.',
        status: 'DELIVERED'
      },
      {
        timestamp: '2026-03-12T09:14:16Z',
        messageEn: 'MahaSetu: Application MH-2026-SEVA-84920 approved. Download verified digital entitlement receipt.',
        messageMr: 'महासेतू: अर्ज MH-2026-SEVA-84920 मंजूर झाला. प्रमाणित डिजिटल पावती डाऊनलोड करा.',
        status: 'DELIVERED'
      }
    ]
  },
  {
    id: 'MH-2026-SEVA-84921',
    schemeId: 'SCHEME_SWADHAR_HOSTEL',
    schemeNameEn: 'Dr. Babasaheb Ambedkar Swadhar Yojana (Hostel & Education)',
    schemeNameMr: 'डॉ. बाबासाहेब आंबेडकर स्वाधार योजना (वसतीगृह व शिक्षण)',
    maxIncomeCeiling: 68000,
    maxLandCeilingHectares: 2.0,
    requiredCasteCategory: 'OBC',

    applicantName: 'Sunita Ramdas Patil',
    applicantNameMr: 'सुनिता रामदास पाटील',
    applicantPhone: '9845192840',
    aadhaarMasked: 'XXXX-XXXX-1928',
    aadhaarHash: 'b7e21a8c90f3d45291e0a81726fca819',
    district: 'Ahmednagar',
    taluka: 'Karjat',
    village: 'Mirajgaon',
    selfDeclaredIncome: 48000,
    selfDeclaredLandHectares: 1.45,
    selfDeclaredCaste: 'OBC (Kunbi Maratha)',

    consent: {
      consentId: 'CONSENT-MH-2026-90413',
      applicantAadhaarHash: 'b7e21a8c90f3d45291e0a81726fca819',
      purpose: 'Swadhar Scheme Entitlement Verification per DPDP Act 2023',
      scope: { revenueIncome: true, socialCaste: true, landHolding: true },
      grantedAt: '2026-03-12T10:30:00Z',
      expiresAt: '2026-04-12T10:30:00Z',
      status: 'ACTIVE',
      signatureAlgorithm: 'MS-ECDSA-P256',
      digitalSignature: 'MS-ECDSA-P256:91c0a8274f81028bc17283749012e8',
      ipAddress: '103.21.144.45 (Aaple Sarkar Kendra Karjat)'
    },

    revenueData: MOCK_REVENUE_DB['b7e21a8c90f3d45291e0a81726fca819'],
    socialWelfareData: MOCK_SOCIAL_WELFARE_DB['b7e21a8c90f3d45291e0a81726fca819'],
    landData: MOCK_LAND_RECORDS_DB['b7e21a8c90f3d45291e0a81726fca819'],

    aiHarmonization: {
      confidenceScore: 54,
      phoneticNameScore: 89,
      schemaConformity: true,
      incomeThresholdPassed: false,
      landCeilingPassed: true,
      casteValidityPassed: true,
      anomalies: [
        {
          code: 'INCOME_DISCREPANCY',
          field: 'annualIncome',
          severity: 'CRITICAL',
          messageEn: 'Income Discrepancy: Self-declared ₹48,000 vs Tahsildar Registry ₹92,000 (Difference: ₹44,000).',
          messageMr: 'उत्पन्नात तफावत: स्वयंघोषित ₹४८,००० विरूद्ध तहसीलदार नोंद ₹९२,००० (फरक: ₹४४,०००).',
          sourceDepartments: ['REVENUE'],
          discrepancyData: { selfDeclared: 48000, officialRegistry: 92000, difference: 44000 },
          suggestedActionEn: 'Desk clerk review required against current year Tahsildar income certificate.',
          suggestedActionMr: 'चालू वर्षाच्या तहसीलदार उत्पन्न प्रमाणपत्राची पडताळणी करावी.'
        },
        {
          code: 'INCOME_CEILING_EXCEEDED',
          field: 'annualIncome',
          severity: 'CRITICAL',
          messageEn: 'Official income ₹92,000 exceeds scheme ceiling of ₹68,000.',
          messageMr: 'अधिकृत उत्पन्न ₹९२,००० हे योजनेच्या कमाल मर्यादा ₹६८,००० पेक्षा जास्त आहे.',
          sourceDepartments: ['REVENUE'],
          discrepancyData: { officialIncome: 92000, ceiling: 68000 },
          suggestedActionEn: 'Immediate officer scrutiny required or initiate scheme ineligibility notification.',
          suggestedActionMr: 'अधिकारी स्तरावर तातडीने पुनरावलोकन किंवा अपात्रता सूचना जारी करावी.'
        }
      ],
      humanReviewRequired: true,
      autoApprovalEligible: false,
      reasoningSummaryEn: 'Critical Anomaly Detected: Revenue Department Tahsildar certificate records ₹92,000, exceeding ₹68,000 scheme ceiling. Routed to Taluka Desk Clerk for Human-in-the-Loop review.',
      reasoningSummaryMr: 'गंभीर त्रुटी आढळली: महसूल विभागाच्या नोंदीनुसार उत्पन्न ₹९२,००० असून ते योजनेच्या ₹६८,००० मर्यादेपेक्षा जास्त आहे. मानवी पडताळणीसाठी पाठवले.',
      evaluationTimestamp: '2026-03-12T10:30:08Z',
      modelEngine: 'State Automated Identity & Registry Verification Engine'
    },

    status: 'FLAGGED_FOR_HUMAN_REVIEW',
    submissionDate: '2026-03-12T10:30:00Z',
    updatedDate: '2026-03-12T10:30:10Z',
    assignedOfficer: 'V. R. Thorat (Tahsildar Verification Clerk, Karjat)',
    officerRemarks: 'Income mismatch flagged by AI Engine. Awaiting citizen clarification or updated income affidavit.',
    smsTrackingLogs: [
      {
        timestamp: '2026-03-12T10:30:02Z',
        messageEn: 'MahaSetu: Interoperability check initiated for MH-2026-SEVA-84921 under Swadhar Scheme.',
        messageMr: 'महासेतू: स्वाधार योजनेअंतर्गत MH-2026-SEVA-84921 साठी आंतर-प्रणाली तपासणी सुरू केली.',
        status: 'DELIVERED'
      },
      {
        timestamp: '2026-03-12T10:30:11Z',
        messageEn: 'MahaSetu Alert: Income discrepancy detected with Tahsildar registry. Application referred to Taluka desk officer.',
        messageMr: 'महासेतू सूचना: तहसीलदार नोंदीसोबत उत्पन्नात तफावत आढळली. अर्ज तालुका अधिकाऱ्यांकडे पाठवला आहे.',
        status: 'DELIVERED'
      }
    ]
  },
  {
    id: 'MH-2026-SEVA-84922',
    schemeId: 'SCHEME_KRUSHI_SANMAN',
    schemeNameEn: 'Krushi Sanman & Small Marginal Farmer Subsidy',
    schemeNameMr: 'कृषी सन्मान व अल्प-अल्पभूधारक शेतकरी सहाय्य',
    maxIncomeCeiling: 120000,
    maxLandCeilingHectares: 2.0,
    requiredCasteCategory: 'ANY',

    applicantName: 'Ramesh Vithal Jadhav',
    applicantNameMr: 'रमेश विठ्ठल जाधव',
    applicantPhone: '9765431890',
    aadhaarMasked: 'XXXX-XXXX-9182',
    aadhaarHash: 'c1d49e8a72b0f19384e9102837fba921',
    district: 'Solapur',
    taluka: 'Barshi',
    village: 'Pangri',
    selfDeclaredIncome: 55000,
    selfDeclaredLandHectares: 1.80,
    selfDeclaredCaste: 'OPEN (Maratha)',

    consent: {
      consentId: 'CONSENT-MH-2026-90414',
      applicantAadhaarHash: 'c1d49e8a72b0f19384e9102837fba921',
      purpose: 'Verification for Krushi Sanman Small Farmer Entitlement per DPDP Act 2023',
      scope: { revenueIncome: true, socialCaste: false, landHolding: true },
      grantedAt: '2026-03-12T11:15:00Z',
      expiresAt: '2026-04-12T11:15:00Z',
      status: 'ACTIVE',
      signatureAlgorithm: 'MS-ECDSA-P256',
      digitalSignature: 'MS-ECDSA-P256:4a810c92178e90a823f4102948b812',
      ipAddress: '103.21.144.89 (Barshi Seva Kendra)'
    },

    revenueData: MOCK_REVENUE_DB['c1d49e8a72b0f19384e9102837fba921'],
    socialWelfareData: MOCK_SOCIAL_WELFARE_DB['c1d49e8a72b0f19384e9102837fba921'],
    landData: MOCK_LAND_RECORDS_DB['c1d49e8a72b0f19384e9102837fba921'],

    aiHarmonization: {
      confidenceScore: 98,
      phoneticNameScore: 97,
      schemaConformity: true,
      incomeThresholdPassed: true,
      landCeilingPassed: true,
      casteValidityPassed: true,
      anomalies: [],
      humanReviewRequired: false,
      autoApprovalEligible: true,
      reasoningSummaryEn: 'Mahabhulekh 7/12 extract confirms 1.80 Hectares (Gat No. 312/4) with dryland classification. Eligible under 2.0 Ha ceiling. Instant auto-approval verified.',
      reasoningSummaryMr: 'महाभूलेख ७/१२ नोंदीनुसार १.८० हेक्टर कोरडवाहू शेती (गट क्र. ३१२/४) प्रमाणित. २.० हेक्टर मर्यादेत. त्वरित स्वयंचलित मंजुरी.',
      evaluationTimestamp: '2026-03-12T11:15:05Z',
      modelEngine: 'State Automated Identity & Registry Verification Engine'
    },

    status: 'OFFICER_APPROVED',
    submissionDate: '2026-03-12T11:15:00Z',
    updatedDate: '2026-03-12T11:15:20Z',
    assignedOfficer: 'P. N. Deshmukh (Agriculture Officer, Barshi)',
    officerRemarks: 'All records clear. Land holding and income verified via MahaSetu API.',
    digitalSignatureRef: 'MH-GOV-DSC-SHA256::9B812A7C330198EF0042',
    smsTrackingLogs: [
      {
        timestamp: '2026-03-12T11:15:01Z',
        messageEn: 'MahaSetu: Consent verified for MH-2026-SEVA-84922. 7/12 land extract verified directly with Mahabhulekh.',
        messageMr: 'महासेतू: MH-2026-SEVA-84922 साठी संमती वैध. महाभूलेख कडून ७/१२ उतारा थेट पडताळला गेला.',
        status: 'DELIVERED'
      },
      {
        timestamp: '2026-03-12T11:15:21Z',
        messageEn: 'MahaSetu: Krushi Sanman entitlement approved. Reference: MH-2026-SEVA-84922.',
        messageMr: 'महासेतू: कृषी सन्मान योजना मंजूर झाली. संदर्भ क्र: MH-2026-SEVA-84922.',
        status: 'DELIVERED'
      }
    ]
  }
];

export const INITIAL_LEDGER_BLOCKS: LedgerBlock[] = [
  {
    index: 0,
    timestamp: '2026-03-12T09:00:00Z',
    action: 'GENESIS_BLOCK',
    applicationId: 'SYSTEM',
    actor: 'MahaSetu Root Node',
    actorRole: 'STATE_ROOT_AUTHORITY',
    dataHash: '0000000000000000000000000000000000000000000000000000000000000000',
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    nonce: 10429,
    hash: '0000a98b1c4f72d918e0018247ca819203948571629401827461920485716294'
  },
  {
    index: 1,
    timestamp: '2026-03-12T09:14:00Z',
    action: 'CONSENT_GRANTED_AND_SUBMITTED',
    applicationId: 'MH-2026-SEVA-84920',
    actor: 'Ganesh Tukaram Shinde (Via Kendra Daund)',
    actorRole: 'CITIZEN_OPERATOR',
    dataHash: 'a3f81e9d01b4c93817a5e98214fbc910a3f81e9d01b4c93817a5e98214fbc910',
    previousHash: '0000a98b1c4f72d918e0018247ca819203948571629401827461920485716294',
    nonce: 82710,
    hash: '4f810e72c81920a4857162940182746192048571629401827461920485716294'
  },
  {
    index: 2,
    timestamp: '2026-03-12T09:14:05Z',
    action: 'CROSS_DEPT_INTEROP_HARMONIZED',
    applicationId: 'MH-2026-SEVA-84920',
    actor: 'MahaSetu AI Validator Engine',
    actorRole: 'SYSTEM_VALIDATOR',
    dataHash: '96b8102a74c1920e847162940182746192048571629401827461920485716294',
    previousHash: '4f810e72c81920a4857162940182746192048571629401827461920485716294',
    nonce: 31984,
    hash: '8f4b1c920e748192a01827461920485716294018274619204857162940182746'
  },
  {
    index: 3,
    timestamp: '2026-03-12T09:14:15Z',
    action: 'OFFICER_DIGITAL_SIGNATURE_ATTACHED',
    applicationId: 'MH-2026-SEVA-84920',
    actor: 'S. K. Kulkarni (Desk Officer, Daund)',
    actorRole: 'TALUKA_OFFICER',
    dataHash: '7a981c4f209b741e009187a981c4f209b741e009187a981c4f209b741e00918',
    previousHash: '8f4b1c920e748192a01827461920485716294018274619204857162940182746',
    nonce: 99482,
    hash: '12a98f4b00192847162940182746192048571629401827461920485716294018'
  },
  {
    index: 4,
    timestamp: '2026-03-12T10:30:00Z',
    action: 'ANOMALY_FLAGGED_FOR_HUMAN_REVIEW',
    applicationId: 'MH-2026-SEVA-84921',
    actor: 'MahaSetu AI Validator Engine',
    actorRole: 'SYSTEM_VALIDATOR',
    dataHash: 'b7e21a8c90f3d45291e0a81726fca819b7e21a8c90f3d45291e0a81726fca819',
    previousHash: '12a98f4b00192847162940182746192048571629401827461920485716294018',
    nonce: 67120,
    hash: '3948571629401827461920485716294018274619204857162940182746192048'
  },
  {
    index: 5,
    timestamp: '2026-03-12T11:15:20Z',
    action: 'OFFICER_DIGITAL_SIGNATURE_ATTACHED',
    applicationId: 'MH-2026-SEVA-84922',
    actor: 'P. N. Deshmukh (Agri Officer, Barshi)',
    actorRole: 'TALUKA_OFFICER',
    dataHash: '9b812a7c330198ef00429b812a7c330198ef00429b812a7c330198ef00429b81',
    previousHash: '3948571629401827461920485716294018274619204857162940182746192048',
    nonce: 45192,
    hash: '5716294018274619204857162940182746192048571629401827461920485716'
  }
];

export const INITIAL_SECURITY_LOGS: SecurityAuditLog[] = [
  {
    id: 'SEC-LOG-001',
    timestamp: '2026-03-12T09:14:01Z',
    actor: 'Kendra-Op-Daund-412',
    role: 'CITIZEN_OPERATOR',
    action: 'DIGITAL_CONSENT_CAPTURED',
    resourceId: 'MH-2026-SEVA-84920',
    ipAddress: '103.21.144.12',
    status: 'SUCCESS',
    details: 'Citizen consented to Revenue, Social Welfare & Land queries for Niradhar Scheme.',
    hash: '8f12a940182746192048571629401827'
  },
  {
    id: 'SEC-LOG-002',
    timestamp: '2026-03-12T09:14:02Z',
    actor: 'MahaSetu-Connector-Worker',
    role: 'SILO_ARCHITECT',
    action: 'SCOPED_API_QUERY_DISPATCHED',
    resourceId: 'REVENUE_PORTAL_V2',
    ipAddress: '10.0.4.15',
    status: 'SUCCESS',
    details: 'Encrypted query dispatched with short-lived mTLS token. Latency: 38ms.',
    hash: '4b716294018274619204857162940182'
  },
  {
    id: 'SEC-LOG-003',
    timestamp: '2026-03-12T10:30:09Z',
    actor: 'MahaSetu-AI-Engine',
    role: 'AUDITOR_SECURITY',
    action: 'ANOMALY_ALERT_TRIGGERED',
    resourceId: 'MH-2026-SEVA-84921',
    ipAddress: '10.0.4.18',
    status: 'ALERT',
    details: 'Income discrepancy exceeds tolerance (₹44,000 variance). Blocked auto-approval.',
    hash: '91827461920485716294018274619204'
  }
];
