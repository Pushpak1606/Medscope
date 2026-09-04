# Medscope: AI-Powered Unified Healthcare & Telemedicine Platform
## Final Year B.Tech Academic Project Report

---

## Project Metadata & Team Details

- **Project Title:** Medscope — Unified Healthcare & Telemedicine Platform
- **Degree:** Bachelor of Technology (B.Tech) in Computer Engineering
- **Academic Year:** 2025–2026
- **Team Members:**
  - **Member 1 (Frontend Architect & UI/UX):** Pushpak Patil
  - **Member 2 (Backend & Database Architect):** Bhavy Dave
  - **Member 3 (System Analysis & API Services):** [Insert Name & Roll No]
  - **Member 4 (QA, Testing & Documentation):** [Insert Name & Roll No]
- **Project Guide / Supervisor:** [Insert Guide Name, Designation]
- **Department:** Department of Computer Engineering
- **Institution:** [Insert College / University Name]

---

## Table of Contents

- **Chapter 1 — Introduction**
  - 1.1 Project Summary
  - 1.2 Purpose
  - 1.3 Scope
- **Chapter 2 — Project Management**
  - 2.1 Project Development Approach and Justification
  - 2.2 Project Plan
  - 2.3 Project Milestones
- **Chapter 3 — System Requirement Study**
  - 3.1 Hardware Requirements
  - 3.2 Software Requirements
- **Chapter 4 — System Analysis**
  - 4.1 Study of Current System
  - 4.2 Problem and Weakness of Current System
  - 4.3 Solution of Weakness
  - 4.4 Data Modelling
  - 4.5 Data Flow Diagram (DFD)
  - 4.6 Use Case Diagram
  - 4.7 Entity-Relationship Diagram (E-R)
- **Chapter 5 — UI/UX Design**
  - 5.1 What is UI/UX Design?
  - 5.2 About Figma
  - 5.3 Websites for UI Design Inspiration
  - 5.4 Wireframing in UI/UX Design
- **Chapter 6 — Coding**
  - 6.1 Front-End Development
  - 6.2 Back-End Development
  - 6.3 Development Environment
- **Chapter 7 — Testing**
- **Chapter 8 — Limitations and Future Motives**
  - 8.1 Limitation
  - 8.2 Future Goals
- **Chapter 9 — References**

---

# Chapter 1 — Introduction

## 1.1 Project Summary
Medscope is a web-based healthcare and telemedicine platform developed to resolve common friction points in personal health monitoring and remote medical consultations. The application is built using React 18 with TypeScript on the frontend and Google Firebase (Authentication and Cloud Firestore) on the backend.

The platform provides dedicated workspaces for two distinct user groups:
- **For Patients:** Medscope offers a centralized health hub centered around a responsive 12-column Bento-Grid dashboard with 11 custom widgets. It includes a 5-step onboarding flow to record medical history and baseline vitals, an emoji-based daily mood tracker, a multi-category reminder vault (medicines, meals, hydration, appointments) with a 1-hour snooze option, an AI-powered prescription scanner (`Scan Rx`), an AI health query assistant (`Ask AI`), an emergency SOS protocol, and an appointment booking module.
- **For Doctors:** The platform provides a professional clinical workspace. Doctors complete a 5-step credential verification onboarding process where they submit their medical registration number, specialization, consultation modes (video, audio, chat, clinic), consultation fee, working hours, and daily patient limit. The doctor portal includes patient queue management, a consultation room interface for recording clinical diagnoses and digital prescriptions, an appointment schedule viewer, and a peer community forum.

All user authentication, profile records, appointment bookings, and access controls are handled through Firebase Authentication and Cloud Firestore, backed by security rules to safeguard sensitive health data.

## 1.2 Purpose
Most consumer health applications available today focus on only one narrow task. A user typically relies on one mobile app to set pill reminders, a separate fitness app to log weight or blood pressure, a messaging app to contact a doctor, and paper files to store prescriptions. This fragmentation leads to two main problems:
1. **Patient non-compliance:** Patients lose track of their schedules and fail to maintain consistent health logs when forced to switch across multiple disconnected tools.
2. **Uninformed consultations:** When a patient books an online consultation, the doctor usually starts with zero context. The doctor spends the first ten minutes asking basic background questions regarding past illnesses, ongoing medications, and allergies instead of focusing on the immediate complaint.

The purpose of Medscope is to eliminate this division by bringing daily wellness tracking and clinical telemedicine into a single connected platform. By giving patients intuitive tools to record their vitals, mood logs, and medications, Medscope allows this data to be organized into pre-consultation clinical summaries. When a consultation begins, the doctor has immediate visibility into the patient's verified health background, leading to faster diagnosis, reduced human error, and more productive appointments.

## 1.3 Scope

### In-Scope (Features Actually Implemented)
- **Role-Based Authentication & Verification:** Independent registration and login flows for patients and doctors using Firebase Authentication, backed by multi-step onboarding wizards that validate medical and personal data.
- **Patient Dashboard & Health Metrics:** A customizable 12-column Bento-Grid interface displaying current health scores, upcoming appointments, countdown timers for the next medication, hydration trackers, and quick-action navigation.
- **Smart Reminders System:** Full CRUD functionality for six reminder categories (Medicines, Meals, Water, Appointments, Wellness, All) with status updates (Upcoming, Completed, Missed) and a 1-hour snooze mechanism.
- **AI-Assisted Patient Tools:** An interactive prescription scanning interface (`Scan Rx`) designed to parse dosage instructions, and a conversational assistant (`Ask AI`) to provide general first-aid guidance and symptom awareness.
- **Mental Wellness Tracking:** Daily emoji-based mood logging, reflective journaling tools, and trend visualization using Recharts.
- **Emergency SOS Response:** An always-visible floating action button (FAB) and dedicated emergency page that exposes emergency contacts, blood group, chronic conditions, and quick-call triggers.
- **Doctor Schedule & Slot Management:** Dynamic calculation of consultation slots based on the doctor's working days, hours, and appointment duration, with conflict detection to prevent overlapping bookings and enforce daily patient caps.
- **Telemedicine Consultation Workspace:** A unified appointment view for managing video, audio, chat, and in-person consultations, complete with diagnosis recording and digital prescription issuance.
- **Data Security:** Cloud Firestore security rules ensuring strict role isolation, plus client-side AES-256 encryption (`CryptoJS`) for local offline caching of personal health information.

