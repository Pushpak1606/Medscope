import React, { useState, useMemo } from "react";
import DoctorLayout from "@/components/doctor-dashboard/DoctorLayout";
import DoctorPageContainer from "@/components/doctor-dashboard/DoctorPageContainer";
import PageTransition from "@/components/doctor-dashboard/PageTransition";

import DirectoryHero from "@/components/doctor-dashboard/patients-directory/DirectoryHero";
import DirectorySearch from "@/components/doctor-dashboard/patients-directory/DirectorySearch";
import DirectoryFilterChips, { PatientFilterCategory } from "@/components/doctor-dashboard/patients-directory/DirectoryFilterChips";
import RecentlyViewedSection from "@/components/doctor-dashboard/patients-directory/RecentlyViewedSection";
import PatientDirectoryGrid, { MOCK_PATIENT_DIRECTORY, PatientDirectoryCardItem } from "@/components/doctor-dashboard/patients-directory/PatientDirectoryGrid";
import DirectoryEmptyState from "@/components/doctor-dashboard/patients-directory/DirectoryEmptyState";

export const DoctorPatientsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<PatientFilterCategory>("all");

  const filteredPatients = useMemo(() => {
    return MOCK_PATIENT_DIRECTORY.filter((patient) => {
      // Filter by category
      if (activeFilter === "today" && !patient.lastConsultation.includes("Today")) return false;
      if (activeFilter === "critical" && patient.riskLevel !== "HIGH RISK") return false;
      if (activeFilter === "followup" && !patient.nextAppointment) return false;

      // Filter by search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        patient.name.toLowerCase().includes(q) ||
        patient.medicalId.toLowerCase().includes(q) ||
        patient.primaryDiagnosis.toLowerCase().includes(q) ||
        patient.bloodGroup.toLowerCase().includes(q) ||
        patient.phone.includes(q)
      );
    });
  }, [searchQuery, activeFilter]);

  const handleReset = () => {
    setSearchQuery("");
    setActiveFilter("all");
  };

  return (
    <DoctorLayout doctorName="Dr. Sarah Jenkins" specialty="Cardiology & Internal Medicine">
      <DoctorPageContainer maxWidth="wide">
        <PageTransition className="space-y-8">
          
          {/* SECTION 1: PATIENTS HERO */}
          <DirectoryHero />

          {/* SECTION 2: GLOBAL SEARCH */}
          <DirectorySearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectRecent={(term) => setSearchQuery(term)}
          />

          {/* SECTION 3: QUICK FILTERS */}
          <DirectoryFilterChips
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {/* SECTION 4: RECENTLY VIEWED (ONLY SHOWN WHEN NO ACTIVE SEARCH) */}
          {!searchQuery && activeFilter === "all" && <RecentlyViewedSection />}

          {/* SECTION 5: PATIENT DIRECTORY GRID OR EMPTY STATE */}
          {filteredPatients.length > 0 ? (
            <PatientDirectoryGrid patients={filteredPatients} />
          ) : (
            <DirectoryEmptyState searchQuery={searchQuery} onReset={handleReset} />
          )}

        </PageTransition>
      </DoctorPageContainer>
    </DoctorLayout>
  );
};

export default DoctorPatientsPage;
