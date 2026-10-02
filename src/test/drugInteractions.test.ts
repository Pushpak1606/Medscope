import { describe, it, expect } from "vitest";
import { checkDrugInteractions } from "@/lib/drugInteractions";

describe("Drug-Drug Interaction Engine (Section 4.4, TC-D04)", () => {
  it("detects Severe interaction between Aspirin and Ibuprofen", () => {
    const conflicts = checkDrugInteractions("Aspirin 81mg", ["Ibuprofen 400mg"]);
    expect(conflicts.length).toBeGreaterThan(0);
    const aspirinNsaid = conflicts.find((c) =>
      c.drugA.toLowerCase().includes("aspirin") || c.drugB.toLowerCase().includes("aspirin")
    );
    expect(aspirinNsaid).toBeDefined();
    expect(aspirinNsaid?.severity).toBe("Severe");
    expect(aspirinNsaid?.clinicalMechanism).toContain("bleeding");
  });

  it("detects Severe interaction between Escitalopram (SSRI) and Tramadol", () => {
    const conflicts = checkDrugInteractions("Escitalopram 10mg", ["Tramadol 50mg"]);
    expect(conflicts.length).toBeGreaterThan(0);
    const ssriConflict = conflicts.find((c) => c.severity === "Severe");
    expect(ssriConflict).toBeDefined();
    expect(ssriConflict?.clinicalMechanism).toContain("Serotonin");
  });

  it("detects Severe hyperkalemia risk between Lisinopril and Spironolactone", () => {
    const conflicts = checkDrugInteractions("Lisinopril 20mg", ["Spironolactone 25mg"]);
    expect(conflicts.length).toBeGreaterThan(0);
    const aceConflict = conflicts.find((c) =>
      c.clinicalMechanism.toLowerCase().includes("hyperkalemia")
    );
    expect(aceConflict).toBeDefined();
  });

  it("returns empty array for compatible, non-interacting medications", () => {
    const conflicts = checkDrugInteractions("Paracetamol 500mg", [
      "Cetirizine 10mg",
      "Vitamin D3 1000IU",
    ]);
    expect(conflicts).toHaveLength(0);
  });

  it("is case-insensitive and extracts drug roots from dosages", () => {
    const conflicts = checkDrugInteractions("ibuprofen", ["ASPIRIN"]);
    expect(conflicts.length).toBeGreaterThan(0);
  });
});
