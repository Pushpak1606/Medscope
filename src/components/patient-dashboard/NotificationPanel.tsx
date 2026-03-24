import { useState } from "react";
import { 
  Bell, CheckCircle, Info, AlertTriangle, X
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface NotificationPanelProps {
  children: React.ReactNode;
}

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Medication Reminder",
    message: "It's time to take your Amoxicillin (500mg).",
    time: "Just now",
    type: "alert",
    read: false,
  },
  {
    id: 2,
    title: "Upcoming Consultation",
    message: "Meeting with Dr. Smith starts in 30 minutes.",
    time: "30m ago",
    type: "info",
    read: false,
  },
  {
    id: 3,
    title: "Journal Entry Logged",
    message: "Your evening journal entry was successfully saved.",
    time: "2h ago",
    type: "success",
    read: true,
  },
];

const NotificationPanel = ({ children }: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismiss = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "alert": return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "success": return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md border-l border-border/50 bg-card/95 backdrop-blur-xl p-0 flex flex-col h-full overflow-hidden [&>button:last-child]:hidden">
        
        {/* Header */}
        <SheetHeader className="p-6 border-b border-border/50 bg-background/50 text-left space-y-0 relative">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold font-heading">
            <div className="relative">
              <Bell className="h-5 w-5 text-foreground" />
              {unreadCount > 0 && <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>}
            </div>
            Notifications
          </SheetTitle>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-60">
              <Bell className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground font-semibold">You're all caught up!</p>
              <p className="text-sm text-muted-foreground">No new notifications right now.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`relative flex gap-4 p-4 rounded-2xl border transition-all ${
                  notification.read 
                    ? "bg-background border-border/30 opacity-70" 
                    : "bg-muted/30 border-primary/20 shadow-sm"
                }`}
              >
                {!notification.read && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-md"></div>}
                
                <div className="shrink-0 mt-0.5">
                  <div className={`p-2 rounded-xl border ${
                    notification.read ? "bg-muted border-border" : "bg-background shadow-xs border-border/60"
                  }`}>
                    {getTypeIcon(notification.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0 pr-6">
                  <h4 className={`text-sm font-bold truncate ${notification.read ? "text-muted-foreground" : "text-foreground"}`}>
                    {notification.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <span className="text-xs font-bold text-muted-foreground opacity-70 mt-3 inline-block">
                    {notification.time}
                  </span>
                </div>

                {/* Dismiss X */}
                <button 
                  onClick={() => dismiss(notification.id)}
                  className="absolute right-3 top-3 p-1.5 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Mark Read hit area (fills empty space if unread) */}
                {!notification.read && (
                  <button 
                    onClick={() => markAsRead(notification.id)}
                    className="absolute inset-0 z-0"
                    aria-label="Mark as read"
                  ></button>
                )}
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationPanel;
