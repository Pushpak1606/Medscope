import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { usePatient, DEFAULT_WIDGET_ORDER, WidgetConfig } from "@/context/PatientContext";
import PatientPageLayout from "@/components/patient-dashboard/shared/PatientPageLayout";
import PageHeader from "@/components/patient-dashboard/shared/PageHeader";
import GlassCard from "@/components/patient-dashboard/shared/GlassCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  Bell, Shield, Monitor, MessageSquare, 
  Activity, User, Moon, Sun, Laptop, 
  CheckCircle, ChevronRight, AlertTriangle,
  LayoutGrid, GripVertical, Eye, EyeOff, RotateCcw,
  SlidersHorizontal, Check, X, Save, AlertCircle,
  ChevronUp, ChevronDown
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "appearance", label: "Appearance", icon: Monitor, desc: "Theme & typography preferences" },
  { id: "layout", label: "Dashboard Layout", icon: LayoutGrid, desc: "Drag & drop widget arrangement" },
  { id: "notifications", label: "Notifications", icon: Bell, desc: "Alerts, reminders & delivery channels" },
  { id: "privacy", label: "Privacy & Security", icon: Shield, desc: "2FA, AI analysis & data security" },
  { id: "consultation", label: "Consultation", icon: MessageSquare, desc: "Video modes & doctor preferences" },
  { id: "health", label: "Health Preferences", icon: Activity, desc: "Physical vs mental care focus" },
  { id: "account", label: "Account", icon: User, desc: "Personal info & medical export" },
];