### Out-of-Scope (Boundaries & Future Extensions)
- **Direct Hospital EHR/EMR Integration:** The platform does not currently interface directly with legacy hospital database protocols such as HL7 or FHIR. All patient data is maintained within Medscope's Firestore collections.
- **Live Media Streaming Infrastructure:** The video and audio consultation rooms currently provide the UI workspace, status tracking, and notes interface, but do not host an in-house WebRTC Selective Forwarding Unit (SFU) media server (e.g., LiveKit or Twilio Video).
- **Custom-Trained OCR Models:** The prescription scanner uses structured parsing logic and external LLM APIs rather than a custom-trained optical character recognition deep learning model for reading handwritten doctor scripts.
- **Real Financial Transactions:** The consultation booking flow calculates fees and simulates payment confirmations, but does not route real credit card or UPI transactions through a live payment gateway like Razorpay or Stripe.

---

# Chapter 2 — Project Management

## 2.1 Project Development Approach and Justification
For developing Medscope, we chose the **Agile Development Methodology** using an iterative Scrum-based lifecycle. 

Healthcare web applications have tightly coupled components: the patient onboarding directly affects the dashboard, which in turn populates the clinical summary presented to the doctor during an appointment. Using a rigid Waterfall model would have forced us to finalize every database field and UI layout before building anything. This would have caused serious delays when we discovered UX bottlenecks or edge cases in doctor scheduling.

Agile suited our 4-member team because:
1. **Iterative Feature Delivery:** We broke the project into two-week sprints. Sprint 1 delivered authentication and basic layout; Sprint 2 delivered patient onboarding and dashboard widgets; Sprint 3 introduced doctor scheduling and Firestore slot logic; Sprint 4 unified the consultation room and reminders.
2. **Early Discovery of System Bottlenecks:** Developing the doctor booking system incrementally helped us realize early that hardcoding time slots caused double-booking issues. We shifted to an algorithmic slot generator (`slotGenerator.ts`) that runs against Firestore appointment queries in real time.
3. **Parallel Task Execution:** While two team members focused on building React UI components and responsive Bento grids, the other two designed Firestore collections, wrote security rules, and handled form validation schemas using Zod.

## 2.2 Project Plan
The project was executed over a six-month academic timeframe (March 2026 to August 2026). Work was partitioned across five structured phases:

1. **Phase 1: Requirements Analysis & Feasibility Study (Weeks 1–4)**
   - Conducted interviews with college peers and local practitioners to map pain points in current telemedicine portals.
   - Defined system requirements, user personas (chronic illness patient vs. busy consulting doctor), and security constraints for handling medical data.
   - Selected the tech stack (React, Vite, TypeScript, TailwindCSS, Firebase).

2. **Phase 2: Architectural & UI/UX Design (Weeks 5–8)**
   - Drafted low-fidelity wireframes and user interaction flows in Figma.
   - Designed the HSL color palette, dark mode tokens, and glassmorphic card primitives in TailwindCSS.
   - Formulated the Cloud Firestore schema across `users`, `patients`, `doctors`, and `appointments`.

3. **Phase 3: Core Frontend & State Architecture (Weeks 9–14)**
   - Initialized the Vite project and configured client-side routing via React Router DOM.
   - Built the 5-step patient onboarding wizard and the 12-column Bento-grid dashboard.
   - Implemented modular React Context providers (`PatientContext`, `DoctorContext`, `ConsultationContext`, `ChatHistoryContext`).
   - Integrated AES-256 client-side encryption for sensitive health keys stored offline.

4. **Phase 4: Backend Integration & Booking Engine (Weeks 15–20)**
   - Connected Firebase Authentication with role-based routing guards.
   - Implemented Firestore CRUD services for patient profiles, medical reminders, and doctor settings.
   - Built the dynamic appointment slot generation and conflict detection logic.
   - Implemented doctor onboarding, appointment queue views, and the consultation workspace.

5. **Phase 5: Testing, Optimization & Deployment (Weeks 21–24)**
   - Wrote unit tests in Vitest for context reducers, form schemas, and slot generation algorithms.
   - Executed Playwright end-to-end tests for cross-browser registration, onboarding, and appointment booking.
   - Audited responsive layouts across desktop, tablet, and mobile screen viewports.
   - Compiled technical documentation and finalized the academic report.

## 2.3 Project Milestones

| Milestone ID | Milestone Description | Planned Target Date | Actual Completion Date | Key Deliverables |
| :--- | :--- | :--- | :--- | :--- |
| **M1** | Project Proposal & Synopsis Defense | March 25, 2026 | March 24, 2026 | Approved project synopsis, scope document, and software requirement specifications. |
| **M2** | UI Wireframing & Design System | April 18, 2026 | April 16, 2026 | Complete Figma UI kit, dark/light theme tokens, and component structure map. |
| **M3** | Mid-Term Evaluation (Frontend Prototype) | May 20, 2026 | May 18, 2026 | Functional patient dashboard, bento widgets, onboarding wizard, and client-side encryption. |
| **M4** | Backend & Database Integration | June 30, 2026 | July 02, 2026 | Firebase Auth, Cloud Firestore schema, dynamic slot generator, and doctor workspace. |
| **M5** | System Integration & Testing Review | July 28, 2026 | July 26, 2026 | Vitest unit test suites, Playwright E2E test runs, bug fixes, and security rule audits. |
| **M6** | Final Project Defense & Report Submission | August 20, 2026 | August 18, 2026 | Deployed web application, source repository, and complete final year project report. |

