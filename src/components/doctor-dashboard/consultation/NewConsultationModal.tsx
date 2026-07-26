import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useConsultation } from "@/context/ConsultationContext";
import { MOCK_PATIENT_DIRECTORY, PatientDirectoryCardItem } from "@/components/doctor-dashboard/patients-directory/PatientDirectoryGrid";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, UserCheck, Stethoscope, CheckCircle2, Phone, AlertCircle, Sparkles, X } from "lucide-react";
import { motion } from "framer-motion";

export interface NewConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewConsultationModal: React.FC<NewConsultationModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { startNewConsultationSession } = useConsultation();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<PatientDirectoryCardItem | null>(null);

  // Search filter matching: Name, Patient ID, Phone Number, Disease/Diagnosis
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_PATIENT_DIRECTORY;
    const q = searchQuery.toLowerCase().trim();
    return MOCK_PATIENT_DIRECTORY.filter((patient) => {
      return (
        patient.name.toLowerCase().includes(q) ||
        patient.medicalId.toLowerCase().includes(q) ||
        patient.phone.toLowerCase().includes(q) ||
        patient.primaryDiagnosis.toLowerCase().includes(q) ||
        (patient.treatmentStatus && patient.treatmentStatus.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  const handleStartConsultation = () => {
    if (!selectedPatient) return;
    startNewConsultationSession(selectedPatient);
    onClose();
    setSelectedPatient(null);
    setSearchQuery("");
    navigate("/doctor/consultations");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-[2rem] border-border/60 bg-card/95 backdrop-blur-2xl max-w-2xl max-h-[90vh] flex flex-col p-6 sm:p-8 shadow-2xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Stethoscope className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle className="font-heading font-extrabold text-xl text-foreground">
                Start New Consultation
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Select a patient to initialize a live synchronized clinical workspace session.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Patient Search Bar */}
        <div className="relative py-2">
          <Search className="absolute left-3.5 top-5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient by Name, Patient ID (e.g. PAT-101), Phone, or Disease..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 h-11 text-xs rounded-2xl bg-background/60 border-border/60 focus:border-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Selected Patient Banner if chosen */}
        {selectedPatient && (
          <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-between text-xs animate-fade-in">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 rounded-xl border border-primary/30">
                <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedPatient.name}`} alt={selectedPatient.name} />
                <AvatarFallback className="bg-primary/20 text-primary font-bold">PT</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-foreground font-heading">{selectedPatient.name} ({selectedPatient.medicalId})</p>
                <p className="text-[11px] text-primary font-medium">{selectedPatient.primaryDiagnosis}</p>
              </div>
            </div>
            <Badge className="bg-primary text-white font-bold text-[10px] gap-1">
              <CheckCircle2 className="h-3 w-3" /> Selected
            </Badge>
          </div>
        )}

        {/* Patients List Grid / Scrollable Area */}
        <div className="flex-1 overflow-y-auto space-y-3 py-2 pr-1 scrollbar-thin">
          {filteredPatients.length === 0 ? (
            <div className="p-8 text-center space-y-2 border border-dashed border-border/60 rounded-2xl">
              <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm font-semibold text-foreground">No patients matched your query</p>
              <p className="text-xs text-muted-foreground">Try searching by Name, Patient ID, or Phone Number.</p>
            </div>
          ) : (
            filteredPatients.map((patient) => {
              const isSelected = selectedPatient?.id === patient.id;
              return (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-primary/15 border-primary/50 shadow-md shadow-primary/10 ring-2 ring-primary/30"
                      : "bg-card/40 border-border/50 hover:bg-card/80 hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Avatar className="h-11 w-11 rounded-2xl border border-primary/30 shrink-0">
                      <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${patient.name}`} alt={patient.name} />
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">PT</AvatarFallback>
                    </Avatar>

                    <div className="space-y-0.5 truncate">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-foreground font-heading truncate">{patient.name}</h4>
                        <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                          {patient.medicalId}
                        </span>
                      </div>
                      <p className="text-xs text-primary font-medium truncate">{patient.primaryDiagnosis}</p>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-2">
                        <span>{patient.age} yrs • {patient.gender}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {patient.phone}</span>
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        patient.riskLevel === "HIGH RISK"
                          ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                      }`}
                    >
                      {patient.riskLevel}
                    </span>

                    <div
                      className={`h-6 w-6 rounded-full border flex items-center justify-center transition-all ${
                        isSelected ? "bg-primary border-primary text-white" : "border-border/60 bg-background"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="h-4 w-4" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="pt-2 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-medium">
            {selectedPatient ? `Selected: ${selectedPatient.name}` : "Please choose a patient to enable consultation"}
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none rounded-2xl h-11 text-xs font-semibold">
              Cancel
            </Button>

            <Button
              disabled={!selectedPatient}
              onClick={handleStartConsultation}
              className="flex-1 sm:flex-none rounded-2xl bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700 text-white font-bold text-xs h-11 px-6 shadow-xl shadow-primary/20 gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-4 w-4" />
              <span>Start Consultation Room</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewConsultationModal;
