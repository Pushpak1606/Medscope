import { describe, it, expect } from "vitest";
import {
  matchSpecialtiesForProblem,
  scoreDoctorForProblem,
  findDoctorsForProblem,
  SPECIALTY_KEYWORDS,
} from "@/lib/doctorMatching";

const DIRECTORY = [
  {
    uid: "d1",
    fullName: "Dr. Sarah Jenkins",
    specialization: "Cardiology",
    subSpecialization: "Interventional Cardiology",
    professionalBio: "Board-certified cardiologist, preventive cardiology.",
    areasOfExpertise: ["Heart Disease", "Hypertension", "Lipid Disorders"],
    consultationFocusAreas: ["Preventive Care"],
  },
  {
    uid: "d2",
    fullName: "Dr. Mike Ross",
    specialization: "General Practice",
    subSpecialization: "Family Medicine",
    professionalBio: "Dedicated primary care physician focusing on holistic wellness.",
    areasOfExpertise: ["General Health", "Diabetes", "Routine Checks"],
    consultationFocusAreas: ["Chronic Care"],
  },
  {
    uid: "d3",
    fullName: "Dr. Anita Sharma",
    specialization: "Psychiatry",
    subSpecialization: "Anxiety & Mood Disorders",
    professionalBio: "Psychiatrist treating depression, anxiety, panic disorder, and chronic stress.",
    areasOfExpertise: ["Anxiety", "Depression", "Panic Disorder"],
    consultationFocusAreas: ["Stress Management"],
  },
  {
    uid: "d4",
    fullName: "Dr. Robert Fox",
    specialization: "Orthopedics",
    subSpecialization: "Sports Medicine",
    professionalBio: "Orthopedic surgeon treating joint pain, fractures, and sports injuries.",
    areasOfExpertise: ["Joint Pain", "Sports Injury", "Fracture Care"],
    consultationFocusAreas: ["Knee & Shoulder Rehab"],
  },
];

describe("matchSpecialtiesForProblem", () => {
  it("maps chest pain to Cardiology first", () => {
    const matches = matchSpecialtiesForProblem("I get chest pain while climbing stairs");
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].specialty).toBe("Cardiology");
  });

  it("maps anxiety language to Psychiatry", () => {
    const matches = matchSpecialtiesForProblem("I feel anxious all the time and cannot sleep");
    expect(matches[0].specialty).toBe("Psychiatry");
  });

  it("maps high blood sugar to Endocrinology", () => {
    const matches = matchSpecialtiesForProblem("my blood sugar is always high");
    expect(matches[0].specialty).toBe("Endocrinology");
  });

  it("maps knee pain to Orthopedics", () => {
    const matches = matchSpecialtiesForProblem("knee pain after running");
    expect(matches[0].specialty).toBe("Orthopedics");
  });

  it("returns empty for blank or unrelated input", () => {
    expect(matchSpecialtiesForProblem("")).toEqual([]);
    expect(matchSpecialtiesForProblem("   ")).toEqual([]);
  });

  it("caps results at the requested limit", () => {
    expect(matchSpecialtiesForProblem("chest pain", 1).length).toBeLessThanOrEqual(1);
  });

  it("covers every specialty in the keyword table", () => {
    expect(Object.keys(SPECIALTY_KEYWORDS).length).toBeGreaterThanOrEqual(15);
  });
});

describe("scoreDoctorForProblem", () => {
  it("scores an exact-specialty cardiologist highest for chest pain", () => {
    const cardio = scoreDoctorForProblem(DIRECTORY[0], "chest pain");
    const gp = scoreDoctorForProblem(DIRECTORY[1], "chest pain");
    const ortho = scoreDoctorForProblem(DIRECTORY[3], "chest pain");
    expect(cardio).toBeGreaterThan(0);
    expect(cardio).toBeGreaterThan(gp);
    expect(cardio).toBeGreaterThan(ortho);
  });

  it("scores psychiatrist highest for anxiety", () => {
    const psych = scoreDoctorForProblem(DIRECTORY[2], "anxiety and panic attacks");
    const cardio = scoreDoctorForProblem(DIRECTORY[0], "anxiety and panic attacks");
    expect(psych).toBeGreaterThan(cardio);
  });

  it("returns 0 for blank problems", () => {
    expect(scoreDoctorForProblem(DIRECTORY[0], "")).toBe(0);
  });
});

describe("findDoctorsForProblem", () => {
  it("returns only matching doctors, sorted by relevance", () => {
    const results = findDoctorsForProblem(DIRECTORY, "anxiety and stress", 6);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].uid).toBe("d3");
  });

  it("respects the result limit", () => {
    const results = findDoctorsForProblem(DIRECTORY, "pain", 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it("returns an empty list for blank input", () => {
    expect(findDoctorsForProblem(DIRECTORY, "")).toEqual([]);
  });

  it("falls back to text overlap when no specialty keyword hits", () => {
    const results = findDoctorsForProblem(DIRECTORY, "lipid");
    expect(results.some((d) => d.uid === "d1")).toBe(true);
  });
});
