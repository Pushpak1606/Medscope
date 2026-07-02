<div align="center">
  <img src="public/medscope-favicon.svg" alt="Medscope Logo" width="120" height="120" style="border-radius: 24px; box-shadow: 0 8px 24px rgba(0,0,0,0.12);" />
  <br/>
  <h1>🌟 Medscope</h1>
  <p><b>The Premium, AI-Powered Healthcare & Wellness Platform</b></p>
  <p>Smarter care for patients and doctors. Bridging the gap between <b>Physical Health</b> and <b>Mental Wellbeing</b> through immersive, intelligent design.</p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer" alt="Framer Motion" />
    <img src="https://img.shields.io/badge/shadcn%2Fui-black?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/State-React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="React Query" />
    <img src="https://img.shields.io/badge/Security-AES--256-green?style=for-the-badge&logo=letsencrypt" alt="AES 256" />
    <img src="https://img.shields.io/badge/Testing-Vitest_&_Playwright-729B1B?style=for-the-badge&logo=vitest&logoColor=white" alt="Testing" />
    <img src="https://img.shields.io/badge/3D-Three.js_&_Spline-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" />
  </p>
</div>

<br />

## 📖 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [UI/UX Psychology & Design Philosophy](#-uiux-psychology--design-philosophy)
- [Security & Encryption](#-security--encryption)
- [Installation & Setup](#-installation--setup)
- [Testing](#-testing)

---

## 🧭 Project Overview

**Medscope** is a premium, AI-powered healthcare web application designed to serve **both patients and doctors**. The platform provides intelligent medicine analysis via prescription scanning, live multi-modal consultations, mental wellness tracking, smart reminders, health records management, and a robust emergency services system.

Featuring a **fully responsive, dark/light themed** interface with modern glassmorphism aesthetics, smooth `Framer Motion` animations, and a "bento-box" layout, the application adapts elegantly across mobile, tablet, and desktop viewports.

---

## ✨ Key Features

### 🧑‍🦰 Patient Workflow
*   🤖 **AI-Powered Tools:** Utilize **Scan Rx** to automatically read prescription photos (dosages, timings, and medicine types) and converse with the **Ask AI** health assistant for immediate health guidance.
*   🧠 **Mental Wellness Hub:** Full-featured mood tracking with interactive logging, immersive calming exercises, and wellness trend visualization.
*   ⏰ **Smart Reminders Vault:** Full CRUD reminder manager across 6 categories (Medicines, Meals, Water, Appointments, Wellness). Features intelligent snoozing and real-time dashboard syncing.
*   🤝 **Multi-Modal Consultations:** Browse available doctors and join live rooms via Video, Audio, Chat, or book In-Clinic appointments.
*   🚨 **Emergency Mode:** Persistent Floating Action Button (FAB) for instant access to emergency SOS, life-saving contacts, and critical health data.
*   📊 **Dashboard Bento-Grid:** An 11-widget interactive dashboard containing health progress, daily timeline tasks, and quick actions, with customizable Drag & Drop functionality.

### 👨‍⚕️ Doctor Workflow
*   🏥 **Professional Dashboard:** Complete schedule management, specializations, and patient queues.
*   💡 **Smart Patient Insights:** Receive automated, summarized insights of patient symptoms ahead of consultations.
*   🛡️ **Assistant Protocol:** Securely delegate administrative tasks to support staff when required.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frameworks** | React 18, Vite 5 (SWC), TypeScript |
| **Routing & Forms** | React Router DOM v6, React Hook Form, Zod |
| **Styling & UI** | TailwindCSS 3, ShadCN/UI (58+ accessible primitives), Radix UI |
| **Animation & 3D** | Framer Motion, Three.js, @splinetool/react-spline |
| **State Management** | React Context API, TanStack React Query |
| **Data Viz & Utilities** | Recharts, Lucide React (Icons), Sonner (Toasts), date-fns, Embla Carousel |

---

## 🧠 UI/UX Psychology & Design Philosophy

Medscope adopts a **"Premium Healthcare-Tech"** aesthetic driven by established psychological principles to make healthcare management feel engaging and trustworthy.

*   **Aesthetic-Usability Effect:** Glassmorphism (`@liquidglass/react`), smooth gradients, and subtle glows create a premium, trustworthy impression. Deep Navy dark mode reduces OLED strain while maintaining a clinical atmosphere. 
*   **Hick's & Fitts's Laws:** The bento-grid dashboard uses a clear visual hierarchy (F-pattern), minimizing choice overload. Mobile-first design ensures large, thumb-friendly touch targets with a dedicated bottom navigation dock.
*   **Zeigarnik Effect:** Profile completeness trackers and the Daily Tasks timeline build a sense of progression and accomplishment.
*   **Gestalt Principles:** Visually cohesive `.gradient-border` and `.glow-primary` utility classes group related content perfectly within frosted-glass boundaries.
*   **Micro-Animations:** Fluid staggered reveals, pulsing live indicators, and Spline 3D ambient backgrounds make the application feel active and alive.

---

## 🔐 Security & Encryption

Medical data requires the highest level of security. Medscope uses **AES-256 Encrypted Storage** (`CryptoJS`) for all Personal Health Information (PHI). 

*   All client-side health data is **encrypted before being written** to `localStorage`.
*   Encryption relies on secure key management (`VITE_SECURE_STORAGE_KEY`).
*   The application enforces Strict HTTP Security Headers.

---

## ⚡ Installation & Setup

### Prerequisites
*   **Node.js** ≥ 18
*   **npm**, **yarn**, or **bun**

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pushpak1606/Medscope.git
   cd medscope
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SECURE_STORAGE_KEY=your-secret-encryption-key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   *Visit `http://localhost:8080` to experience Medscope.*

---

## 🧪 Testing

Medscope implements a rigorous testing strategy to ensure reliability:

*   **Unit & Component Testing (Vitest)**
    ```bash
    npm run test          # Run all tests once
    npm run test:watch    # Watch mode
    ```
*   **End-to-End browser Tests (Playwright)**
    ```bash
    npx playwright test
    ```

---

## 🤝 Contributors

*   **Pushpak Patil** - *Frontend Architect & UI/UX Designer*
*   **Bhavy Dave** - *Backend Architect*

---

<br/>
<div align="center">
  <p><b>Built with ❤️ by the Medscope Team</b></p>
</div>