---

# Chapter 3 — System Requirement Study

## 3.1 Hardware Requirements

### Development Environment (Client Machine used for coding and testing)
- **Processor:** Intel Core i5 / AMD Ryzen 5 (quad-core, 2.4 GHz or higher)
- **System Memory (RAM):** Minimum 8 GB (16 GB recommended for concurrent Vite dev server and Playwright test executions)
- **Hard Disk Space:** Minimum 20 GB of free solid-state drive (SSD) storage
- **Display Resolution:** 1920 × 1080 pixels (Full HD) for multi-column dashboard layout testing
- **Network Interface:** Active broadband Internet connection (minimum 10 Mbps) for fetching NPM packages and querying Cloud Firestore

### Production / End-User Client Requirements
- **Desktop / Laptop:** Dual-core 1.8 GHz processor or higher, 4 GB RAM, display resolution of 1280 × 720 or higher
- **Mobile Devices:** Android device running Android 9.0+ or iOS device running iOS 14+ with modern mobile browser support (Chrome, Safari)
- **Input Devices:** Keyboard, mouse/trackpad, or touchscreen display; microphone and webcam (optional, required for telemedicine consultations)

## 3.2 Software Requirements

### Operating System Support
- **Development Workstation:** Microsoft Windows 10/11 (64-bit), macOS Monterey or higher, or Ubuntu 22.04 LTS
- **End-User Platform:** Any modern operating system capable of running an updated web browser

### Development Languages & Core Frameworks
- **Runtime Environment:** Node.js (Version 18.18.0 LTS or Version 20+)
- **Package Manager:** NPM (Version 9+) or Bun (Version 1.1+)
- **Language:** TypeScript (Version 5.8.3) with strict mode enabled
- **Core Library:** React (Version 18.3.1) and React DOM
- **Build Tool:** Vite (Version 5.4.19) utilizing `@vitejs/plugin-react-swc` for fast compiler compilation

### Backend & Cloud Infrastructure
- **Database:** Google Cloud Firestore (NoSQL Document Database)
- **Authentication Service:** Google Firebase Authentication (Email/Password provider)
- **Cloud Security:** Firestore Security Rules version 2

### Development & Design Tools
- **Code Editor:** Visual Studio Code / Antigravity IDE with ESLint, Prettier, and Tailwind CSS IntelliSense extensions
- **UI/UX Design Platform:** Figma (Desktop and Web client)
- **Browser Suite for Verification:** Google Chrome (Chromium v120+), Mozilla Firefox, and Apple Safari
- **Testing Tools:** Vitest (v3.2.4) with JSDOM environment, Playwright (v1.57.0) for browser automation

---

# Chapter 4 — System Analysis

## 4.1 Study of Current System
Existing healthcare platforms in the market can be broadly divided into three categories:

1. **Standalone Clinic Booking Platforms (e.g., Practo, Zocdoc):**
   These services excel at directory listing and appointment scheduling. However, they stop at the booking confirmation. They do not provide patients with long-term tools to log medication adherence, monitor daily vitals, or track mental health. Once an appointment ends, the patient's records remain locked inside individual clinic software silos.

2. **Personal Wellness & Fitness Trackers (e.g., Apple Health, Google Fit, MyFitnessPal):**
   These applications allow patients to record steps, sleep, and heart rate. However, they are isolated from real clinical workflows. When a user falls sick and consults a doctor, the doctor has no direct access to this data. The patient must verbally explain their past symptoms, leading to inaccurate medical histories.

3. **General Video Calling Apps (e.g., Zoom, Google Meet, WhatsApp):**
   Many independent doctors conduct teleconsultations over consumer video calling platforms. These apps lack healthcare-specific features: there is no way to verify patient identity, review ongoing prescriptions, check drug interactions, or generate standardized digital prescription notes during the call.

## 4.2 Problem and Weakness of Current System
The analysis of current systems reveals several critical weaknesses:
- **Scattered Patient Records:** Medical data is split across paper files, pharmacy slips, fitness apps, and WhatsApp chats. When emergencies occur, vital data like allergies or blood group is rarely accessible immediately.
- **High Friction in Patient Compliance:** Patients find it tedious to use separate tools for remembering pills, drinking water, and booking visits. As a result, reminder apps are frequently abandoned.
- **Rushed and Unprepared Consultations:** Doctors spend valuable appointment time gathering baseline lifestyle and medical history that should already be organized before the session starts.
- **Double Booking and Scheduling Conflicts:** Many small clinics rely on manual phone calls or static web forms for booking. This results in overlapping slots, overbooked doctors, and long patient waiting times.
- **Lack of Mental Health Integration:** Physical ailments and mental stress are deeply interconnected. Existing medical portals treat them as completely separate problems, ignoring the impact of mood and anxiety on chronic physical conditions.

## 4.3 Solution of Weakness
Medscope solves these problems through an integrated, user-centric architecture:
- **Unified Health Record Hub:** By pairing patient onboarding with ongoing vitals tracking, Medscope compiles a unified profile covering allergies, chronic conditions, emergency contacts, and lifestyle habits into a single Firestore document (`patients/{uid}`).
- **Pre-Consultation Clinical Summaries:** When a patient books an appointment, the doctor's workspace pulls the patient's health snapshot automatically. The doctor enters the call knowing the patient's existing medications, allergies, and recent vital readings.
- **Algorithmic Conflict-Free Booking:** Medscope's `slotGenerator.ts` checks the doctor's defined working hours, consultation duration, and maximum daily patient limit, cross-referencing existing entries in the `appointments` collection to generate only valid, conflict-free booking slots.
- **Holistic Wellness Approach:** The platform places physical reminders and mental wellness tracking (emoji mood logging, journal entries, AI companion) on the same primary dashboard.
- **Rapid Emergency Access:** A persistent floating action button gives patients and emergency responders one-touch access to blood group, emergency contacts, and active chronic conditions without needing to navigate complex menus.

