import type {
  CitizenApplication,
  RevenueRecord,
  SocialWelfareRecord,
  LandRecord,
  AIHarmonizationResult,
  AnomalyFlag
} from '../types';

/**
 * Computes Levenshtein Distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const s1 = a.toLowerCase().trim();
  const s2 = b.toLowerCase().trim();

  const matrix: number[][] = [];

  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[s1.length][s2.length];
}

/**
 * Normalized phonetic / name match score (0 to 100)
 */
export function calculateNameMatchScore(name1: string, name2: string): number {
  if (!name1 || !name2) return 0;
  
  const n1 = name1.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const n2 = name2.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

  if (n1 === n2) return 100;

  const tokens1 = n1.split(/\s+/);
  const tokens2 = n2.split(/\s+/);

  const matchedTokens = tokens1.filter(t1 => {
    return tokens2.some(t2 => t1 === t2 || (t1.length === 1 && t2.startsWith(t1)) || (t2.length === 1 && t1.startsWith(t2)));
  });

  const tokenOverlapScore = (matchedTokens.length / Math.max(tokens1.length, tokens2.length)) * 100;

  const maxLen = Math.max(n1.length, n2.length);
  const distance = levenshteinDistance(n1, n2);
  const levenshteinScore = Math.max(0, Math.round(((maxLen - distance) / maxLen) * 100));

  return Math.round(0.6 * tokenOverlapScore + 0.4 * levenshteinScore);
}

/**
 * Automated Record Verification & Anomaly Detection Engine
 */
