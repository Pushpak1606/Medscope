/**
 * Condition → specialty matcher for "Find doctors for my problem".
 *
 * Patients describe a problem in plain language ("chest pain", "I feel
 * anxious all the time", "sugar is high"). This maps that to the specialties
 * and doctors most likely to treat it. Pure functions only: no Firestore,
 * no React. Tested in src/test/doctorMatching.test.ts.
 */

export interface MatchableDoctor {
  uid: string;
  fullName?: string;
  specialization?: string;
  subSpecialization?: string;
  professionalBio?: string;
  areasOfExpertise?: string[];
  consultationFocusAreas?: string[];
}

export interface SpecialtyMatch {
  specialty: string;
  /** 0-100 confidence used for the match badge. */
  confidence: number;
  matchedTerms: string[];
}

/** healthFocus / conditions chips used by onboarding step 1 & 3. */
export const CONDITION_KEYWORDS: string[] = [
  "heart disease", "hypertension", "blood pressure", "cholesterol", "lipid",
  "chest pain", "palpitations", "cardiac",
  "diabetes", "blood sugar", "thyroid", "obesity", "weight",
  "anxiety", "depression", "stress", "panic", "insomnia", "mental health",
  "migraine", "headache", "epilepsy", "seizure", "dizziness",
  "back pain", "joint pain", "knee pain", "arthritis", "fracture", "sports injury",
  "asthma", "copd", "breathing", "cough", "wheezing", "allergy",
  "acne", "rash", "eczema", "psoriasis", "hair loss", "skin",
  "stomach pain", "acidity", "gas", "ibs", "constipation", "acidity reflux", "gerd",
  "kidney", "urinary", "ut i", "uti",
  "pregnancy", "pcod", "pcos", "menstrual",
  "child health", "immunization", "vaccination", "fever in children",
  "eye", "vision", "cataract",
  "cancer", "tumor", "lump",
];

export const SPECIALTY_KEYWORDS: Record<string, string[]> = {
  "Cardiology": [
    "heart", "cardiac", "chest pain", "palpitation", "hypertension", "blood pressure",
    "cholesterol", "lipid", "blocked artery", "angiography", "stent", "bypass",
  ],
  "General Practice": [
    "fever", "cold", "cough", "flu", "general checkup", "weakness", "fatigue",
    "body ache", "vaccination", "routine check", "tiredness", "infection",
  ],
  "Endocrinology": [
    "diabetes", "blood sugar", "sugar", "thyroid", "obesity", "weight gain",
    "weight loss", "hormone", "pcod", "pcos", "insulin",
  ],
  "Psychiatry": [
    "anxiety", "anxious", "depression", "depressed", "stress", "stressed", "panic", "mental health", "sadness", "sad",
    "sleep problem", "insomnia", "sleep", "mood", "overthinking", "addiction", "ocd", "lonely", "worry",
  ],
  "Neurology": [
    "migraine", "headache", "epilepsy", "seizure", "fits", "dizziness",
    "numbness", "tingling", "memory loss", "stroke", "tremor", "vertigo",
  ],
  "Orthopedics": [
    "back pain", "joint pain", "knee pain", "shoulder pain", "arthritis",
    "fracture", "sprain", "sports injury", "bone", "neck pain", "stiff joint",
  ],
  "Pulmonology": [
    "asthma", "copd", "breathing", "breathless", "wheezing", "chronic cough",
    "smoker cough", "lung",
  ],
  "Dermatology": [
    "acne", "pimple", "rash", "itching", "eczema", "psoriasis", "skin",
    "hair loss", "hair fall", "dandruff", "fungal infection", "pigmentation",
  ],
  "Gastroenterology": [
    "stomach pain", "acidity", "gas", "bloating", "ibs", "constipation",
    "diarrhea", "acid reflux", "gerd", "liver", "jaundice", "vomiting",
  ],
  "Urology": [
    "kidney stone", "urinary", "uti", "urine", "bladder", "prostate",
    "burning urination",
  ],
  "Pediatrics": [
    "child", "children", "baby", "infant", "newborn", "immunization",
    "vaccination", "kid", "toddler",
  ],
  "Gynecology": [
    "pregnancy", "periods", "menstrual", "pcod", "pcos", "ivf",
    "white discharge", "menopause",
  ],
  "Ophthalmology": [
    "eye", "vision", "blurry vision", "cataract", "red eye", "dry eyes",
  ],
  "Oncology": [
    "cancer", "tumor", "lump", "chemotherapy", "malignant", "biopsy",
  ],
  "ENT": [
    "ear", "throat", "tonsil", "sinus", "snoring", "hearing loss",
    "ear pain", "sore throat", "nasal",
  ],
};