## 4.4 Data Modelling
Medscope uses a NoSQL document-oriented data model implemented in Google Cloud Firestore. Document databases are well suited for healthcare platforms because medical profiles contain nested attributes (such as allergy lists, medication arrays, and varying emergency contact structures) that evolve over time without requiring heavy SQL schema migrations.

The database is structured around four primary collections:

```
Cloud Firestore Root
│
├── users/{uid}
│     ├── uid: string (Primary Key, matches Firebase Auth UID)
│     ├── role: "patient" | "doctor"
│     ├── email: string
│     ├── onboardingCompleted: boolean
│     ├── createdAt: timestamp
│     └── updatedAt: timestamp
│
├── patients/{uid}
│     ├── uid: string (Foreign Key -> users.uid)
│     ├── firstName: string
│     ├── lastName: string
│     ├── phone: string
│     ├── dateOfBirth: string
│     ├── gender: string
│     ├── bloodGroup: string
│     ├── height: string
│     ├── weight: string
│     ├── allergies: array of strings
│     ├── chronicConditions: array of strings
│     ├── emergencyContactName: string
│     ├── emergencyContactPhone: string
│     ├── emergencyContactRelation: string
│     ├── lifestyle: map { activityLevel, sleepHours, stressLevel }
│     └── profileCompleteness: number
│
├── doctors/{uid}
│     ├── uid: string (Foreign Key -> users.uid)
│     ├── firstName: string
│     ├── lastName: string
│     ├── professionalEmail: string
│     ├── phone: string
│     ├── specialization: string
│     ├── qualification: string
│     ├── registrationNumber: string
│     ├── hospital: string
│     ├── experienceYears: number
│     ├── consultationModes: array ["video", "audio", "chat", "clinic"]
│     ├── consultationFee: number
│     ├── consultationDuration: number (minutes: 15, 30, 45, 60)
│     ├── availableDays: array of strings ["Monday", "Tuesday", ...]
│     ├── availableFrom: string ("09:00")
│     ├── availableUntil: string ("17:00")
│     ├── maxPatientsPerDay: number
│     └── isAvailable: boolean
│
└── appointments/{appointmentId}
      ├── appointmentId: string (Auto-generated UUID)
      ├── patientId: string (Foreign Key -> patients.uid)
      ├── doctorId: string (Foreign Key -> doctors.uid)
      ├── patientName: string
      ├── doctorName: string
      ├── date: string (YYYY-MM-DD)
      ├── timeSlot: string ("10:30 AM")
      ├── consultationMode: "video" | "audio" | "chat" | "clinic"
      ├── status: "upcoming" | "completed" | "cancelled"
      ├── symptoms: string
      ├── clinicalNotes: string
      ├── prescription: string
      └── createdAt: timestamp
```

## 4.5 Data Flow Diagram (DFD)

Data Flow Diagrams illustrate how information enters, transforms, and stores within Medscope.

### DFD Level 0 (Context Diagram)
The context-level diagram shows Medscope as a central software entity interacting with two primary external agents: Patients and Doctors.

```
+---------------+                                           +---------------+
|               |  ---- (1) Registration & Vitals Input --->|               |
|               |  ---- (2) Appointment Booking Request --->|               |
|               |  ---- (3) Emergency SOS Trigger --------->|               |
|    PATIENT    |                                           |    MEDSCOPE   |
|               |<---- (4) Dashboard Health Summaries ----- |    HEALTHCARE |
|               |<---- (5) Medication Reminders & Alerts -- |    PLATFORM   |
|               |<---- (6) Confirmed Bookings & Rx ---------|               |
+---------------+                                           +---------------+
                                                                  |   ^
                               (7) Credentials & Schedule Input --|   |
                               (8) Clinical Diagnoses & Notes ----|   |
                                                                  |   |
                               (9) Real-time Patient Queue -------|   |
                              (10) Patient Clinical History -------|   |
                                                                  v   |
                                                            +---------------+
                                                            |               |
                                                            |    DOCTOR     |
                                                            |               |
                                                            +---------------+
```
*(Insert DFD Level 0 Diagram image here — should illustrate external entities Patient and Doctor exchanging data with the central Medscope boundary).*

### DFD Level 1
Level 1 decomposes the platform into core functional subsystems:
1. **1.0 Authentication & Role Verification:** Directs users to the appropriate onboarding flow based on assigned role (`patient` or `doctor`).
2. **2.0 Patient Health & Reminder Management:** Handles profile updates, vitals logging, reminder scheduling, and AES-256 encrypted local caching.
3. **3.0 Doctor Schedule & Workspace Management:** Ingests practice hours, creates valid consultation slots, and serves patient history to the doctor.
4. **4.0 Appointment Booking Engine:** Runs transactional conflict checks against the `appointments` data store.
5. **5.0 Telemedicine & Prescription Module:** Facilitates consultation sessions, saves clinical notes, and outputs digital prescriptions.

*(Insert DFD Level 1 Diagram image here — should show processes 1.0 through 5.0 interacting with Data Stores D1: Users, D2: Patients, D3: Doctors, and D4: Appointments).*

### DFD Level 2 (Appointment Booking Subsystem)
Level 2 zooms into process 4.0:
- **4.1 Query Doctor Availability:** Reads doctor's `availableDays`, `availableFrom`, `availableUntil`, and `consultationDuration` from `doctors/{uid}`.
- **4.2 Fetch Existing Bookings:** Reads all records from `appointments` matching the target doctor and date.
- **4.3 Slot Calculation & Filtering:** Generates time intervals, removes booked slots, and verifies if `count(bookings) < maxPatientsPerDay`.
- **4.4 Transactional Commit:** Writes the confirmed booking document to `appointments` and notifies both patient and doctor state contexts.

