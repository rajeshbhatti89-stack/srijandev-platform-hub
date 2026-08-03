# SrijanDev Next Generation Multi-Portal Web Application (`srijandev-next`)

Welcome to the **SrijanDev Multi-Portal Platform**, an enterprise-grade standalone web application built with **Next.js 15**, **React 19**, **TypeScript**, **TailwindCSS**, **Framer Motion**, and **Prisma ORM**.

---

## Key Highlights

- **Dual-Portal Engine**:
  - **Portal 1: Corporate Website**: High-converting, glassmorphic company web portal featuring an animated mesh hero, services directory, portfolio showcase with dynamic category filtering, pricing tiers with monthly/annual toggle, engineering blog, career opportunities, and proposal request forms.
  - **Portal 2: Business Platform (SaaS Operations)**: Workforce management suite featuring an Executive Analytics Dashboard, Employee Directory, Shift Attendance Tracker with clock-in/out simulator, Task & Project Kanban Board, CRM Lead Pipeline, Document Center, and System Audit Logs.
- **Animated Portal Switcher**: Instant transition segmented tab control persisted via LocalStorage with keyboard shortcuts (`Alt+S`) and Framer Motion spring layout animations.
- **Isolated Standalone Application**: Built entirely inside `apps/srijandev-next`. The legacy root application remains 100% untouched and functional.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Frontend**: React 19, TypeScript 5.3, TailwindCSS
- **Animations**: Framer Motion 11
- **Icons**: Lucide React
- **Charts**: Recharts
- **Database & ORM**: Prisma ORM (PostgreSQL & Supabase ready)

---

## Quick Start

```bash
# Navigate to the app directory
cd apps/srijandev-next

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the platform.
