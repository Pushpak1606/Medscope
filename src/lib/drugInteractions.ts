/**
 * =========================================================================
 * MEDSCOPE CLINICAL DRUG-DRUG INTERACTION INTELLIGENCE MATRIX
 * =========================================================================
 * 
 * Implements real-time pharmacological interaction checks as specified in
 * Medscope Chapter 1.2.1, Section 4.4, Table 4.3, and Table 5.2 (TC-D04).
 * 
 * Features:
 * - Real-time pair-wise cross-reference against active patient regimen.
 * - Color-coded clinical severity: Severe / Contraindicated, Moderate, Mild.
 * - Mandatory clinical acknowledgement and override audit trail.
 */

export interface DrugInteractionRule {
  drugA: string[];
  drugB: string[];
  severity: "Severe" | "Moderate" | "Mild";
  title: string;
  clinicalMechanism: string;
  recommendedAction: string;
}

export interface DetectedInteraction {
  ruleId: string;
  drugA: string;
  drugB: string;
  severity: "Severe" | "Moderate" | "Mild";
  title: string;
  clinicalMechanism: string;
  recommendedAction: string;
}

export interface InteractionAuditTrail {
  id: string;
  detectedInteractions: DetectedInteraction[];
  doctorRationale: string;
  prescribedDrug: string;
  doctorName: string;
  timestamp: string;
}

// Clinically validated high-risk pharmacological pairs
export const CLINICAL_INTERACTION_RULES: DrugInteractionRule[] = [
  {
    drugA: ["warfarin", "coumadin", "clopidogrel", "plavix", "ticagrelor"],
    drugB: ["aspirin", "ibuprofen", "naproxen", "diclofenac", "ketorolac"],
    severity: "Severe",
    title: "Antiplatelet / Anticoagulant + NSAID Co-administration",
    clinicalMechanism: "Synergistic inhibition of platelet aggregation and gastric mucosal erosion markedly increases major gastrointestinal bleeding risk.",
    recommendedAction: "Avoid co-administration or prescribe gastroprotective PPI with close INR / hemoglobin monitoring.",
  },
  {
    drugA: ["aspirin", "acetylsalicylic"],
    drugB: ["ibuprofen", "naproxen", "diclofenac", "ketorolac", "indomethacin", "meloxicam"],
    severity: "Severe",
    title: "Aspirin + NSAID Competitive COX-1 Inhibition & Bleeding",
    clinicalMechanism: "NSAIDs competitively antagonize aspirin antiplatelet effect and elevate gastrointestinal ulceration and major bleeding risk.",
    recommendedAction: "Take aspirin at least 2 hours before or consider paracetamol.",
  },
  {
    drugA: ["lisinopril", "enalapril", "ramipril", "losartan", "valsartan"],
    drugB: ["spironolactone", "eplerenone", "potassium", "k-dur"],
    severity: "Severe",
    title: "Renin-Angiotensin System Inhibitor + Potassium-Sparing Diuretic",
    clinicalMechanism: "Compounded potassium retention may induce life-threatening hyperkalemia and fatal cardiac arrhythmias.",
    recommendedAction: "Monitor serum potassium and renal function (BUN/creatinine) within 1-2 weeks of initiation.",
  },
  {
    drugA: ["metoprolol", "atenolol", "carvedilol", "bisoprolol"],
    drugB: ["verapamil", "diltiazem"],
    severity: "Severe",
    title: "Beta-Blocker + Non-Dihydropyridine Calcium Channel Blocker",
    clinicalMechanism: "Additive negative inotropic and chronotropic effects can precipitate severe bradycardia, heart block, and cardiogenic shock.",
    recommendedAction: "Extreme caution advised. Co-prescription requires continuous telemetry or cardiology specialist sign-off.",
  },
  {
    drugA: ["atorvastatin", "simvastatin", "lovastatin"],
    drugB: ["clarithromycin", "erythromycin", "gemfibrozil", "amiodarone"],
    severity: "Moderate",
    title: "Statin + CYP3A4 Inhibitor / Fibrate",
    clinicalMechanism: "Inhibition of CYP3A4 metabolism escalates systemic statin exposure, elevating risk of myopathy and rhabdomyolysis.",
    recommendedAction: "Reduce statin dose or temporarily suspend statin during antibiotic course.",
  },
  {
    drugA: ["sertraline", "fluoxetine", "escitalopram", "citalopram", "venlafaxine"],
    drugB: ["tramadol", "linezolid", "selegiline", "phenelzine", "st john"],
    severity: "Severe",
    title: "Serotonergic Agent + Tramadol / MAOI",
    clinicalMechanism: "Excessive serotonin receptor stimulation in CNS risks precipitating Serotonin Syndrome (hyperthermia, clonus, autonomic instability).",
    recommendedAction: "Contraindicated or requires mandatory 14-day washout period.",
  },
  {
    drugA: ["digoxin", "lanoxin"],
    drugB: ["amiodarone", "verapamil", "clarithromycin"],
    severity: "Moderate",
    title: "Digoxin Clearance Impairment",
    clinicalMechanism: "P-glycoprotein inhibition reduces renal and non-renal digoxin clearance, doubling serum digoxin concentrations.",
    recommendedAction: "Reduce digoxin dose by 30-50% upon initiating co-therapy and monitor serum levels.",
  },
  {
    drugA: ["metformin", "glycomet", "glucophage"],
    drugB: ["contrast", "radiopaque contrast"],
    severity: "Moderate",
    title: "Metformin + Iodinated Radiographic Contrast",
    clinicalMechanism: "Contrast-induced acute kidney injury leads to toxic metformin accumulation and fatal lactic acidosis.",
    recommendedAction: "Withhold metformin prior to or at time of procedure, resuming after 48 hours if renal function is normal.",
  },
];

/**
 * Checks a candidate medication against the patient's existing regimen.
 */
export function checkDrugInteractions(
  candidateDrug: string,
  existingDrugs: string[]
): DetectedInteraction[] {
  if (!candidateDrug || !existingDrugs || existingDrugs.length === 0) {
    return [];
  }

  const candidateLower = candidateDrug.toLowerCase();
  const detected: DetectedInteraction[] = [];

  for (const rule of CLINICAL_INTERACTION_RULES) {
    const matchesA = rule.drugA.some((d) => candidateLower.includes(d));
    const matchesB = rule.drugB.some((d) => candidateLower.includes(d));

    if (matchesA) {
      // Check if existing drugs match B
      for (const existing of existingDrugs) {
        const existingLower = existing.toLowerCase();
        if (rule.drugB.some((d) => existingLower.includes(d))) {
          detected.push({
            ruleId: rule.title,
            drugA: candidateDrug,
            drugB: existing,
            severity: rule.severity,
            title: rule.title,
            clinicalMechanism: rule.clinicalMechanism,
            recommendedAction: rule.recommendedAction,
          });
        }
      }
    } else if (matchesB) {
      // Check if existing drugs match A
      for (const existing of existingDrugs) {
        const existingLower = existing.toLowerCase();
        if (rule.drugA.some((d) => existingLower.includes(d))) {
          detected.push({
            ruleId: rule.title,
            drugA: candidateDrug,
            drugB: existing,
            severity: rule.severity,
            title: rule.title,
            clinicalMechanism: rule.clinicalMechanism,
            recommendedAction: rule.recommendedAction,
          });
        }
      }
    }
  }

  return detected;
}