*(Insert DFD Level 2 Diagram image here — should depict slot calculation, conflict validation, and transactional write to D4: Appointments).*

## 4.6 Use Case Diagram
The Use Case Diagram defines the behavioral interactions of Medscope.

### Actors
- **Patient:** A registered individual seeking personal health management, reminder assistance, and remote medical consultation.
- **Doctor:** A verified medical practitioner managing appointments, reviewing patient health histories, and conducting consultations.
- **System / Firebase Backend:** The background cloud infrastructure providing authentication, database operations, and security validation.

### Major Use Cases
1. **Patient Use Cases:**
   - Sign up / Sign in via Firebase Auth
   - Complete 5-Step Patient Onboarding
   - View Bento-Grid Health Dashboard
   - Manage Daily Reminders (Create, Snooze, Complete, Delete)
   - Scan Prescription (`Scan Rx`) and Query Symptom Assistant (`Ask AI`)
   - Log Mood & Wellness Journal Entries
   - Trigger Emergency SOS & View Emergency Medical Card
   - Browse Doctors and Book Appointment Slots
   - Attend Consultation & View Digital Prescriptions

2. **Doctor Use Cases:**
   - Register Credentials and Complete Doctor Verification Onboarding
   - Configure Consultation Modes, Fees, and Weekly Availability
   - View Daily Appointment Queue and Patient Schedules
   - Inspect Pre-Consultation Patient Vitals, Conditions, and Allergies
   - Conduct Telemedicine Consultation
   - Enter Clinical Diagnosis Notes and Issue Prescriptions
   - Participate in Peer Case Discussions in Doctor Community

*(Insert Use Case Diagram image here — should display Patient and Doctor actors connected via association lines to oval use cases, with <<include>> relationships for authentication and onboarding).*

## 4.7 Entity-Relationship Diagram (E-R)
The Entity-Relationship Diagram illustrates the entities, attributes, and cardinality relationships governing Medscope's data architecture.

### Entities and Cardinalities
- **USER (1) to PATIENT (1):** One-to-one relationship. Every user with `role == "patient"` possesses exactly one corresponding patient profile record.
- **USER (1) to DOCTOR (1):** One-to-one relationship. Every user with `role == "doctor"` possesses exactly one corresponding doctor profile record.
- **PATIENT (1) to APPOINTMENT (N):** One-to-many relationship. A patient can book multiple appointments over time; an appointment belongs to exactly one patient.
- **DOCTOR (1) to APPOINTMENT (N):** One-to-many relationship. A doctor can accept multiple appointments across different days; an appointment is assigned to exactly one doctor.

```
+--------------------+            1:1            +------------------------+
|       USER         |---------------------------|        PATIENT         |
+--------------------+                           +------------------------+
| PK  uid            |                           | PK,FK1 uid             |
|     role           |                           |        firstName       |
|     email          |                           |        lastName        |
|     onboardingDone |                           |        bloodGroup      |
|     createdAt      |                           |        vitals          |
+--------------------+                           |        allergies       |
          |                                      |        chronicConditions|
          | 1:1                                  +------------------------+
          |                                                  |
+--------------------+                                       | 1:N
|      DOCTOR        |                                       |
+--------------------+                                       |
| PK,FK1 uid         |                                       |
|     firstName      |                                       v
|     lastName       |            1:N            +------------------------+
|     specialization |-------------------------->|      APPOINTMENT       |
|     regNumber      |                           +------------------------+
|     consultationFee|                           | PK     appointmentId   |
|     availableDays  |                           | FK1    patientId       |
|     workingHours   |                           | FK2    doctorId        |
|     maxPatients    |                           |        date            |
+--------------------+                           |        timeSlot        |
                                                 |        mode            |
                                                 |        status          |
                                                 |        clinicalNotes   |
                                                 |        prescription    |
                                                 +------------------------+
```
*(Insert Entity-Relationship Diagram image here — should depict User, Patient, Doctor, and Appointment entities with primary keys, foreign keys, attributes, and diamond relationship connectors).*

---

# Chapter 5 — UI/UX Design

## 5.1 What is UI/UX Design?
**User Interface (UI) Design** focuses on the visual presentation and interactive elements of a software application. It encompasses typography choices, color schemes, button styles, card layouts, responsive spacing, and micro-animations. 

**User Experience (UX) Design**, on the other hand, deals with the user's overall journey, emotional response, and cognitive friction while navigating the product. In a healthcare application, UX design is critical: confusing layouts or ambiguous terminology can cause a patient to miss medication dosages or delay emergency SOS calls during medical crises.

Medscope applies several established psychological design principles:
- **Aesthetic-Usability Effect:** Users perceive cleanly designed, visually polished interfaces as more reliable and easier to use. For a medical application, a modern clinical aesthetic builds trust.
- **Hick's Law:** Cognitive burden increases with the number of choices. We structured the patient dashboard into an 11-widget Bento-Grid where related information (vitals, upcoming appointments, next pill countdown) is grouped into self-contained visual tiles rather than one long, overwhelming table.
- **Fitts's Law:** Interactive touch targets must be sized and placed for effortless reach. On mobile viewports, Medscope introduces a bottom-docked navigation bar and places the Emergency SOS button within immediate thumb reach.
- **Progressive Disclosure:** Instead of confronting first-time users with a 30-field registration form, Medscope divides onboarding into five logical steps, validating inputs progressively.

## 5.2 About Figma
Figma was used as the primary design tool throughout the UI/UX conceptualization phase of Medscope. Figma is a collaborative, cloud-based vector interface design platform that runs in web browsers as well as desktop clients.

Key advantages of Figma for our project included:
- **Real-Time Collaboration:** Our four-member team worked concurrently on the same canvas, allowing UI design iterations to occur in lockstep with frontend component planning.
- **Design Tokens & Component Variants:** We built a centralized design kit in Figma with predefined auto-layout cards, button states (default, hover, active, disabled), and dark-mode color tokens matching our planned TailwindCSS HSL variables.
- **Interactive Prototyping:** Before writing React code, we connected frames to simulate navigation between role selection, onboarding wizards, and dashboard widget expansions. This helped us refine the user flow early.

