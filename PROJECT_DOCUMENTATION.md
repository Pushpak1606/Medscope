# 🏥 Medscope — AI-Powered Healthcare Platform

> **Smarter care for patients and doctors.**
> AI medicine assistance, live consultations, mental health support, and smart health tracking — all in one premium platform built for modern healthcare.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture Overview](#architecture-overview)
4. [Folder Structure](#folder-structure)
5. [User Flow](#user-flow)
6. [Feature Breakdown](#feature-breakdown)
7. [UI/UX Psychology & Design Principles](#uiux-psychology--design-principles)
8. [Design System & Theming](#design-system--theming)
9. [State Management](#state-management)
10. [Security](#security)
11. [SEO & Performance](#seo--performance)
12. [Third-Party Integrations](#third-party-integrations)
13. [Routing Map](#routing-map)
14. [Testing](#testing)
15. [Getting Started](#getting-started)

---

## 🧭 Project Overview

**Medscope** is a premium, AI-powered healthcare web application designed to serve **both patients and doctors**. The platform provides intelligent medicine analysis via prescription scanning, live multi-modal consultations (video, audio, chat, clinic), mental wellness tracking, smart reminders, health records management, and an emergency services system.

The application features a **fully responsive, dark/light themed** interface with modern glassmorphism aesthetics, smooth Framer Motion animations, and a "bento box" dashboard layout that adapts elegantly across mobile, tablet, and desktop viewports.

### Key Highlights:
- 🤖 **AI-Powered Tools** — Prescription scanning (Scan Rx), AI health assistant (Ask AI)
- 📹 **Multi-Modal Consultations** — Video, Audio, Chat, and In-Clinic appointment booking
- 🧠 **Mental Wellness** — Mood logging, wellness tracking, and stress management
- ⏰ **Smart Reminders** — Medicine, meals, water, appointments, and wellness reminders with snooze/edit/delete
- 📊 **Health Dashboard** — Bento-grid layout with configurable, drag-and-drop widgets
- 🔐 **AES-256 Encrypted Storage** — All client-side health data is encrypted at rest
- 🌗 **Dark/Light Theme** — HSL-based design tokens with smooth theme transitions
- 📱 **Mobile-First** — Bottom navigation dock, responsive breakpoints, touch-optimized UI

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React 18 | Component-based UI library |
| **Language** | TypeScript | Static type safety across entire codebase |
| **Build Tool** | Vite 5 (SWC) | Blazing-fast HMR and production builds |
| **Routing** | React Router DOM v6 | Client-side SPA routing with 20+ routes |
| **Styling** | TailwindCSS 3 | Utility-first CSS with custom design tokens |
| **UI Components** | ShadCN/UI (Radix Primitives) | 58+ accessible, headless UI components |
| **Animations** | Framer Motion | Page transitions, stagger reveals, micro-interactions |
| **3D Graphics** | Three.js + Spline | Interactive 3D hero visuals and backgrounds |
| **Charts** | Recharts | Health progress data visualization |
| **Forms** | React Hook Form + Zod | Type-safe form validation with schema-based parsing |
| **State** | React Context API | Global state for patient profile, reminders, consultations |
| **Encryption** | CryptoJS (AES) | Client-side encryption of health data (PHI) |
| **Icons** | Lucide React | 460+ open-source icons |
| **Toasts** | Sonner | Elegant, stacked toast notifications |
| **Date Handling** | date-fns | Lightweight date manipulation and formatting |
| **Server State** | TanStack React Query | Async state management and caching |
| **Testing** | Vitest + Playwright | Unit tests (Vitest) and E2E browser tests (Playwright) |
| **Linting** | ESLint 9 | Code quality and consistency enforcement |
| **Fonts** | Satoshi (headings) + Inter (body) | Premium, modern typography via Fontshare & Google Fonts |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   index.html                    │
│            (SEO meta, OG tags, fonts)           │
└───────────────────────┬─────────────────────────┘
                        │
                   src/main.tsx
                        │
                    src/App.tsx
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   Providers         Router        Global UI
   ├─ QueryClient   ├─ /           ├─ Toaster
   ├─ ThemeProvider  ├─ /auth/*    ├─ Sonner
   ├─ PatientCtx     ├─ /patient/* ├─ ScrollToTop
   └─ ConsultCtx     ├─ /doctor/*  └─ GlobalCommand
                     └─ /*  (404)
```

### Provider Hierarchy:
```
QueryClientProvider
  └─ ThemeProvider (dark/light)
      └─ TooltipProvider
          └─ BrowserRouter
              └─ ScrollToTop
                  └─ PatientProvider (profile, reminders, widgets)
                      └─ ConsultationProvider (doctors, bookings)
                          └─ <Routes />
```

---

## 📂 Folder Structure

```
medscope/
├── public/                           # Static assets
│   ├── favicon.ico
│   ├── medscope-favicon.svg
│   ├── placeholder.svg
│   └── robots.txt
│
├── src/
│   ├── main.tsx                      # React DOM entry point
│   ├── App.tsx                       # Root component, all routes & providers
│   ├── index.css                     # Design tokens (HSL vars), global styles
│   ├── App.css                       # Additional app-level styles
│   ├── vite-env.d.ts                 # Vite type declarations
│   │
│   ├── context/                      # Global state management
│   │   ├── PatientContext.tsx         # Patient profile, reminders, widget config
│   │   └── ConsultationContext.tsx    # Doctors, bookings, consultations
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-mobile.tsx            # Responsive breakpoint detection
│   │   └── use-toast.ts              # Toast notification hook
│   │
│   ├── lib/                          # Utility libraries
│   │   ├── secureStorage.ts          # AES-256 encrypted localStorage wrapper
│   │   └── utils.ts                  # Tailwind `cn()` class merger
│   │
│   ├── pages/                        # Route-level page components
│   │   ├── Index.tsx                  # Landing page (marketing site)
│   │   ├── NotFound.tsx              # 404 catch-all page
│   │   │
│   │   ├── auth/                     # Authentication pages
│   │   │   ├── SelectRole.tsx        # Patient vs Doctor role selection
│   │   │   ├── PatientLogin.tsx      # Patient login form
│   │   │   ├── PatientSignup.tsx     # Patient registration (multi-field)
│   │   │   ├── DoctorLogin.tsx       # Doctor login form
│   │   │   └── DoctorSignup.tsx      # Doctor registration
│   │   │
│   │   ├── patient/                  # Patient portal pages
│   │   │   ├── OnboardingPage.tsx    # 5-step patient onboarding wizard
│   │   │   ├── PatientDashboard.tsx  # Main bento-grid dashboard
│   │   │   ├── PatientProfile.tsx    # View profile page
│   │   │   ├── EditProfile.tsx       # Edit profile form
│   │   │   ├── PatientSettings.tsx   # Full settings panel (notifications, privacy, etc.)
│   │   │   ├── ScanRxPage.tsx        # AI prescription scanner
│   │   │   ├── AskAIPage.tsx         # AI health assistant chat
│   │   │   ├── LogMoodPage.tsx       # Daily mood & wellness tracker
│   │   │   ├── EmergencyPage.tsx     # Emergency services & contacts
│   │   │   ├── RecordsPage.tsx       # Health records management
│   │   │   ├── RemindersPage.tsx     # Full reminders system (CRUD + snooze)
│   │   │   └── ConsultationsPage.tsx # Book, manage, and review consultations
│   │   │
│   │   └── doctor/                   # Doctor portal
│   │       └── DoctorOnboardingPage.tsx  # 5-step doctor onboarding wizard
│   │
│   ├── components/                   # Shared & feature components
│   │   ├── ScrollToTop.tsx           # Auto-scroll on route change
│   │   ├── NavLink.tsx               # Active-aware navigation link
│   │   ├── theme-provider.tsx        # Dark/light theme context provider
│   │   ├── theme-toggle.tsx          # Theme toggle button (sun/moon)
│   │   │
│   │   ├── auth/                     # Auth-specific components
│   │   │   ├── AuthLayout.tsx        # Split-screen auth layout shell
│   │   │   └── FeaturePanel.tsx      # Auth page feature showcase panel
│   │   │
│   │   ├── landing/                  # Landing page sections
│   │   │   ├── Hero.tsx              # Hero with floating cards & 3D grid
│   │   │   ├── CoreValue.tsx         # Core value proposition section
│   │   │   ├── FeatureCards.tsx      # Feature highlights grid
│   │   │   ├── PatientShowcase.tsx   # Patient experience showcase
│   │   │   ├── DoctorShowcase.tsx    # Doctor experience showcase
│   │   │   ├── HowItWorks.tsx       # Step-by-step process
│   │   │   ├── AIInsight.tsx         # AI capabilities deep-dive
│   │   │   ├── FAQ.tsx              # Frequently asked questions
│   │   │   ├── FinalCTA.tsx         # Final call-to-action banner
│   │   │   ├── Footer.tsx           # Site-wide footer
│   │   │   └── Navbar.tsx           # Top navigation bar
│   │   │
│   │   ├── onboarding/              # Patient onboarding steps
│   │   │   ├── StepBasicProfile.tsx  # Name, age, gender, etc.
│   │   │   ├── StepHealthInfo.tsx    # Conditions, medications, allergies
│   │   │   ├── StepLifestyle.tsx     # Activity, diet, sleep, stress
│   │   │   ├── StepEmergency.tsx     # Emergency contacts & preferences
│   │   │   └── StepReview.tsx        # Review & confirm onboarding data
│   │   │
│   │   ├── doctor-onboarding/       # Doctor onboarding steps
│   │   │   ├── DocStepPersonal.tsx   # Personal information
│   │   │   ├── DocStepQualifications.tsx  # Degrees, certifications
│   │   │   ├── DocStepAvailability.tsx    # Schedule & availability
│   │   │   ├── DocStepConsultation.tsx    # Consultation preferences
│   │   │   └── DocStepReview.tsx          # Review & submit
│   │   │
│   │   ├── patient-dashboard/       # Dashboard components
│   │   │   ├── DashboardHeader.tsx   # Top bar (search, profile, notifications)
│   │   │   ├── GlobalSearch.tsx      # ⌘K command palette search
│   │   │   ├── HeroOverview.tsx      # Dashboard hero summary
│   │   │   ├── MobileNavDock.tsx     # Bottom mobile navigation dock
│   │   │   ├── NotificationPanel.tsx # Notification dropdown panel
│   │   │   │
│   │   │   ├── widgets/             # Dashboard bento-grid widgets
│   │   │   │   ├── HealthOverviewWidget.tsx   # Master health overview card
│   │   │   │   ├── QuickActionsWidget.tsx     # Smart action shortcuts
│   │   │   │   ├── DailyTasksWidget.tsx       # Daily task timeline
│   │   │   │   ├── ConsultationWidget.tsx     # Upcoming consultation card
│   │   │   │   ├── MentalWellnessWidget.tsx   # Wellness tracker widget
│   │   │   │   ├── HealthProgressWidget.tsx   # Health score progress
│   │   │   │   ├── MedicineTimerWidget.tsx    # Next medicine countdown
│   │   │   │   ├── MedicineWidget.tsx         # Medicine list overview
│   │   │   │   ├── AccordionInfoWidget.tsx    # Expandable info sections
│   │   │   │   ├── CommunityWidget.tsx        # Community engagement card
│   │   │   │   └── ProfileSnapshotWidget.tsx  # Quick profile overview
│   │   │   │
│   │   │   └── shared/              # Dashboard shared components
│   │   │       ├── GlassCard.tsx     # Glassmorphism card wrapper
│   │   │       ├── LiquidGlassButton.tsx  # Liquid glass effect button
│   │   │       ├── PageHeader.tsx    # Reusable page header
│   │   │       └── PatientPageLayout.tsx  # Patient page layout shell
│   │   │
│   │   └── ui/                      # 58 ShadCN/Radix UI primitives
│   │       ├── MedscopeLogo.tsx      # Custom SVG brand logo
│   │       ├── animated-background.tsx  # Dynamic gradient background
│   │       ├── button.tsx            # Button with CVA variants
│   │       ├── card.tsx              # Card compound component
│   │       ├── dialog.tsx            # Modal dialog
│   │       ├── rainbow-button.tsx    # Animated rainbow gradient CTA button
│   │       ├── tubelight-navbar.tsx  # Animated "tubelight" navbar
│   │       ├── glowing-effect.tsx    # Glow border effect
│   │       ├── global-command.tsx    # ⌘K command palette
│   │       ├── the-infinite-grid.tsx # Infinite dot-grid background
│   │       ├── web-gl-shader.tsx     # WebGL shader background
│   │       ├── emergency-fab.tsx     # Emergency floating action button
│   │       ├── sidebar.tsx           # Multi-state sidebar
│   │       └── ... (45 more Radix-based components)
│   │
│   └── test/                        # Test files
│
├── index.html                       # HTML entry with SEO meta & OG tags
├── vite.config.ts                   # Vite configuration
├── tailwind.config.ts               # Tailwind design system config
├── tsconfig.json                    # TypeScript configuration
├── components.json                  # ShadCN CLI component config
├── vitest.config.ts                 # Vitest test runner config
├── playwright.config.ts             # Playwright E2E config
├── postcss.config.js                # PostCSS + Autoprefixer
└── eslint.config.js                 # ESLint 9 flat config
```

---

## 🚶 User Flow

### 1. Landing Page Experience
```
[Visit /] → Hero Section → Core Values → Feature Cards → Patient Showcase
         → Doctor Showcase → How It Works → AI Insight → FAQ → CTA → Footer
```

### 2. Authentication Flow
```
[Landing] → "Get Started" / "Log In"
         → /auth/select-role (Choose: Patient or Doctor)
         │
         ├─ Patient Path:
         │   ├─ /patient/login (Email + Password)
         │   └─ /patient/signup (Full registration form)
         │       └─ /patient/onboarding (5-step wizard)
         │           ├─ Step 1: Basic Profile (name, age, gender, city, blood group)
         │           ├─ Step 2: Health Info (conditions, medications, allergies, surgeries)
         │           ├─ Step 3: Lifestyle (activity, sleep, stress, diet, habits)
         │           ├─ Step 4: Emergency Contacts & Preferences
         │           └─ Step 5: Review & Confirm → Dashboard
         │
         └─ Doctor Path:
             ├─ /doctor/login
             └─ /doctor/signup
                 └─ /doctor/onboarding (5-step wizard)
                     ├─ Step 1: Personal Information
                     ├─ Step 2: Qualifications & Certifications
                     ├─ Step 3: Availability & Schedule
                     ├─ Step 4: Consultation Preferences
                     └─ Step 5: Review & Submit
```

### 3. Patient Dashboard Flow
```
/patient/dashboard
├── Health Overview (Master Widget — vitals, score, streaks)
├── Quick Actions → Scan Rx | Ask AI | Log Mood | Emergency | Records | Reminders
├── Daily Tasks Timeline (real-time reminders — mark done / snooze)
├── Consultation Widget (upcoming, join video call)
├── Mental Wellness Widget (mood trends, meditation suggestions)
├── Health Progress Widget (score charts via Recharts)
└── Accordion Info Widget (tips, community activity)

Side navigations:
├── /patient/profile → View full profile
├── /patient/profile/edit → Edit profile details
├── /patient/settings → Notifications, Privacy, Consultation prefs, Font size, Theme
├── /patient/scan-rx → Upload & scan prescriptions w/ AI
├── /patient/ask-ai → Chat with AI health assistant
├── /patient/log-mood → Daily mood tracker (emoji-based)
├── /patient/emergency → Emergency SOS, nearby hospitals, contacts
├── /patient/records → Health records vault
├── /patient/reminders → Full CRUD reminder manager (add/edit/delete/snooze)
└── /patient/consultations → Browse doctors, book, cancel, reschedule, view history
```

---

## ✨ Feature Breakdown

### 🏠 Landing Page
- **Animated Hero** with floating interaction cards (Medication, Doctor, Wellness) using Framer Motion
- **Infinite Grid** background with particle/dot pattern
- **Tubelight Navbar** — Unique animated navbar with glowing active-tab indicator
- **Rainbow CTA Button** — Animated gradient border button for primary actions
- **11 distinct sections** — Hero, Core Values, Features, Patient Showcase, Doctor Showcase, How It Works, AI Insight, FAQ, Final CTA, Footer

### 📊 Patient Dashboard
- **Bento-Grid Layout** — 12-column CSS Grid with responsive column collapsing (xl:12 → md:2 → sm:1)
- **11 Dashboard Widgets** — Each self-contained with its own data, animations, and interactions
- **Animated Background** — Dynamic gradient blobs with `blob-drift` and `blob-spin` keyframes
- **⌘K Command Palette** — Global search via `cmdk` for rapid navigation
- **Mobile Navigation Dock** — iOS-style bottom tab bar for small screens
- **Notification Panel** — Real-time notification dropdown with categorized alerts

### 🔔 Reminders System
- Full **CRUD operations** (Create, Read, Update, Delete) for reminders
- **6 categories**: Medicines, Meals, Water, Appointments, Wellness, and All
- **Snooze** functionality (1-hour bump with AM/PM handling)
- **Status tracking**: Upcoming → Completed / Missed
- Real-time sync with dashboard's `DailyTasksWidget`
- Persistent via AES-encrypted localStorage

### 📹 Consultations
- **4 consultation modes**: Video, Audio, Chat, In-Clinic
- Browse available doctors with ratings and specialties
- **Book, Cancel, Reschedule** appointments with toast feedback
- **Join** live consultation rooms (WebRTC-ready architecture)
- **Past consultation history** with diagnosis notes

### 🤖 AI Features
- **Scan Rx** — Upload prescription images for AI-powered medicine analysis
- **Ask AI** — Chat-style AI health assistant for symptom queries and health advice

### 😌 Mental Wellness
- **Mood Logger** — Emoji-based daily mood tracking
- **Wellness Widget** — Dashboard mood trend visualization
- Stress level tracking integrated into patient profile

### 🚨 Emergency System
- **Emergency SOS Page** — Quick-access emergency services
- **Emergency FAB** (Floating Action Button) — Always-accessible emergency trigger
- **Emergency Contacts** stored in patient profile via onboarding

---

## 🧠 UI/UX Psychology & Design Principles

### 1. **Aesthetic-Usability Effect**
Users perceive aesthetically pleasing designs as more usable. Medscope uses glassmorphism cards, smooth gradients, and subtle glow effects (`glow-primary`, `gradient-border`) to create a premium, trustworthy first impression — critical for a healthcare platform where user trust is paramount.

### 2. **Progressive Disclosure**
Complex health information is hidden behind **accordion widgets** (`AccordionInfoWidget`) and **expandable panels**. The 5-step onboarding wizard reveals fields progressively rather than overwhelming users with a single massive form.

### 3. **Hick's Law (Reducing Choice Overload)**
The **Quick Actions Widget** limits visible actions to 6 primary options (Scan Rx, Ask AI, Log Mood, Emergency, Records, Reminders). The dashboard bento grid uses a clear visual hierarchy — large hero widget at top, secondary actions below — guiding user attention naturally via the **F-pattern reading model**.

### 4. **Fitts's Law (Target Accessibility)**
- Large, finger-friendly touch targets on mobile (minimum 44px)
- **Floating Action Button** for emergency access — always within thumb reach
- **Bottom Navigation Dock** on mobile follows the natural thumb zone
- Oversized CTA buttons (`RainbowButton`, `LiquidGlassButton`) to maximize click target area

### 5. **The Von Restorff Effect (Isolation Effect)**
The most critical actions are visually distinct — the **emergency FAB** uses a red pulsing glow, the **Rainbow Button** on the landing page uses animated gradient borders, and the **health score widget** uses a prominent circular progress indicator.

### 6. **Zeigarnik Effect (Task Completion Drive)**
The **profile completeness percentage** (displayed in the dashboard header) motivates users to complete their profile. The **Daily Tasks Widget** shows a task completion timeline that creates a sense of progression and accomplishment.

### 7. **Serial Position Effect (Primacy & Recency)**
The most important widgets (Health Overview, Quick Actions) are placed **first** in the dashboard. The mobile navigation dock places core actions at the **edges** (easily reachable) and secondary ones in the center.

### 8. **Color Psychology**
| Color | Usage | Psychology |
|---|---|---|
| **Blue** (Primary) | CTAs, links, primary actions | Trust, reliability, medical authority |
| **Green** | Success states, health scores, "Online" badges | Health, safety, growth |
| **Orange** | Medicine reminders, warnings | Urgency, attention without alarm |
| **Red** | Emergency, destructive actions, missed reminders | Immediate attention, urgency |
| **Purple/Violet** | AI features, wellness, premium accents | Intelligence, creativity, premium |
| **Cyan** | Water reminders, info badges | Calm, hydration, freshness |

### 9. **Dark Mode as Default**
The application defaults to **dark mode** (`defaultTheme="dark"`). Dark interfaces are perceived as more premium and modern in healthcare/medical apps. The deep navy/slate dark palette (`224 35% 6%`) avoids pure black (OLED strain) and creates a calm, clinical atmosphere.

### 10. **Gestalt Principles**
- **Proximity**: Dashboard widgets are grouped by function (health metrics left, timeline center, consultations right)
- **Similarity**: Consistent card styling (rounded corners, subtle borders, backdrop blur) creates visual cohesion
- **Common Region**: The `GlassCard` wrapper groups related content within frosted-glass boundaries
- **Continuity**: The bento grid guides the eye in a natural flow from top-left to bottom-right

### 11. **Micro-Animations & Delight**
- Staggered reveal animations on page load (`staggerChildren: 0.15`)
- Float animations on hero cards (`animate-float`, 6s ease-in-out)
- Pulse glow on live indicators (`animate-pulse-glow`)
- Accordion expand/collapse with height transitions
- Smooth page transitions via Framer Motion

### 12. **Accessibility Considerations**
- Global **font scaling** toggle (`font-large` class scales all `rem` units by 110%)
- Hidden scrollbars for cleaner aesthetics while maintaining scroll functionality
- `smooth scroll-behavior` for anchor navigation
- Radix UI primitives provide built-in **ARIA attributes** and keyboard navigation
- High contrast text on both light and dark themes

---

## 🎨 Design System & Theming

### HSL-Based Design Tokens
All colors are defined as HSL values in CSS custom properties (`index.css`), enabling dynamic theming:

| Token | Light Mode | Dark Mode |
|---|---|---|
| `--background` | `210 30% 98%` (off-white) | `224 35% 6%` (deep navy) |
| `--foreground` | `220 30% 12%` (near-black) | `210 30% 96%` (near-white) |
| `--primary` | `220 80% 55%` (vivid blue) | `222 85% 65%` (soft blue) |
| `--card` | `0 0% 100%` (pure white) | `224 30% 10%` (dark slate) |
| `--accent` | `217 60% 94%` (light blue) | `222 40% 18%` (deep blue) |
| `--destructive` | `0 84% 60%` (red) | `0 65% 50%` (muted red) |

### Typography System
- **Headings**: `Satoshi` (Fontshare) — Variable weight 300–900, geometric sans-serif
- **Body Text**: `Inter` (Google Fonts) — Variable weight 300–900, optimized for screens

### Border Radius
Global `--radius: 1.5rem` for a soft, pill-like aesthetic across all components.

### Custom Tailwind Animations
| Animation | Duration | Effect |
|---|---|---|
| `fade-in` | 0.6s | Opacity + translateY entrance |
| `float` | 6s | Gentle up-down floating |
| `pulse-glow` | 4s | Opacity pulsing glow |
| `blob-drift` | 20s | Organic background blob movement |
| `blob-spin-slow` | 30s | Rotational blob animation |
| `rainbow` | Variable | Gradient position animation for rainbow buttons |

### Utility Classes
- `.gradient-text` — Gradient-filled text via `bg-clip-text`
- `.glow-primary` — Box-shadow glow using primary color
- `.grid-overlay` — Radial-gradient dot pattern overlay
- `.gradient-border` — Pseudo-element gradient border effect

---

## 🗃️ State Management

### PatientContext (`PatientContext.tsx`)
Global state for all patient-related data, persisted via AES-encrypted localStorage.

| State | Type | Description |
|---|---|---|
| `profile` | `PatientProfile` | Full patient profile (basic info, health, lifestyle, emergency) |
| `widgetOrder` | `WidgetConfig[]` | Dashboard widget visibility and ordering |
| `reminders` | `Reminder[]` | All user reminders with CRUD + snooze operations |

**Key actions**: `setProfile`, `updateProfile`, `setWidgetOrder`, `addReminder`, `editReminder`, `markReminderDone`, `snoozeReminder`, `deleteReminder`

### ConsultationContext (`ConsultationContext.tsx`)
Global state for consultations and doctor directory.

| State | Type | Description |
|---|---|---|
| `upcomingConsultations` | `Consultation[]` | Scheduled upcoming appointments |
| `pastConsultations` | `Consultation[]` | Historical consultation records |
| `availableDoctors` | `Doctor[]` | Directory of available doctors |

**Key actions**: `bookConsultation`, `cancelConsultation`, `rescheduleConsultation`, `joinConsultation`

---

## 🔐 Security

### AES-256 Encrypted Storage (`secureStorage.ts`)
All client-side health data (PHI — Personal Health Information) is encrypted before being stored in `localStorage`:

- **Encryption**: AES (Advanced Encryption Standard) via CryptoJS
- **Key Management**: Environment variable `VITE_SECURE_STORAGE_KEY` (with dev fallback)
- **Auto-Migration**: Legacy unencrypted or base64-encoded data is automatically migrated to AES on read
- **Fallback Handling**: Graceful error recovery for corrupted storage data

### HTTP Security Headers (via Vite Dev Server)
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

---

## 🔍 SEO & Performance

### SEO
- Descriptive `<title>` and `<meta description>` tags
- OpenGraph (`og:title`, `og:description`, `og:type`, `og:image`) for social sharing
- Twitter Card meta tags
- `robots.txt` for crawler guidance
- Semantic HTML structure with proper heading hierarchy
- Custom SVG favicon (`medscope-favicon.svg`)

### Performance Optimizations
- **Vite SWC Plugin** for ultra-fast TypeScript → JavaScript transpilation
- **Font Preconnect** — Preconnect hints for Google Fonts and Fontshare CDNs
- **Hidden scrollbars** — CSS-only scrollbar hiding (no JS overhead)
- **Font FOUC Prevention** — `initFontSize()` runs synchronously before React mounts
- **HMR Overlay Disabled** — `hmr.overlay: false` for cleaner dev experience

---

## 🔗 Third-Party Integrations

| Package | Integration |
|---|---|
| `@splinetool/react-spline` | 3D Spline scene embedding in hero/backgrounds |
| `three` | WebGL shader-based animated backgrounds |
| `embla-carousel-react` | Touch-optimized carousels for feature showcases |
| `@dnd-kit/core` + `@dnd-kit/sortable` | Drag-and-drop widget reordering on dashboard |
| `react-resizable-panels` | Resizable split-pane layouts |
| `vaul` | Drawer/bottom-sheet component (mobile UI) |
| `cmdk` | ⌘K command palette for global search & navigation |
| `input-otp` | OTP input component for two-factor authentication |
| `crypto-js` | AES encryption for client-side data security |
| `recharts` | Health progress chart visualizations |

---

## 🗺️ Routing Map

| Route | Page | Description |
|---|---|---|
| `/` | `Index` | Marketing landing page |
| `/auth/select-role` | `SelectRole` | Choose Patient or Doctor |
| `/patient/login` | `PatientLogin` | Patient login form |
| `/patient/signup` | `PatientSignup` | Patient registration |
| `/patient/onboarding` | `OnboardingPage` | 5-step patient onboarding |
| `/patient/dashboard` | `PatientDashboard` | Main patient dashboard |
| `/patient/settings` | `PatientSettings` | Comprehensive settings page |
| `/patient/profile` | `PatientProfile` | View patient profile |
| `/patient/profile/edit` | `EditProfile` | Edit patient profile |
| `/patient/scan-rx` | `ScanRxPage` | AI prescription scanner |
| `/patient/ask-ai` | `AskAIPage` | AI health assistant chat |
| `/patient/log-mood` | `LogMoodPage` | Daily mood tracker |
| `/patient/emergency` | `EmergencyPage` | Emergency services & SOS |
| `/patient/records` | `RecordsPage` | Health records vault |
| `/patient/reminders` | `RemindersPage` | Reminders management (CRUD) |
| `/patient/consultations` | `ConsultationsPage` | Consultations hub |
| `/doctor/login` | `DoctorLogin` | Doctor login form |
| `/doctor/signup` | `DoctorSignup` | Doctor registration |
| `/doctor/onboarding` | `DoctorOnboardingPage` | 5-step doctor onboarding |
| `*` | `NotFound` | 404 catch-all page |

---

## 🧪 Testing

### Unit Tests (Vitest)
```bash
npm run test          # Run all unit tests once
npm run test:watch    # Run in watch mode
```

### End-to-End Tests (Playwright)
```bash
npx playwright test   # Run E2E browser tests
```

**Test configuration:**
- Vitest uses `jsdom` environment for DOM simulation
- Playwright configured for cross-browser E2E testing
- Testing Library (`@testing-library/react`) for component-level assertions

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** or **bun** package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/Pushpak1606/Medscope.git
cd medscope

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
| Script | Command | Description |
|---|---|---|
| `dev` | `npm run dev` | Start Vite dev server on port 8080 |
| `build` | `npm run build` | Production build |
| `build:dev` | `npm run build:dev` | Development build |
| `preview` | `npm run preview` | Preview production build |
| `lint` | `npm run lint` | Run ESLint checks |
| `test` | `npm run test` | Run Vitest unit tests |
| `test:watch` | `npm run test:watch` | Vitest watch mode |

### Environment Variables
```env
VITE_SECURE_STORAGE_KEY=your-secret-encryption-key
```

---

## 📊 Project Stats

| Metric | Value |
|---|---|
| **Total Routes** | 20 |
| **Page Components** | 20 |
| **Dashboard Widgets** | 11 |
| **Landing Page Sections** | 11 |
| **UI Primitives** | 58 |
| **Onboarding Steps** | 10 (5 patient + 5 doctor) |
| **Global Contexts** | 2 (Patient + Consultation) |
| **Custom Hooks** | 2 |
| **Custom Animations** | 7 |
| **Reminder Categories** | 6 |
| **Consultation Modes** | 4 |

---

*Built with ❤️ by the Medscope Team*