const PatientSettings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { profile, updateProfile, widgetOrder, setWidgetOrder } = usePatient();
  const [activeTab, setActiveTab] = useState("appearance");
  const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Unsaved Changes Navigation Modal state
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingTargetUrl, setPendingTargetUrl] = useState<string | null>(null);

  // Buffered Appearance State
  const [appearanceData, setAppearanceData] = useState({
    theme: theme,
    fontSize: localStorage.getItem("medscope-font-size") || "default"
  });
  
  // Buffered Account State
  const [accountData, setAccountData] = useState({
    fullName: profile.fullName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    city: profile.city || ""
  });

  // Warn user before closing window/tab if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Intercept internal link clicks to warn on unsaved changes
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      if (!isDirty) return;
      const target = (e.target as HTMLElement).closest("a");
      if (target && target.href && !target.href.includes("/patient/settings")) {
        const urlObj = new URL(target.href);
        if (urlObj.origin === window.location.origin) {
          e.preventDefault();
          e.stopPropagation();
          setPendingTargetUrl(urlObj.pathname);
          setShowLeaveModal(true);
        }
      }
    };
    document.addEventListener("click", handleLinkClick, true);
    return () => document.removeEventListener("click", handleLinkClick, true);
  }, [isDirty]);

  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Apply Theme
    setTheme(appearanceData.theme as "light"|"dark"|"system");
    
    // Apply Font Size
    localStorage.setItem("medscope-font-size", appearanceData.fontSize);
    if (appearanceData.fontSize === "large") {
      document.documentElement.classList.add("font-large");
    } else {
      document.documentElement.classList.remove("font-large");
    }

    // Apply Profile & Preferences
    updateProfile({
      fullName: accountData.fullName,
      email: accountData.email,
      phone: accountData.phone,
      city: accountData.city
    });

    setTimeout(() => {
      setIsSaving(false);
      setIsDirty(false);
      setSavedStatus(true);
      toast.success("Settings saved and updated across Medscope!");
      setTimeout(() => setSavedStatus(false), 3000);

      if (pendingTargetUrl) {
        setShowLeaveModal(false);
        navigate(pendingTargetUrl);
        setPendingTargetUrl(null);
      }
    }, 500);
  };

  const handleDiscardAndProceed = () => {
    setIsDirty(false);
    setShowLeaveModal(false);
    toast.info("Unsaved changes discarded.");
    if (pendingTargetUrl) {
      navigate(pendingTargetUrl);
      setPendingTargetUrl(null);
    }
  };

  const updatePrefs = (category: "notifications"| "privacy" | "consultation", key: string, value: any) => {
    markDirty();
    const currentPrefs = profile.preferences!;
    updateProfile({
      preferences: {
        ...currentPrefs,
        [category]: {
          ...currentPrefs[category],
          [key]: value
        }
      }
    });
  };

  const toggleWidgetVisibility = (index: number) => {
    markDirty();
    const newOrder = [...widgetOrder];
    newOrder[index] = { ...newOrder[index], visible: !newOrder[index].visible };
    setWidgetOrder(newOrder);
  };

  const moveWidgetUp = (index: number) => {
    if (index <= 0) return;
    markDirty();
    const updated = arrayMove(widgetOrder, index, index - 1);
    setWidgetOrder(updated);
    toast.success(`Moved "${widgetOrder[index].label}" up!`);
  };

  const moveWidgetDown = (index: number) => {
    if (index >= widgetOrder.length - 1) return;
    markDirty();
    const updated = arrayMove(widgetOrder, index, index + 1);
    setWidgetOrder(updated);
    toast.success(`Moved "${widgetOrder[index].label}" down!`);
  };

  const resetWidgetOrder = () => {
    markDirty();
    setWidgetOrder([...DEFAULT_WIDGET_ORDER]);
    toast.success("Reset layout to default!");
  };

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(MouseSensor, { activationConstraint: { distance: 3 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      markDirty();
      const oldIndex = widgetOrder.findIndex((w) => w.id === active.id);
      const newIndex = widgetOrder.findIndex((w) => w.id === over.id);
      const updated = arrayMove(widgetOrder, oldIndex, newIndex);
      setWidgetOrder(updated);
    }
  };

  const currentTabObj = TABS.find((t) => t.id === activeTab) || TABS[0];
  const ActiveIcon = currentTabObj.icon;

  const RenderSaveSectionBar = () => (
    <div className="pt-6 border-t border-border/40 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        {isDirty ? (
          <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Unsaved Changes</span>
          </span>
        ) : savedStatus ? (
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>All Changes Saved</span>
          </span>
        ) : (
          <span className="text-xs text-muted-foreground font-medium">
            Changes will apply immediately after saving.
          </span>
        )}
      </div>

      <Button
        onClick={handleSave}
        disabled={isSaving}
        className={cn(
          "h-11 px-6 rounded-2xl font-bold text-xs sm:text-sm gap-2 shadow-lg transition-all duration-300",
          isDirty 
            ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 animate-pulse"
            : "bg-primary/90 hover:bg-primary text-primary-foreground"
        )}
      >
        <Save className="w-4 h-4" />
        <span>{isSaving ? "Saving..." : savedStatus ? "Saved!" : "Save Changes"}</span>
      </Button>
    </div>
  );

  return (
    <PatientPageLayout className="w-full">
      <div className="w-full space-y-6 lg:space-y-8 pb-12">
        
        {/* --- PAGE HEADER --- */}
        <PageHeader
          title="Patient Settings"
          subtitle="Customize your portal preferences, theme appearance, and security options."
        >
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="rounded-full shadow-lg shadow-primary/20 bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6 h-10 text-xs sm:text-sm"
          >
            {isSaving ? "Saving..." : savedStatus ? <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-emerald-300" /> Saved!</span> : "Save Changes"}
          </Button>
        </PageHeader>

        {/* --- SETTINGS BURGER MENU NAV BAR --- */}
        <div className="relative z-20 space-y-3">
          <div className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                <ActiveIcon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Current Section
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-foreground flex items-center gap-2">
                  <span>{currentTabObj.label}</span>
                  <span className="hidden sm:inline text-xs text-muted-foreground font-normal">• {currentTabObj.desc}</span>
                </h3>
              </div>
            </div>

            <Button
              onClick={() => setIsBurgerMenuOpen(!isBurgerMenuOpen)}
              variant="outline"
              className={cn(
                "h-10 px-4 rounded-xl border-primary/30 text-primary font-bold text-xs gap-2 transition-all duration-300 shadow-sm",
                isBurgerMenuOpen ? "bg-primary text-primary-foreground border-primary" : "bg-primary/10 hover:bg-primary/20"
              )}
            >
              {isBurgerMenuOpen ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
              <span>{isBurgerMenuOpen ? "Close Menu" : "Sections Menu"}</span>
            </Button>
          </div>

          <AnimatePresence>
            {isBurgerMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="w-full p-4 sm:p-6 rounded-3xl bg-card/75 backdrop-blur-2xl border border-border/60 shadow-2xl space-y-3 relative z-30"
              >
                <div className="flex items-center justify-between px-2 pb-2 border-b border-border/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    <span>Select Settings Section</span>
                  </span>
                  <button 
                    onClick={() => setIsBurgerMenuOpen(false)} 
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground p-1"
                  >
                    Close [✕]
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
                  {TABS.map((tab) => {
                    const TabIcon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsBurgerMenuOpen(false);
                        }}
                        className={cn(
                          "flex items-center gap-3 p-3.5 rounded-2xl text-xs font-bold transition-all text-left border group",
                          isActive
                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-[1.01]"
                            : "bg-card/40 border-border/40 text-foreground/80 hover:bg-card/90 hover:border-primary/40"
                        )}
                      >
                        <div className={cn(
                          "p-2.5 rounded-xl transition-colors",
                          isActive ? "bg-white/20 text-white" : "bg-primary/10 text-primary group-hover:bg-primary/20"
                        )}>
                          <TabIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold truncate">{tab.label}</h4>
                          <p className={cn("text-[10px] truncate font-normal", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>
                            {tab.desc}
                          </p>
                        </div>
                        {isActive && <Check className="w-4 h-4 text-white shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- MAIN SETTINGS CONTENT AREA --- */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Desktop Left Sidebar Tabs */}
          <GlassCard className="hidden md:flex flex-col gap-1.5 w-64 shrink-0 p-3 h-fit bg-card/60 backdrop-blur-xl border-border/50">
            {TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <TabIcon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 truncate">{tab.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
                </button>
              );
            })}
          </GlassCard>

          {/* Right Section Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex-1"
            >
              <GlassCard className="p-6 sm:p-10 bg-card/60 backdrop-blur-xl border-border/50 relative overflow-hidden space-y-8">
                
                <div className="flex items-center justify-between pb-4 border-b border-border/40">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-foreground flex items-center gap-2">
                      <ActiveIcon className="w-6 h-6 text-primary" />
                      <span>{currentTabObj.label}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">{currentTabObj.desc}</p>
                  </div>
                </div>

                <div className="max-w-3xl space-y-8">
                  
                  {/* --- APPEARANCE TAB --- */}
                  {activeTab === "appearance" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base font-bold text-foreground mb-4">Color Theme</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <button 
                            onClick={() => { setAppearanceData({...appearanceData, theme: "light"}); markDirty(); }}
                            className={cn(
                              "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-3",
                              appearanceData.theme === "light" ? "border-primary bg-primary/10 shadow-md" : "border-border/50 hover:border-border bg-card/40"
                            )}
                          >
                            <Sun className={cn("h-7 w-7", appearanceData.theme === "light" ? "text-primary" : "text-muted-foreground")} />
                            <span className="font-bold text-xs">Light Mode</span>
                          </button>
                          <button 
                            onClick={() => { setAppearanceData({...appearanceData, theme: "dark"}); markDirty(); }}
                            className={cn(
                              "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-3",
                              appearanceData.theme === "dark" ? "border-primary bg-primary/10 shadow-md" : "border-border/50 hover:border-border bg-card/40"
                            )}
                          >
                            <Moon className={cn("h-7 w-7", appearanceData.theme === "dark" ? "text-primary" : "text-muted-foreground")} />
                            <span className="font-bold text-xs">Dark Mode (Default)</span>
                          </button>
                          <button 
                            onClick={() => { setAppearanceData({...appearanceData, theme: "system"}); markDirty(); }}
                            className={cn(
                              "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-3",
                              appearanceData.theme === "system" ? "border-primary bg-primary/10 shadow-md" : "border-border/50 hover:border-border bg-card/40"
                            )}
                          >
                            <Laptop className={cn("h-7 w-7", appearanceData.theme === "system" ? "text-primary" : "text-muted-foreground")} />
                            <span className="font-bold text-xs">System Synchronized</span>
                          </button>
                        </div>
                      </div>
                      <Separator className="bg-border/40" />
                      <div>
                        <h3 className="text-base font-bold text-foreground mb-3">Font Scale</h3>
                        <Select 
                          value={appearanceData.fontSize} 
                          onValueChange={(val) => { setAppearanceData({...appearanceData, fontSize: val}); markDirty(); }}
                        >
                          <SelectTrigger className="w-[220px] rounded-xl h-11 bg-card border-border/60 font-semibold text-xs">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-border/50">
                            <SelectItem value="default" className="rounded-lg cursor-pointer">Default (100%)</SelectItem>
                            <SelectItem value="large" className="rounded-lg cursor-pointer">Large (110% Accessibility)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* --- DASHBOARD LAYOUT TAB --- */}
                  {activeTab === "layout" && (
                    <div className="space-y-6">
                      <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-1">
                        <h4 className="font-bold text-xs text-primary flex items-center gap-1.5">
                          <GripVertical className="w-4 h-4" />
                          <span>Drag Handle or Use Up/Down Buttons to Rearrange</span>
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Hold the drag handle or click the Up/Down arrows to reorder dashboard widgets. Toggle the eye icon to show or hide widgets.
                        </p>
                      </div>

                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                      >
                        <SortableContext
                          items={widgetOrder.map((w) => w.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="space-y-3">
                            {widgetOrder.map((widget, index) => (
                              <SortableWidgetItem
                                key={widget.id}
                                widget={widget}
                                index={index}
                                totalCount={widgetOrder.length}
                                onToggleVisibility={() => toggleWidgetVisibility(index)}
                                onMoveUp={() => moveWidgetUp(index)}
                                onMoveDown={() => moveWidgetDown(index)}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>

                      <Separator className="bg-border/40" />

                      <Button
                        variant="outline"
                        onClick={resetWidgetOrder}
                        className="rounded-xl border-border/60 hover:bg-muted font-bold text-xs h-10"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" /> Reset Default Order
                      </Button>
                    </div>
                  )}

                  {/* --- NOTIFICATIONS TAB --- */}
                  {activeTab === "notifications" && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-card/40 border border-border/40">
                          <div className="space-y-0.5">
                            <Label className="text-sm font-bold">Medicine Reminders</Label>
                            <p className="text-xs text-muted-foreground">Alerts when it's time to take prescribed medications.</p>
                          </div>
                          <Switch 
                            checked={profile.preferences?.notifications.medicine}
                            onCheckedChange={(val) => updatePrefs("notifications", "medicine", val)}
                            className="data-[state=checked]:bg-primary" 
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-card/40 border border-border/40">
                          <div className="space-y-0.5">
                            <Label className="text-sm font-bold">Appointment Alerts</Label>
                            <p className="text-xs text-muted-foreground">Notifications prior to live consultations.</p>
                          </div>
                          <Switch 
                            checked={profile.preferences?.notifications.appointments}
                            onCheckedChange={(val) => updatePrefs("notifications", "appointments", val)}
                            className="data-[state=checked]:bg-primary" 
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-card/40 border border-border/40">
                          <div className="space-y-0.5">
                            <Label className="text-sm font-bold">Wellness Recommendations</Label>
                            <p className="text-xs text-muted-foreground">Daily AI suggestions based on your health logs.</p>
                          </div>
                          <Switch 
                            checked={profile.preferences?.notifications.wellness}
                            onCheckedChange={(val) => updatePrefs("notifications", "wellness", val)}
                            className="data-[state=checked]:bg-primary" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- PRIVACY TAB --- */}
                  {activeTab === "privacy" && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Security</h3>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-card/40 border border-border/40">
                          <div className="space-y-0.5">
                            <Label className="text-sm font-bold">Two-Factor Authentication (2FA)</Label>
                            <p className="text-xs text-muted-foreground">Add an extra verification step during login.</p>
                          </div>
                          <Switch 
                            checked={profile.preferences?.privacy.twoFactor}
                            onCheckedChange={(val) => updatePrefs("privacy", "twoFactor", val)}
                            className="data-[state=checked]:bg-primary" 
                          />
                        </div>
                      </div>
                      <Separator className="bg-border/40" />
                      <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5 space-y-3">
                        <h3 className="text-sm font-bold text-red-500 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" /> Danger Zone
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Permanently delete your account and encrypted medical history.
                        </p>
                        <Button variant="destructive" size="sm" className="rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* --- CONSULTATION TAB --- */}
                  {activeTab === "consultation" && (
                    <div className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="font-semibold text-xs">Default Mode</Label>
                          <Select 
                            value={profile.preferences?.consultation.defaultMode}
                            onValueChange={(val) => updatePrefs("consultation", "defaultMode", val)}
                          >
                            <SelectTrigger className="w-full rounded-xl bg-card border-border/60 h-10 text-xs">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="video" className="rounded-lg">Video Call</SelectItem>
                              <SelectItem value="audio" className="rounded-lg">Voice Call</SelectItem>
                              <SelectItem value="chat" className="rounded-lg">Text Chat</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- HEALTH TAB --- */}
                  {activeTab === "health" && (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="font-semibold text-xs">Primary Health Focus</Label>
                        <Select 
                          value={profile.healthFocus || "both"}
                          onValueChange={(val) => { updateProfile({ healthFocus: val }); markDirty(); }}
                        >
                          <SelectTrigger className="w-full sm:w-[260px] rounded-xl bg-card border-border/60 h-10 text-xs">
                            <SelectValue placeholder="Select focus" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="physical" className="rounded-lg">Physical Care</SelectItem>
                            <SelectItem value="mental" className="rounded-lg">Mental Wellness</SelectItem>
                            <SelectItem value="both" className="rounded-lg">Balanced (Both)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {/* --- ACCOUNT TAB --- */}
                  {activeTab === "account" && (
                    <div className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label className="font-semibold text-xs">Full Name</Label>
                          <Input 
                            value={accountData.fullName} 
                            onChange={(e) => { setAccountData({...accountData, fullName: e.target.value}); markDirty(); }}
                            className="bg-card rounded-xl h-10 text-xs" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-semibold text-xs">Email Address</Label>
                          <Input 
                            value={accountData.email} 
                            onChange={(e) => { setAccountData({...accountData, email: e.target.value}); markDirty(); }}
                            className="bg-card rounded-xl h-10 text-xs" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-semibold text-xs">Phone</Label>
                          <Input 
                            value={accountData.phone} 
                            onChange={(e) => { setAccountData({...accountData, phone: e.target.value}); markDirty(); }}
                            className="bg-card rounded-xl h-10 text-xs" 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="font-semibold text-xs">City</Label>
                          <Input 
                            value={accountData.city} 
                            onChange={(e) => { setAccountData({...accountData, city: e.target.value}); markDirty(); }}
                            className="bg-card rounded-xl h-10 text-xs" 
                          />
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                <RenderSaveSectionBar />

              </GlassCard>
            </motion.div>
          </AnimatePresence>

        </div>

      </div>

      {/* --- UNSAVED CHANGES CONFIRMATION MODAL DIALOG --- */}
      <Dialog open={showLeaveModal} onOpenChange={setShowLeaveModal}>
        <DialogContent className="sm:max-w-[440px] rounded-3xl bg-card/95 backdrop-blur-2xl border-border/60 shadow-2xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2 text-amber-400">
              <AlertCircle className="w-5 h-5" />
              <span>Unsaved Changes</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              You have modified settings that haven't been saved yet. Would you like to save your changes before leaving this page?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleDiscardAndProceed}
              className="rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10 font-bold text-xs h-10"
            >
              Discard Changes
            </Button>
            <Button
              onClick={handleSave}
              className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-10 gap-1.5 shadow-md shadow-primary/20"
            >
              <Save className="w-4 h-4" />
              <span>Save & Proceed</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PatientPageLayout>
  );
};

interface SortableItemProps {
  widget: WidgetConfig;
  index: number;
  totalCount: number;
  onToggleVisibility: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const SortableWidgetItem = ({ widget, index, totalCount, onToggleVisibility, onMoveUp, onMoveDown }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 p-3.5 rounded-2xl border transition-all relative select-none group",
        isDragging 
          ? "bg-primary/20 border-primary shadow-2xl scale-[1.02] z-50 ring-2 ring-primary/40 text-primary" 
          : widget.visible 
            ? "bg-card/60 backdrop-blur-md border-border/50 hover:border-primary/40 hover:bg-card/90" 
            : "bg-muted/10 border-border/30 opacity-60"
      )}
    >
      {/* Explicit Drag Handle */}
      <button
        type="button"
        aria-label="Drag to reorder"
        className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-muted/80 text-muted-foreground hover:text-primary transition-colors shrink-0 touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Position Badge */}
      <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
        {index + 1}
      </div>

      {/* Widget Label */}
      <span className={cn("flex-1 font-bold text-xs truncate", widget.visible ? "text-foreground" : "text-muted-foreground")}>
        {widget.label}
      </span>

      {/* Direct Action Controls: Up, Down, Visibility */}
      <div className="flex items-center gap-1 ml-auto shrink-0">
        <Button
          variant="ghost"
          size="icon"
          disabled={index === 0}
          title="Move Up"
          className="h-7 w-7 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary disabled:opacity-30"
          onClick={onMoveUp}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          disabled={index === totalCount - 1}
          title="Move Down"
          className="h-7 w-7 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary disabled:opacity-30"
          onClick={onMoveDown}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          title={widget.visible ? "Hide widget" : "Show widget"}
          className={cn("h-7 w-7 rounded-lg", widget.visible ? "hover:bg-red-500/10 text-foreground" : "hover:bg-green-500/10 text-muted-foreground")}
          onClick={onToggleVisibility}
        >
          {widget.visible ? <Eye className="h-4 w-4 text-emerald-400" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
        </Button>
      </div>
    </div>
  );
};

export default PatientSettings;