## 5.3 Websites for UI Design Inspiration
To move away from the dull, outdated appearance of traditional hospital portals, our team analyzed modern product design references across several recognized platforms:
1. **Mobbin:** Provided real-world mobile and web interface flows from leading digital health products, helping us design our multi-step onboarding wizard.
2. **Dribbble & Behance:** Provided inspiration for modern dashboard aesthetics, specifically dark-slate color palettes, neon glow borders, and frosted-glass card textures.
3. **Linear App Design Patterns:** Influenced our implementation of the Bento-Grid layout, keyboard shortcuts (such as the ⌘K command palette in `GlobalSearch.tsx`), and clean typography hierarchy.
4. **ShadCN/UI Documentation:** Served as an architectural reference for building accessible, keyboard-navigable UI primitives on top of Radix UI headless components.

## 5.4 Wireframing in UI/UX Design
Wireframing is the process of creating low-to-mid-fidelity skeletal blueprints of user interfaces before adding visual branding, imagery, or detailed styling. 

For Medscope, wireframing served three critical functions:
- **Information Hierarchy Mapping:** Allowed us to determine which metrics (such as the next scheduled pill and vital alerts) deserved primary top-level positioning on the Bento Grid versus secondary tabs.
- **Responsive Breakpoint Layout Planning:** We planned how a 12-column desktop grid collapses into a 2-column layout on tablet screens and a single-column scrolling view with a bottom dock on mobile viewports.
- **Form Progression Testing:** Allowed us to streamline doctor credential inputs, grouping degrees, registrations, and consultation preferences logically to reduce drop-off rates during onboarding.

*(Insert Wireframe Images here — should show low-fidelity wireframe sketches of the Patient Onboarding flow, Patient Dashboard Bento Grid, and Doctor Consultation Workspace).*

---

# Chapter 6 — Coding

## 6.1 Front-End Development
The frontend of Medscope is constructed as a modern Single-Page Application (SPA) using React 18, TypeScript, and Vite.

### Architecture and Component Hierarchy
The UI architecture follows a component-driven structure organized inside `src/`:
- **`src/components/ui/`:** Contains 58 headless, accessible primitives built using Radix UI (dialogs, dropdowns, accordions, tooltips, tabs) styled with TailwindCSS utilities.
- **`src/components/patient-dashboard/`:** Houses the 11 self-contained dashboard widgets (`HealthOverviewWidget`, `QuickActionsWidget`, `DailyTasksWidget`, `ConsultationWidget`, `MentalWellnessWidget`, `MedicineTimerWidget`).
- **`src/components/auth/`:** Provides the split-screen authentication shell (`AuthLayout.tsx`) and role protection wrappers (`ProtectedRoute.tsx`).
- **`src/pages/`:** Contains route-level page components organized into `/auth`, `/patient`, and `/doctor` directories.

### State Management via React Context
Rather than introducing heavy external state libraries like Redux, application state is managed cleanly using React Context providers organized in a modular provider tree in `App.tsx`:
```tsx
<QueryClientProvider client={queryClient}>
  <ThemeProvider defaultTheme="dark">
    <DoctorProvider>
      <PatientProvider>
        <ConsultationProvider>
          <ChatHistoryProvider>
            <AppRoutes />
          </ChatHistoryProvider>
        </ConsultationProvider>
      </PatientProvider>
    </DoctorProvider>
  </ThemeProvider>
</QueryClientProvider>
```
- **`PatientContext.tsx`:** Manages patient profile fields, vital logs, dashboard widget visibility, and reminder state.
- **`DoctorContext.tsx`:** Stores doctor credentials, active working hours, and consultation preferences.
- **`ConsultationContext.tsx`:** Manages doctor directories, appointment booking modals, and active consultation sessions.

### Client-Side Security & AES-256 Storage
To protect Personal Health Information (PHI) stored in client-side storage for offline access, we implemented `secureStorage.ts` using `CryptoJS`:
```typescript
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECURE_STORAGE_KEY || "medscope-phi-secure-key";

export const secureStorage = {
  setItem: (key: string, data: any): void => {
    const serialized = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(serialized, SECRET_KEY).toString();
    localStorage.setItem(key, encrypted);
  },
  getItem: <T>(key: string, fallback: T): T => {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      const bytes = CryptoJS.AES.decrypt(raw, SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return decrypted ? JSON.parse(decrypted) : fallback;
    } catch {
      return fallback;
    }
  }
};
```

## 6.2 Back-End Development
The backend architecture is powered by Google Firebase, utilizing Firebase Authentication for identity management and Cloud Firestore for document storage.

### Data Service Layer (`firebaseService.ts`)
To isolate Firebase SDK calls from our UI components, all database transactions are centralized within `src/services/firebaseService.ts`. This service exposes typed helper functions for:
- User credential creation and role assignment (`users` collection).
- Patient onboarding submission and profile updates (`patients` collection).
- Doctor credentials, consultation fees, and schedule updates (`doctors` collection).
- Conflict-checked appointment booking transactions (`appointments` collection).

