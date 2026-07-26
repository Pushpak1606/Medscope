<div align="center">
  <img src="public/medscope-favicon.svg" alt="Medscope Logo" width="120" height="120" style="border-radius: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);" />
  <br/>
  <h1>🌟 Medscope</h1>
  <p><b>The Premium, AI-Powered Healthcare & Telehealth Platform</b></p>
  <p>Smarter care for patients and doctors. Bridging the gap between <b>Physical Health</b>, <b>Telemedicine</b>, and <b>Mental Wellbeing</b> through immersive, intelligent design.</p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/Radix_UI-black?style=for-the-badge&logo=radix-ui&logoColor=white" alt="Radix UI" />
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Security-AES--256-green?style=for-the-badge&logo=letsencrypt" alt="AES 256" />
    <img src="https://img.shields.io/badge/State-React_Context_API-FF4154?style=for-the-badge&logo=react&logoColor=white" alt="React Context" />
    <img src="https://img.shields.io/badge/Icons-Lucide_React-orange?style=for-the-badge&logo=lucide" alt="Lucide Icons" />
    <img src="https://img.shields.io/badge/Build-TSC_0_Errors-brightgreen?style=for-the-badge" alt="Build Status" />
  </p>
</div>

<br />

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Unified Consultation Room & Telehealth Lifecycle](#-unified-consultation-room--telehealth-lifecycle)
- [Patient Portal Features](#-patient-portal-features)
- [Doctor Workspace Infrastructure](#-doctor-workspace-infrastructure)
- [System-Wide Design System & Dropdown Architecture](#-system-wide-design-system--dropdown-architecture)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Security & Encryption](#-security--encryption)
- [Installation & Setup](#-installation--setup)
- [Contributors](#-contributors)

---

## 🧭 Project Overview

**Medscope** is a production-grade, AI-powered healthcare SaaS platform engineered for **both Patients and Doctors**. Built with modern Glassmorphic UI aesthetics, real-time frontend synchronization, and strict HIPAA-grade design standards, Medscope unifies clinical telehealth, prescription management, patient telemetry, and mental wellness into one synchronized ecosystem.

---

## 📹 Unified Consultation Room & Telehealth Lifecycle

The core of Medscope is a single, synchronized **Unified Consultation Room** (`UnifiedConsultationRoom.tsx`) shared across both Doctor and Patient roles with role-based permission control (*Doctor edits, Patient views & interacts*).

### 🔄 4-Stage Telemedicine Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 1. Scheduled State                                                                     │
│    • Video Window: HIDDEN                                                               │
│    • Status: "Scheduled • Waiting for Doctor"                                           │
│    • Patient Join Button: DISABLED ("Waiting for doctor...")                            │
│    • Doctor Action: "Mark Doctor Available" trigger                                     │
└───────────────────────────┬─────────────────────────────────────────────────────────────┘
                            │ Doctor marks availability
                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 2. Doctor Available State                                                               │
│    • Video Window: HIDDEN                                                               │
│    • Banner: "Doctor is available. Ready to join consultation."                         │
│    • Join Button: ENABLED for both roles                                                │
└───────────────────────────┬─────────────────────────────────────────────────────────────┘
                            │ Doctor or Patient clicks "Join Consultation"
                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 3. Consultation Live State                                                              │
│    • Video Window: OPENS (1080p HD WebRTC Video Room with PiP & Controls)               │
│    • Workspace: Real-Time Synced Prescription, Diet Plan, SOAP Notes, Reports & Timeline│
│    • Action: Doctor clicks "End Consultation"                                           │
└───────────────────────────┬─────────────────────────────────────────────────────────────┘
                            │ Doctor ends session
                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 4. Consultation Completed State                                                         │
│    • Video Window: AUTOMATICALLY CLOSES & DISAPPEARS                                    │
│    • Rejoin Prevention Lock: Completed consultations cannot reopen video stream         │
│    • Automated Syncing Executed:                                                        │
│      - Prescribed medicines auto-added to Patient Daily Reminders                       │
│      - Diagnostic lab reports auto-synced to Patient Health Records                     │
│      - Follow-up appointment auto-added to Patient Calendar                             │
│    • Summary View Enabled: Includes "Export Consultation PDF" printing engine           │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 📋 8 Integrated Consultation Sections
1. **Consultation Header**: Live status beacon, appointment duration timer, session ID, and role indicators.
2. **Video Meeting Area**: 1080p WebRTC stream canvas with Mic/Cam/Share Screen controls (active ONLY during live sessions).
3. **Prescription Panel**: Real-time Rx authoring with AI interaction safety verification. Patient features **"Add to Reminders"** and **"Download Rx PDF"**.
4. **Diet Plan Panel**: Breakfast, Lunch, Dinner, Snacks, Water Intake, and Restrictions. Patient features **"Save Diet Plan"** and **"Mark as Following Plan"**.
5. **Doctor SOAP Notes**: Clinical Subjective, Objective, Assessment, and Plan fields with a **"Share Notes with Patient"** toggle.
6. **Uploaded Reports**: Diagnostic lab results and telemetry PDF previews.
7. **Follow-up Plan**: Scheduled review appointment picker with **"Add Follow-up to Calendar"**.
8. **Clinical Activity Timeline**: Chronological event trace updated in real-time.

---

## 🧑‍🦰 Patient Portal Features

*   📊 **Interactive Bento Dashboard**: Real-time health overview, vitals summary, and daily timeline tasks.
*   🤖 **AI Scan Rx & Ask AI**: Automated OCR prescription reading and multi-modal AI health assistant.
*   🧠 **Mental Wellness Hub**: Interactive mood tracking, calming exercises, and wellness trend analytics.
*   ⏰ **Smart Reminders Vault**: Full CRUD reminder manager synced automatically with physician prescriptions.
*   📑 **Health Records Vault**: Encrypted medical history, lab reports, and doctor-synced diagnostic telemetry.
*   🚨 **Emergency SOS System**: Floating emergency action button with life-saving contacts and emergency triage.

---

## 👨‍⚕️ Doctor Workspace Infrastructure

*   🏥 **Doctor Dashboard** (`/doctor/dashboard`): Urgency-prioritized patient queue, availability status widget, and live schedule timeline.
*   🔍 **New Consultation Selection Engine** (`NewConsultationModal.tsx`): Search patients by Name, Medical ID (`PAT-101`), Phone, or Disease with automated session initialization.
*   👨‍⚕️ **Patient Workspace** (`/doctor/patients/:id`): Unified medical timeline, clinical AI briefings, SOAP editor, and lab telemetry.
*   📅 **Doctor Schedule & Calendar** (`/doctor/schedule`): Weekly overview, pending follow-ups, and today's appointment list.
*   🗂️ **Patients Directory** (`/doctor/patients`): Global directory search, risk level filtering (*High Risk, Stable, Monitor*), and patient profiles.
*   🤖 **Clinical AI Copilot** (`/doctor/clinical-ai`): Patient education material generator, treatment plan drafts, and specialist referral suggestions.
*   💊 **Medicine Assistant** (`/doctor/medicine-assistant`): AI prescribing support, drug interaction checks, and final Rx preview.
*   🌐 **Doctor Community & Moderation** (`/doctor/community`): Group moderation, flagged post review queue, practitioner announcements, and educational event management.
*   ⚙️ **Doctor Settings** (`/doctor/settings`): Medical credentials, practice info, working hours, and privacy controls.

---

## 🎨 System-Wide Design System & Dropdown Architecture

Medscope uses a unified **Glassmorphism Design System** featuring:
- Frosted glass cards (`backdrop-blur-2xl bg-card/90 border-border/60`).
- Vibrant curated gradients and dark/light theme CSS tokens.
- **Custom Dropdown & Select Components**: 100% of standard raw HTML `<select>` tags are replaced with Radix-powered Glassmorphic components ([`select.tsx`](file:///c:/Users/htale/OneDrive/Desktop/Medscope/src/components/ui/select.tsx) and [`dropdown-menu.tsx`](file:///c:/Users/htale/OneDrive/Desktop/Medscope/src/components/ui/dropdown-menu.tsx)) featuring 2XL/3XL rounded borders, animated indicators, and glowing focus states.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Core Framework** | React 18, Vite 5, TypeScript |
| **Routing & State** | React Router DOM v6, React Context API (`ConsultationContext`, `PatientContext`, `DoctorContext`) |
| **Styling & Design** | TailwindCSS 3, Radix UI Primitives, Custom Glassmorphism System |
| **Animation & Motion** | Framer Motion |
| **Icons & Feedback** | Lucide React, Sonner (Toast notifications) |
| **Code Quality** | Strict TypeScript (`npx tsc --noEmit` verified 0 errors) |

---

## 🔐 Security & Encryption

Personal Health Information (PHI) is protected using **AES-256 Client-Side Encryption** (`secureStorage.ts`). Client data is encrypted before being saved to local storage, ensuring privacy and compliance.

---

## ⚡ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pushpak1606/Medscope.git
   cd Medscope
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   *Open `http://localhost:5173` to experience Medscope.*

4. **Verify TypeScript build**
   ```bash
   npx tsc --noEmit
   ```

---

## 🤝 Contributors

*   **Pushpak Patil** - *Lead Frontend Architect & UI/UX Designer*
*   **Bhavy Dave** - *Backend Architect*

---

<div align="center">
  <p><b>Built with ❤️ by the Medscope Team</b></p>
</div>
