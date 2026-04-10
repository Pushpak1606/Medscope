<div align="center">
  <br />
    <a href="https://github.com/your-username/medscope" target="_blank">
      <!-- Replace with your actual logo URL if you have one, or delete this line -->
      <img src="public/logo-placeholder.png" alt="Medscope Logo" width="100">
    </a>
  <br />

  <h1>Medscope</h1>

  <h3>The Next-Generation AI-Powered Healthcare Ecosystem</h3>

  <p>
    Bridging the gap between <b>Physical Consultation</b> and <b>Mental Health Support</b> through intelligent design.
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-Blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui" alt="shadcn/ui" />
    <img src="https://img.shields.io/badge/AI_Integration-Planned-orange?style=for-the-badge" alt="AI" />
  </p>
</div>

<br />

## 📋 Table of Contents

- [Introduction](#-introduction)
- [The Problem & Solution](#-the-problem--solution)
- [System Workflow](#-system-workflow)
- [Key Features](#-key-features)
- [UI/UX Design Philosophy](#-uiux-design-philosophy)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Roadmap](#-roadmap)

---

## 🚀 Introduction

**Medscope** is a comprehensive medical assistance platform designed to streamline the interaction between patients and doctors while providing robust, AI-driven personal health management.

Unlike traditional telemedicine apps, Medscope treats **Mental Health** with the same priority as **Physical Health**, offering distinct pathways for both, powered by an intelligent dashboard that adapts to the user's specific needs.

> **Status:** B.Tech Final Year Project (Frontend MVP Completed)

---

## 💡 The Problem & Solution

| The Problem | The Medscope Solution |
| :--- | :--- |
| **Fragmented Care:** Patients struggle to manage prescriptions, appointments, and mental wellness in one place. | **Unified Dashboard:** A Bento-grid style hub that organizes medicines, consultations, and journals intelligently. |
| **Generic Advice:** Health apps often provide one-size-fits-all suggestions. | **AI-Driven Personalization:** Onboarding data tailors reminders, nutrition, and exercise specifically to the user's condition. |
| **Mental Health Stigma:** Mental wellness is often an afterthought or difficult to access. | **Dedicated Pathway:** A specific flow for mental health including mood logging, AI companionship, and community support. |

---

## 🔄 System Workflow

The platform operates on a dual-user architecture:

### 🧑‍🦰 Patient Workflow
1.  **Onboarding:** Users complete a detailed health profile (Physical & Mental context).
2.  **Personalized Dashboard:** The UI rearranges itself based on user priorities (e.g., highlighting Medicine Reminders vs. Mood Logs).
3.  **Pathways:**
    *   *Physical:* Scan Rx -> AI Analysis -> Dosage Reminders -> Doctor Consult.
    *   *Mental:* Mood Tracking -> AI Chatbot -> Wellness Suggestions -> Community Groups.

### 👨‍⚕️ Doctor Workflow
1.  **Professional Profile:** Setup specialization, availability, and consultation modes.
2.  **AI Assistant:** Receives AI-summarized patient history and prescription suggestions.
3.  **Management:** Handles appointments, patient records, and assistant doctor allocation.

---

## ✨ Key Features

### 🏥 For Patients
*   **AI Medicine Assistant (Scan Rx):** Upload prescription photos to automatically extract dosage, timing, and medicine type (Ayurvedic/Allopathy).
*   **Smart Reminders:** Intelligent notifications for medicines and meals based on your routine.
*   **Emergency Mode:** One-tap access to emergency contacts, ambulance services, and critical health data.
*   **Mood Logger:** A "Liquid Glass" interface for tracking emotional well-being over time.
*   **Secure Records:** Encrypted storage for lab reports and history.

### 🩺 For Doctors
*   **Smart Patient Insights:** AI-driven summary of patient symptoms before the call.
*   **Schedule Management:** Drag-and-drop appointment handling.
*   **Assistant Doctor Protocol:** Delegate tasks to support staff when unavailable.

---

## 🎨 UI/UX Design Philosophy

Medscope is built with a **"Premium Healthcare-Tech"** aesthetic. We moved away from sterile, clinical designs to create an experience that feels alive and supportive.

*   **Bento Grid Layouts:** Modular, responsive dashboards that present complex data cleanly.
*   **Liquid Glass Effect:** Primary actions (like *Scan Rx* or *Emergency*) feature a premium, translucent glassmorphism effect to guide user attention.
*   **Mobile-First Architecture:** Fully optimized for touch devices with sticky bottom navigation and stacked card layouts.
*   **Ambient Motion:** Subtle moving gradients and glow effects to reduce anxiety and create a calming atmosphere.

---

## 🛠 Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS, CSS Modules |
| **Components** | shadcn/ui, Radix UI |
| **Icons** | Lucide React |
| **Animation** | Framer Motion |
| **Theme** | next-themes (Dark/Light Mode) |

---

## 📸 Screenshots

*(Place your screenshots in a `public/screenshots` folder)*

| **Landing Page** | **Patient Dashboard** |
|:---:|:---:|
| <img src="public/screenshots/landing.png" alt="Landing" width="400"> | <img src="public/screenshots/dashboard.png" alt="Dashboard" width="400"> |

| **AI Scan Rx** | **Mood Logger** |
|:---:|:---:|
| <img src="public/screenshots/scan.png" alt="Scan" width="400"> | <img src="public/screenshots/mood.png" alt="Mood" width="400"> |

---

## ⚡ Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/medscope.git
    cd medscope
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Open the app**
    Visit `http://localhost:3000` to view the application.

---

## 🛣 Roadmap

- [x] **Phase 1: UI/UX & Frontend Architecture** (Completed)
    - Landing, Auth, Onboarding, Dashboard, Quick Actions.
- [ ] **Phase 2: Backend Integration**
    - Database setup (PostgreSQL/MongoDB).
    - Auth integration (NextAuth/Clerk).
- [ ] **Phase 3: AI Integration**
    - Connecting OpenAI/Gemini API for the Chatbot and Medicine Scanner.
- [ ] **Phase 4: Real-time Features**
    - WebRTC for Video Consultations.
    - Socket.io for Chat.

---

## 🤝 Contributors

*   **Pushpak Patil** - *Frontend Architect & UI Designer*
*   **Bhavy Dave** - *Backend Architect*

---