### Dynamic Slot Generation Algorithm (`slotGenerator.ts`)
To prevent double bookings and enforce doctor capacity limits, Medscope calculates available appointment slots dynamically:
```typescript
export interface SlotParams {
  availableDays: string[];
  availableFrom: string;       // e.g. "09:00"
  availableUntil: string;      // e.g. "17:00"
  consultationDuration: number;// e.g. 30 (minutes)
  maxPatientsPerDay: number;
  existingAppointments: { timeSlot: string; status: string }[];
  targetDate: Date;
}

export const generateAvailableSlots = (params: SlotParams): string[] => {
  const dayName = params.targetDate.toLocaleDateString("en-US", { weekday: "long" });
  if (!params.availableDays.includes(dayName)) return [];

  // Enforce daily doctor capacity limit
  const activeBookings = params.existingAppointments.filter(
    (apt) => apt.status !== "cancelled"
  );
  if (activeBookings.length >= params.maxPatientsPerDay) return [];

  const bookedTimes = new Set(activeBookings.map((apt) => apt.timeSlot));
  const slots: string[] = [];

  let [startHour, startMin] = params.availableFrom.split(":").map(Number);
  const [endHour, endMin] = params.availableUntil.split(":").map(Number);

  let currentMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;

  while (currentMinutes + params.consultationDuration <= endMinutes) {
    const h = Math.floor(currentMinutes / 60);
    const m = currentMinutes % 60;
    const period = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const displayMin = m < 10 ? `0${m}` : m;
    const slotString = `${displayHour}:${displayMin} ${period}`;

    if (!bookedTimes.has(slotString)) {
      slots.push(slotString);
    }
    currentMinutes += params.consultationDuration;
  }

  return slots;
};
```

