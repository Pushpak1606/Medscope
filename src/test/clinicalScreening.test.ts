import { describe, it, expect } from "vitest";
import {
  evaluatePHQ9,
  evaluateGAD7,
  evaluatePSS10,
  PHQ9_QUESTIONS,
  GAD7_QUESTIONS,
  PSS10_QUESTIONS,
} from "@/lib/clinicalScreening";

describe("Clinical Mental Health Screening Engine (FR-05, Microservice 3)", () => {
  describe("PHQ-9 Depression Screener", () => {
    it("correctly scores zero when all items are 0", () => {
      const answers: Record<number, number> = {};
      PHQ9_QUESTIONS.forEach((q) => (answers[q.id] = 0));
      const res = evaluatePHQ9(answers);
      expect(res.score).toBe(0);
      expect(res.severity).toBe("Minimal");
      expect(res.escalationTriggered).toBe(false);
      expect(res.crisisAlert).toBe(false);
    });

    it("correctly identifies severe depression when all items are 3", () => {
      const answers: Record<number, number> = {};
      PHQ9_QUESTIONS.forEach((q) => (answers[q.id] = 3));
      const res = evaluatePHQ9(answers);
      expect(res.score).toBe(27);
      expect(res.severity).toBe("Severe");
      expect(res.escalationTriggered).toBe(true);
      expect(res.crisisAlert).toBe(true);
    });

    it("triggers crisis alert if Question 9 is positive (>= 1) even with low total score", () => {
      const answers: Record<number, number> = {};
      PHQ9_QUESTIONS.forEach((q) => (answers[q.id] = 0));
      answers[9] = 1;
      const res = evaluatePHQ9(answers);
      expect(res.score).toBe(1);
      expect(res.crisisAlert).toBe(true);
      expect(res.escalationTriggered).toBe(true);
    });

    it("correctly classifies moderate depression (score 10-14)", () => {
      const answers: Record<number, number> = {
        1: 1, 2: 1, 3: 1, 4: 1, 5: 2, 6: 2, 7: 2, 8: 1, 9: 0,
      }; // Sum = 11
      const res = evaluatePHQ9(answers);
      expect(res.score).toBe(11);
      expect(res.severity).toBe("Moderate");
      expect(res.escalationTriggered).toBe(true);
      expect(res.crisisAlert).toBe(false);
    });
  });

  describe("GAD-7 Anxiety Screener", () => {
    it("correctly classifies minimal anxiety for score < 5", () => {
      const answers: Record<number, number> = {
        1: 0, 2: 1, 3: 0, 4: 1, 5: 0, 6: 0, 7: 0,
      }; // Sum = 2
      const res = evaluateGAD7(answers);
      expect(res.score).toBe(2);
      expect(res.severity).toBe("Minimal");
      expect(res.escalationTriggered).toBe(false);
    });

    it("correctly classifies mild anxiety for score 5-9", () => {
      const answers: Record<number, number> = {
        1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1,
      }; // Sum = 7
      const res = evaluateGAD7(answers);
      expect(res.score).toBe(7);
      expect(res.severity).toBe("Mild");
      expect(res.escalationTriggered).toBe(false);
    });

    it("correctly flags clinical threshold for score >= 10", () => {
      const answers: Record<number, number> = {
        1: 2, 2: 2, 3: 2, 4: 2, 5: 1, 6: 1, 7: 1,
      }; // Sum = 11
      const res = evaluateGAD7(answers);
      expect(res.score).toBe(11);
      expect(res.severity).toBe("Moderate");
      expect(res.escalationTriggered).toBe(true);
    });
  });

  describe("PSS-10 Perceived Stress Scale", () => {
    it("correctly applies reverse scoring on positive coping items 4, 5, 7, 8", () => {
      // If a user selects 0 for all items, positive coping items (4, 5, 7, 8) invert to 4
      const answers: Record<number, number> = {};
      PSS10_QUESTIONS.forEach((q) => (answers[q.id] = 0));
      const res = evaluatePSS10(answers);
      // Items 1, 2, 3, 6, 9, 10 are 0.
      // Items 4, 5, 7, 8 invert from 0 -> 4.
      // Total = 4 * 4 = 16.
      expect(res.score).toBe(16);
      expect(res.severity).toBe("Moderate");
    });

    it("scores 0 when negative items are 0 and positive items are 4 (inverted to 0)", () => {
      const answers: Record<number, number> = {
        1: 0, 2: 0, 3: 0, 4: 4, 5: 4, 6: 0, 7: 4, 8: 4, 9: 0, 10: 0,
      };
      const res = evaluatePSS10(answers);
      expect(res.score).toBe(0);
      expect(res.severity).toBe("Minimal");
    });

    it("classifies high stress when total score is >= 27", () => {
      const highStressAnswers: Record<number, number> = {
        1: 4, 2: 4, 3: 4, 4: 0, 5: 0, 6: 4, 7: 0, 8: 0, 9: 4, 10: 4,
      };
      // 6 * 4 = 24 negative items + 4 * 4 = 16 inverted positive items = 40
      const res = evaluatePSS10(highStressAnswers);
      expect(res.score).toBe(40);
      expect(res.severity).toBe("Severe");
      expect(res.escalationTriggered).toBe(true);
    });
  });
});