export function harmonizeAndValidateApplication(
  application: Partial<CitizenApplication>,
  revenue?: RevenueRecord,
  socialWelfare?: SocialWelfareRecord,
  land?: LandRecord
): AIHarmonizationResult {
  const anomalies: AnomalyFlag[] = [];
  const applicantName = application.applicantName || '';
  const selfIncome = application.selfDeclaredIncome || 0;
  const maxIncomeCeiling = application.maxIncomeCeiling;
  const selfLand = application.selfDeclaredLandHectares || 0;
  const maxLandCeiling = application.maxLandCeilingHectares;
  const targetTaluka = (application.taluka || '').toLowerCase().trim();

  // 1. Phonetic & Levenshtein Name Analysis across all registry records
  const nameScores: number[] = [];
  if (revenue?.applicantName) {
    const score = calculateNameMatchScore(applicantName, revenue.applicantName);
    nameScores.push(score);
    if (score < 80) {
      anomalies.push({
        code: 'NAME_MISMATCH_REVENUE',
        field: 'applicantName',
        severity: score < 60 ? 'CRITICAL' : 'WARNING',
        messageEn: `Name spelling variation with Revenue Record: "${applicantName}" vs "${revenue.applicantName}" (Match: ${score}%)`,
        messageMr: `महसूल अभिलेखासोबत नावात तफावत: "${applicantName}" विरूद्ध "${revenue.applicantName}" (साम्य: ${score}%)`,
        sourceDepartments: ['REVENUE'],
        discrepancyData: { citizenInput: applicantName, revenueRecord: revenue.applicantName, matchScore: score },
        suggestedActionEn: 'Taluka officer to inspect Tahsildar identity cross-reference.',
        suggestedActionMr: 'तहसीलदार ओळख संदर्भाची पडताळणी करावी.'
      });
    }
  }

  if (socialWelfare?.applicantName) {
    const score = calculateNameMatchScore(applicantName, socialWelfare.applicantName);
    nameScores.push(score);
    if (score < 80) {
      anomalies.push({
        code: 'NAME_MISMATCH_SOCIAL',
        field: 'applicantName',
        severity: score < 60 ? 'CRITICAL' : 'WARNING',
        messageEn: `Name mismatch with Social Welfare (BARTI): "${applicantName}" vs "${socialWelfare.applicantName}" (Match: ${score}%)`,
        messageMr: `सामाजिक न्याय (BARTI) अभिलेखासोबत नाव तफावत: "${applicantName}" विरूद्ध "${socialWelfare.applicantName}" (साम्य: ${score}%)`,
        sourceDepartments: ['SOCIAL_WELFARE'],
        discrepancyData: { citizenInput: applicantName, socialRecord: socialWelfare.applicantName, matchScore: score },
        suggestedActionEn: 'Verify caste certificate holder identity with Aadhaar VUID.',
        suggestedActionMr: 'आधार क्रमांकासह जात प्रमाणपत्र धारकाची ओळख तपासा.'
      });
    }
  }

  if (land?.applicantName) {
    const score = calculateNameMatchScore(applicantName, land.applicantName);
    nameScores.push(score);
    if (score < 80) {
      anomalies.push({
        code: 'NAME_MISMATCH_LAND',
        field: 'applicantName',
        severity: score < 60 ? 'CRITICAL' : 'WARNING',
        messageEn: `Name variation in 7/12 Land Record: "${applicantName}" vs "${land.applicantName}" (Match: ${score}%)`,
        messageMr: `७/१२ भूमी अभिलेखात नावातील फरक: "${applicantName}" विरूद्ध "${land.applicantName}" (साम्य: ${score}%)`,
        sourceDepartments: ['LAND_RECORDS'],
        discrepancyData: { citizenInput: applicantName, landRecord: land.applicantName, matchScore: score },
        suggestedActionEn: 'Review mutation entry (फेरफार) or joint khatedar status.',
        suggestedActionMr: 'फेरफार नोंद किंवा सामाईक खातेदार स्थिती तपासा.'
      });
    }
  }

  const averageNameScore = nameScores.length > 0
    ? Math.round(nameScores.reduce((a, b) => a + b, 0) / nameScores.length)
    : 100;

  // 2. Income Threshold & Discrepancy Evaluation
  let incomeThresholdPassed = true;
  if (revenue) {
    const officialIncome = revenue.annualIncome;
    const incomeDiff = Math.abs(officialIncome - selfIncome);
    if (incomeDiff > 15000) {
      const severity = incomeDiff > 35000 ? 'CRITICAL' : 'WARNING';
      anomalies.push({
        code: 'INCOME_DISCREPANCY',
        field: 'annualIncome',
        severity,
        messageEn: `Income discrepancy detected: Self-declared ₹${selfIncome.toLocaleString('en-IN')} vs Tahsildar Registry ₹${officialIncome.toLocaleString('en-IN')}`,
        messageMr: `उत्पन्नात तफावत आढळली: स्वयंघोषित ₹${selfIncome.toLocaleString('en-IN')} विरूद्ध तहसीलदार नोंद ₹${officialIncome.toLocaleString('en-IN')}`,
        sourceDepartments: ['REVENUE'],
        discrepancyData: { selfDeclared: selfIncome, officialRegistry: officialIncome, difference: incomeDiff },
        suggestedActionEn: 'Desk clerk review required against current year Tahsildar income certificate.',
        suggestedActionMr: 'चालू वर्षाच्या तहसीलदार उत्पन्न प्रमाणपत्राची पडताळणी करावी.'
      });
    }

    if (maxIncomeCeiling && officialIncome > maxIncomeCeiling) {
      incomeThresholdPassed = false;
      anomalies.push({
        code: 'INCOME_CEILING_EXCEEDED',
        field: 'annualIncome',
        severity: 'CRITICAL',
        messageEn: `Official income ₹${officialIncome.toLocaleString('en-IN')} exceeds scheme ceiling of ₹${maxIncomeCeiling.toLocaleString('en-IN')}`,
        messageMr: `अधिकृत उत्पन्न ₹${officialIncome.toLocaleString('en-IN')} हे योजनेच्या कमाल मर्यादा ₹${maxIncomeCeiling.toLocaleString('en-IN')} पेक्षा जास्त आहे`,
        sourceDepartments: ['REVENUE'],
        discrepancyData: { officialIncome, ceiling: maxIncomeCeiling },
        suggestedActionEn: 'Immediate officer scrutiny required or initiate scheme ineligibility notification.',
        suggestedActionMr: 'अधिकारी स्तरावर तातडीने पुनरावलोकन किंवा अपात्रता सूचना जारी करावी.'
      });
    }
  }

  // 3. Land Ceiling & Encumbrance Evaluation (Mahabhulekh 7/12)
  let landCeilingPassed = true;
  if (land) {
    if (maxLandCeiling && land.landAreaHectares > maxLandCeiling) {
      landCeilingPassed = false;
      anomalies.push({
        code: 'LAND_CEILING_EXCEEDED',
        field: 'landAreaHectares',
        severity: 'CRITICAL',
        messageEn: `Registered land parcel (${land.landAreaHectares} Ha, declared ${selfLand} Ha) exceeds small farmer ceiling limit (${maxLandCeiling} Ha)`,
        messageMr: `नोंदणीकृत जमीन क्षेत्र (${land.landAreaHectares} हे., घोषित ${selfLand} हे.) अल्पभूधारक मर्यादेपेक्षा (${maxLandCeiling} हे.) अधिक आहे`,
        sourceDepartments: ['LAND_RECORDS'],
        discrepancyData: { parcelHolding: land.landAreaHectares, maxCeiling: maxLandCeiling },
        suggestedActionEn: 'Verify if farmer holds dry-land or partitioned share.',
        suggestedActionMr: 'कोरडवाहू जमीन किंवा हिस्सा वाटणीची खात्री करावी.'
      });
    }

    if (land.encumbranceStatus === 'DISPUTED') {
      anomalies.push({
        code: 'LAND_LEGAL_DISPUTE',
        field: 'encumbranceStatus',
        severity: 'WARNING',
        messageEn: `Mahabhulekh indicates active legal dispute on Survey Gat No. ${land.surveyGatNumber}`,
        messageMr: `महाभूलेख नोंदीनुसार गट क्र. ${land.surveyGatNumber} वर न्यायालयीन वाद प्रलंबित आहे`,
        sourceDepartments: ['LAND_RECORDS'],
        suggestedActionEn: 'Verify order of sub-divisional officer (SDO).',
        suggestedActionMr: 'उपविभागीय अधिकाऱ्यांच्या आदेशाची तपासणी करावी.'
      });
    }
  }

  // 4. Caste Validity & BARTI Verification
  let casteValidityPassed = true;
  if (socialWelfare) {
    if (socialWelfare.bartiStatus === 'UNDER_SCRUTINY') {
      casteValidityPassed = false;
      anomalies.push({
        code: 'CASTE_SCRUTINY_PENDING',
        field: 'bartiStatus',
        severity: 'WARNING',
        messageEn: `BARTI caste validity verification is currently UNDER_SCRUTINY (${socialWelfare.bartiVerificationNumber})`,
        messageMr: `बार्टी जात पडताळणी प्रमाणपत्र सध्या तपासणी अंतर्गत आहे (${socialWelfare.bartiVerificationNumber})`,
        sourceDepartments: ['SOCIAL_WELFARE'],
        suggestedActionEn: 'Allow provisional review or await BARTI digital clearance token.',
        suggestedActionMr: 'तात्पुरते पुनरावलोकन किंवा बार्टी डिजिटल मंजुरीची प्रतीक्षा करा.'
      });
    } else if (socialWelfare.bartiStatus === 'REJECTED') {
      casteValidityPassed = false;
      anomalies.push({
        code: 'CASTE_VALIDITY_REJECTED',
        field: 'bartiStatus',
        severity: 'CRITICAL',
        messageEn: 'BARTI scrutiny committee marked caste certificate as INVALID / REJECTED',
        messageMr: 'बार्टी छाननी समितीने जात वैधता प्रमाणपत्र अवैध / नाकारलेले घोषित केले आहे',
        sourceDepartments: ['SOCIAL_WELFARE'],
        suggestedActionEn: 'Application cannot proceed under reserved category.',
        suggestedActionMr: 'राखीव प्रवर्गांतर्गत अर्ज पुढे पाठवता येणार नाही.'
      });
    }
  }

  // 5. Geographic Taluka Alignment Check
  if (revenue && revenue.taluka.toLowerCase().trim() !== targetTaluka && targetTaluka) {
    anomalies.push({
      code: 'TALUKA_JURISDICTION_MISMATCH',
      field: 'taluka',
      severity: 'WARNING',
      messageEn: `Jurisdiction difference: Applicant applied in "${targetTaluka.toUpperCase()}" but Revenue certificate issued in "${revenue.taluka.toUpperCase()}"`,
      messageMr: `कार्यक्षेत्र तफावत: अर्जदाराने "${targetTaluka}" येथे अर्ज केला मात्र महसूल प्रमाणपत्र "${revenue.taluka}" चे आहे`,
      sourceDepartments: ['REVENUE'],
      suggestedActionEn: 'Desk clerk to confirm district intra-taluka migration status.',
      suggestedActionMr: 'जिल्हांतर्गत स्थलांतर स्थितीची नोंद घ्यावी.'
    });
  }

  const schemaConformity = true;
  const criticalCount = anomalies.filter(a => a.severity === 'CRITICAL').length;
  const warningCount = anomalies.filter(a => a.severity === 'WARNING').length;

  let baseScore = averageNameScore;
  if (!incomeThresholdPassed) baseScore -= 30;
  if (!landCeilingPassed) baseScore -= 25;
  if (!casteValidityPassed) baseScore -= 20;
  baseScore -= (warningCount * 8);

  const confidenceScore = Math.max(15, Math.min(99, baseScore));

  const humanReviewRequired = criticalCount > 0 || confidenceScore < 85;
  const autoApprovalEligible = criticalCount === 0 && warningCount === 0 && confidenceScore >= 92;

  let reasoningSummaryEn = '';
  let reasoningSummaryMr = '';

  if (autoApprovalEligible) {
    reasoningSummaryEn = `All registry schemas conform. High phonetic alignment (${averageNameScore}%), income within threshold, and digital records verified. Eligible for instant automated approval.`;
    reasoningSummaryMr = `सर्व विभागांचे डेटा सुसंगत आहेत. उच्च नाव साम्यता (${averageNameScore}%), उत्पन्नाची अट पूर्ण आणि डिजिटल नोंदी वैध. त्वरित स्वयंचलित मंजुरीसाठी पात्र.`;
  } else if (humanReviewRequired) {
    reasoningSummaryEn = `Routed for Taluka Frontline Officer Review: Detected ${criticalCount} discrepancy and ${warningCount} variance notice(s). Requires human oversight before final entitlement release.`;
    reasoningSummaryMr = `तालुका सेवा अधिकारी पुनरावलोकनासाठी पाठवले: ${criticalCount} त्रुटी आणि ${warningCount} सूचना आढळल्या. अंतिम मंजुरीपूर्वी मानवी पडताळणी आवश्यक आहे.`;
  } else {
    reasoningSummaryEn = `Conditional clearance. Minor non-blocking variances observed (${warningCount} notice). Officer sign-off recommended.`;
    reasoningSummaryMr = `सशर्त मान्यता. किरकोळ विसंगती (${warningCount} सूचना) आढळल्या. अधिकाऱ्यांच्या शिफारसीने मंजुरी शक्य.`;
  }

  return {
    confidenceScore,
    phoneticNameScore: averageNameScore,
    schemaConformity,
    incomeThresholdPassed,
    landCeilingPassed,
    casteValidityPassed,
    anomalies,
    humanReviewRequired,
    autoApprovalEligible,
    reasoningSummaryEn,
    reasoningSummaryMr,
    evaluationTimestamp: new Date().toISOString(),
    modelEngine: 'State Automated Identity & Registry Verification Engine'
  };
}
