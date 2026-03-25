import { useState, useRef } from "react";
import { toast } from "sonner";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import LiquidGlassButton from "@/components/patient-dashboard/shared/LiquidGlassButton";
import { FileHeart, FileText, FlaskConical, Download, Eye, UploadCloud, Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

type RecordType = "All" | "Prescriptions" | "Lab Reports" | "Scans";

const RECORDS = [
  { id: 1, name: "Complete Blood Count (CBC)", date: "Oct 15, 2023", size: "2.4 MB", type: "Lab Reports", icon: FlaskConical, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 2, name: "Cardiologist Prescription", date: "Sep 28, 2023", size: "1.1 MB", type: "Prescriptions", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: 3, name: "Chest X-Ray HD", date: "Aug 12, 2023", size: "14.5 MB", type: "Scans", icon: FileHeart, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: 4, name: "Vitamin D Assessment", date: "Jul 05, 2023", size: "1.8 MB", type: "Lab Reports", icon: FlaskConical, color: "text-blue-500", bg: "bg-blue-500/10" },
];

const FILTER_TAGS: RecordType[] = ["All", "Prescriptions", "Lab Reports", "Scans"];

const RecordsPage = () => {
  const [activeFilter, setActiveFilter] = useState<RecordType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -150 : 150,
        behavior: "smooth"
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      toast.success("File uploaded successfully", {
        description: `${e.target.files[0].name} has been securely added to your records.`,
      });
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const filteredRecords = RECORDS.filter((record) => {
    const matchesFilter = activeFilter === "All" || record.type === activeFilter;
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <PatientPageLayout className="pb-32">
      <PageHeader
        title="Health Records"
        subtitle="Securely access, upload, and manage your prescriptions, medical reports, and scans in one place."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        
        {/* Main Content: File List & Flters */}
        <div className="lg:col-span-8 flex flex-col gap-6 order-2 lg:order-1">
          
          <GlassCard className="p-4 sm:p-6 flex flex-col gap-4">
            {/* Search and Filter Row */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-border/60 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Horizontal scrollable tags for mobile */}
              <div className="relative group w-full sm:w-[calc(100%-18rem)] md:w-auto">
                {/* Left Arrow */}
                <button 
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity -ml-3 sm:-ml-2"
                >
                  <ChevronLeft className="h-3 w-3" />
                </button>

                <div 
                  ref={scrollContainerRef}
                  className="flex overflow-x-auto w-full gap-2 py-1 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 px-4 sm:mx-0 sm:px-0 snap-x"
                >
                  {FILTER_TAGS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setActiveFilter(tag)}
                      className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all snap-start ${
                        activeFilter === tag 
                          ? "bg-primary text-primary-foreground shadow-sm scale-105" 
                          : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Right Arrow */}
                <button 
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm flex items-center justify-center text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity -mr-3 sm:-mr-2"
                >
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Records List */}
            <div className="space-y-3 mt-2">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <div key={record.id} className="group flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center p-4 rounded-2xl bg-muted/20 border border-border/40 hover:bg-muted/40 transition-colors">
                    
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center ${record.bg} ${record.color} border border-border/20 shadow-sm`}>
                        <record.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground mb-1 line-clamp-1">{record.name}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {record.date}</span>
                          <span>•</span>
                          <span>{record.size}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="hidden sm:inline">{record.type}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full sm:w-auto gap-2 justify-end mt-2 sm:mt-0">
                      <LiquidGlassButton variant="secondary" className="px-3 py-2 flex-1 sm:flex-none">
                        <Eye className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">View</span>
                      </LiquidGlassButton>
                      <LiquidGlassButton variant="secondary" className="px-3 py-2 flex-1 sm:flex-none">
                        <Download className="h-4 w-4 sm:mr-2" /> <span className="hidden sm:inline">Download</span>
                      </LiquidGlassButton>
                    </div>

                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center gap-3 py-12 text-muted-foreground/50 border border-dashed rounded-2xl border-border/50">
                  <Search className="h-8 w-8 mb-2" />
                  <p className="text-sm font-bold text-muted-foreground">No records found</p>
                </div>
              )}
            </div>
          </GlassCard>

        </div>

        {/* Right Column: Upload & Storage Stats */}
        <div className="lg:col-span-4 flex flex-col gap-6 order-1 lg:order-2">
          
          <GlassCard variant="highlight" className="p-6 border-primary/20 bg-primary/5 flex flex-col items-center text-center justify-center border-dashed border-2 group cursor-pointer hover:bg-primary/10 transition-colors" onClick={() => fileInputRef.current?.click()}>
            <div className="h-16 w-16 mb-4 rounded-full bg-background flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300 shadow-sm border border-border/50">
              <UploadCloud className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Upload Record</h3>
            <p className="text-sm text-muted-foreground mt-2 mb-6">Select a PDF, JPG, or PNG</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
            />
            <LiquidGlassButton className="w-full" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
              Browse Files
            </LiquidGlassButton>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-bold text-lg font-heading text-foreground mb-4">Storage Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-foreground">Total Files</span>
                  <span className="text-muted-foreground">14 Used</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-primary/80 h-2 rounded-full w-[45%]" />
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-border/50 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xl font-extrabold text-foreground">4<span className="text-xs text-muted-foreground ml-1">Docs</span></p>
                  <p className="text-xs font-bold text-emerald-500 uppercase tracking-wider mt-1 flex items-center gap-1"><FileText className="h-3 w-3"/> Prescriptions</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-foreground">10<span className="text-xs text-muted-foreground ml-1">Docs</span></p>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mt-1 flex items-center gap-1"><FlaskConical className="h-3 w-3"/> Lab Reports</p>
                </div>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>
    </PatientPageLayout>
  );
};

export default RecordsPage;
