import { describe, it, expect } from "vitest";
import { runAdherenceSimulation, SYNTHETIC_PATIENTS_DATABASE } from "@/lib/adherenceSimulation";

describe("Medication Adherence Simulation (Chapter 6.1 & Appendix III)", () => {
  it("includes 50 synthetic patient profiles", () => {
    expect(SYNTHETIC_PATIENTS_DATABASE).toHaveLength(50);
  });

  it("distributes patients evenly across 5 cohorts (10 patients each)", () => {
    const counts: Record<string, number> = {};
    SYNTHETIC_PATIENTS_DATABASE.forEach((p) => {
      counts[p.cohort] = (counts[p.cohort] || 0) + 1;
    });

    expect(counts["Hypertension"]).toBe(10);
    expect(counts["Type 2 Diabetes"]).toBe(10);
    expect(counts["Cardiac (Post-ACS)"]).toBe(10);
    expect(counts["Mental Health Comorbid"]).toBe(10);
    expect(counts["Polypharmacy (3+ meds)"]).toBe(10);
  });

  it("yields overall relative improvement within the 30-50% target range", () => {
    const results = runAdherenceSimulation();
    expect(results.overall.baselineAdherence).toBeGreaterThan(45);
    expect(results.overall.simulatedAdherence).toBeGreaterThan(65);
    expect(results.overall.relativeImprovement).toBeGreaterThanOrEqual(30);
    expect(results.overall.relativeImprovement).toBeLessThanOrEqual(50);
  });

  it("generates a 90-day trajectory with 30 timepoints", () => {
    const results = runAdherenceSimulation();
    expect(results.dailyTrajectory.length).toBe(30);
    const lastDay = results.dailyTrajectory[results.dailyTrajectory.length - 1];
    expect(lastDay.day).toBe(90);
    // Medscope adherence exceeds baseline at day 90
    expect(lastDay.medscope).toBeGreaterThan(lastDay.baseline);
  });
});
