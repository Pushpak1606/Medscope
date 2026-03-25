import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { usePatient, DEFAULT_WIDGET_ORDER, WidgetConfig } from "@/context/PatientContext";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
  LayoutGrid, GripVertical, Eye, EyeOff, RotateCcw
} from "lucide-react";

import AnimatedBackground from "@/components/ui/animated-background";
import DashboardHeader from "@/components/patient-dashboard/DashboardHeader";
import MobileNavDock from "@/components/patient-dashboard/MobileNavDock";

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

const TABS = [
  { id: "appearance", label: "Appearance", icon: Monitor },
  { id: "layout", label: "Dashboard Layout", icon: LayoutGrid },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "consultation", label: "Consultation", icon: MessageSquare },
  { id: "health", label: "Health Preferences", icon: Activity },
  { id: "account", label: "Account", icon: User },
];

const PatientSettings = () => {
  const { theme, setTheme } = useTheme();
  const { profile, widgetOrder, setWidgetOrder } = usePatient();
  const [activeTab, setActiveTab] = useState("appearance");
  const [isSaving, setIsSaving] = useState(false);
  const [savedStatus, setSavedStatus] = useState(false);

  const displayName = profile.fullName?.split(" ")[0] || "Patient";

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSavedStatus(true);
      setTimeout(() => setSavedStatus(false), 3000);
    }, 1000);
  };

  // Widget reorder helpers
  const toggleWidgetVisibility = (index: number) => {
    const newOrder = [...widgetOrder];
    newOrder[index] = { ...newOrder[index], visible: !newOrder[index].visible };
    setWidgetOrder(newOrder);
  };

  const resetWidgetOrder = () => {
    setWidgetOrder([...DEFAULT_WIDGET_ORDER]);
  };

  // Drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = widgetOrder.findIndex((w) => w.id === active.id);
      const newIndex = widgetOrder.findIndex((w) => w.id === over.id);
      setWidgetOrder(arrayMove(widgetOrder, oldIndex, newIndex));
    }
  };

  return (
    <div className="min-h-screen bg-surface relative flex justify-center pb-24 sm:pb-8 overflow-x-hidden">
      <AnimatedBackground variant="patient" className="opacity-30 fixed inset-0 pointer-events-none" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      <div className="relative z-10 w-full max-w-[1400px] flex flex-col px-4 sm:px-8 py-8 md:py-10 min-h-screen gap-8">
        <DashboardHeader profile={{ name: displayName, profileCompleteness: profile.profileCompleteness }} />

        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-extrabold font-heading text-foreground tracking-tight mb-2">Settings</h1>
          <p className="text-muted-foreground font-medium">Manage your portal preferences and account settings.</p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8 mt-4">
          
          {/* Settings Sidebar Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-64 shrink-0 overflow-x-auto pb-2 md:pb-0 hide-scrollbar"
          >
            <div className="flex md:flex-col gap-2 min-w-max md:min-w-0">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === tab.id 
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {activeTab === tab.id && <ChevronRight className="h-4 w-4 ml-auto hidden md:block opacity-50" />}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Settings Content Area */}
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 bg-card/80 backdrop-blur-xl border border-border/50 rounded-[2rem] p-6 sm:p-10 shadow-sm relative overflow-hidden"
          >
            {/* Top Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-20 bg-primary/10 blur-[50px] pointer-events-none"></div>

            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
              <h2 className="text-2xl font-bold font-heading text-foreground">
                {TABS.find(t => t.id === activeTab)?.label}
              </h2>
              
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="rounded-xl shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-6"
              >
                {isSaving ? "Saving..." : savedStatus ? <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" /> Saved</span> : "Save Changes"}
              </Button>
            </div>

            <div className="max-w-3xl space-y-8 pb-10">
              
              {/* --- APPEARANCE TAB --- */}
              {activeTab === "appearance" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4">Theme</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button 
                        onClick={() => setTheme("light")}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-3 ${theme === "light" ? "border-primary bg-primary/5" : "border-border/50 hover:border-border bg-background"}`}
                      >
                        <Sun className={`h-8 w-8 ${theme === "light" ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="font-semibold text-sm">Light</span>
                      </button>
                      <button 
                         onClick={() => setTheme("dark")}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-3 ${theme === "dark" ? "border-primary bg-primary/5" : "border-border/50 hover:border-border bg-background"}`}
                      >
                        <Moon className={`h-8 w-8 ${theme === "dark" ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="font-semibold text-sm">Dark</span>
                      </button>
                      <button 
                        onClick={() => setTheme("system")}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-3 ${theme === "system" ? "border-primary bg-primary/5" : "border-border/50 hover:border-border bg-background"}`}
                      >
                        <Laptop className={`h-8 w-8 ${theme === "system" ? "text-primary" : "text-muted-foreground"}`} />
                        <span className="font-semibold text-sm">System</span>
                      </button>
                    </div>
                  </div>
                  <Separator className="bg-border/50" />
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-4">Font Size</h3>
                    <Select defaultValue="default">
                      <SelectTrigger className="w-[200px] rounded-xl h-11 bg-background">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="default" className="rounded-lg">Default</SelectItem>
                        <SelectItem value="large" className="rounded-lg">Large (Accessibility)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* --- DASHBOARD LAYOUT TAB --- */}
              {activeTab === "layout" && (
                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Drag widgets to rearrange your dashboard layout. Toggle the eye icon to show/hide a widget. Changes are applied instantly.
                  </p>

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
                            onToggleVisibility={() => toggleWidgetVisibility(index)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>

                  <Separator className="bg-border/50" />

                  <Button
                    variant="outline"
                    onClick={resetWidgetOrder}
                    className="rounded-xl border-border/60 hover:bg-muted font-bold h-11"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset to Default Layout
                  </Button>
                </div>
              )}

              {/* --- NOTIFICATIONS TAB --- */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold">Medicine Reminders</Label>
                        <p className="text-sm text-muted-foreground">Receive alerts when it's time to take your medication.</p>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold">Appointment Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified before upcoming consultations.</p>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold">Wellness Tips</Label>
                        <p className="text-sm text-muted-foreground">Daily AI-generated advice based on your profile.</p>
                      </div>
                      <Switch className="data-[state=checked]:bg-primary" />
                    </div>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Delivery Methods</h3>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-bold">Email Notifications</Label>
                      <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-bold">SMS Notifications</Label>
                      <Switch className="data-[state=checked]:bg-primary" />
                    </div>
                  </div>
                </div>
              )}

              {/* --- PRIVACY TAB --- */}
              {activeTab === "privacy" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Security</h3>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold">Two-Factor Authentication (2FA)</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                      </div>
                      <Switch className="data-[state=checked]:bg-primary" />
                    </div>
                    <Button variant="outline" className="rounded-xl border-border/60 hover:bg-muted font-bold h-11">
                      Change Password
                    </Button>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Data Privacy</h3>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                      <div className="space-y-0.5">
                        <Label className="text-base font-bold">AI Health Suggestions</Label>
                        <p className="text-sm text-muted-foreground">Allow Medscope AI to analyze your data securely to provide insights.</p>
                      </div>
                      <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                    </div>
                  </div>
                  <Separator className="bg-border/50" />
                  <div className="space-y-4 pt-2">
                    <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
                      <h3 className="text-lg font-bold text-red-500 flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5" /> Danger Zone
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Permanently delete your account and all associated health data. This action cannot be undone.
                      </p>
                      <Button variant="destructive" className="rounded-xl font-bold bg-red-600 hover:bg-red-700">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* --- CONSULTATION TAB --- */}
              {activeTab === "consultation" && (
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="font-semibold text-foreground">Default Consultation Mode</Label>
                      <Select defaultValue="video">
                        <SelectTrigger className="w-full rounded-xl bg-background border-border/60 h-11">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="video" className="rounded-lg">Video Call</SelectItem>
                          <SelectItem value="audio" className="rounded-lg">Voice Call</SelectItem>
                          <SelectItem value="chat" className="rounded-lg">Text Chat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold text-foreground">Reminder Timing</Label>
                      <Select defaultValue="15">
                        <SelectTrigger className="w-full rounded-xl bg-background border-border/60 h-11">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="5" className="rounded-lg">5 minutes before</SelectItem>
                          <SelectItem value="15" className="rounded-lg">15 minutes before</SelectItem>
                          <SelectItem value="30" className="rounded-lg">30 minutes before</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold text-foreground">Preferred Doctor Gender</Label>
                      <Select defaultValue="any">
                        <SelectTrigger className="w-full rounded-xl bg-background border-border/60 h-11">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="any" className="rounded-lg">No Preference</SelectItem>
                          <SelectItem value="female" className="rounded-lg">Female</SelectItem>
                          <SelectItem value="male" className="rounded-lg">Male</SelectItem>
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
                    <Label className="font-semibold text-foreground">Current Health Focus</Label>
                    <Select defaultValue={profile.healthFocus || "both"}>
                      <SelectTrigger className="w-full sm:w-[300px] rounded-xl bg-background border-border/60 h-11">
                        <SelectValue placeholder="Select focus" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="physical" className="rounded-lg">Physical Care</SelectItem>
                        <SelectItem value="mental" className="rounded-lg">Mental Wellness</SelectItem>
                        <SelectItem value="both" className="rounded-lg">Balanced (Both)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground mt-1">This determines how your dashboard is automatically organized.</p>
                  </div>
                </div>
              )}

              {/* --- ACCOUNT TAB --- */}
              {activeTab === "account" && (
                <div className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="font-semibold">Full Name</Label>
                      <Input defaultValue={profile.fullName || ""} className="bg-background rounded-xl h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Email Address</Label>
                      <Input defaultValue={profile.email || ""} className="bg-background rounded-xl h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Phone Number</Label>
                      <Input defaultValue={profile.phone || ""} className="bg-background rounded-xl h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">City</Label>
                      <Input defaultValue={profile.city || ""} className="bg-background rounded-xl h-11" />
                    </div>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Data Export</h3>
                    <Button variant="outline" className="rounded-xl border-border/60 hover:bg-muted font-bold h-11">
                      Download My Medical Records (PDF)
                    </Button>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="pt-4">
                    <Button variant="outline" className="w-full sm:w-auto px-8 rounded-xl border-border/60 hover:bg-muted text-foreground font-bold h-12 flex items-center gap-2">
                       <LogOut className="h-4 w-4" /> Sign Out
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      </div>

      <MobileNavDock />
    </div>
  );
};

// Quick helper icon for signout
const LogOut = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
)

interface SortableItemProps {
  widget: WidgetConfig;
  index: number;
  onToggleVisibility: () => void;
}

const SortableWidgetItem = ({ widget, index, onToggleVisibility }: SortableItemProps) => {
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
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 rounded-2xl border transition-colors relative ${
        isDragging ? "bg-muted/50 border-primary/50 shadow-md" : 
        widget.visible 
          ? "bg-muted/30 border-border/50" 
          : "bg-muted/10 border-border/30 opacity-60"
      }`}
    >
      {/* Drag handle */}
      <button
        type="button"
        aria-label="Drag to reorder widget"
        className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-1 -ml-2 rounded-md hover:bg-muted/50 transition-colors"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Position number */}
      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
        {index + 1}
      </div>

      {/* Widget name */}
      <span className={`flex-1 font-semibold text-sm ${widget.visible ? "text-foreground" : "text-muted-foreground"}`}>
        {widget.label}
      </span>

      {/* Controls */}
      <div className="flex items-center gap-1.5 ml-auto relative z-10 pointer-events-auto">
        <Button
          variant="ghost"
          size="icon"
          aria-label={widget.visible ? "Hide widget" : "Show widget"}
          onPointerDown={(e) => e.stopPropagation()}
          className={`h-8 w-8 rounded-lg ${widget.visible ? "hover:bg-red-500/10 text-foreground" : "hover:bg-green-500/10 text-muted-foreground"}`}
          onClick={onToggleVisibility}
        >
          {widget.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default PatientSettings;
