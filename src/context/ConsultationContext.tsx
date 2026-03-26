import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export type ConsultationType = 'Video' | 'Audio' | 'Chat' | 'Clinic';
export type ConsultationStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  nextSlot: string;
  img: string;
}

export interface Consultation {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: ConsultationType;
  status: ConsultationStatus;
  doctorImg: string;
  diagnosis?: string;
  startsInMins?: number;
}

interface ConsultationContextType {
  upcomingConsultations: Consultation[];
  pastConsultations: Consultation[];
  availableDoctors: Doctor[];
  bookConsultation: (doctorId: string, type: ConsultationType, date: string, time: string) => void;
  cancelConsultation: (consultationId: string) => void;
  rescheduleConsultation: (consultationId: string, newDate: string, newTime: string) => void;
  joinConsultation: (consultationId: string) => void;
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

const INITIAL_DOCTORS: Doctor[] = [
  { id: 'doc-1', name: "Dr. Sarah Jenkins", specialty: "Cardiology", rating: 4.9, nextSlot: "Today, 2:30 PM", img: "SJ" },
  { id: 'doc-2', name: "Dr. Mike Ross", specialty: "General Practice", rating: 4.8, nextSlot: "Tomorrow, 10:00 AM", img: "MR" },
  { id: 'doc-3', name: "Dr. Emily Chen", specialty: "Neurology", rating: 5.0, nextSlot: "Wed, 4:15 PM", img: "EC" },
  { id: 'doc-4', name: "Dr. Robert Fox", specialty: "Orthopedics", rating: 4.7, nextSlot: "Thu, 1:00 PM", img: "RF" },
];

const INITIAL_UPCOMING: Consultation[] = [
  {
    id: 'cons-1',
    doctorId: 'doc-0',
    doctorName: "Dr. Jane Davidson",
    specialty: "Senior Endocrinologist",
    date: "Today, Oct 24",
    time: "10:00 AM",
    type: "Video",
    status: "upcoming",
    doctorImg: "JD",
    startsInMins: 45
  }
];

const INITIAL_PAST: Consultation[] = [
  { id: 'cons-101', doctorId: 'doc-1', doctorName: "Dr. Sarah Jenkins", specialty: "Cardiology", date: "Oct 12, 2026", time: "2:00 PM", type: "Video", status: "completed", doctorImg: "SJ", diagnosis: "Routine Checkup" },
  { id: 'cons-102', doctorId: 'doc-3', doctorName: "Dr. Emily Chen", specialty: "Neurology", date: "Sep 28, 2026", time: "11:30 AM", type: "Audio", status: "completed", doctorImg: "EC", diagnosis: "Migraine Follow-up" },
  { id: 'cons-103', doctorId: 'doc-2', doctorName: "Dr. Mike Ross", specialty: "General Practice", date: "Aug 15, 2026", time: "9:00 AM", type: "Chat", status: "completed", doctorImg: "MR", diagnosis: "Allergy Prescription" },
];

export const ConsultationProvider = ({ children }: { children: ReactNode }) => {
  const [upcomingConsultations, setUpcomingConsultations] = useState<Consultation[]>(INITIAL_UPCOMING);
  const [pastConsultations, setPastConsultations] = useState<Consultation[]>(INITIAL_PAST);
  const [availableDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);

  const bookConsultation = (doctorId: string, type: ConsultationType, date: string, time: string) => {
    const doctor = availableDoctors.find(d => d.id === doctorId);
    if (!doctor) return;

    const newConsultation: Consultation = {
      id: `cons-${Date.now()}`,
      doctorId: doctor.id,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date,
      time,
      type,
      status: 'upcoming',
      doctorImg: doctor.img,
      startsInMins: 120 // mock value
    };

    setUpcomingConsultations(prev => [...prev, newConsultation]);
    toast.success(`Successfully booked ${type} consultation with ${doctor.name}`);
  };

  const cancelConsultation = (consultationId: string) => {
    setUpcomingConsultations(prev => prev.filter(c => c.id !== consultationId));
    toast.success("Consultation cancelled successfully.");
  };

  const rescheduleConsultation = (consultationId: string, newDate: string, newTime: string) => {
    setUpcomingConsultations(prev => 
      prev.map(c => c.id === consultationId ? { ...c, date: newDate, time: newTime } : c)
    );
    toast.success(`Consultation rescheduled to ${newDate} at ${newTime}`);
  };

  const joinConsultation = (consultationId: string) => {
    // In a real app, this would route to a WebRTC video room
    toast.success("Connecting to secure consultation room...");
  };

  return (
    <ConsultationContext.Provider value={{
      upcomingConsultations,
      pastConsultations,
      availableDoctors,
      bookConsultation,
      cancelConsultation,
      rescheduleConsultation,
      joinConsultation
    }}>
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultation = () => {
  const context = useContext(ConsultationContext);
  if (context === undefined) {
    throw new Error('useConsultation must be used within a ConsultationProvider');
  }
  return context;
};