### Cloud Security Rules (`firestore.rules`)
Access boundaries are strictly enforced at the database level:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Authenticated user record
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Patient medical profiles
    match /patients/{patientId} {
      allow read, write: if request.auth != null && request.auth.uid == patientId;
      // Allow doctor to read patient records if an appointment exists
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/appointments/$(request.auth.uid + "_" + patientId));
    }
    
    // Doctor professional profiles
    match /doctors/{doctorId} {
      allow read: if request.auth != null; // Any authenticated user can browse doctor directory
      allow write: if request.auth != null && request.auth.uid == doctorId;
    }
    
    // Appointments collection
    match /appointments/{appointmentId} {
      allow read, create: if request.auth != null && 
        (resource.data.patientId == request.auth.uid || resource.data.doctorId == request.auth.uid);
      allow update: if request.auth != null && 
        (resource.data.patientId == request.auth.uid || resource.data.doctorId == request.auth.uid);
    }
  }
}
```

## 6.3 Development Environment
The development environment was configured for strict code quality, type safety, and reproducibility:
- **Transpilation & Bundling:** Vite 5 with SWC plugin (`@vitejs/plugin-react-swc`) compiling TypeScript with sub-100ms hot module replacement.
- **Static Type Checking:** Strict TypeScript configuration (`tsconfig.json`) preventing untyped variables (`noImplicitAny: true`).
- **Code Standards & Linting:** ESLint 9 flat configuration with plugins for React Hooks and React Refresh.
- **CSS Post-Processing:** PostCSS with Autoprefixer and TailwindCSS compiler generating atomic utility classes.

---

# Chapter 7 — Testing

Testing a healthcare platform requires verifying both visual interactions on the frontend and data integrity during booking transactions. We executed a dual-layered testing strategy combining unit tests with end-to-end browser tests.

## 7.1 Unit & Component Testing (Vitest + JSDOM)
We configured **Vitest** alongside `@testing-library/react` and `jsdom` to test logic in isolation. Unit tests were written for:
1. **Dynamic Slot Generation:** Tested `slotGenerator.ts` against edge cases including overlapping time slots, non-working days, boundary hours (e.g. 11:59 PM), and rejection when the maximum daily patient limit is reached.
2. **Encryption Wrapper:** Tested `secureStorage.ts` to ensure that data written to `localStorage` is completely obfuscated with AES-256 and decrypts reliably back to valid JSON.
3. **Form Schema Validations:** Tested Zod schemas in onboarding steps to verify that invalid blood groups, negative consultation fees, or missing phone numbers properly block form submission.

Commands executed:
```bash
npm run test          # Executes all Vitest test suites
npm run test:watch    # Runs Vitest in interactive development mode
```

## 7.2 End-to-End Browser Testing (Playwright)
To verify user journeys across realistic browser environments, we used **Playwright** configured across Chromium, Firefox, and WebKit engines (`playwright.config.ts`).

Critical flows automated:
- **Patient Registration & Onboarding Flow:** Automated a full browser session registering a new patient, stepping through all 5 onboarding pages, and verifying that the dashboard bento grid properly loads with the entered profile data.
- **Doctor Availability & Booking Flow:** Simulated doctor onboarding with defined working hours (Mon-Wed, 10:00 AM – 2:00 PM, 30 min duration), logged in as a patient, booked the 10:30 AM slot, and verified that 10:30 AM vanished from subsequent slot queries.

Command executed:
```bash
npx playwright test
```

## 7.3 Test Cases and Results Table

| Test ID | Module Tested | Test Objective | Input Data / Action | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Authentication | Validate role redirection after login | Valid credentials with `role: "patient"` | App routes immediately to `/patient/dashboard` | Redirected to `/patient/dashboard` | **PASS** |
| **TC-02** | Authentication | Validate role redirection for doctors | Valid credentials with `role: "doctor"` | App routes immediately to `/doctor/dashboard` | Redirected to `/doctor/dashboard` | **PASS** |
| **TC-03** | Onboarding | Check required field validation | Submit Step 1 of onboarding with empty name and age | Zod triggers validation errors; form does not advance | Red error labels rendered below inputs | **PASS** |
| **TC-04** | Reminders | Verify 1-hour snooze mechanism | Click "Snooze" on an 8:00 AM medicine reminder | Scheduled time advances to 9:00 AM; status updates | Reminder moved to 9:00 AM in daily tasks | **PASS** |
| **TC-05** | Booking Engine | Verify slot generation on doctor working days | Doctor available Mon/Wed; Patient queries Tuesday | Generated slot array is empty `[]` | Empty state displayed: "No slots available" | **PASS** |
| **TC-06** | Booking Engine | Prevent double booking on identical slot | Two patients book 10:00 AM slot concurrently | First booking succeeds; second request is blocked | Slot removed; second attempt rejected with alert | **PASS** |
| **TC-07** | Booking Engine | Enforce maximum daily patient limit | Doctor sets limit = 2; attempt booking 3rd appointment | Booking button disabled; slot generator halts | Rejection alert: "Doctor reached daily capacity" | **PASS** |
| **TC-08** | Emergency SOS | Verify floating action button reachability | Click red Emergency FAB from any route | Instant modal/page opening displaying critical contacts | Emergency page renders with phone triggers | **PASS** |
| **TC-09** | Data Security | Validate AES-256 encryption at rest | Inspect browser `localStorage` directly via DevTools | Medical keys contain unreadable encrypted ciphertext | Raw strings show AES ciphertext | **PASS** |
| **TC-10** | Responsive UI | Verify mobile navigation dock | Resize viewport width to 375px (iPhone SE) | Top navbar collapses; bottom icon dock becomes active | Bottom navigation bar displayed correctly | **PASS** |

---

# Chapter 8 — Limitations and Future Motives

## 8.1 Limitations
While Medscope successfully implements an end-to-end healthcare and telemedicine workflow, several technical and infrastructural constraints exist in the current version:

1. **Simulated Media Streaming in Consultation Rooms:**
   Although the telemedicine workspace provides full appointment scheduling, clinical note-taking, and digital prescription issuance, the live video and audio calling features currently operate on UI mock rooms rather than an in-house WebRTC Selective Forwarding Unit (SFU) media server (such as Agora or LiveKit).
2. **Client-Side Optical Character Recognition (OCR):**
   The prescription scanning feature (`Scan Rx`) relies on client-side text parsing patterns and external LLM API wrappers. It does not incorporate a custom-trained computer vision model specifically trained on complex handwritten medical scripts.
3. **No Direct Hospital EMR/EHR Interoperability:**
   Medscope stores records within its Cloud Firestore document structure. It does not currently implement international healthcare data exchange standards such as HL7 (Health Level Seven) or FHIR (Fast Healthcare Interoperability Resources), making automated exports to existing hospital databases unavailable.
4. **Simulated Payment Transactions:**
   Consultation fees are displayed, calculated, and tracked through simulated transaction states. A live payment gateway provider (such as Razorpay or Stripe) has not been integrated with real merchant banking accounts.
5. **Offline Write Synchronization Limitations:**
   While encrypted local storage allows offline viewing of cached profile vitals and reminders, real-time appointment bookings and doctor queue modifications strictly require active internet connectivity to prevent slot conflicts in Firestore.

## 8.2 Future Goals
To scale Medscope from an academic prototype into a production-grade digital health platform, the following enhancements are planned:

1. **Integration of Live WebRTC Media Infrastructure:**
   Deploy a dedicated WebRTC media server using Janus or LiveKit to enable end-to-end encrypted video consultations directly within the `ConsultationWorkspacePage`, complete with screen sharing and in-call vitals overlays.
2. **Standardization with ABDM & FHIR Standards:**
   Implement FHIR-compliant REST APIs to allow Medscope patient profiles to synchronize with India's Ayushman Bharat Digital Mission (ABDM) and international electronic medical record (EMR) systems.
3. **Custom Deep Learning OCR for Handwritten Prescriptions:**
   Train an open-source Transformer-based OCR model (such as TrOCR) fine-tuned on handwritten clinical scripts to improve the precision of the `Scan Rx` dosage and medicine parsing engine.
4. **Live Payment Gateway & Invoicing Engine:**
   Integrate Razorpay or Stripe to process real consultation payments, complete with automated GST invoicing and doctor payout management.
5. **IoT Medical Device Synchronization:**
   Enable Bluetooth Web API connections to pull live blood pressure, glucose, and pulse oximeter readings directly from consumer digital health devices into the `LogVitalsPage`.

---

# Chapter 9 — References

1. **React Documentation** — Meta Open Source. *React 18 Architecture, Hooks, and Server Components*. Available: https://react.dev/
2. **TypeScript Handbook** — Microsoft. *Strict Type Checking, Interfaces, and Generics in TypeScript 5*. Available: https://www.typescriptlang.org/docs/
3. **Vite Official Documentation** — Evan You & Vite Contributors. *Next Generation Frontend Tooling and Fast SWC Compilation*. Available: https://vitejs.dev/
4. **Google Firebase Documentation** — Google Cloud. *Firebase Authentication and Cloud Firestore Data Modeling & Security Rules*. Available: https://firebase.google.com/docs/firestore
5. **TailwindCSS Documentation** — Adam Wathan. *Utility-First CSS, Design Tokens, and Custom Keyframe Animations*. Available: https://tailwindcss.com/docs
6. **Radix UI Primitives** — WorkOS. *Headless Accessible UI Components and WAI-ARIA Specifications*. Available: https://www.radix-ui.com/
7. **Nielsen Norman Group** — Jakob Nielsen and Don Norman. *UX Design Principles: Hick’s Law, Fitts’s Law, and Progressive Disclosure in Complex Interfaces*. Available: https://www.nngroup.com/
8. **CryptoJS Documentation** — Jeff Mott. *AES-256 Symmetric Key Encryption for Client-Side Storage Security*. Available: https://cryptojs.gitbook.io/docs/
9. **Vitest Documentation** — Vitest Team. *Blazing Fast Unit Test Framework Powered by Vite*. Available: https://vitest.dev/
10. **Playwright Documentation** — Microsoft. *Fast and Reliable End-to-End Testing for Modern Web Apps*. Available: https://playwright.dev/
11. **Recharts Documentation** — Recharts Community. *Redefined Chart Library Built with React and D3*. Available: https://recharts.org/
12. **World Health Organization (WHO)** — *Global Strategy on Digital Health 2020–2025*. Geneva: World Health Organization; 2021. Available: https://www.who.int/docs/default-source/documents/gs4dhdaa2a9f352b0445bafbc79ca799dce4d.pdf
