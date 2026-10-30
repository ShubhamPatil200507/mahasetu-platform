export type UserRole = 'CITIZEN_OPERATOR' | 'TALUKA_OFFICER' | 'AUDITOR_SECURITY' | 'SILO_ARCHITECT';

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

export type Language = 'en' | 'mr';

export type DepartmentType = 'REVENUE' | 'SOCIAL_WELFARE' | 'LAND_RECORDS';

export interface ConsentScope {
  revenueIncome: boolean;
  socialCaste: boolean;
  landHolding: boolean;
}

export interface ConsentToken {
  consentId: string;
  applicantAadhaarHash: string;
  purpose: string;
  scope: ConsentScope;
  grantedAt: string;
  expiresAt: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  signatureAlgorithm: string;
  digitalSignature: string;
  ipAddress: string;
}

export interface RevenueRecord {
  incomeCertId: string;
  applicantName: string;
  annualIncome: number;
  tahsildarOffice: string;
  taluka: string;
  district: string;
  issuedDate: string;
  validityStatus: 'VALID' | 'EXPIRED' | 'PENDING';
  domicileNumber: string;
  rationCardNumber: string;
}

export interface SocialWelfareRecord {
  casteCertId: string;
  applicantName: string;
  casteCategory: 'SC' | 'ST' | 'OBC' | 'EWS' | 'OPEN';
  subCaste: string;
  bartiVerificationNumber: string;
  bartiStatus: 'VERIFIED' | 'UNDER_SCRUTINY' | 'REJECTED';
  divyangId?: string;
  disabilityPercentage?: number;
  schemeEntitlement: string;
}

export interface LandRecord {
  surveyGatNumber: string;
  applicantName: string;
  landAreaHectares: number;
  irrigationType: 'Jirayat (Dry)' | 'Bagayat (Irrigated)' | 'Tari';
  khataNumber: string;
  villageName: string;
  taluka: string;
  district: string;
  mutationEntryNumber: string;
  encumbranceStatus: 'NIL' | 'BANK_MORTGAGE' | 'DISPUTED';
}

export interface AnomalyFlag {
  code: string;
  field: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  messageEn: string;
  messageMr: string;
  sourceDepartments: string[];
  discrepancyData?: Record<string, any>;
  suggestedActionEn: string;
  suggestedActionMr: string;
}

export interface AIHarmonizationResult {
  confidenceScore: number; // 0 - 100
  phoneticNameScore: number; // 0 - 100
  schemaConformity: boolean;
  incomeThresholdPassed: boolean;
  landCeilingPassed: boolean;
  casteValidityPassed: boolean;
  anomalies: AnomalyFlag[];
  humanReviewRequired: boolean;
  autoApprovalEligible: boolean;
  reasoningSummaryEn: string;
  reasoningSummaryMr: string;
  evaluationTimestamp: string;
  modelEngine: string;
}

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'CONSENT_GRANTED'
  | 'CONNECTORS_DISPATCHED'
  | 'AI_HARMONIZED'
  | 'FLAGGED_FOR_HUMAN_REVIEW'
  | 'OFFICER_APPROVED'
  | 'OFFICER_REJECTED';

export interface CitizenApplication {
  id: string; // e.g. MH-2026-SEVA-84920
  schemeId: string;
  schemeNameEn: string;
  schemeNameMr: string;
  maxIncomeCeiling?: number;
  maxLandCeilingHectares?: number;
  requiredCasteCategory?: string;

  // Applicant info (Citizen entered)
  applicantName: string;
  applicantNameMr?: string;
  applicantPhone: string;
  aadhaarMasked: string; // e.g. "XXXX-XXXX-4921"
  aadhaarHash: string;
  district: string;
  taluka: string;
  village: string;
  selfDeclaredIncome: number;
  selfDeclaredLandHectares: number;
  selfDeclaredCaste: string;

  // Consent
  consent: ConsentToken;

  // Queried Legacy Silo Data (Raw snapshots stored as read-only proof)
  revenueData?: RevenueRecord;
  socialWelfareData?: SocialWelfareRecord;
  landData?: LandRecord;

  // AI Harmonization
  aiHarmonization: AIHarmonizationResult;

  // Workflow
  status: ApplicationStatus;
  submissionDate: string;
  updatedDate: string;
  assignedOfficer?: string;
  officerRemarks?: string;
  digitalSignatureRef?: string;
  smsTrackingLogs: {
    timestamp: string;
    messageEn: string;
    messageMr: string;
    status: 'DELIVERED' | 'QUEUED';
  }[];
}

export interface LedgerBlock {
  index: number;
  timestamp: string;
  action: string;
  applicationId: string;
  actor: string;
  actorRole: string;
  dataHash: string;
  previousHash: string;
  nonce: number;
  hash: string;
  isTampered?: boolean;
  tamperNote?: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  resourceId: string;
  ipAddress: string;
  status: 'SUCCESS' | 'ALERT' | 'BLOCKED';
  details: string;
  hash: string;
}

export interface DepartmentApiStatus {
  department: DepartmentType;
  nameEn: string;
  nameMr: string;
  endpoint: string;
  status: 'ONLINE' | 'DEGRADED' | 'MAINTENANCE';
  responseTimeMs: number;
  totalRecordsInLocalSilo: number;
  authStandard: string;
}