/** Normalize a user's free-text problem into lowercase words. */
const tokenize = (problem: string): string[] =>
  (problem || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2);

/**
 * Rank specialties for a plain-language problem.
 * Returns the top `limit` matches sorted by confidence (highest first).
 */
export const matchSpecialtiesForProblem = (problem: string, limit = 3): SpecialtyMatch[] => {
  const normalized = (problem || "").toLowerCase().trim();
  if (!normalized) return [];
  const words = tokenize(normalized);

  const matches: SpecialtyMatch[] = [];
  Object.entries(SPECIALTY_KEYWORDS).forEach(([specialty, keywords]) => {
    const matchedTerms: string[] = [];
    let score = 0;
    keywords.forEach((kw) => {
      if (normalized.includes(kw)) {
        matchedTerms.push(kw);
        score += kw.includes(" ") ? 3 : 2;
      }
    });
    words.forEach((w) => {
      if (specialty.toLowerCase().includes(w)) score += 1;
    });
    if (score > 0) {
      matches.push({
        specialty,
        matchedTerms,
        confidence: Math.min(100, score * 12),
      });
    }
  });

  matches.sort((a, b) => b.confidence - a.confidence);
  return matches.slice(0, limit);
};

/** Build a searchable text blob for a doctor from their profile fields. */
export const doctorSearchText = (doc: MatchableDoctor): string =>
  [
    doc.specialization,
    doc.subSpecialization,
    doc.professionalBio,
    ...(Array.isArray(doc.areasOfExpertise) ? doc.areasOfExpertise : []),
    ...(Array.isArray(doc.consultationFocusAreas) ? doc.consultationFocusAreas : []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

/**
 * Score one doctor against a problem. Returns 0 when unrelated.
 * Specialty hits weigh most, then expertise tags, then bio text.
 */
export const scoreDoctorForProblem = (doctor: MatchableDoctor, problem: string): number => {
  const normalized = (problem || "").toLowerCase().trim();
  if (!normalized) return 0;

  const specialtyMatches = matchSpecialtiesForProblem(normalized, 5);
  const specialty = (doctor.specialization || "").trim();
  let score = 0;
  specialtyMatches.forEach((m) => {
    if (specialty && specialty.toLowerCase() === m.specialty.toLowerCase()) score += 10;
    else if (specialty && specialty.toLowerCase().includes(m.specialty.toLowerCase())) score += 5;
  });

  const text = doctorSearchText(doctor);
  const words = tokenize(normalized);
  words.forEach((w) => {
    if (text.includes(w)) score += 2;
  });

  return score;
};

/**
 * Given a directory and a problem description, return doctors whose
 * profile matches, sorted by relevance.
 */
export const findDoctorsForProblem = <T extends MatchableDoctor>(
  doctors: T[],
  problem: string,
  limit = 6
): T[] => {
  const normalized = (problem || "").toLowerCase().trim();
  if (!normalized) return [];
  const words = tokenize(normalized);

  return doctors
    .map((doc) => {
      let score = scoreDoctorForProblem(doc, normalized);
      const text = doctorSearchText(doc);
      if (score === 0 && text.includes(normalized)) score = 4;
      return { doc, score };
    })
    .filter((entry) => {
      if (entry.score > 0) return true;
      // keep doctors whose expertise words overlap even without keyword table
      const text = doctorSearchText(entry.doc);
      return words.some((w) => text.includes(w));
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.doc);
};
