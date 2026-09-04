import { parse, format, addMinutes, isBefore, isEqual } from "date-fns";

export interface DoctorAvailabilityConfig {
  availableDays?: string[];
  availableFrom?: string; // e.g. "10:00" or "08:00 AM"
  availableUntil?: string; // e.g. "17:00" or "04:00 PM"
  consultationDuration?: number; // e.g. 15, 30, 45, 60 minutes
  maxPatientsPerDay?: number; // e.g. 20
}

export interface ExistingAppointmentSlot {
  startTime: string; // e.g. "10:00 AM" or "10:00"
  status?: string;
}

export interface GeneratedSlot {
  time: string; // "10:00 AM"
  available: boolean;
  reason?: string;
}

// Convert "10:00", "10:00 AM", "04:00 PM" to Date object on a reference day
const parseTimeString = (timeStr: string): Date => {
  const clean = timeStr.trim();
  const baseDate = new Date(2026, 0, 1); // reference base date

  if (clean.includes("AM") || clean.includes("PM")) {
    return parse(clean, "hh:mm a", baseDate);
  } else if (clean.includes(":")) {
    const parts = clean.split(":");
    const hours = parseInt(parts[0], 10) || 0;
    const mins = parseInt(parts[1], 10) || 0;
    const d = new Date(baseDate);
    d.setHours(hours, mins, 0, 0);
    return d;
  }
  return baseDate;
};

// Standardize time string format for comparison ("10:00 AM")
export const normalizeTimeFormat = (timeStr: string): string => {
  try {
    const parsed = parseTimeString(timeStr);
    return format(parsed, "hh:mm a");
  } catch {
    return timeStr;
  }
};

/**
 * Dynamically generates consultation time slots for a doctor on a specific target date
 */
export const generateAvailableSlots = (
  date: Date | string,
  config: DoctorAvailabilityConfig,
  existingAppointments: ExistingAppointmentSlot[] = []
): GeneratedSlot[] => {
  const targetDate = typeof date === "string" ? new Date(date) : date;
  
  // 1. Check if the doctor works on the selected day of the week
  const dayName = format(targetDate, "EEEE"); // e.g. "Monday"
  const activeDays = config.availableDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  const isDayAvailable = activeDays.some(
    d => d.toLowerCase() === dayName.toLowerCase()
  );

  if (!isDayAvailable) {
    return [];
  }

  // 2. Check if daily patient limit is reached
  const validAppointments = existingAppointments.filter(
    app => app.status !== "cancelled"
  );
  const maxLimit = config.maxPatientsPerDay || 20;

  if (validAppointments.length >= maxLimit) {
    return [];
  }

  // 3. Calculate time slots
  const fromStr = config.availableFrom || "09:00 AM";
  const untilStr = config.availableUntil || "05:00 PM";
  const durationMinutes = config.consultationDuration || 30;

  const startTime = parseTimeString(fromStr);
  const endTime = parseTimeString(untilStr);

  // Normalize booked times
  const bookedSet = new Set(
    validAppointments.map(app => normalizeTimeFormat(app.startTime))
  );

  const slots: GeneratedSlot[] = [];
  let currentTime = startTime;

  while (isBefore(currentTime, endTime)) {
    const nextTime = addMinutes(currentTime, durationMinutes);
    if (isBefore(endTime, nextTime) && !isEqual(currentTime, endTime)) {
      // Slot exceeds available end time
      break;
    }

    const slotFormatted = format(currentTime, "hh:mm a");
    const isBooked = bookedSet.has(slotFormatted);

    slots.push({
      time: slotFormatted,
      available: !isBooked,
      reason: isBooked ? "Booked" : undefined
    });

    currentTime = nextTime;
  }

  return slots;
};
